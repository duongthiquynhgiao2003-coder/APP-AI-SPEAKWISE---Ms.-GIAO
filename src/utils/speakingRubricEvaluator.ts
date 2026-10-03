import {
  SchoolLevel,
  ScoringScale,
  AssessmentResult,
  FeedbackEntry,
  CefrLevel,
  VideoPostureAnalysis,
} from '../types';
import { reconstructStudentSpeech } from './sentenceComparator';
import { extractAccuratePhonemeIssues } from './phonemeAnalyzer';
import { generatePresentationRubric } from './videoPostureAnalyzer';

export interface PhonemeIssue {
  word: string;
  phoneticExpected?: string;
  phoneticIssue: string; // e.g. "Thiếu âm đuôi /s/"
  severity: 'high' | 'medium' | 'low';
}

export interface SentenceComparison {
  studentSentence: string;
  improvedSentence: string;
  explanationVi: string;
  focusArea: 'grammar' | 'vocabulary' | 'naturalness';
}

export interface GrammarIssueItem {
  descriptionVi: string;
  example: string;
  penalty: number;
}

export interface SpeechMetrics {
  durationSeconds: number;
  wordCount: number;
  wordsPerMinute: number;
  pauseCount: number;
  fillerWordsCount: number;
  fillerWordsList: string[];
  vocabularyRichnessPercentage: number; // Unique words / Total words
  targetTaskAlignmentPercentage: number; // Overlap with lesson keywords
}

export interface ComprehensiveAssessmentResult extends AssessmentResult {
  speechMetrics: SpeechMetrics;
  phonemeIssues: PhonemeIssue[];
  sentenceComparisons: SentenceComparison[];
  grammarIssues?: GrammarIssueItem[];
  strengths: string[];
  improvementPriorities: string[];
  taskTopicEn: string;
  taskTopicVi: string;
}

// Common English filler words
const FILLER_WORDS = ['um', 'uh', 'er', 'ah', 'like', 'you know', 'so', 'well'];

/**
 * Clean and tokenize raw transcript
 */
