import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Volume1,
  VolumeX,
  Play,
  Pause,
  Square,
  Sparkles,
  Sliders,
  RotateCcw,
  ListMusic,
  Headphones,
  Gauge,
  Minus,
  Plus,
  ChevronDown,
  FileText,
  Upload,
  ChevronUp,
  Loader2,
  Mic,
} from 'lucide-react';
import { SchoolLevel } from '../types';
import { extractTextFromFile } from '../utils/fileTextExtractor';
import { ShadowingChallengeBox } from './ShadowingChallengeBox';

interface SampleSpeechPlayerProps {
  sampleText: string;
  suggestedVocabulary?: string[];
  schoolLevel: SchoolLevel;
  onShowToast?: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export type VoiceOptionId =
  | 'us-female'
  | 'us-male'
  | 'uk-female'
  | 'uk-male'
  | 'us-girl'
  | 'us-boy';

export interface VoiceOption {
  id: VoiceOptionId;
  label: string;
  shortLabel: string;
  icon: string;
  langCode: string;
  gender: 'female' | 'male';
  accent: 'US' | 'Br.E';
  category: 'teacher' | 'child';
  toastDesc: string;
}

export const VOICE_OPTIONS: VoiceOption[] = [
  {
    id: 'us-female',
    label: 'Female Teacher (US)',
    shortLabel: 'US Female',
    icon: '👩‍🏫',
    langCode: 'en-US',
    gender: 'female',
    accent: 'US',
    category: 'teacher',
    toastDesc: 'Đã chọn Female Teacher (US) - Giọng cô giáo Anh-Mỹ chuẩn mực, truyền cảm.',
  },
  {
    id: 'us-male',
    label: 'Male Teacher (US)',
    shortLabel: 'US Male',
    icon: '👨‍🏫',
    langCode: 'en-US',
    gender: 'male',
    accent: 'US',
    category: 'teacher',
    toastDesc: 'Đã chọn Male Teacher (US) - Giọng thầy giáo Anh-Mỹ trầm ấm & dứt khoát.',
  },
  {
    id: 'uk-female',
    label: 'Female Teacher (Br.E)',
    shortLabel: 'Br.E Female',
    icon: '👩‍🏫',
    langCode: 'en-GB',
    gender: 'female',
    accent: 'Br.E',
    category: 'teacher',
    toastDesc: 'Đã chọn Female Teacher (Br.E) - Giọng cô giáo Anh-Anh (RP) thanh lịch, chuẩn mực.',
  },
  {
    id: 'uk-male',
    label: 'Male Teacher (Br.E)',
    shortLabel: 'Br.E Male',
    icon: '👨‍🏫',
    langCode: 'en-GB',
    gender: 'male',
    accent: 'Br.E',
    category: 'teacher',
    toastDesc: 'Đã chọn Male Teacher (Br.E) - Giọng thầy giáo Anh-Anh (Oxford/BBC) trầm ấm.',
  },
  {
    id: 'us-girl',
    label: 'Child Girl (US)',
    shortLabel: 'US Girl',
    icon: '👧',
    langCode: 'en-US',
    gender: 'female',
    accent: 'US',
    category: 'child',
    toastDesc: 'Đã chọn Child Girl (US) - Giọng bé gái trong trẻo, ngọt ngào, phát âm chuẩn.',
  },
  {
    id: 'us-boy',
    label: 'Child Boy (US)',
    shortLabel: 'US Boy',
    icon: '👦',
    langCode: 'en-US',
    gender: 'male',
    accent: 'US',
    category: 'child',
    toastDesc: 'Đã chọn Child Boy (US) - Giọng bé trai năng động, khỏe khoắn & rõ ràng.',
  },
];

export const SPEED_PRESETS = [
  { rate: 0.5, label: '0.5x', tag: 'Rất chậm', desc: 'Rất chậm (0.5x): Nghe siêu chi tiết các âm /s/, /t/, /d/' },
  { rate: 0.7, label: '0.7x', tag: 'Chậm', desc: 'Chậm (0.7x): Thích hợp học sinh Tiểu học lớp 1-3' },
  { rate: 0.8, label: '0.8x', tag: 'Vừa phải', desc: 'Vừa phải (0.8x): Dễ theo dõi và nhắc lại theo mẫu' },
  { rate: 0.9, label: '0.9x', tag: 'Tự nhiên', desc: 'Tự nhiên (0.9x): Ngữ điệu chuẩn mẫu, thích hợp THCS' },
  { rate: 1.0, label: '1.0x', tag: 'Chuẩn', desc: 'Chuẩn bản ngữ (1.0x): Tốc độ chuẩn Cambridge/GDPT' },
  { rate: 1.2, label: '1.2x', tag: 'Nhanh', desc: 'Nhanh (1.2x): Thách thức phản xạ nghe nhanh' },
  { rate: 1.5, label: '1.5x', tag: 'Siêu nhanh', desc: 'Siêu nhanh (1.5x): Luyện phản xạ nghe nâng cao' },
];

export const SampleSpeechPlayer: React.FC<SampleSpeechPlayerProps> = ({
  sampleText,
  suggestedVocabulary,
  schoolLevel,
  onShowToast,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState<VoiceOptionId>('us-female');
  const [playbackRate, setPlaybackRate] = useState<number>(0.8);
  const [volume, setVolume] = useState<number>(1.0);
  const [prevVolume, setPrevVolume] = useState<number>(1.0);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number | null>(null);
  const [activeSpeakingWord, setActiveSpeakingWord] = useState<string | null>(null);
  const [isSentenceMode, setIsSentenceMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customText, setCustomText] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInputDraft, setCustomInputDraft] = useState<string>('');
  const [shadowingSentenceIdx, setShadowingSentenceIdx] = useState<number | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isExtractingFile, setIsExtractingFile] = useState(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const sentencesRef = useRef<string[]>([]);
  const volumeRef = useRef<number>(1.0);
  const volumeDebounceTimerRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const customTextRef = useRef<string | null>(null);

  useEffect(() => {
    customTextRef.current = customText;
  }, [customText]);

  useEffect(() => {
    if (customTextRef.current === null && customText === null) {
      setCustomInputDraft(sampleText);
    }
  }, [sampleText, customText]);

  useEffect(() => {
    if (schoolLevel === 'primary') {
      setPlaybackRate(0.7);
    } else if (schoolLevel === 'middle') {
      setPlaybackRate(0.8);
    } else {
      setPlaybackRate(1.0);
    }
    stopSpeaking();
  }, [schoolLevel]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    const updateVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const englishVoices = allVoices.filter(
        (v) => v.lang.startsWith('en') || v.lang.includes('EN')
      );
      setVoices(englishVoices);
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const sentences = React.useMemo(() => {
    const textToProcess = customText !== null && customText.trim().length > 0 ? customText : sampleText;
    if (!textToProcess) return [];
    const raw = textToProcess
      .split(/(?<=[.!?])\s+|\n+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('[') && !s.endsWith(']'));
    sentencesRef.current = raw;
    return raw;
  }, [sampleText, customText]);

  const cleanTextForSpeech = (text: string): string => {
    if (!text) return '';
    const cleaned = text
      .replace(/^[A-Za-z\s]+:\s*/gm, '')
      .replace(/\s*\/\s*/g, ', or ')
      .replace(/[\(\[\{][^\)\]\}]*[\)\]\}]/g, '')
      .replace(/[*_#~]/g, '')
      .replace(/•/g, '')
      .trim();
    if ((!cleaned || cleaned.length < 2) && text.trim().length > 0) {
      return text.replace(/[*_#~]/g, '').trim();
    }
    return cleaned;
  };

  const isBritishVoice = (v: SpeechSynthesisVoice): boolean => {
    const lang = v.lang.toLowerCase();
    const name = v.name.toLowerCase();
    return (
      lang.startsWith('en-gb') ||
      lang.includes('en_gb') ||
      lang.includes('gb') ||
      lang.includes('uk') ||
      name.includes('united kingdom') ||
      name.includes('uk english') ||
      name.includes('great britain') ||
      name.includes('british') ||
      name.includes('oxford') ||
      name.includes('daniel') ||
      name.includes('oliver') ||
      name.includes('george') ||
      name.includes('serena') ||
      name.includes('libby') ||
      name.includes('sonia') ||
      name.includes('hazel') ||
      name.includes('fiona') ||
      name.includes('kate')
    );
  };

  const isUsVoice = (v: SpeechSynthesisVoice): boolean => {
    const lang = v.lang.toLowerCase();
    const name = v.name.toLowerCase();
    if (isBritishVoice(v)) return false;
    return (
      lang.startsWith('en-us') ||
      lang.includes('en_us') ||
      lang.includes('us') ||
      name.includes('united states') ||
      name.includes('us english') ||
      name.includes('david') ||
      name.includes('guy') ||
      name.includes('mark') ||
      name.includes('jenny') ||
      name.includes('aria') ||
      name.includes('zira') ||
      name.includes('samantha') ||
      name.includes('alex')
    );
  };

  const isFemaleVoice = (v: SpeechSynthesisVoice): boolean => {
    const name = v.name.toLowerCase();
    if (name.includes('google us english') && !name.includes('male')) return true;
    if (name.includes('google uk english female')) return true;
    if (name.includes('female') || name.includes('woman') || name.includes('girl')) return true;
    const femaleNames = [
      'samantha', 'jenny', 'aria', 'ava', 'victoria', 'karen', 'zira', 'susan', 'cathy',
      'allison', 'fiona', 'veena', 'tessa', 'moira', 'alice', 'emma', 'serena', 'clara',
      'amy', 'kate', 'heather', 'linda', 'sarah', 'michelle', 'stephanie', 'sara', 'anna',
      'eva', 'olivia', 'mia', 'chloe', 'libby', 'sonia', 'hazel', 'natasha', 'steffi'
    ];
    return femaleNames.some((k) => name.includes(k));
  };

  const isMaleVoice = (v: SpeechSynthesisVoice): boolean => {
    const name = v.name.toLowerCase();
    if (isFemaleVoice(v)) return false;
    if (name.includes('male') || name.includes('man') || name.includes('boy')) return true;
    const maleNames = [
      'guy', 'david', 'mark', 'george', 'daniel', 'alex', 'oliver', 'james',
      'christopher', 'eric', 'ryan', 'andrew', 'brian', 'steffan', 'richard',
      'tom', 'fred', 'bruce', 'ralph', 'junior', 'lee', 'jack', 'aaron', 'kevin',
      'paul', 'matthew', 'steve', 'michael', 'jason', 'william', 'john', 'arthur',
      'edward', 'peter', 'gordon', 'rishi', 'prabhat', 'male_1', 'male-1'
    ];
    return maleNames.some((k) => name.includes(k));
  };

  const getAvailableEnglishVoices = (): SpeechSynthesisVoice[] => {
    if (voices.length > 0) return voices;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith('en') || v.lang.includes('EN'));
    }
    return [];
  };

  const getBestVoice = (voiceId: VoiceOptionId): SpeechSynthesisVoice | null => {
    const allEnVoices = getAvailableEnglishVoices();
    if (allEnVoices.length === 0) return null;

    if (voiceId === 'us-male') {
      const usMaleVoices = allEnVoices.filter((v) => isUsVoice(v) && isMaleVoice(v));
      const premiumUsMale = usMaleVoices.find((v) => {
        const n = v.name.toLowerCase();
        return n.includes('natural') || n.includes('neural') || n.includes('online') || n.includes('david') || n.includes('guy');
      });
      if (premiumUsMale) return premiumUsMale;
      if (usMaleVoices.length > 0) return usMaleVoices[0];
      const anyMaleVoices = allEnVoices.filter((v) => isMaleVoice(v));
      if (anyMaleVoices.length > 0) return anyMaleVoices[0];
      return allEnVoices.find((v) => isUsVoice(v)) || allEnVoices[0];
    }

    if (voiceId === 'us-female') {
      const usFemaleVoices = allEnVoices.filter((v) => isUsVoice(v) && isFemaleVoice(v));
      const premiumUsFemale = usFemaleVoices.find((v) => {
        const n = v.name.toLowerCase();
        return n.includes('natural') || n.includes('neural') || n.includes('online') || n.includes('google') || n.includes('jenny');
      });
      if (premiumUsFemale) return premiumUsFemale;
      if (usFemaleVoices.length > 0) return usFemaleVoices[0];
      const anyFemaleVoices = allEnVoices.filter((v) => isFemaleVoice(v));
      if (anyFemaleVoices.length > 0) return anyFemaleVoices[0];
      return allEnVoices.find((v) => isUsVoice(v)) || allEnVoices[0];
    }

    if (voiceId === 'uk-male') {
      const ukMaleVoices = allEnVoices.filter((v) => isBritishVoice(v) && isMaleVoice(v));
      const googleUkMale = ukMaleVoices.find((v) => v.name.toLowerCase().includes('google'));
      if (googleUkMale) return googleUkMale;
      if (ukMaleVoices.length > 0) return ukMaleVoices[0];
      const anyMaleVoices = allEnVoices.filter((v) => isMaleVoice(v));
      if (anyMaleVoices.length > 0) return anyMaleVoices[0];
      return allEnVoices[0];
    }

    if (voiceId === 'uk-female') {
      const ukFemaleVoices = allEnVoices.filter((v) => isBritishVoice(v) && isFemaleVoice(v));
      const googleUkFemale = ukFemaleVoices.find((v) => v.name.toLowerCase().includes('google'));
      if (googleUkFemale) return googleUkFemale;
      if (ukFemaleVoices.length > 0) return ukFemaleVoices[0];
      const anyFemale = allEnVoices.filter((v) => isFemaleVoice(v));
      if (anyFemale.length > 0) return anyFemale[0];
      return allEnVoices[0];
    }

    if (voiceId === 'us-girl') {
      const usVoices = allEnVoices.filter((v) => isUsVoice(v));
      const nativeGirl = allEnVoices.filter((v) => {
        const n = v.name.toLowerCase();
        return n.includes('ana') || n.includes('sandy') || n.includes('shelley') || n.includes('ivy') || n.includes('chloe');
      });
      if (nativeGirl.length > 0) return nativeGirl[0];
      const premiumGirl = usVoices.find((v) => {
        const n = v.name.toLowerCase();
        return (n.includes('google') || n.includes('jenny') || n.includes('aria')) && isFemaleVoice(v);
      });
      if (premiumGirl) return premiumGirl;
      const anyUsFemale = usVoices.filter((v) => isFemaleVoice(v));
      if (anyUsFemale.length > 0) return anyUsFemale[0];
      return usVoices[0] || allEnVoices[0];
    }

    if (voiceId === 'us-boy') {
      const usVoices = allEnVoices.filter((v) => isUsVoice(v));
      const isAdultManVoice = (v: SpeechSynthesisVoice): boolean => {
        const n = v.name.toLowerCase();
        if (n.includes('junior')) return false;
        return (
          n.includes('guy') ||
          n.includes('david') ||
          n.includes('mark') ||
          n.includes('george') ||
          n.includes('daniel') ||
          n.includes('alex') ||
          n.includes('man') ||
          n.includes('desktop')
        );
      };

      const nativeBoy = allEnVoices.filter((v) => {
        const n = v.name.toLowerCase();
        return n.includes('junior') || n.includes('eddy');
      });
      if (nativeBoy.length > 0) return nativeBoy[0];

      const safeUsVoices = usVoices.filter((v) => !isAdultManVoice(v));
      if (safeUsVoices.length > 0) return safeUsVoices[0];
      return allEnVoices[0];
    }

    return allEnVoices[0];
  };

  const getCalibratedRate = (baseRate: number, voiceId: VoiceOptionId): number => {
    if (voiceId === 'us-girl') {
      const adjusted = Math.round(baseRate * 0.76 * 100) / 100;
      return Math.max(0.35, Math.min(1.5, adjusted));
    }
    if (voiceId === 'us-boy') {
      const adjusted = Math.round(baseRate * 0.86 * 100) / 100;
      return Math.max(0.35, Math.min(1.5, adjusted));
    }
    if (voiceId === 'us-female' || voiceId === 'uk-female') {
      const adjusted = Math.round(baseRate * 0.88 * 100) / 100;
      return Math.max(0.35, Math.min(1.5, adjusted));
    }
    return baseRate;
  };

  const getPitchForVoice = (voiceId: VoiceOptionId, voice?: SpeechSynthesisVoice | null): number => {
    const voiceName = voice?.name?.toLowerCase() || '';
    if (voiceId === 'us-girl') {
      if (voiceName.includes('ana') || voiceName.includes('sandy')) return 1.05;
      if (voiceName.includes('google')) return 1.25;
      return 1.22;
    }
    if (voiceId === 'us-boy') {
      if (voiceName.includes('junior') || voiceName.includes('eddy')) return 1.02;
      if (voiceName.includes('aria')) return 1.08;
      if (voiceName.includes('google')) return 1.10;
      return 1.08;
    }
    if (voiceId === 'us-female' || voiceId === 'uk-female') {
      return schoolLevel === 'primary' ? 1.04 : 1.0;
    }
    return voiceId === 'uk-male' ? 0.86 : 0.84;
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
    setActiveSentenceIndex(null);
    setActiveSpeakingWord(null);
  };

  const togglePause = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleSelectVoice = (voiceId: VoiceOptionId) => {
    const wasPlaying = isPlaying;
    stopSpeaking();
    setSelectedVoiceId(voiceId);
    const opt = VOICE_OPTIONS.find((v) => v.id === voiceId);
    if (opt) {
      onShowToast?.(opt.toastDesc, 'info');
    }
    if (wasPlaying) {
      setTimeout(() => {
        handlePlayFull(undefined, voiceId);
      }, 100);
    }
  };

  const handleVolumeChange = (newVol: number, showToastMsg: boolean = true) => {
    const clamped = Math.max(0, Math.min(1, Math.round(newVol * 100) / 100));
    setVolume(clamped);
    volumeRef.current = clamped;
    if (clamped > 0) {
      setPrevVolume(clamped);
    }

    if (clamped === 0) {
      if (volumeDebounceTimerRef.current) {
        clearTimeout(volumeDebounceTimerRef.current);
      }
      stopSpeaking();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (showToastMsg) {
        onShowToast?.('Âm thanh đã tắt (0% - Tắt tiếng)', 'info');
      }
      return;
    }

    if (isPlaying && !isPaused) {
      if (volumeDebounceTimerRef.current) {
        clearTimeout(volumeDebounceTimerRef.current);
      }
      volumeDebounceTimerRef.current = setTimeout(() => {
        if (activeSentenceIndex !== null && sentencesRef.current[activeSentenceIndex]) {
          handlePlaySentence(sentencesRef.current[activeSentenceIndex], activeSentenceIndex, clamped);
        } else {
          handlePlayFull(undefined, undefined, clamped);
        }
      }, 120);
    }

    if (showToastMsg) {
      const pct = Math.round(clamped * 100);
      onShowToast?.(
        `Âm lượng loa: ${pct}%${pct === 100 ? ' (To rõ tối đa)' : ''}`,
        'info'
      );
    }
  };

  const adjustVolumeStep = (delta: number) => {
    handleVolumeChange(volume + delta);
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
      volumeRef.current = 0;
      stopSpeaking();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      onShowToast?.('Âm thanh đã tắt (0% - Tắt tiếng)', 'info');
    } else {
      const restored = prevVolume > 0 ? prevVolume : 1.0;
      setVolume(restored);
      volumeRef.current = restored;
      onShowToast?.(`Âm lượng: ${Math.round(restored * 100)}% (To rõ)`, 'info');
    }
  };

