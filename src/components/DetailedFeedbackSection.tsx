import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  PhonemeIssue,
  SentenceComparison,
  SpeechMetrics,
  AssessmentResult,
} from '../types';
import {
  Volume2,
  VolumeX,
  ArrowRight,
  TrendingUp,
  Gauge,
  Clock,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Layers,
  Lightbulb,
  Mic,
  ChevronDown,
  Eye,
  Smile,
  UserCheck,
  Camera,
  Users,
} from 'lucide-react';
import { playPedagogicalAudio, stopSpeechAudio } from '../utils/speechPlayer';
import { normalizeTranscribedSpeech } from '../utils/transcriptPunctuation';
import { ShadowingChallengeBox } from './ShadowingChallengeBox';

interface DetailedFeedbackSectionProps {
  metrics?: SpeechMetrics;
  phonemeIssues?: PhonemeIssue[];
  sentenceComparisons?: SentenceComparison[];
  strengths?: string[];
  improvementPriorities?: string[];
  transcript?: string;
  presentationAnalysis?: AssessmentResult['presentationAnalysis'];
  onPlaySentenceAudio?: (text: string) => void;
}

export const DetailedFeedbackSection: React.FC<DetailedFeedbackSectionProps> = ({
  metrics,
  phonemeIssues = [],
  sentenceComparisons = [],
  strengths = [],
  improvementPriorities = [],
  transcript,
  presentationAnalysis,
  onPlaySentenceAudio,
}) => {
  const [isPlayingFullTranscript, setIsPlayingFullTranscript] = useState(false);
  const [currentlyPlayingText, setCurrentlyPlayingText] = useState<string | null>(null);
  const [activeShadowingIdx, setActiveShadowingIdx] = useState<number | null>(null);

  const speakText = (text: string, isFullTranscript = false) => {
    if (isFullTranscript) {
      if (isPlayingFullTranscript) {
        stopSpeechAudio();
        setIsPlayingFullTranscript(false);
        return;
      }
      setIsPlayingFullTranscript(true);
      playPedagogicalAudio(text, {
        rate: 0.83, // Relaxed, clear educational pace with natural pauses
        pitch: 1.02,
        onEnd: () => setIsPlayingFullTranscript(false),
        onError: () => setIsPlayingFullTranscript(false),
      });
      return;
    }

    if (onPlaySentenceAudio) {
      onPlaySentenceAudio(text);
      return;
    }

    if (currentlyPlayingText === text) {
      stopSpeechAudio();
      setCurrentlyPlayingText(null);
      return;
    }

    setCurrentlyPlayingText(text);
    playPedagogicalAudio(text, {
      rate: 0.84,
      pitch: 1.02,
      onEnd: () => setCurrentlyPlayingText(null),
      onError: () => setCurrentlyPlayingText(null),
    });
  };

  return (
    <div id="detailedSpeechEvaluationSection" className="w-full space-y-4 mb-5 animate-fadeIn">
      {/* 1. Speech Analytics Real Metrics Bar */}
      {metrics && (
        <div
          id="realSpeechMetricsBar"
          className="bg-[#091122] rounded-2xl p-4 border border-cyan-500/30 shadow-[0_0_25px_rgba(6,182,212,0.12)]"
        >
          <div className="flex items-start sm:items-center justify-between pb-3 mb-3 border-b border-cyan-500/20">
            <div className="flex items-start gap-2.5">
              <Gauge className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <h4 className="text-xs sm:text-sm font-black text-cyan-300 uppercase tracking-wider leading-snug">
                  REAL-TIME SPEAKING METRICS
                </h4>
                <p className="text-[10.5px] sm:text-[11px] font-normal text-cyan-200/60 leading-tight">
                  Chỉ số phân tích bài nói thực tế
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] sm:text-[11px] font-bold text-slate-300 tracking-wide font-mono">
                GDPT 2018 &amp; CEFR STANDARDS
              </div>
              <div className="text-[9px] sm:text-[9.5px] font-normal text-slate-500">
                Chuẩn GDPT 2018 &amp; CEFR
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Metric 1: WPM */}
            <div className="bg-[#0e1b38] rounded-xl p-3 border border-cyan-500/20 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-1.5 mb-2">
                  <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-100 tracking-wide leading-tight">
                      Speaking Speed
                    </span>
                    <span className="text-[9.5px] font-normal text-slate-400 leading-tight">
                      Tốc độ nói
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-2xl font-black text-cyan-300 font-mono tracking-tight">
                    {metrics.wordsPerMinute}
                  </span>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10.5px] font-bold text-cyan-300">WPM (words/min)</span>
                    <span className="text-[9px] font-normal text-cyan-400/60">từ/phút</span>
                  </div>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-cyan-500/15 flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-cyan-200 leading-snug">
                  {metrics.wordsPerMinute >= 75 && metrics.wordsPerMinute <= 130
                    ? 'Ideal speaking pace'
                    : metrics.wordsPerMinute < 75
                    ? 'Slightly slow, aim higher'
                    : 'Quite fast, mind pauses'}
                </span>
                <span className="text-[9px] font-normal text-slate-400 leading-snug">
                  {metrics.wordsPerMinute >= 75 && metrics.wordsPerMinute <= 130
                    ? 'Nhịp nói vừa phải, tự nhiên'
                    : metrics.wordsPerMinute < 75
                    ? 'Nhịp hơi chậm, cần nhanh hơn'
                    : 'Nói khá nhanh, chú ý ngắt nghỉ'}
                </span>
              </div>
            </div>

            {/* Metric 2: Word count */}
            <div className="bg-[#0e1b38] rounded-xl p-3 border border-cyan-500/20 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-1.5 mb-2">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-100 tracking-wide leading-tight">
                      Speech Volume
                    </span>
                    <span className="text-[9.5px] font-normal text-slate-400 leading-tight">
                      Dung lượng bài nói
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-2xl font-black text-blue-300 font-mono tracking-tight">
                    {metrics.wordCount}
                  </span>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10.5px] font-bold text-blue-300">words ({metrics.durationSeconds}s)</span>
                    <span className="text-[9px] font-normal text-blue-400/60">từ ({metrics.durationSeconds} giây)</span>
                  </div>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-blue-500/15 flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-blue-200 leading-snug">
                  Good speaking duration
                </span>
                <span className="text-[9px] font-normal text-slate-400 leading-snug">
                  Thời lượng nói hoàn thành tốt
                </span>
              </div>
            </div>

            {/* Metric 3: Vocabulary Richness */}
            <div className="bg-[#0e1b38] rounded-xl p-3 border border-cyan-500/20 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-1.5 mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-100 tracking-wide leading-tight">
                      Vocabulary Diversity
                    </span>
                    <span className="text-[9.5px] font-normal text-slate-400 leading-tight">
                      Độ đa dạng từ vựng
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-2xl font-black text-purple-300 font-mono tracking-tight">
                    {metrics.vocabularyRichnessPercentage}%
                  </span>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10.5px] font-bold text-purple-300">rich vocabulary</span>
                    <span className="text-[9px] font-normal text-purple-400/60">từ phong phú</span>
                  </div>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-purple-500/15 flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-purple-200 leading-snug">
                  {metrics.vocabularyRichnessPercentage >= 70
                    ? 'Flexible vocabulary, low repetition'
                    : 'Some basic words repeated'}
                </span>
                <span className="text-[9px] font-normal text-slate-400 leading-snug">
                  {metrics.vocabularyRichnessPercentage >= 70
                    ? 'Vốn từ linh hoạt, ít lặp'
                    : 'Có vài từ bị lặp lại'}
                </span>
              </div>
            </div>

            {/* Metric 4: Topic Alignment */}
            <div className="bg-[#0e1b38] rounded-xl p-3 border border-cyan-500/20 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-1.5 mb-2">
                  <Layers className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-100 tracking-wide leading-tight">
                      Topic Alignment
                    </span>
                    <span className="text-[9.5px] font-normal text-slate-400 leading-tight">
                      Bám sát chủ đề
                    </span>
                  </div>
                </div>
                <div className="flex items-baseline gap-1.5 my-1">
                  <span className="text-2xl font-black text-emerald-300 font-mono tracking-tight">
                    {metrics.targetTaskAlignmentPercentage}%
                  </span>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10.5px] font-bold text-emerald-300">target accuracy</span>
                    <span className="text-[9px] font-normal text-emerald-400/60">độ chuẩn mục tiêu</span>
                  </div>
                </div>
              </div>
              <div className="mt-2.5 pt-2 border-t border-emerald-500/15 flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold text-emerald-200 leading-snug">
                  Aligned with keywords &amp; prompt
                </span>
                <span className="text-[9px] font-normal text-slate-400 leading-snug">
                  Bám sát từ khóa bài yêu cầu
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Side-by-Side: Sentence Comparison & Phoneme Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
        {/* Left: What You Said vs Native Speaker Elevation */}
        <div
          id="boxSentenceComparison"
          className="bg-[#091124] rounded-2xl p-4 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] flex flex-col"
        >
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-cyan-500/20">
            <h4 className="text-xs font-black text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              So sánh Câu Nói Thực Tế (What You Said vs Native Way)
            </h4>
          </div>
          <div className="space-y-3 flex-grow">
            {sentenceComparisons.length > 0 ? (
              sentenceComparisons.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#0e1c38] border border-cyan-500/20 space-y-2 hover:border-cyan-400/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Câu học sinh nói:
                    </span>
                    <span className="text-[9.5px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 font-mono">
                      {item.focusArea.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[12px] text-slate-200 italic font-medium pl-3 border-l-2 border-rose-500/60">
                    "{item.studentSentence}"
                  </p>
                  <div className="pt-1 flex items-center gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[10.5px] font-bold uppercase tracking-wider text-emerald-300">
                      Cách diễn đạt chuẩn &amp; hay hơn:
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-2 pl-3 border-l-2 border-emerald-500/60">
                    <p className="text-[12.5px] text-emerald-200 font-semibold">
                      "{item.improvedSentence}"
                    </p>
                    <button
                      type="button"
                      onClick={() => speakText(item.improvedSentence)}
                      className={`p-1.5 rounded-md border text-emerald-300 hover:text-white cursor-pointer transition-colors shrink-0 ${
                        currentlyPlayingText === item.improvedSentence
                          ? 'bg-amber-950 border-amber-400 text-amber-300 animate-pulse'
                          : 'bg-emerald-950/80 hover:bg-emerald-900 border-emerald-500/40'
                      }`}
                      title={
                        currentlyPlayingText === item.improvedSentence
                          ? 'Dừng phát'
                          : 'Nghe phát âm chuẩn'
                      }
                    >
                      {currentlyPlayingText === item.improvedSentence ? (
                        <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                  <div className="text-[11px] text-slate-300 bg-[#071124] p-2.5 rounded-lg border border-slate-800 space-y-1">
                    <div className="text-cyan-300 font-semibold flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Giải thích sư phạm:</span>
                    </div>
                    <div className="text-slate-300 whitespace-pre-line pl-0.5 leading-relaxed font-normal">
                      {item.explanationVi.replace(/^•\s*(\[[^\]]+\]:\s*)?/, '')}
                    </div>
                  </div>

                  {/* Practice & Shadowing Button & Challenge Box */}
                  <div className="pt-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setActiveShadowingIdx(activeShadowingIdx === idx ? null : idx)
                      }
                      className={`w-full py-2.5 px-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        activeShadowingIdx === idx
                          ? 'bg-gradient-to-r from-cyan-950/90 via-blue-950/90 to-cyan-950/90 border-cyan-400 text-cyan-200 shadow-[0_0_20px_rgba(6,182,212,0.35)]'
                          : 'bg-gradient-to-r from-[#0c1f3d] to-[#0a1830] hover:from-[#102a52] hover:to-[#0d2040] border-cyan-500/40 text-cyan-300 hover:border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.12)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-left">
                        <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shrink-0">
                          <Mic className="w-4 h-4 text-cyan-300 animate-pulse" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11.5px] sm:text-[12px] font-black text-white tracking-wide">
                            THỬ THÁCH NÓI LẠI (Practice &amp; Shadowing)
                          </span>
                          <span className="text-[9.5px] sm:text-[10px] text-cyan-300/75 font-normal">
                            Luyện nói lại theo mẫu - AI phân tích ngay tức thì &amp; Trao huy hiệu đạt chuẩn
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300 shrink-0">
                        <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-cyan-950/90 border border-cyan-500/50 text-cyan-200 hidden sm:inline-block">
                          {activeShadowingIdx === idx ? 'Thu gọn' : 'Bắt đầu luyện'}
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            activeShadowingIdx === idx ? 'rotate-180 text-cyan-300' : 'text-slate-400'
                          }`}
                        />
                      </div>
                    </button>
                    <AnimatePresence>
                      {activeShadowingIdx === idx && (
                        <ShadowingChallengeBox
                          targetSentence={item.improvedSentence}
                          studentOriginalSentence={item.studentSentence}
                          index={idx}
                          onClose={() => setActiveShadowingIdx(null)}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">
                Chưa phát hiện lỗi ngữ pháp lớn trong bài. Câu nói lưu loát.
              </p>
            )}
          </div>
        </div>

        {/* Right: Phoneme & Pronunciation Nuance */}
        <div
          id="boxPhonemeIssues"
          className="bg-[#091124] rounded-2xl p-4 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)] flex flex-col"
        >
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-cyan-500/20">
            <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-amber-400" />
              Điểm cần chú ý &amp; Phát âm (Phoneme Insights)
            </h4>
          </div>
          <div className="space-y-2.5 flex-grow">
            {phonemeIssues.length > 0 ? (
              phonemeIssues.map((issue, idx) => {
                const isMissingEnding = issue.errorType === 'missing_ending';
                const isOmission = issue.errorType === 'omitted_word';
                const isMispronounced = issue.errorType === 'mispronounced';
                const badgeBg = isOmission
                  ? 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                  : isMissingEnding
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                  : isMispronounced
                  ? 'bg-purple-950/80 text-purple-300 border-purple-500/40'
                  : 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40';

                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#0e1c38] border border-cyan-500/20 flex items-start gap-2.5 hover:border-amber-400/40 transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-300 text-xs font-bold mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between gap-1 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-[13px] tracking-wide">
                            "{issue.word}"
                          </span>
                          {issue.phoneticExpected && (
                            <span className="text-cyan-300 font-mono text-[11px] px-1.5 py-0.5 bg-cyan-950/80 rounded border border-cyan-500/30">
                              {issue.phoneticExpected}
                            </span>
                          )}
                          {issue.errorLabelVi && (
                            <span
                              className={`text-[9.5px] px-2 py-0.5 rounded-full border font-semibold ${badgeBg}`}
                            >
                              {issue.errorLabelVi}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => speakText(issue.word)}
                          className="p-1 rounded bg-[#091124] hover:bg-cyan-950 text-cyan-300 border border-cyan-500/30 cursor-pointer transition-colors"
                          title="Nghe chuẩn từ này"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11.5px] text-slate-300 mt-1.5 leading-relaxed">
                        {issue.phoneticIssue}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 italic">
                Các từ ngữ cốt lõi được phát âm rõ ràng và chuẩn xác.
              </p>
            )}
          </div>

          {/* Actionable Next Practice Steps */}
          {improvementPriorities.length > 0 && (
            <div className="mt-3 pt-3 border-t border-cyan-500/20">
              <span className="text-[11px] font-bold text-cyan-300 block mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Nhiệm vụ ưu tiên để nâng band điểm tiếp theo:
              </span>
              <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                {improvementPriorities.map((item, i) => (
                  <li key={i} className="leading-snug">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 3. Video Presentation & Interaction Breakdown (if Video) */}
      {presentationAnalysis?.subRatings && (
        <div
          id="detailedPresentationSection"
          className="bg-[#091124] rounded-2xl p-4 border border-teal-500/35 shadow-[0_0_20px_rgba(20,184,166,0.12)] text-xs text-slate-200"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-teal-500/20">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-teal-950 border border-teal-500/50 flex items-center justify-center text-teal-300">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div>
                <h4 className="font-black text-teal-300 uppercase tracking-wider text-xs">
                  Phân tích Chi tiết Phong thái &amp; Tương tác Video (Presentation &amp; Interaction)
                </h4>
                <p className="text-[10px] text-teal-400/70 italic">
                  Đánh giá đa chiều dựa trên cử chỉ, hướng nhìn, biểu cảm và góc máy thực tế
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Điểm phong thái:</span>
              <span className="px-2.5 py-0.5 rounded-md bg-[#0d2238] border border-teal-500/40 text-teal-200 font-mono font-black text-xs">
                {presentationAnalysis.score} / 10
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div className="p-3 rounded-xl bg-[#061021] border border-teal-500/20">
              <div className="flex items-center gap-1.5 font-bold text-teal-300 mb-1">
                <Eye className="w-3.5 h-3.5 text-teal-400" />
                <span>Giao tiếp mắt &amp; Ống kính:</span>
              </div>
              <div className="text-[11px] font-semibold text-cyan-200 mb-1">
                {presentationAnalysis.subRatings.eyeContact.labelVi}
              </div>
              <p className="text-[11.5px] text-slate-300 leading-snug">
                {presentationAnalysis.subRatings.eyeContact.commentVi}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#061021] border border-teal-500/20">
              <div className="flex items-center gap-1.5 font-bold text-teal-300 mb-1">
                <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>Tư thế &amp; Ngôn ngữ cơ thể:</span>
              </div>
              <div className="text-[11px] font-semibold text-cyan-200 mb-1">
                {presentationAnalysis.subRatings.posture.labelVi}
              </div>
              <p className="text-[11.5px] text-slate-300 leading-snug">
                {presentationAnalysis.subRatings.posture.commentVi}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#061021] border border-teal-500/20">
              <div className="flex items-center gap-1.5 font-bold text-teal-300 mb-1">
                <Smile className="w-3.5 h-3.5 text-teal-400" />
                <span>Biểu cảm gương mặt:</span>
              </div>
              <div className="text-[11px] font-semibold text-cyan-200 mb-1">
                {presentationAnalysis.subRatings.facialExpression.labelVi}
              </div>
              <p className="text-[11.5px] text-slate-300 leading-snug">
                {presentationAnalysis.subRatings.facialExpression.commentVi}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#061021] border border-teal-500/20">
              <div className="flex items-center gap-1.5 font-bold text-teal-300 mb-1">
                <Camera className="w-3.5 h-3.5 text-teal-400" />
                <span>Khung hình &amp; Ánh sáng:</span>
              </div>
              <div className="text-[11px] font-semibold text-cyan-200 mb-1">
                {presentationAnalysis.subRatings.framingAndLighting.labelVi}
              </div>
              <p className="text-[11.5px] text-slate-300 leading-snug">
                {presentationAnalysis.subRatings.framingAndLighting.commentVi}
              </p>
            </div>
          </div>

          {presentationAnalysis.coachingTipsVi && presentationAnalysis.coachingTipsVi.length > 0 && (
            <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-2 text-emerald-200">
              <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-300">Gợi ý nâng cao phong thái: </span>
                <span>{presentationAnalysis.coachingTipsVi.join(' ')}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Real Transcribed Speech Display */}
      {transcript && (
        <div
          id="evaluatedSpeechTranscriptBox"
          className="bg-[#0b162f] rounded-xl p-3 border border-cyan-500/30 text-xs text-slate-200"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              Bản ghi Lời thoại Thực tế của Học sinh (Verified Student Transcript):
            </span>
            <button
              type="button"
              onClick={() => speakText(transcript, true)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer transition-all ${
                isPlayingFullTranscript
                  ? 'bg-amber-950/80 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.3)] animate-pulse'
                  : 'bg-cyan-950 hover:bg-cyan-900 border-cyan-500/50 text-cyan-200'
              }`}
              title={isPlayingFullTranscript ? 'Dừng phát' : 'Nghe giọng mẫu, có ngắt nghỉ chuẩn'}
            >
              {isPlayingFullTranscript ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-amber-400" /> Đang đọc (Bấm để dừng)
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Nghe lại toàn bài
                </>
              )}
            </button>
          </div>
          <p className="italic text-slate-100 bg-[#070e20] p-2.5 rounded-lg border border-cyan-500/20 font-serif leading-relaxed">
            "{normalizeTranscribedSpeech(transcript)}"
          </p>
        </div>
      )}
    </div>
  );
};