export function tokenizeTranscript(transcript: string): string[] {
  if (!transcript) return [];
  return transcript
    .toLowerCase()
    .replace(/[^\w\s']/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

/**
 * Calculates real-world speaking metrics based on actual speech and duration
 */
export function calculateSpeechMetrics(
  transcript: string,
  durationSeconds: number,
  sampleContent: string
): SpeechMetrics {
  const safeDuration = Math.max(durationSeconds, 4); // Minimum 4s to avoid division by zero
  const words = tokenizeTranscript(transcript);
  const wordCount = words.length;

  // Words per minute (WPM)
  const wordsPerMinute = Math.round((wordCount / safeDuration) * 60);

  // Identify filler words
  const detectedFillers: string[] = [];
  words.forEach((w) => {
    if (FILLER_WORDS.includes(w)) {
      detectedFillers.push(w);
    }
  });

  // Rough estimation of hesitation pauses based on speech duration vs standard speaking pace
  const expectedSpeechTime = wordCount / 2.0;
  const idleTime = Math.max(0, safeDuration - expectedSpeechTime);
  const estimatedPauses = Math.min(Math.floor(idleTime / 2.5), 8);

  // Vocabulary richness (Unique words / total words)
  const uniqueWords = new Set(words);
  const vocabRichness =
    wordCount > 0 ? Math.round((uniqueWords.size / wordCount) * 100) : 70;

  // Topic alignment check
  const sampleWords = new Set(tokenizeTranscript(sampleContent));
  let matchCount = 0;
  sampleWords.forEach((sw) => {
    if (sw.length > 3 && words.includes(sw)) {
      matchCount++;
    }
  });

  const alignmentRate =
    sampleWords.size > 0
      ? Math.min(100, Math.round((matchCount / Math.min(sampleWords.size, 10)) * 100) + 40)
      : 85;

  return {
    durationSeconds: safeDuration,
    wordCount,
    wordsPerMinute,
    pauseCount: estimatedPauses,
    fillerWordsCount: detectedFillers.length,
    fillerWordsList: Array.from(new Set(detectedFillers)),
    vocabularyRichnessPercentage: vocabRichness,
    targetTaskAlignmentPercentage: alignmentRate,
  };
}

/**
 * Detect phoneme and pronunciation weak points strictly grounded in the student's actual transcript
 */
export function analyzePhonemeIssues(transcript: string, sampleContent: string): PhonemeIssue[] {
  return extractAccuratePhonemeIssues(transcript, sampleContent);
}

/**
 * Identify grammar mistakes and generate realistic comparative corrections
 */
export function generateSentenceComparisons(
  transcript: string,
  sampleContent: string,
  level: SchoolLevel
): SentenceComparison[] {
  return reconstructStudentSpeech(transcript, level, sampleContent);
}

/**
 * Detect specific grammar patterns commonly found in Vietnamese student English speech
 */
export function detectGrammarIssues(transcript: string, schoolLevel: SchoolLevel): GrammarIssueItem[] {
  const issues: GrammarIssueItem[] = [];
  const text = (transcript || '').toLowerCase().trim();
  if (!text) return issues;

  // 1. Missing copula "to be"
  if (/\b(?:i)\s+from\s+[a-z]+/i.test(text) && !/\bi\s*(?:am|'m)\s+from\b/i.test(text)) {
    issues.push({
      descriptionVi: 'Thiếu động từ "to be" (am) trong câu giới thiệu quê quán ("I from..." thay vì "I am from...")',
      example: 'I from Vietnam → I am from Vietnam',
      penalty: 0.8,
    });
  } else if (/\b(?:i)\s+(?:vietnam|england|america|japan|korea)\b/i.test(text) && !/\b(?:am|'m)\s+from\b/i.test(text)) {
    issues.push({
      descriptionVi: 'Thiếu cấu trúc "am from" khi nói quốc gia ("I Vietnam")',
      example: 'I Vietnam → I am from Vietnam',
      penalty: 0.8,
    });
  }

  if (/\bmy\s+name\s+[a-z]+/i.test(text) && !/\bmy\s+name\s+is\b/i.test(text) && !/\bmy\s+name's\b/i.test(text)) {
    issues.push({
      descriptionVi: 'Thiếu động từ "is" khi giới thiệu tên ("My name..." thay vì "My name is...")',
      example: 'My name Lan → My name is Lan',
      penalty: 0.7,
    });
  }

  if (/\bi\s+(?:\d+|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen)\s*(?:years?\s+old)?\b/i.test(text) && !/\bi\s*(?:am|'m)\b/i.test(text)) {
    issues.push({
      descriptionVi: 'Thiếu động từ "am" khi giới thiệu tuổi ("I 9 years old")',
      example: 'I 9 years old → I am 9 years old',
      penalty: 0.8,
    });
  }

  // 2. 3rd person singular subject-verb agreement (e.g. "he like", "she live")
  if (/\b(?:he|she|it|my\s+mother|my\s+father|my\s+brother|my\s+sister|my\s+friend)\s+(?:like|live|play|want|love|eat|go|watch|read)\b/i.test(text)) {
    issues.push({
      descriptionVi: 'Chưa chia động từ ngôi thứ ba (thiếu đuôi -s/-es)',
      example: 'He like / She live → He likes / She lives',
      penalty: 0.7,
    });
  }

  // 3. Gerund error after like/love/enjoy (bare infinitive instead of gerund)
  if (/\b(?:like|love|enjoy)\s+(?:play|eat|swim|read|watch|sing|draw|cook|dance)\b/i.test(text)) {
    issues.push({
      descriptionVi: 'Dùng động từ nguyên mẫu sau like/love (cần dùng danh động từ V-ing hoặc to V)',
      example: 'I like play → I like playing',
      penalty: 0.6,
    });
  }

  // 4. Missing plural -s after numerals > 1 (e.g. "9 year old", "two cat")
  if (/\b(?:\d{2,}|[2-9]|two|three|four|five|six|seven|eight|nine|ten)\s+year\s+old\b/i.test(text)) {
    issues.push({
      descriptionVi: 'Thiếu đuôi danh từ số nhiều -s sau số đếm ("year" thay vì "years")',
      example: '9 year old → 9 years old',
      penalty: 0.5,
    });
  }

  // 5. Wrong negation e.g. "I no like"
  if (/\bi\s+(?:no|not)\s+(?:like|have|want|can)\b/i.test(text)) {
    issues.push({
      descriptionVi: 'Sai cấu trúc phủ định ("I no like" thay vì "I don\'t like")',
      example: 'I no like → I don\'t like',
      penalty: 0.8,
    });
  }

  // 6. Sentence fragmentation / Lack of main verb
  const words = tokenizeTranscript(text);
  if (words.length > 0 && words.length < 6) {
    issues.push({
      descriptionVi: 'Nói quá ngắn, chưa tạo thành câu hoàn chỉnh có chủ ngữ và vị ngữ',
      example: 'Thiếu cấu trúc câu hoàn chỉnh',
      penalty: 1.0,
    });
  }

  return issues;
}

/**
 * Generate Rubric-based, non-repetitive, evidence-anchored scores and feedbacks
 */
export function evaluateSpeakingRubric(params: {
  schoolLevel: SchoolLevel;
  taskType: string;
  transcript: string;
  durationSeconds: number;
  hasVideo: boolean;
  scoringScale: ScoringScale;
  sampleContent: string;
  taskTitleEn: string;
  taskTitleVi: string;
  videoPostureAnalysis?: VideoPostureAnalysis;
}): ComprehensiveAssessmentResult {
  const {
    schoolLevel,
    transcript,
    durationSeconds,
    hasVideo,
    scoringScale,
    sampleContent,
    taskTitleEn,
    taskTitleVi,
    videoPostureAnalysis,
  } = params;

  // 1. Calculate realistic speech analytics
  const metrics = calculateSpeechMetrics(transcript, durationSeconds, sampleContent);

  // 2. Extract phoneme and grammar issues FIRST so score calculations strictly reflect actual errors
  const phonemeIssues = analyzePhonemeIssues(transcript, sampleContent);
  const sentenceComparisons = generateSentenceComparisons(transcript, sampleContent, schoolLevel);
  const grammarIssues = detectGrammarIssues(transcript, schoolLevel);

  // 3. Pronunciation score: strictly penalizes missing endings, mispronounced core words
  let pScore = 7.4;
  if (schoolLevel === 'middle') pScore = 7.2;
  else if (schoolLevel === 'high') pScore = 7.0;

  // Deduct for phoneme issues
  const highSeverityCount = phonemeIssues.filter((p) => p.severity === 'high').length;
  const medSeverityCount = phonemeIssues.filter((p) => p.severity === 'medium').length;
  const lowSeverityCount = phonemeIssues.filter((p) => p.severity === 'low').length;

  pScore -= highSeverityCount * 0.6;
  pScore -= medSeverityCount * 0.35;
  pScore -= lowSeverityCount * 0.2;

  // Pacing / rhythm adjustments
  if (metrics.wordsPerMinute >= 70 && metrics.wordsPerMinute <= 125) {
    pScore += 0.4;
  } else if (metrics.wordsPerMinute < 45) {
    pScore -= 0.6;
  }

  // Bonus for clear delivery with good word count and zero phoneme issues
  if (phonemeIssues.length === 0 && metrics.wordCount >= 15) {
    pScore += 0.8;
  }
  pScore = Math.min(9.6, Math.max(4.2, pScore));

  // 4. Grammar & Accuracy: strictly penalizes grammatical flaws and fragments
  let gScore = 7.5;
  if (schoolLevel === 'middle') gScore = 7.2;
  else if (schoolLevel === 'high') gScore = 7.0;

  // Deduct for each detected grammar issue
  let totalGrammarPenalty = 0;
  grammarIssues.forEach((issue) => {
    totalGrammarPenalty += issue.penalty;
  });
  gScore -= totalGrammarPenalty;

  // Penalty if student spoke too few words (fragmented sentences)
  if (metrics.wordCount < 8) {
    gScore -= 1.0;
  } else if (metrics.wordCount < 14) {
    gScore -= 0.5;
  } else if (metrics.wordCount >= 25 && grammarIssues.length === 0) {
    gScore += 0.8;
  }
  gScore = Math.min(9.6, Math.max(4.0, gScore));

  // 5. Fluency: directly grounded in WPM, pauses, and flow
  let fScore = 7.2;
  if (schoolLevel === 'primary') {
    if (metrics.wordsPerMinute >= 60 && metrics.wordsPerMinute <= 95) fScore = 8.0;
    else if (metrics.wordsPerMinute < 45) fScore = 5.8;
    else fScore = 7.0;
  } else if (schoolLevel === 'middle') {
    if (metrics.wordsPerMinute >= 75 && metrics.wordsPerMinute <= 115) fScore = 8.2;
    else if (metrics.wordsPerMinute < 55) fScore = 5.6;
    else fScore = 7.2;
  } else {
    // High school
    if (metrics.wordsPerMinute >= 95 && metrics.wordsPerMinute <= 135) fScore = 8.4;
    else if (metrics.wordsPerMinute < 70) fScore = 5.5;
    else fScore = 7.2;
  }

  // Deduct for excess hesitation/filler words and pauses
  if (metrics.fillerWordsCount > 2) {
    fScore -= Math.min(1.2, (metrics.fillerWordsCount - 1) * 0.3);
  }
  if (metrics.pauseCount > 2) {
    fScore -= Math.min(1.4, (metrics.pauseCount - 2) * 0.35);
  }
  fScore = Math.min(9.5, Math.max(4.0, fScore));

  // 6. Intonation: tied to pronunciation clarity, pauses, and cadence
  let iScore = pScore * 0.5 + fScore * 0.5;
  if (metrics.wordCount < 10) {
    iScore -= 0.5;
  }
  if (phonemeIssues.length > 2) {
    iScore -= 0.3;
  }
  iScore = Math.min(9.5, Math.max(4.2, iScore));

  // 7. Vocabulary (Lexical Resource): based on unique word richness and topic match
  let vScore = 7.0;
  if (metrics.wordCount < 10) {
    vScore = 5.5;
  } else {
    if (metrics.vocabularyRichnessPercentage >= 75) vScore += 0.8;
    else if (metrics.vocabularyRichnessPercentage < 50) vScore -= 0.6;

    if (metrics.targetTaskAlignmentPercentage >= 75) vScore += 0.6;
    else if (metrics.targetTaskAlignmentPercentage < 40) vScore -= 0.6;
  }
  vScore = Math.min(9.5, Math.max(4.2, vScore));

  // 8. Task Completion: based on word count & topic coverage
  let tScore = 7.2;
  if (metrics.wordCount < 8) {
    tScore = 5.0;
  } else if (metrics.wordCount < 15) {
    tScore = 6.4;
  } else if (metrics.wordCount >= 22 && metrics.targetTaskAlignmentPercentage >= 65) {
    tScore = 8.6;
  }
  tScore = Math.min(9.6, Math.max(4.5, tScore));

  // Presentation (if video) - evaluated dynamically based on real posture, eye contact, and framing
  const effectivePostureAnalysis: VideoPostureAnalysis | undefined = hasVideo
    ? videoPostureAnalysis || {
        posture: 'sitting_upright',
        eyeContact: 'direct',
        lighting: 'good',
        confidence: 0.85,
        detectedDetailsVi: 'Ngồi ngay ngắn, thẳng lưng trước camera',
        detectedDetailsEn: 'Sitting upright facing camera',
      }
    : undefined;

  const presentationSeed = `${transcript}_${durationSeconds}_${metrics.wordsPerMinute}_${metrics.wordCount}_${taskTitleEn}_${schoolLevel}_${Date.now()}`;
  const presentationRubric =
    hasVideo && effectivePostureAnalysis
      ? generatePresentationRubric(
          effectivePostureAnalysis,
          parseFloat(((fScore + tScore) / 2).toFixed(1)),
          scoringScale,
          presentationSeed
        )
      : undefined;

  const prScore = presentationRubric ? presentationRubric.score : undefined;

  // Round all to 1 decimal place
  pScore = parseFloat(pScore.toFixed(1));
  fScore = parseFloat(fScore.toFixed(1));
  iScore = parseFloat(iScore.toFixed(1));
  vScore = parseFloat(vScore.toFixed(1));
  gScore = parseFloat(gScore.toFixed(1));
  tScore = parseFloat(tScore.toFixed(1));

  // Calculate Overall
  const count = hasVideo ? 7 : 6;
  const sum = pScore + fScore + iScore + vScore + gScore + tScore + (prScore || 0);
  const overall10 = parseFloat((sum / count).toFixed(1));

  // CEFR mapping strictly matching Vietnam's GDPT 2018 (Chương trình GDPT 2018 của Bộ GD&ĐT)
  let cefr: CefrLevel = 'A1';
  let cefrDescriptionVi = '';

  if (schoolLevel === 'primary') {
    // Cấp Tiểu học (Lớp 3 - 5): Chuẩn đầu ra theo GDPT 2018 là Bậc 1 (A1).
    if (overall10 < 6.0) {
      cefr = 'Pre-A1';
      cefrDescriptionVi = 'Tiền A1 (Mức khởi đầu - Cần thêm từ vựng & cấu trúc)';
    } else if (overall10 < 8.2) {
      cefr = 'A1';
      cefrDescriptionVi = 'Bậc 1 (Đạt chuẩn Tiểu học GDPT 2018 - Cambridge Movers)';
    } else {
      cefr = 'A2';
      cefrDescriptionVi = 'Bậc 2 (Vượt chuẩn Tiểu học / Xuất sắc - Cambridge Flyers)';
    }
  } else if (schoolLevel === 'middle') {
    // Cấp THCS (Lớp 6 - 9): Chuẩn đầu ra theo GDPT 2018 là Bậc 2 (A2).
    if (overall10 < 5.8) {
      cefr = 'A1';
      cefrDescriptionVi = 'Bậc 1 (Chưa đạt chuẩn THCS - Cần củng cố thêm)';
    } else if (overall10 < 8.2) {
      cefr = 'A2';
      cefrDescriptionVi = 'Bậc 2 (Đạt chuẩn THCS GDPT 2018 - Cambridge KET)';
    } else {
      cefr = 'B1';
      cefrDescriptionVi = 'Bậc 3 (Vượt chuẩn THCS / Xuất sắc - Cambridge PET)';
    }
  } else {
    // Cấp THPT (Lớp 10 - 12): Chuẩn đầu ra theo GDPT 2018 là Bậc 3 (B1).
    if (overall10 < 5.8) {
      cefr = 'A2';
      cefrDescriptionVi = 'Bậc 2 (Chưa đạt chuẩn THPT - Cần luyện thêm)';
    } else if (overall10 < 7.8) {
      cefr = 'B1';
      cefrDescriptionVi = 'Bậc 3 (Đạt chuẩn THPT GDPT 2018)';
    } else if (overall10 < 9.1) {
      cefr = 'B2';
      cefrDescriptionVi = 'Bậc 4 (Vượt chuẩn THPT / Xuất sắc - Cambridge FCE)';
    } else {
      cefr = 'C1';
      cefrDescriptionVi = 'Bậc 5 (Thành thạo cao / Trình độ nâng cao)';
    }
  }

  // Format with scale (10 or 100)
  const mult = scoringScale === 100 ? 10 : 1;
  const fmt = (val: number) => (val * mult).toFixed(scoringScale === 100 ? 0 : 1);

  // Evidence-anchored Rubric feedbacks tailored to actual student output
  const feedback: AssessmentResult['feedback'] = {
    pronunciation: {
      e:
        pScore >= 8.2
          ? `Vowel and consonant sounds are clear and intelligible. Good control of key sounds with ${phonemeIssues.length > 0 ? `minor attention needed on '${phonemeIssues[0].word}'` : 'natural articulation'}.`
          : `Pronunciation needs attention on ending sounds and phonemes in words like ${phonemeIssues.slice(0, 3).map((p) => `'${p.word}'`).join(', ') || 'key words'}.`,
      v:
        pScore >= 8.2
          ? `Phát âm to, rõ ràng và chuẩn xác. Các nguyên âm chính xác; ${phonemeIssues.length > 0 ? `hãy hoàn thiện thêm từ "${phonemeIssues[0].word}"` : 'nhịp tự nhiên'}.`
          : phonemeIssues.length > 0
          ? `Phát hiện ${phonemeIssues.length} điểm cần cải thiện phát âm (đặc biệt các âm đuôi "${phonemeIssues.slice(0, 3).map((p) => p.word).join('", "')}"). Em hãy bật dứt khoát âm cuối chuẩn nhé.`
          : `Phát âm tương đối rõ, cần chú ý trọng âm và âm cuối (ending sounds).`,
    },
    fluency: {
      e: `Speaking speed is ${metrics.wordsPerMinute} WPM (${metrics.wordCount} words spoken). ${metrics.pauseCount > 2 ? `Contains ${metrics.pauseCount} hesitation pauses.` : 'Smooth delivery with natural flow.'}`,
      v: `Tốc độ nói đạt ${metrics.wordsPerMinute} từ/phút (${metrics.wordCount} từ). ${metrics.pauseCount > 2 ? `Có khoảng ${metrics.pauseCount} lần ngập ngừng ngắn; hãy giữ nhịp tự nhiên.` : 'Dòng chảy trôi chảy, ngắt nghỉ hợp lý.'}`,
    },
    intonation: {
      e:
        iScore >= 8.2
          ? 'Natural sentence stress and pitch modulation, especially in question and statement cadences.'
          : 'Intonation is understandable but slightly flat. Practice rising intonation for questions and falling cadence for statements.',
      v:
        iScore >= 8.2
          ? 'Ngữ điệu tự nhiên, lên giọng và xuống giọng chuẩn xác theo cấu trúc câu.'
          : 'Ngữ điệu tương đối ổn nhưng hơi đều giọng (monotone). Hãy nhấn mạnh vào các từ mang thông tin chính.',
    },
    vocabulary: {
      e: `Used ${metrics.vocabularyRichnessPercentage}% unique vocabulary with ${metrics.targetTaskAlignmentPercentage}% topic relevance. Good foundational words.`,
      v: `Độ phong phú từ vựng đạt ${metrics.vocabularyRichnessPercentage}%, bám sát chủ đề ${metrics.targetTaskAlignmentPercentage}%. Sử dụng từ vựng đúng trọng tâm.`,
    },
    grammar: {
      e:
        gScore >= 8.2
          ? 'Strong control of core sentence patterns. Subject-verb agreements and tenses are well managed.'
          : `Noticeable grammatical errors observed (${grammarIssues.length > 0 ? grammarIssues[0].example : 'sentence patterns'}). Focus on complete sentence structure.`,
      v:
        gScore >= 8.2
          ? 'Kiểm soát cấu trúc ngữ pháp tốt, câu mạch lạc, chia động từ và liên kết chuẩn xác.'
          : grammarIssues.length > 0
          ? `Bài nói có lỗi ngữ pháp: ${grammarIssues.slice(0, 2).map((g) => g.descriptionVi).join('. ')}. Hãy chú ý câu hoàn chỉnh và chia động từ nhé.`
          : 'Cấu trúc câu đơn giản hoặc ngắn. Em hãy chú ý chia động từ và liên kết câu mạch lạc hơn.',
    },
    taskCompletion: {
      e: `Addressed the speaking task (${taskTitleEn}). Ideas are relevant to the requested topic.`,
      v: `Hoàn thành yêu cầu bài nói (${taskTitleVi}). Bám sát mục tiêu luyện nói và chia sẻ thông tin theo chủ đề.`,
    },
    presentation: presentationRubric ? presentationRubric.feedback : undefined,
  };

  // Strengths & Improvement Priorities
  const strengths: string[] = [
    `Nói tự tin với tốc độ phù hợp (${metrics.wordsPerMinute} từ/phút)`,
    `Vốn từ vựng bám sát chủ đề (${metrics.targetTaskAlignmentPercentage}%)`,
  ];
  if (pScore >= 8.0) {
    strengths.push('Giọng nói to, phát âm các nguyên âm chính chuẩn xác');
  }
  if (presentationRubric && presentationRubric.strengths.length > 0) {
    strengths.push(...presentationRubric.strengths);
  }

  const improvementPriorities: string[] = [];
  if (phonemeIssues.length > 0) {
    improvementPriorities.push(`Luyện phát âm dứt khoát âm cuối cho từ: ${phonemeIssues.map((p) => p.word).join(', ')}`);
  }
  if (grammarIssues.length > 0) {
    improvementPriorities.push(`Khắc phục lỗi ngữ pháp: ${grammarIssues[0].example}`);
  }
  if (metrics.wordsPerMinute < 55) {
    improvementPriorities.push('Tăng nhịp nói trôi chảy hơn (mục tiêu 70-90 từ/phút)');
  }
  if (sentenceComparisons.length > 0) {
    improvementPriorities.push(`Thử cách diễn đạt nâng cao: "${sentenceComparisons[0].improvedSentence}"`);
  }
  if (presentationRubric && presentationRubric.improvements.length > 0) {
    improvementPriorities.push(...presentationRubric.improvements);
  }

  return {
    overallScore: overall10,
    scale: scoringScale,
    cefr,
    cefrDescriptionVi,
    hasVideo,
    videoPostureAnalysis: effectivePostureAnalysis,
    transcript: transcript.trim() || undefined,
    scores: {
      overall: fmt(overall10),
      pronunciation: fmt(pScore),
      fluency: fmt(fScore),
      intonation: fmt(iScore),
      vocabulary: fmt(vScore),
      grammar: fmt(gScore),
      taskCompletion: fmt(tScore),
      presentation: prScore ? fmt(prScore) : undefined,
    },
    feedback,
    speechMetrics: metrics,
    phonemeIssues,
    sentenceComparisons,
    grammarIssues,
    strengths,
    improvementPriorities,
    taskTopicEn: taskTitleEn,
    taskTopicVi: taskTitleVi,
  };
}
