/**
 * Intelligent Speech Player & Audio Normalizer
 * Provides clear, articulate, natural-paced native pronunciation with accurate pauses.
 */

let isCurrentlySpeaking = false;

/**
 * Punctuate and structure raw or run-on student speech to guarantee
 * that the Text-To-Speech engine pauses at natural syntactic boundaries.
 */
export function formatSpeechWithNaturalPauses(rawText: string): string {
  if (!rawText || !rawText.trim()) return '';

  let text = rawText.trim();
  const punctuationCount = (text.match(/[.!?,;:]/g) || []).length;
  const wordCount = text.split(/\s+/).length;

  if (punctuationCount < Math.max(1, Math.floor(wordCount / 6))) {
    // 1. Natural greeting pause
    text = text.replace(/^(hello|hi|good\s+morning|good\s+afternoon)\b/i, '$1, ');

    // 2. Name pause
    text = text.replace(
      /\b(my\s+name\s+is\s+[a-zA-Z]+)\b/i,
      '$1. '
    );

    // 3. Country / Origin pause
    text = text.replace(
      /\b((?:i\s+am|i'm|i\s+come)\s+from\s+[a-zA-Z\s]+?)(?=\s+(?:i'm|i\s+am|i\s+like|i\s+love|and|what|how|my|$))/i,
      '$1. '
    );

    // 4. Age pause
    text = text.replace(
      /\b((?:i'm|i\s+am|\b)\s*\d+\s+years?\s+old)\b/i,
      '$1. '
    );

    // 5. Subject / Hobby / Likes pause
    text = text.replace(
      /\b(i\s+like\s+[a-zA-Z\s]+?)(?=\s+(?:and|what|how|where|$))/i,
      '$1. '
    );

    // 6. Connective words: add slight comma pause before conjunctions
    text = text.replace(/\s+(because|and|but|so)\s+/gi, ', $1 ');

    // Clean up any double punctuation or spacing
    text = text
      .replace(/\s*([,.]\s*)+/g, (match) => (match.includes('.') ? '. ' : ', '))
      .replace(/\s+/g, ' ')
      .trim();

    // Ensure final period
    if (!/[.!?]$/.test(text)) {
      text += '.';
    }
  }

  return text;
}

/**
 * Finds the most natural, clear, high-fidelity English voice available on the device
 */
function getBestEnglishVoice(synth: SpeechSynthesis): SpeechSynthesisVoice | null {
  const voices = synth.getVoices();
  if (!voices || voices.length === 0) return null;

  const preferredVoiceNames = [
    'Google US English',
    'Samantha',
    'Karen',
    'Daniel',
    'Microsoft Jenny Online (Natural)',
    'Microsoft Guy Online (Natural)',
    'Microsoft Aria Online (Natural)',
    'Google UK English Female',
    'Google UK English Male',
    'Alex',
    'Victoria',
  ];

  for (const name of preferredVoiceNames) {
    const found = voices.find((v) => v.name.toLowerCase().includes(name.toLowerCase()));
    if (found) return found;
  }

  // Fallback: Any English US voice with 'natural' or 'premium'
  const naturalEn = voices.find(
    (v) =>
      v.lang.startsWith('en') &&
      (v.name.toLowerCase().includes('natural') || v.name.toLowerCase().includes('premium'))
  );
  if (naturalEn) return naturalEn;

  // Fallback: Any en-US voice
  const enUS = voices.find((v) => v.lang === 'en-US');
  if (enUS) return enUS;

  // Fallback: Any en voice
  return voices.find((v) => v.lang.startsWith('en')) || null;
}

export interface SpeechPlayOptions {
  rate?: number; // default: 0.84 for maximum clarity and pedagogical articulation
  pitch?: number; // default: 1.02 for bright, friendly tone
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
}

/**
 * Play text with pedagogical clarity, distinct punctuation pauses, and warm intonation
 */
export function playPedagogicalAudio(
  rawText: string,
  options: SpeechPlayOptions = {}
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis is not supported in this environment');
    return false;
  }

  const synth = window.speechSynthesis;

  try {
    synth.cancel();
  } catch (e) {}

  const formattedText = formatSpeechWithNaturalPauses(rawText);
  if (!formattedText) return false;

  const clauses = formattedText
    .split(/(?<=[.!?])\s+|(?<=,)\s+/)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  if (clauses.length === 0) return false;

  isCurrentlySpeaking = true;
  if (options.onStart) options.onStart();

  let currentIndex = 0;

  const playNextClause = () => {
    if (!isCurrentlySpeaking || currentIndex >= clauses.length) {
      isCurrentlySpeaking = false;
      if (options.onEnd) options.onEnd();
      return;
    }

    const clauseText = clauses[currentIndex];
    const isTerminal = /[.!?]$/.test(clauseText);
    const utterance = new SpeechSynthesisUtterance(clauseText);
    utterance.lang = 'en-US';
    utterance.rate = options.rate ?? 0.84;
    utterance.pitch = options.pitch ?? 1.02;

    const bestVoice = getBestEnglishVoice(synth);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }

    utterance.onend = () => {
      currentIndex++;
      if (currentIndex < clauses.length) {
        const pauseDuration = isTerminal ? 380 : 220;
        setTimeout(playNextClause, pauseDuration);
      } else {
        isCurrentlySpeaking = false;
        if (options.onEnd) options.onEnd();
      }
    };

    utterance.onerror = (err) => {
      console.warn('SpeechSynthesis error:', err);
      currentIndex++;
      if (currentIndex < clauses.length) {
        setTimeout(playNextClause, 150);
      } else {
        isCurrentlySpeaking = false;
        if (options.onError) options.onError();
      }
    };

    synth.speak(utterance);
  };

  playNextClause();
  return true;
}

/**
 * Stop any current speech playback
 */
export function stopSpeechAudio(): void {
  isCurrentlySpeaking = false;
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}
