import { PhonemeIssue } from '../types';

export interface PhonologicalProfile {
  ipa: string;
  category: 'ending_consonant' | 'stress' | 'vowel_length' | 'cluster';
  errorType: 'missing_ending' | 'mispronounced' | 'stress_intonation';
  errorLabelVi: string;
  problemVi: string;
  solutionVi: string;
  severity: 'high' | 'medium' | 'low';
}

/**
 * Curated knowledge base of common pronunciation errors, missing endings, and phonetic traps
 * specifically for Vietnamese learners speaking English.
 */
const PHONEME_DATABASE: Record<string, PhonologicalProfile> = {
  england: {
    ipa: '/ˈɪŋɡlənd/',
    category: 'cluster',
    errorType: 'missing_ending',
    errorLabelVi: 'Nuốt âm cuối /nd/',
    problemVi: 'Học sinh thường nuốt âm cuối thành "Ing-lân" hoặc đọc thành "Ing-lèn", bỏ bật âm /d/.',
    solutionVi: 'Nhấn trọng âm đầu, hạ giọng âm sau thành /lənd/ và bật nhẹ âm chặn /d/ ở cuối.',
    severity: 'high',
  },
  english: {
    ipa: '/ˈɪŋɡlɪʃ/',
    category: 'ending_consonant',
    errorType: 'missing_ending',
    errorLabelVi: 'Thiếu âm gió /ʃ/',
    problemVi: 'Học sinh thường nuốt âm gió hoặc phát âm nhầm thành "ing-lịt" / "ing-lịch".',
    solutionVi: 'Chu tròn môi, cong nhẹ đầu lưỡi tạo luồng hơi ma sát (âm "suýt") dứt khoát.',
    severity: 'high',
  },
  is: {
    ipa: '/ɪz/',
    category: 'ending_consonant',
    errorType: 'missing_ending',
    errorLabelVi: 'Nuốt âm rung /z/',
    problemVi: 'Dễ đọc thành "i" hoặc thả lỏng thành âm vô thanh /s/.',
    solutionVi: 'Rung nhẹ dây thanh quản cho âm /z/, không nuốt âm.',
    severity: 'high',
  },
  like: {
    ipa: '/laɪk/',
    category: 'ending_consonant',
    errorType: 'missing_ending',
    errorLabelVi: 'Thiếu âm chặn /k/',
    problemVi: 'Thường nuốt âm cuối thành "lai", khiến người nghe nhầm thành "lie" (nói dối / nằm).',
    solutionVi: 'Nâng phần sau của lưỡi chạm vòm miệng mềm, bật dứt khoát âm chặn đuôi /k/.',
    severity: 'high',
  },
  likes: {
    ipa: '/laɪks/',
    category: 'ending_consonant',
    errorType: 'missing_ending',
    errorLabelVi: 'Rơi rụng cụm âm /ks/',
    problemVi: 'Thường bỏ âm /s/ chia động từ ngôi thứ ba số ít hoặc nuốt âm /k/.',
    solutionVi: 'Bật liền mạch cả hai phụ âm dứt khoát: chặn /k/ rồi xì /s/ ngay lập tức (/laɪks/).',
    severity: 'high',
  },
  chicken: {
    ipa: '/ˈtʃɪkɪn/',
    category: 'cluster',
    errorType: 'mispronounced',
    errorLabelVi: 'Phát âm sai âm đầu /tʃ/',
    problemVi: 'Dễ đọc âm đầu /tʃ/ thành "si" hoặc "chi" nhưng bị bẹt môi.',
    solutionVi: 'Khép răng, tròn môi và bật mạnh âm /tʃ/ chuẩn xác.',
    severity: 'medium',
  },
  vietnam: {
    ipa: '/ˌvjetˈnæm/',
    category: 'stress',
    errorType: 'stress_intonation',
    errorLabelVi: 'Sai trọng âm tiếng Anh',
    problemVi: 'Thường giữ nguyên âm điệu tiếng Việt "Việt Nam", thiếu trọng âm chính tiếng Anh.',
    solutionVi: 'Nhấn rõ vào âm tiết thứ hai /-ˈnæm/ và ngậm hai môi dứt khoát cho âm /m/.',
    severity: 'medium',
  },
  vietnamese: {
    ipa: '/ˌvjetnəˈmiːz/',
    category: 'ending_consonant',
    errorType: 'missing_ending',
    errorLabelVi: 'Thiếu âm cuối rung /z/',
    problemVi: 'Dễ phát âm thành "vịt-na-mi", bỏ mất âm rung /z/ và quên trọng âm tiết 3.',
    solutionVi: 'Ngân dài nguyên âm /iː/, rung nhẹ dây thanh quản cho âm cuối /z/.',
    severity: 'high',
  },
  love: {
    ipa: '/lʌv/',
    category: 'ending_consonant',
    errorType: 'missing_ending',
    errorLabelVi: 'Nuốt âm răng môi /v/',
    problemVi: 'Thường phát âm thành "lớp" (nhầm sang âm /p/) hoặc "lâu" (nuốt hẳn phụ âm cuối).',
    solutionVi: 'Răng cửa trên chạm nhẹ môi dưới, đẩy luồng hơi rung /v/ có âm sắc.',
    severity: 'medium',
  },
  name: {
    ipa: '/neɪm/',
    category: 'ending_consonant',
    errorType: 'missing_ending',
    errorLabelVi: 'Nuốt âm ngậm môi /m/',
    problemVi: 'Dễ phát âm thành "nây" (nuốt âm cuối /m/) thay vì ngậm hai môi kết thúc.',
    solutionVi: 'Phát âm nguyên âm đôi /eɪ/ rồi khép chặt hai môi lại cho âm /m/.',
    severity: 'medium',
  },
  school: {
    ipa: '/skuːl/',
    category: 'cluster',
    errorType: 'mispronounced',
    errorLabelVi: 'Lệch cụm phụ âm /sk/ & /l/',
    problemVi: 'Thường chèn thêm nguyên âm thừa thành "sờ-cun" và không cong lưỡi âm /l/.',
    solutionVi: 'Không đọc "sờ", lướt âm gió /s/ sang /k/ nhanh, ngân dài /uː/ rồi cong đầu lưỡi chạm chân răng trên /l/.',
    severity: 'high',
  },
  children: {
    ipa: '/ˈtʃɪldrən/',
    category: 'cluster',
    errorType: 'mispronounced',
    errorLabelVi: 'Phát âm sai âm đầu /tʃ/ và cụm /dr/',
    problemVi: 'Đọc thành "chi-đần" hoặc nhầm với từ "child".',
    solutionVi: 'Nhấn âm 1 /ˈtʃɪl/, bật rõ cụm phụ âm /dr/ ở âm tiết sau (/drən/).',
    severity: 'medium',
  },
  child: {
    ipa: '/tʃaɪld/',
    category: 'ending_consonant',
    errorType: 'missing_ending',
    errorLabelVi: 'Thiếu cụm âm cuối /ld/',
    problemVi: 'Dễ đọc thành "chai" (bỏ mất âm cong lưỡi /l/ và âm chặn /d/).',
    solutionVi: 'Đọc nguyên âm đôi /aɪ/, cong lưỡi tạo /l/ rồi bật nhẹ âm chặn /d/ ở cuối.',
    severity: 'high',
  },
  friends: {
    ipa: '/frendz/',
    category: 'ending_consonant',
    errorType: 'missing_ending',
    errorLabelVi: 'Thiếu âm số nhiều /dz/',
    problemVi: 'Thường nuốt âm /s/ hoặc /z/ của danh từ số nhiều, người nghe hiểu thành số ít.',
    solutionVi: 'Rung nhẹ dây thanh quản cho cụm âm cuối /dz/ dứt khoát.',
    severity: 'high',
  },
  friend: {
    ipa: '/frend/',
    category: 'ending_consonant',
    errorType: 'missing_ending',
    errorLabelVi: 'Nuốt âm chặn cuối /d/',
    problemVi: 'Dễ đọc thành "phen" (nuốt âm /d/ ở cuối).',
    solutionVi: 'Chạm nhẹ đầu lưỡi vào chân răng trên để bật nhẹ âm /d/.',
    severity: 'medium',
  },
  years: {
    ipa: '/jɪəz/',
    category: 'ending_consonant',
    errorType: 'missing_ending',
    errorLabelVi: 'Rơi rụng âm đuôi /z/',
    problemVi: 'Đọc thành "dia" hoặc "ia", bỏ mất âm rung /z/ ở cuối.',
    solutionVi: 'Bắt đầu với /j/ và kết thúc dứt khoát bằng âm rung /z/ nhẹ.',
    severity: 'medium',
  },
  old: {
    ipa: '/əʊld/',
    category: 'ending_consonant',
    errorType: 'missing_ending',
    errorLabelVi: 'Nuốt âm /ld/',
    problemVi: 'Thường nuốt mất thành "âu" trong cụm "years old".',
    solutionVi: 'Cong lưỡi âm /l/ và bật nhẹ âm /d/ (/əʊld/).',
    severity: 'medium',
  },
  favorite: {
    ipa: '/ˈfeɪvərɪt/',
    category: 'stress',
    errorType: 'stress_intonation',
    errorLabelVi: 'Lệch trọng âm và âm cuối /t/',
    problemVi: 'Nhấn sai vào âm 2 hoặc đọc thành 4 âm "phây-vơ-ri-tờ".',
    solutionVi: 'Nhấn mạnh dứt khoát âm 1 /ˈfeɪ/, các âm sau đọc lướt nhẹ, cuối bật nhẹ /t/.',
    severity: 'high',
  },
  subject: {
    ipa: '/ˈsʌbdʒɪkt/',
    category: 'ending_consonant',
    errorType: 'missing_ending',
    errorLabelVi: 'Nuốt cụm phụ âm cuối /kt/',
    problemVi: 'Thường nuốt âm cuối thành "sắp-dếch" mà không bật âm /kt/.',
    solutionVi: 'Bật âm chặn /k/ rồi tiếp nối ngay âm /t/ dứt khoát.',
    severity: 'high',
  },
  because: {
    ipa: '/bɪˈkɒz/ or /bɪˈkəz/',
    category: 'ending_consonant',
    errorType: 'missing_ending',
    errorLabelVi: 'Nuốt âm kết thúc /z/',
    problemVi: 'Thường đọc thành "bi-cơ" hoặc đọc âm /s/ vô thanh.',
    solutionVi: 'Rung nhẹ dây thanh quản cho âm cuối /z/ (/bɪˈkɒz/), không nuốt âm.',
    severity: 'medium',
  },
  what: {
    ipa: '/wɒt/ or /wʌt/',
    category: 'ending_consonant',
    errorType: 'missing_ending',
    errorLabelVi: 'Nuốt âm đuôi /t/',
    problemVi: 'Thường đọc thành "goát" không có âm đuôi.',
    solutionVi: 'Chạm nhanh đầu lưỡi vào chân răng trên, bật dứt khoát âm /t/.',
    severity: 'medium',
  },
  watch: {
    ipa: '/wɒtʃ/',
    category: 'ending_consonant',
    errorType: 'missing_ending',
    errorLabelVi: 'Lẫn giữa /tʃ/ và /s/',
    problemVi: 'Dễ nói thành "goát-xơ" thay vì âm ngừng /tʃ/.',
    solutionVi: 'Chu môi bật dứt khoát /tʃ/ (tương tự tiếng bật trong "ch" nhưng mạnh hơn).',
    severity: 'high',
  },
  speak: {
    ipa: '/spiːk/',
    category: 'ending_consonant',
    errorType: 'missing_ending',
    errorLabelVi: 'Thiếu âm chặn đuôi /k/',
    problemVi: 'Dễ đọc thành "s-pích" mà quên âm chặn /k/ ở đuôi.',
    solutionVi: 'Bật dứt khoát âm chặn /k/ đằng sau khi phát nguyên âm dài /iː/.',
    severity: 'medium',
  },
  music: {
    ipa: '/ˈmjuːzɪk/',
    category: 'ending_consonant',
    errorType: 'missing_ending',
    errorLabelVi: 'Nuốt âm cuối /k/',
    problemVi: 'Đọc thành "miu-dịt" hoặc quên âm cuối.',
    solutionVi: 'Âm giữa là âm rung /z/, kết thúc dứt khoát bằng âm chặn đuôi /k/.',
    severity: 'medium',
  },
  teacher: {
    ipa: '/ˈtiːtʃə(r)/',
    category: 'stress',
    errorType: 'stress_intonation',
    errorLabelVi: 'Chưa chuẩn /tʃ/',
    problemVi: 'Phát âm thành "tích-chờ" nhưng bị bẹt môi.',
    solutionVi: 'Ngân dài nguyên âm /iː/, nhấn âm 1 và chu môi âm /tʃ/ ở giữa.',
    severity: 'low',
  },
  study: {
    ipa: '/ˈstʌdi/',
    category: 'cluster',
    errorType: 'mispronounced',
    errorLabelVi: 'Chèn âm thừa thành "sờ-ta-đi"',
    problemVi: 'Thêm nguyên âm phụ vào cụm phụ âm /st/.',
    solutionVi: 'Lướt nhanh âm gió /s/ nối liền sang /t/, không tách thành "sờ".',
    severity: 'low',
  },
};