  const handlePlayFull = (
    overrideRate?: number,
    overrideVoiceId?: VoiceOptionId,
    overrideVolume?: number,
    overrideText?: string
  ) => {
    if (!('speechSynthesis' in window)) {
      onShowToast?.('Trình duyệt không hỗ trợ phát giọng.', 'info');
      return;
    }

    const effectiveVolume = overrideVolume !== undefined ? overrideVolume : volume;
    if (effectiveVolume <= 0) {
      stopSpeaking();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      onShowToast?.(
        'Loa đang tắt tiếng (0%). Hãy chỉnh biểu tượng loa để mở âm thanh.',
        'info'
      );
      return;
    }

    if (
      overrideRate === undefined &&
      overrideVoiceId === undefined &&
      overrideVolume === undefined &&
      overrideText === undefined &&
      isPlaying &&
      !isPaused
    ) {
      stopSpeaking();
      return;
    }

    if (
      overrideRate === undefined &&
      overrideVoiceId === undefined &&
      overrideVolume === undefined &&
      overrideText === undefined &&
      isPaused
    ) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }

    stopSpeaking();

    const textToPlay =
      overrideText !== undefined && overrideText.trim().length > 0
        ? overrideText
        : customTextRef.current !== null && customTextRef.current.trim().length > 0
        ? customTextRef.current
        : customText !== null && customText.trim().length > 0
        ? customText
        : sampleText;

    const cleaned = cleanTextForSpeech(textToPlay);
    if (!cleaned) return;

    const voiceToUseId = overrideVoiceId ?? selectedVoiceId;
    const baseRate = overrideRate ?? playbackRate;
    const rateToUse = getCalibratedRate(baseRate, voiceToUseId);

    const utterance = new SpeechSynthesisUtterance(cleaned);
    const chosenVoice = getBestVoice(voiceToUseId);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    const defaultLang = voiceToUseId.startsWith('uk') ? 'en-GB' : 'en-US';
    utterance.lang = chosenVoice?.lang || defaultLang;
    utterance.rate = rateToUse;
    utterance.pitch = getPitchForVoice(voiceToUseId, chosenVoice);
    utterance.volume = Math.max(0.01, Math.min(1.0, effectiveVolume));

    const activeVoiceOpt = VOICE_OPTIONS.find((v) => v.id === voiceToUseId) || VOICE_OPTIONS[0];

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      onShowToast?.(
        `Đang phát: ${activeVoiceOpt.label} • ${baseRate}x • Âm lượng ${Math.round(effectiveVolume * 100)}%`,
        'info'
      );
    };

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const text = cleaned.substring(event.charIndex, event.charIndex + event.charLength);
        setActiveSpeakingWord(text);
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setActiveSentenceIndex(null);
      setActiveSpeakingWord(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setActiveSentenceIndex(null);
      setActiveSpeakingWord(null);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handleSelectSpeed = (newRate: number) => {
    setPlaybackRate(newRate);
    const speedInfo = SPEED_PRESETS.find((s) => s.rate === newRate);
    onShowToast?.(`Đã chỉnh tốc độ: ${newRate}x ${speedInfo ? `(${speedInfo.tag})` : ''}`, 'info');
    if (isPlaying) {
      stopSpeaking();
      setTimeout(() => {
        handlePlayFull(newRate);
      }, 70);
    }
  };

  const handlePlaySentence = (
    sentence: string,
    index: number,
    overrideVolume?: number
  ) => {
    if (!('speechSynthesis' in window)) return;
    const effectiveVolume = overrideVolume !== undefined ? overrideVolume : volume;
    if (effectiveVolume <= 0) {
      stopSpeaking();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      onShowToast?.(
        'Loa đang tắt tiếng (0%). Hãy chỉnh biểu tượng loa để mở âm thanh.',
        'info'
      );
      return;
    }

    stopSpeaking();
    const cleaned = cleanTextForSpeech(sentence);
    if (!cleaned) return;

    const utterance = new SpeechSynthesisUtterance(cleaned);
    const chosenVoice = getBestVoice(selectedVoiceId);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    const defaultLang = selectedVoiceId.startsWith('uk') ? 'en-GB' : 'en-US';
    utterance.lang = chosenVoice?.lang || defaultLang;
    utterance.rate = getCalibratedRate(playbackRate, selectedVoiceId);
    utterance.pitch = getPitchForVoice(selectedVoiceId, chosenVoice);
    utterance.volume = Math.max(0.01, Math.min(1.0, effectiveVolume));

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setActiveSentenceIndex(index);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setActiveSentenceIndex(null);
      setActiveSpeakingWord(null);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setActiveSentenceIndex(null);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const handlePlayWord = (
    word: string,
    e: React.MouseEvent,
    overrideVolume?: number
  ) => {
    e.stopPropagation();
    if (!('speechSynthesis' in window)) return;
    const effectiveVolume = overrideVolume !== undefined ? overrideVolume : volume;
    if (effectiveVolume <= 0) {
      stopSpeaking();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      onShowToast?.(
        'Loa đang tắt tiếng (0%). Hãy chỉnh biểu tượng loa để mở âm thanh.',
        'info'
      );
      return;
    }

    stopSpeaking();
    const utterance = new SpeechSynthesisUtterance(word);
    const chosenVoice = getBestVoice(selectedVoiceId);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    const defaultLang = selectedVoiceId.startsWith('uk') ? 'en-GB' : 'en-US';
    utterance.lang = chosenVoice?.lang || defaultLang;
    const baseWordRate = Math.min(playbackRate, 0.8);
    utterance.rate = getCalibratedRate(baseWordRate, selectedVoiceId);
    utterance.pitch = getPitchForVoice(selectedVoiceId, chosenVoice);
    utterance.volume = Math.max(0.01, Math.min(1.0, effectiveVolume));

    utterance.onstart = () => {
      setActiveSpeakingWord(word);
    };

    utterance.onend = () => {
      setActiveSpeakingWord(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    stopSpeaking();
    setIsExtractingFile(true);
    onShowToast?.(`Đang phân tích và trích xuất nội dung từ file "${file.name}"...`, 'info');

    try {
      const extracted = await extractTextFromFile(file);
      if (!extracted || extracted.trim().length === 0) {
        throw new Error('File không có nội dung văn bản đọc được.');
      }
      const trimmed = extracted.trim();
      customTextRef.current = trimmed;
      setCustomText(trimmed);
      setCustomInputDraft(trimmed);
      onShowToast?.(`Nạp file "${file.name}" thành công! Bắt đầu phát giọng nội dung file...`, 'success');
      handlePlayFull(undefined, undefined, undefined, trimmed);
    } catch (err: any) {
      console.error('File extraction error:', err);
      const msg = err?.message || `Không thể đọc file "${file.name}". Em hãy thử copy & dán trực tiếp nhé!`;
      onShowToast?.(msg, 'error');
    } finally {
      setIsExtractingFile(false);
    }
  };

  const handleApplyCustomText = () => {
    const trimmed = customInputDraft.trim();
    if (!trimmed) {
      onShowToast?.('Vui lòng nhập hoặc dán nội dung tiếng Anh trước.', 'info');
      return;
    }
    stopSpeaking();
    customTextRef.current = trimmed;
    setCustomText(trimmed);
    onShowToast?.('Đã nạp nội dung của em! Bắt đầu đọc chính xác nội dung vừa nhập...', 'success');
    handlePlayFull(undefined, undefined, undefined, trimmed);
  };

  const handleRestoreOriginal = () => {
    stopSpeaking();
    customTextRef.current = null;
    setCustomText(null);
    setCustomInputDraft(sampleText);
    onShowToast?.('Đã khôi phục bài luyện mẫu của chương trình.', 'info');
  };

  const levelBadge = {
    primary: {
      tag: 'Cấp 1 - Tiểu học',
      badgeClass: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.25)]',
      hint: 'Phát âm chậm, chuẩn âm tiết & phát âm cuối (Ending Sounds: /s/, /t/, /d/)',
      speedLabel: '0.78x (Chậm & Rõ)',
    },
    middle: {
      tag: 'Cấp 2 - THCS',
      badgeClass: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.25)]',
      hint: 'Tốc độ vừa phải, tự nhiên, rõ nối âm - trọng âm',
      speedLabel: '0.88x (Tự nhiên)',
    },
    high: {
      tag: 'Cấp 3 - THPT',
      badgeClass: 'bg-purple-950/80 text-purple-300 border-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.25)]',
      hint: 'Tốc độ chuẩn bản ngữ, ngữ điệu học thuật, nhấn nhá biểu cảm',
      speedLabel: '0.98x (Bản ngữ)',
    },
  }[schoolLevel];

  return (
    <div
      id="sampleSpeechPlayer"
      className="bg-[#090f1d] rounded-xl border border-cyan-500/35 shadow-[0_0_25px_rgba(6,182,212,0.12)] overflow-hidden transition-all duration-200 text-slate-200"
    >
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-[#0d1c3a] via-[#0f244e] to-[#0a1835] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-white border-b border-cyan-500/30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-950/70 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.25)]">
            <Headphones className="w-4 h-4 text-cyan-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wide uppercase text-cyan-300">
                Giọng đọc mẫu AI chuẩn
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-950/80 text-cyan-200 border border-cyan-500/40">
                GDPT 2018
              </span>
            </div>
            <p className="text-[11px] text-cyan-100/70 leading-tight">
              {levelBadge.hint}
            </p>
          </div>
        </div>

        {/* Action Controls in Header */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            id="btnToggleCustomInput"
            onClick={() => {
              const nextState = !showCustomInput;
              setShowCustomInput(nextState);
              if (nextState && !customInputDraft) {
                setCustomInputDraft(customText || sampleText);
              }
            }}
            title={
              showCustomInput
                ? 'Thu gọn khung nhập bài'
                : 'Nhập nội dung riêng hoặc tải file để nghe AI đọc mẫu'
            }
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showCustomInput
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold shadow-[0_0_12px_rgba(16,185,129,0.6)]'
                : customText !== null
                ? 'bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/60 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                : 'bg-[#13203c] border border-cyan-500/30 text-cyan-200 hover:bg-[#1a2d54] hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>
              {showCustomInput
                ? 'Thu gọn bài riêng'
                : customText !== null
                ? 'Bài riêng (đang dùng)'
                : 'Nhập bài / Tải file'}
            </span>
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            title="Tùy chỉnh giọng đọc & tốc độ"
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              showSettings
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                : 'bg-[#13203c] border border-cyan-500/30 text-cyan-200 hover:bg-[#1a2d54] hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tùy chỉnh</span>
          </button>

          <button
            onClick={() => {
              stopSpeaking();
              setIsSentenceMode(!isSentenceMode);
            }}
            title="Chuyển chế độ luyện từng câu"
            className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isSentenceMode
                ? 'bg-amber-400 text-amber-950 font-black shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                : 'bg-[#13203c] border border-cyan-500/30 text-cyan-200 hover:bg-[#1a2d54] hover:text-white'
            }`}
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span>{isSentenceMode ? 'Đang bật từng câu' : 'Luyện từng câu'}</span>
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-[#0a1224] px-3.5 py-2.5 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-200 animate-in fade-in duration-150">
          <div className="w-full flex flex-col gap-2.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-300 sm:w-28 shrink-0">Teacher:</span>
              <div className="inline-flex rounded-lg p-0.5 bg-[#0e1933] border border-cyan-500/30 flex-wrap gap-1">
                {VOICE_OPTIONS.filter((opt) => opt.category === 'teacher').map((opt) => {
                  const isSelected = selectedVoiceId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      id={`btnSettings_${opt.id}`}
                      onClick={() => handleSelectVoice(opt.id)}
                      title={opt.toastDesc}
                      className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                          : 'text-slate-300 hover:text-cyan-200 hover:bg-[#121f3a]'
                      }`}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-300 sm:w-28 shrink-0">Child:</span>
              <div className="inline-flex rounded-lg p-0.5 bg-[#0e1933] border border-cyan-500/30 flex-wrap gap-1">
                {VOICE_OPTIONS.filter((opt) => opt.category === 'child').map((opt) => {
                  const isSelected = selectedVoiceId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      id={`btnSettings_${opt.id}`}
                      onClick={() => handleSelectVoice(opt.id)}
                      title={opt.toastDesc}
                      className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                          : 'text-slate-300 hover:text-cyan-200 hover:bg-[#121f3a]'
                      }`}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row sm:items-center gap-2 pt-1 border-t border-slate-800">
            <div className="flex items-center gap-1.5 text-cyan-300 font-semibold sm:w-28 shrink-0">
              <Gauge className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tốc độ đọc:</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {SPEED_PRESETS.map((item) => (
                <button
                  key={item.rate}
                  type="button"
                  onClick={() => handleSelectSpeed(item.rate)}
                  title={item.desc}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    Math.abs(playbackRate - item.rate) < 0.04
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-black shadow-[0_0_10px_rgba(6,182,212,0.6)] scale-105'
                      : 'bg-[#121f3a] text-slate-300 hover:text-cyan-200 hover:bg-[#18294e] border border-cyan-500/20'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="text-[10.5px] opacity-80 font-normal">({item.tag})</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Input & File Upload Panel */}
      {showCustomInput && (
        <div
          id="customTextUploadPanel"
          className="bg-[#071324] px-3.5 py-3 border-b border-emerald-500/35 text-xs text-slate-200 animate-in fade-in duration-150 shadow-inner"
        >
          <div className="flex items-center justify-between gap-2 pb-2 mb-2.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <FileText className="w-4 h-4" />
              </span>
              <div>
                <h4 className="font-bold text-slate-100 text-xs flex items-center gap-2 flex-wrap">
                  <span>Nhập nội dung riêng hoặc tải file để nghe AI đọc mẫu</span>
                  {customText !== null && (
                    <span className="px-1.5 py-0.5 rounded text-[10.5px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50">
                      Đang phát bài của học sinh
                    </span>
                  )}
                </h4>
                <p className="text-[11px] text-slate-400">
                  Gõ văn bản tiếng Anh hoặc tải file (.txt, .docx, .doc, .pdf) để luyện nghe và đọc theo giọng Teacher &amp; Child
                </p>
              </div>
            </div>
            <button
              type="button"
              id="btnCloseCustomInputPanel"
              onClick={() => setShowCustomInput(false)}
              title="Thu gọn khung nhập bài"
              className="px-2 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition-colors text-[11px]"
            >
              <ChevronUp className="w-3.5 h-3.5" />
              <span>Thu gọn</span>
            </button>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingFile(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              setIsDraggingFile(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              setIsDraggingFile(false);
              const files = e.dataTransfer.files;
              if (files && files.length > 0) {
                handleFileUpload(files[0]);
              }
            }}
            className={`border-2 border-dashed rounded-lg p-2.5 mb-2.5 flex flex-wrap items-center justify-between gap-2.5 transition-all ${
              isDraggingFile
                ? 'border-emerald-400 bg-emerald-950/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'border-slate-700/80 bg-[#09152a] hover:border-emerald-500/40'
            }`}
          >
            <div className="flex items-center gap-2">
              {isExtractingFile ? (
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
              ) : (
                <Upload className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <div className="text-[11.5px]">
                <span className="text-slate-200 font-medium">
                  {isExtractingFile ? 'Đang đọc và phân tích file...' : 'Kéo thả file vào đây hoặc tải file:'}
                </span>
                <span className="text-slate-400 ml-1.5 text-[10.5px]">(.txt, .doc, .docx, .pdf)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.doc,.docx,.pdf,.rtf,.md"
                disabled={isExtractingFile}
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    handleFileUpload(files[0]);
                  }
                  e.target.value = '';
                }}
                className="hidden"
              />
              <button
                type="button"
                id="btnUploadCustomFile"
                disabled={isExtractingFile}
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all active:scale-95"
              >
                {isExtractingFile ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang nạp file...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span>Tải file lên</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="relative mb-2">
            <textarea
              id="textareaCustomSpeechText"
              rows={4}
              value={customInputDraft}
              onChange={(e) => setCustomInputDraft(e.target.value)}
              placeholder="Nhập hoặc dán đoạn văn, câu hội thoại tiếng Anh mà em muốn nghe ở đây..."
              className="w-full bg-[#040916] border border-slate-700/90 rounded-lg p-2.5 text-slate-100 text-xs sm:text-[13px] font-sans leading-relaxed focus:outline-hidden focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 placeholder:text-slate-500 resize-y min-h-[95px]"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
            <div className="text-slate-400 font-mono">
              {customInputDraft.trim() ? (
                <span>
                  {customInputDraft.trim().split(/\s+/).length} từ •{' '}
                  {customInputDraft.split(/[.!?]+/).filter(Boolean).length} câu
                </span>
              ) : (
                <span>Chưa có nội dung văn bản</span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {customText !== null && (
                <button
                  type="button"
                  id="btnRestoreOriginalLesson"
                  onClick={handleRestoreOriginal}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Khôi phục bài gốc</span>
                </button>
              )}
              {customInputDraft && (
                <button
                  type="button"
                  id="btnClearCustomDraft"
                  onClick={() => setCustomInputDraft('')}
                  className="px-2 py-1 rounded-md text-slate-400 hover:text-rose-400 cursor-pointer transition-colors"
                >
                  Xóa
                </button>
              )}
              <button
                type="button"
                id="btnApplyCustomSpeechText"
                onClick={handleApplyCustomText}
                disabled={!customInputDraft.trim()}
                className="px-3.5 py-1.5 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(16,185,129,0.4)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Áp dụng &amp; Nghe mẫu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="p-3.5 bg-[#080e1c]">
        {/* Playback Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5 bg-[#0c162c] p-2.5 rounded-lg border border-cyan-500/25">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              id="btnMainTTSPlay"
              onClick={() => handlePlayFull()}
              className={`px-4 py-2 rounded-lg font-black text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer ${
                isPlaying && !isPaused
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.6)] ring-2 ring-rose-400'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.5)] active:scale-98'
              }`}
            >
              {isPlaying && !isPaused ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>Dừng đọc</span>
                </>
              ) : isPaused ? (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Tiếp tục</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>
                    Nghe toàn bài ({(VOICE_OPTIONS.find((v) => v.id === selectedVoiceId) || VOICE_OPTIONS[0]).label} • {playbackRate}x)
                  </span>
                </>
              )}
            </button>

            {isPlaying && (
              <button
                onClick={togglePause}
                title={isPaused ? 'Tiếp tục' : 'Tạm dừng'}
                className="p-2 rounded-lg bg-[#142344] border border-cyan-500/40 text-cyan-300 hover:bg-[#1b2f5c] transition-colors cursor-pointer"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
            )}

            {/* Volume Control */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all shadow-xs ${
                volume === 0
                  ? 'bg-rose-950/40 border-rose-500/60 text-rose-300 ring-1 ring-rose-500/40'
                  : 'bg-[#142344] border-cyan-500/40 text-cyan-200'
              }`}
              title={volume === 0 ? 'Loa đang tắt tiếng (0%)' : 'Chỉnh âm lượng to nhỏ'}
            >
              <button
                type="button"
                id="btnSampleSpeakerToggle"
                onClick={toggleMute}
                title={volume === 0 ? 'Bật âm thanh (Unmute)' : 'Tắt âm thanh (Mute)'}
                className="p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer text-cyan-300 flex items-center justify-center"
              >
                {volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400 animate-pulse" />
                ) : volume < 0.5 ? (
                  <Volume1 className="w-4 h-4 text-cyan-300" />
                ) : (
                  <Volume2 className="w-4 h-4 text-cyan-300" />
                )}
              </button>

              <button
                type="button"
                onClick={() => adjustVolumeStep(-0.1)}
                disabled={volume <= 0}
                title="Giảm 10%"
                className="w-5 h-5 flex items-center justify-center rounded bg-slate-800/80 hover:bg-cyan-500/30 text-slate-300 hover:text-cyan-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-xs font-bold transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>

              <input
                id="inputVolumeSlider"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                title={`Kéo chỉnh âm lượng: ${Math.round(volume * 100)}%`}
                className="w-18 sm:w-24 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:accent-cyan-300"
              />

              <button
                type="button"
                onClick={() => adjustVolumeStep(0.1)}
                disabled={volume >= 1}
                title="Tăng 10%"
                className="w-5 h-5 flex items-center justify-center rounded bg-slate-800/80 hover:bg-cyan-500/30 text-slate-300 hover:text-cyan-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-xs font-bold transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={toggleMute}
                title={volume === 0 ? 'Bật âm thanh' : 'Tắt tiếng'}
                className={`text-[11px] font-black px-1.5 py-0.5 rounded cursor-pointer tabular-nums min-w-[34px] text-center transition-all ${
                  volume === 0
                    ? 'bg-rose-500/25 text-rose-300 border border-rose-500/50'
                    : 'text-cyan-300 hover:bg-cyan-500/20'
                }`}
              >
                {volume === 0 ? 'TẮT' : `${Math.round(volume * 100)}%`}
              </button>
            </div>

            {isPlaying && !isPaused && (
              <div className="flex items-center gap-0.5 px-2.5 py-1 bg-[#0f1d3a] rounded-md border border-cyan-500/30 text-cyan-400">
                <span className="w-1 h-3 bg-cyan-400 rounded-full animate-pulse" />
                <span className="w-1 h-5 bg-cyan-300 rounded-full animate-pulse [animation-delay:150ms]" />
                <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse [animation-delay:300ms]" />
                <span className="w-1 h-6 bg-cyan-400 rounded-full animate-pulse [animation-delay:200ms]" />
                <span className="text-[11px] font-semibold text-cyan-200 ml-1.5">Đang phát mẫu...</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-1 rounded-md border text-[11px] font-semibold ${levelBadge.badgeClass}`}>
              {levelBadge.tag}
            </span>

            <div className="relative inline-flex items-center">
              <select
                id="selectSampleVoiceQuick"
                value={selectedVoiceId}
                onChange={(e) => handleSelectVoice(e.target.value as VoiceOptionId)}
                title="Chọn giọng đọc"
                className="bg-[#0c1833] text-cyan-200 text-xs font-semibold pl-2.5 pr-7 py-1 rounded-md border border-cyan-500/40 hover:border-cyan-400 focus:outline-hidden focus:ring-1 focus:ring-cyan-400 cursor-pointer shadow-xs appearance-none"
              >
                {VOICE_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-slate-900 text-slate-200">
                    {opt.icon} {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400 absolute right-2 pointer-events-none" />
            </div>

            <div className="relative inline-flex items-center">
              <select
                id="selectSampleSpeedQuick"
                value={playbackRate}
                onChange={(e) => handleSelectSpeed(parseFloat(e.target.value))}
                title="Chọn tốc độ"
                className="bg-[#0c1833] text-cyan-200 text-xs font-semibold pl-2.5 pr-6 py-1 rounded-md border border-cyan-500/40 hover:border-cyan-400 focus:outline-hidden focus:ring-1 focus:ring-cyan-400 cursor-pointer shadow-xs appearance-none"
              >
                {SPEED_PRESETS.map((item) => (
                  <option key={item.rate} value={item.rate} className="bg-slate-900 text-slate-200">
                    {item.label} ({item.tag})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400 absolute right-1.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Text Display */}
        {isSentenceMode ? (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            <div className="text-[11px] text-amber-300 bg-amber-950/60 border border-amber-500/40 rounded-md px-2.5 py-1.5 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                Chế độ Luyện từng câu: Bấm <strong>"Nghe câu"</strong> để nghe hoặc <strong>"Luyện lại"</strong> để nói theo mẫu (Shadowing).
              </span>
            </div>
            {sentences.map((sent, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border transition-all flex flex-col gap-2 ${
                  activeSentenceIndex === idx
                    ? 'bg-[#0f2142] border-cyan-400 ring-1 ring-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-[#0b1428] border-slate-700/80 hover:border-cyan-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2 text-xs sm:text-[13px] leading-relaxed text-slate-200">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className={activeSentenceIndex === idx ? 'font-bold text-cyan-200' : ''}>
                      {sent}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handlePlaySentence(sent, idx)}
                      title="Nghe riêng câu này"
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer transition-colors ${
                        activeSentenceIndex === idx && isPlaying
                          ? 'bg-rose-600 text-white font-bold shadow-[0_0_10px_rgba(225,29,72,0.5)]'
                          : 'bg-[#12203e] border border-cyan-500/40 text-cyan-300 hover:bg-[#182c57]'
                      }`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span className="text-[11px]">Nghe câu {idx + 1}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setShadowingSentenceIdx(shadowingSentenceIdx === idx ? null : idx)
                      }
                      title="Luyện nói lại câu này"
                      className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 shrink-0 cursor-pointer transition-all ${
                        shadowingSentenceIdx === idx
                          ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(6,182,212,0.6)]'
                          : 'bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 hover:text-white'
                      }`}
                    >
                      <Mic className="w-3 h-3" />
                      <span className="text-[11px]">Luyện lại</span>
                    </button>
                  </div>
                </div>

                {shadowingSentenceIdx === idx && (
                  <div className="mt-1">
                    <ShadowingChallengeBox
                      targetSentence={sent}
                      index={idx}
                      onClose={() => setShadowingSentenceIdx(null)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-[#050914] rounded-lg p-3 sm:p-3.5 border border-cyan-500/30 font-mono text-xs sm:text-[13.5px] text-cyan-50 leading-relaxed whitespace-pre-line relative shadow-[inset_0_2px_8px_rgba(0,0,0,0.7)]">
            {customText !== null && (
              <div className="mb-2 pb-1.5 border-b border-emerald-500/30 flex items-center justify-between text-[11px] text-emerald-400 font-sans">
                <span className="flex items-center gap-1.5 font-semibold">
                  <FileText className="w-3.5 h-3.5" /> Đang dùng bài riêng của học sinh
                </span>
                <button
                  type="button"
                  onClick={handleRestoreOriginal}
                  className="text-slate-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  Khôi phục bài gốc
                </button>
              </div>
            )}
            {customText !== null ? customText : sampleText}
          </div>
        )}

        {/* Suggested Vocabulary Quick-Listen */}
        {suggestedVocabulary && suggestedVocabulary.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap items-center gap-1.5 text-[11.5px]">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
              Bấm để nghe phát âm từ vựng:
            </span>
            {suggestedVocabulary.map((voc) => (
              <button
                key={voc}
                type="button"
                onClick={(e) => handlePlayWord(voc, e)}
                title={`Bấm để nghe phát âm "${voc}"`}
                className={`px-2.5 py-0.5 rounded-md font-semibold border transition-all cursor-pointer inline-flex items-center gap-1 ${
                  activeSpeakingWord === voc
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 scale-105 font-black shadow-[0_0_12px_rgba(6,182,212,0.7)]'
                    : 'bg-[#0f1e3c] hover:bg-[#142850] text-cyan-300 border-cyan-500/35 hover:border-cyan-400'
                }`}
              >
                <span>{voc}</span>
                <Volume2 className="w-3 h-3 opacity-80" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