/**
 * Clean transcript tokens into searchable words
 */
function tokenize(text: string): string[] {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length >= 2);
}

/**
 * Intelligent Phoneme & Pronunciation Analyzer
 */
export function extractAccuratePhonemeIssues(
  rawTranscript: string,
  sampleContent: string
): PhonemeIssue[] {
  const issues: PhonemeIssue[] = [];
  const studentText = (rawTranscript || '').trim();

  // If transcript is totally empty, analyze sampleContent
  const sourceText = studentText.length >= 3 ? studentText : sampleContent;
  const studentWords = tokenize(sourceText);

  // Check unique student words in order of speaking
  const uniqueStudentWords: string[] = [];
  const seen = new Set<string>();
  for (const w of studentWords) {
    if (!seen.has(w)) {
      seen.add(w);
      uniqueStudentWords.push(w);
    }
  }

  // --- 1. Check for Grammatical / Key Vocabulary Omissions (Bỏ từ) ---
  if (/\bi\s+vietnam\b/i.test(studentText)) {
    issues.push({
      word: 'am / come from',
      phoneticExpected: '/æm/ - /kʌm frɒm/',
      phoneticIssue:
        'Lỗi học sinh nói tắt "I Vietnam" làm thiếu động từ "I am from Vietnam" hoặc "I come from Vietnam".',
      severity: 'high',
      errorType: 'omitted_word',
      errorLabelVi: 'Bỏ từ',
      suggestedActionVi: 'Bổ sung động từ "am" và "from" trước tên quốc gia.',
    });
  }

  if (/\b\d+\s+(?!years|year)/i.test(studentText) && !/years\s+old/i.test(studentText)) {
    issues.push({
      word: 'years old',
      phoneticExpected: '/jɪəz əʊld/',
      phoneticIssue:
        'Lỗi thiếu cụm chỉ tuổi: Khi nói tuổi, cần phát âm trọn cụm "years old" với âm rung /z/ nối liền sang /əʊld/.',
      severity: 'medium',
      errorType: 'omitted_word',
      errorLabelVi: 'Thiếu cụm cần thiết',
      suggestedActionVi: 'Nói đủ "years old" sau số tuổi.',
    });
  }

  // --- 2. Check Real Student Words with Phoneme Traps & Missing Endings ---
  const prioritizedCandidates = uniqueStudentWords.filter((w) => PHONEME_DATABASE[w]);

  prioritizedCandidates.sort((a, b) => {
    const sevOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
    const aScore = (sevOrder[PHONEME_DATABASE[a].severity] || 1) + (PHONEME_DATABASE[a].category === 'ending_consonant' ? 2 : 0);
    const bScore = (sevOrder[PHONEME_DATABASE[b].severity] || 1) + (PHONEME_DATABASE[b].category === 'ending_consonant' ? 2 : 0);
    return bScore - aScore;
  });

  for (const word of prioritizedCandidates) {
    if (issues.some((i) => i.word.toLowerCase() === word)) continue;
    const data = PHONEME_DATABASE[word];
    issues.push({
      word,
      phoneticExpected: data.ipa,
      phoneticIssue: `${data.errorLabelVi}: ${data.problemVi} Khắc phục: ${data.solutionVi}`,
      severity: data.severity,
      errorType: data.errorType,
      errorLabelVi: data.errorLabelVi,
      suggestedActionVi: data.solutionVi,
    });
    if (issues.length >= 3) break;
  }

  // --- 3. Dynamic Structural Check for other words with Ending Sounds ---
  if (issues.length < 3) {
    for (const word of uniqueStudentWords) {
      if (issues.some((i) => i.word.toLowerCase() === word)) continue;

      // Words ending in 'sh'
      if (word.endsWith('sh') && word.length >= 3) {
        issues.push({
          word,
          phoneticExpected: `/${word.slice(0, -2)}ɪʃ/`,
          phoneticIssue: `Lỗi nuốt âm đuôi "${word}": Cần chu tròn môi tạo luồng hơi ma sát dứt khoát, tránh đọc thành tiếng câm.`,
          severity: 'high',
          errorType: 'missing_ending',
          errorLabelVi: 'Thiếu âm gió',
          suggestedActionVi: 'Bật âm đuôi gió dứt khoát.',
        });
      }
      // Words ending in 'ch'
      else if (word.endsWith('ch') && word.length >= 3) {
        issues.push({
          word,
          phoneticExpected: `/${word.slice(0, -2)}tʃ/`,
          phoneticIssue: `Lỗi thiếu âm chặn /tʃ/ ở "${word}": Cần chạm môi tròn và bật luồng hơi dứt khoát.`,
          severity: 'high',
          errorType: 'missing_ending',
          errorLabelVi: 'Thiếu âm chặn /tʃ/',
          suggestedActionVi: 'Bật dứt khoát âm chặn /tʃ/ cuối từ.',
        });
      }
      // Words ending in 's' / 'es' (plural or verb)
      else if (word.endsWith('s') && word.length >= 4 && !word.endsWith('is')) {
        issues.push({
          word,
          phoneticIssue: `Lỗi âm số nhiều/chia động từ "${word}": Cần phát âm gió /s/ hoặc âm rung /z/ ở đuôi chuẩn ngữ pháp.`,
          severity: 'medium',
          errorType: 'missing_ending',
          errorLabelVi: 'Rơi rụng âm đuôi /s/-/z/',
          suggestedActionVi: 'Phát dứt khoát âm cuối /s/ hoặc /z/.',
        });
      }

      if (issues.length >= 3) break;
    }
  }

  // --- 4. Fallback: If absolutely no tricky words identified ---
  if (issues.length === 0 && uniqueStudentWords.length > 0) {
    const candidate = uniqueStudentWords.find((w) => w.length >= 4) || uniqueStudentWords[0];
    issues.push({
      word: candidate,
      phoneticIssue: `Cần chú ý nguyên âm chuẩn và dứt khoát khi phát âm từ "${candidate}".`,
      severity: 'low',
      errorType: 'mispronounced',
      errorLabelVi: 'Phát âm hời hợt',
      suggestedActionVi: 'Nghe lại phát âm chuẩn và luyện tập nhắc lại.',
    });
  }

  return issues;
}
