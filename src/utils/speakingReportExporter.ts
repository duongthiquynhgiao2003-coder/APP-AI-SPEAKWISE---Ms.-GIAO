import { AssessmentResult, ScoringScale } from '../types';

export interface ReportExportData {
  studentName: string;
  grade: string;
  classNameVal: string;
  taskTypeEn: string;
  taskTypeVi: string;
  scale: ScoringScale;
  result: AssessmentResult;
  assessmentDate?: string;
  videoSnapshotUrl?: string;
  videoSnapshotTime?: string;
  videoSnapshotSecond?: number;
  totalDurationSeconds?: number;
}

/**
 * Formats seconds into MM:SS format
 */
export function formatTimeMmSs(seconds: number): string {
  const safeSec = Math.max(0, Math.floor(seconds || 0));
  const m = Math.floor(safeSec / 60);
  const s = Math.floor(safeSec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export interface VideoSnapshotDetails {
  dataUrl: string;
  capturedSecond: number;
  totalDuration: number;
  timeDisplay: string;
}

/**
 * Captures a video frame snapshot with rich metadata at any target timestamp.
 * If targetTimeSeconds is not provided, dynamically selects a representative active moment.
 */
export async function captureVideoSnapshotDetails(
  videoSource?: string | HTMLVideoElement | Blob | null,
  targetTimeSeconds?: number
): Promise<VideoSnapshotDetails> {
  const fallbackResult: VideoSnapshotDetails = {
    dataUrl: '',
    capturedSecond: 2,
    totalDuration: 15,
    timeDisplay: '00:02 / 00:15',
  };

  if (typeof window === 'undefined') return fallbackResult;

  // 1. Try DOM video element first
  let videoEl: HTMLVideoElement | null = null;
  if (videoSource instanceof HTMLVideoElement) {
    videoEl = videoSource;
  } else {
    videoEl =
      (document.querySelector('#recordedVideoCustomPlayer video') as HTMLVideoElement) ||
      (document.querySelector('#uploadedVideoCustomPlayer video') as HTMLVideoElement) ||
      (document.querySelector('video') as HTMLVideoElement);
  }

  if (videoEl && (videoEl.videoWidth > 0 || videoEl.readyState >= 1)) {
    const rawDur = isFinite(videoEl.duration) && videoEl.duration > 0 ? videoEl.duration : 15;
    
    // If targetTimeSeconds is specified and differs from current position, seek videoEl
    if (typeof targetTimeSeconds === 'number' && targetTimeSeconds >= 0 && Math.abs(videoEl.currentTime - targetTimeSeconds) > 0.2) {
      try {
        const desired = Math.max(0.1, Math.min(rawDur - 0.1, targetTimeSeconds));
        await new Promise<void>((res) => {
          let done = false;
          const onSeek = () => {
            if (!done) {
              done = true;
              videoEl?.removeEventListener('seeked', onSeek);
              res();
            }
          };
          videoEl?.addEventListener('seeked', onSeek);
          if (videoEl) videoEl.currentTime = desired;
          setTimeout(onSeek, 650);
        });
      } catch (err) {
        console.warn('DOM video seek error:', err);
      }
    }

    if (videoEl.videoWidth > 0 && videoEl.videoHeight > 0) {
      try {
        const canvas = document.createElement('canvas');
        const w = videoEl.videoWidth;
        const h = videoEl.videoHeight;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(videoEl, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.98);
          if (dataUrl && dataUrl.length > 500) {
            const capturedSec = Math.round(videoEl.currentTime * 10) / 10;
            const totalDur = Math.round(rawDur * 10) / 10;
            return {
              dataUrl,
              capturedSecond: capturedSec,
              totalDuration: totalDur,
              timeDisplay: `${formatTimeMmSs(capturedSec)} / ${formatTimeMmSs(totalDur)}`,
            };
          }
        }
      } catch (e) {
        console.warn('DOM video canvas snapshot capture failed:', e);
      }
    }
  }

  // 2. Try Blob or URL source
  const src =
    typeof videoSource === 'string' && videoSource
      ? videoSource
      : videoSource instanceof Blob
      ? URL.createObjectURL(videoSource)
      : videoEl && (videoEl.src || videoEl.currentSrc)
      ? (videoEl.src || videoEl.currentSrc)
      : '';

  if (src) {
    return new Promise((resolve) => {
      const tempVideo = document.createElement('video');
      tempVideo.crossOrigin = 'anonymous';
      tempVideo.muted = true;
      tempVideo.playsInline = true;
      tempVideo.src = src;
      let settled = false;

      const cleanup = () => {
        if (videoSource instanceof Blob) {
          try {
            URL.revokeObjectURL(src);
          } catch (_) {}
        }
      };

      const handleSeeked = () => {
        if (settled) return;
        settled = true;
        try {
          const canvas = document.createElement('canvas');
          const w = tempVideo.videoWidth || 1280;
          const h = tempVideo.videoHeight || 720;
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d', { alpha: false });
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(tempVideo, 0, 0, w, h);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.98);
            cleanup();
            const dur = isFinite(tempVideo.duration) && tempVideo.duration > 0 ? tempVideo.duration : 15;
            const capturedSec = Math.round(tempVideo.currentTime * 10) / 10;
            const totalDur = Math.round(dur * 10) / 10;
            resolve({
              dataUrl,
              capturedSecond: capturedSec,
              totalDuration: totalDur,
              timeDisplay: `${formatTimeMmSs(capturedSec)} / ${formatTimeMmSs(totalDur)}`,
            });
            return;
          }
        } catch (e) {
          console.warn('tempVideo seeked snapshot failed:', e);
        }
        cleanup();
        resolve(fallbackResult);
      };

      tempVideo.onloadedmetadata = () => {
        const dur = isFinite(tempVideo.duration) && tempVideo.duration > 0 ? tempVideo.duration : 15;
        let target = typeof targetTimeSeconds === 'number' && targetTimeSeconds >= 0 ? targetTimeSeconds : 0;
        if (target <= 0) {
          target = dur > 3 ? Math.max(1.5, Math.min(dur - 0.5, dur * 0.35)) : Math.min(0.5, dur * 0.5);
        }
        tempVideo.currentTime = Math.max(0.1, Math.min(dur - 0.1, target));
      };
      tempVideo.onseeked = handleSeeked;
      tempVideo.onerror = () => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(fallbackResult);
      };
      setTimeout(() => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve(fallbackResult);
      }, 3000);
    });
  }

  return fallbackResult;
}

/**
 * Captures a video frame snapshot as a base64 JPEG data URL.
 */
export async function captureVideoSnapshot(
  videoSource?: string | HTMLVideoElement | Blob | null,
  targetTimeSeconds?: number
): Promise<string> {
  const details = await captureVideoSnapshotDetails(videoSource, targetTimeSeconds);
  return details.dataUrl;
}

/**
 * Formats student full name into a safe file name
 */
function toSafeFileName(name: string): string {
  if (!name || !name.trim()) return 'HocSinh';
  return name
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

/**
 * Generates an SVG radar chart markup for embedding into HTML reports.
 */
export function generateRadarChartSvg(result: AssessmentResult): string {
  const maxScale = result.scale;
  const center = 170;
  const radius = 86;

  const categories: Array<{
    key: string;
    en: string;
    vi: string;
    val: number;
    color: string;
  }> = [
    { key: 'pronunciation', en: 'Pronunciation', vi: 'Phát âm', val: parseFloat(result.scores.pronunciation) || 0, color: '#0284c7' },
    { key: 'fluency', en: 'Fluency', vi: 'Trôi chảy', val: parseFloat(result.scores.fluency) || 0, color: '#2563eb' },
    { key: 'intonation', en: 'Intonation', vi: 'Ngữ điệu', val: parseFloat(result.scores.intonation) || 0, color: '#059669' },
    { key: 'vocabulary', en: 'Vocabulary', vi: 'Từ vựng', val: parseFloat(result.scores.vocabulary) || 0, color: '#9333ea' },
    { key: 'grammar', en: 'Grammar', vi: 'Ngữ pháp', val: parseFloat(result.scores.grammar) || 0, color: '#e11d48' },
    { key: 'taskCompletion', en: 'Task Comp.', vi: 'Nhiệm vụ', val: parseFloat(result.scores.taskCompletion) || 0, color: '#d97706' },
  ];

  if (result.hasVideo && result.scores.presentation) {
    categories.push({
      key: 'presentation',
      en: 'Presentation',
      vi: 'Trình bày',
      val: parseFloat(result.scores.presentation) || 0,
      color: '#0d9488',
    });
  }

  const totalAxes = categories.length;
  const angleStep = (Math.PI * 2) / totalAxes;
  const startAngle = -Math.PI / 2;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  const getPolygonCoords = (ratio: number) => {
    return categories
      .map((_, i) => {
        const angle = startAngle + i * angleStep;
        const x = center + radius * ratio * Math.cos(angle);
        const y = center + radius * ratio * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const scoreCoords = categories.map((cat, i) => {
    const angle = startAngle + i * angleStep;
    const ratio = Math.min(Math.max(cat.val / maxScale, 0.05), 1);
    const x = center + radius * ratio * Math.cos(angle);
    const y = center + radius * ratio * Math.sin(angle);
    return { x, y, val: cat.val, cat, angle };
  });

  const scorePolygon = scoreCoords.map((c) => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');

  // Grid rings
  const gridRingsSvg = levels
    .map(
      (lvl, idx) =>
        `<polygon points="${getPolygonCoords(lvl)}" fill="${
          idx === 4 ? 'rgba(6, 182, 212, 0.04)' : 'none'
        }" stroke="#cbd5e1" stroke-width="${lvl === 1 ? '1.6' : '0.9'}" stroke-dasharray="${
          lvl === 1 ? 'none' : '3 3'
        }" />`
    )
    .join('\n');

  // Axis spokes
  const spokesSvg = categories
    .map((cat, i) => {
      const angle = startAngle + i * angleStep;
      const x2 = center + radius * Math.cos(angle);
      const y2 = center + radius * Math.sin(angle);
      return `<line x1="${center}" y1="${center}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(
        1
      )}" stroke="#94a3b8" stroke-width="1.2" stroke-dasharray="2 2" />`;
    })
    .join('\n');

  // Score points
  const pointsSvg = scoreCoords
    .map(
      (pt) =>
        `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(
          1
        )}" r="4.2" fill="#ffffff" stroke="${pt.cat.color}" stroke-width="2.2" />`
    )
    .join('\n');

  // Outer Labels
  const labelsSvg = scoreCoords
    .map((pt) => {
      const labelDist = radius + 22;
      const lx = center + labelDist * Math.cos(pt.angle);
      const ly = center + labelDist * Math.sin(pt.angle);
      let textAnchor = 'middle';
      if (Math.cos(pt.angle) > 0.25) textAnchor = 'start';
      else if (Math.cos(pt.angle) < -0.25) textAnchor = 'end';

      return `
        <g transform="translate(${lx.toFixed(1)}, ${ly.toFixed(1)})">
          <text text-anchor="${textAnchor}" font-size="10.5" font-weight="bold" fill="#0f172a" dy="-3">
            ${pt.cat.en}
          </text>
          <text text-anchor="${textAnchor}" font-size="9" font-weight="600" dy="10">
            <tspan fill="#64748b" font-style="italic">(${pt.cat.vi}) </tspan>
            <tspan fill="${pt.cat.color}" font-weight="bold">${pt.val}</tspan>
          </text>
        </g>
      `;
    })
    .join('\n');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-55 -15 450 350" class="radar-svg" style="width: 100%; max-width: 350px; height: 215px; display: block; margin: 0 auto; overflow: visible;">
      <defs>
        <radialGradient id="reportRadarFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.45" />
          <stop offset="60%" stop-color="#3b82f6" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.1" />
        </radialGradient>
      </defs>
      ${gridRingsSvg}
      ${spokesSvg}
      <polygon points="${scorePolygon}" fill="url(#reportRadarFill)" stroke="#0284c7" stroke-width="2.5" />
      ${pointsSvg}
      ${labelsSvg}
    </svg>
  `;
}

/**
 * Converts SVG radar chart into a standalone high-resolution PNG Data URL
 */
export function generateRadarChartPngDataUrl(result: AssessmentResult, width = 380, height = 300): Promise<string> {
  return new Promise((resolve) => {
    try {
      if (typeof window === 'undefined') {
        resolve('');
        return;
      }
      const svgStr = generateRadarChartSvg(result);
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = width * 2;
          canvas.height = height * 2;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.scale(2, 2);
            ctx.drawImage(img, 0, 0, width, height);
            const png = canvas.toDataURL('image/png');
            URL.revokeObjectURL(url);
            resolve(png);
            return;
          }
        } catch {
          // fallback
        }
        URL.revokeObjectURL(url);
        resolve('');
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve('');
      };
      img.src = url;
    } catch {
      resolve('');
    }
  });
}

/**
 * Generates an SVG mockup snapshot for student video recording display
 */
export function generateVideoSnapshotMockupSvg(
  studentName: string,
  _grade: string,
  _classNameVal: string
): string {
  const safeName = studentName ? studentName.replace(/[<>&"]/g, '') : 'Student Speaking';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="640" height="360">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b" />
        <stop offset="45%" stop-color="#334155" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
      <linearGradient id="boardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#14532d" />
        <stop offset="100%" stop-color="#064e3b" />
      </linearGradient>
      <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#0369a1" />
        <stop offset="50%" stop-color="#0284c7" />
        <stop offset="100%" stop-color="#0284c7" />
      </linearGradient>
      <radialGradient id="faceLight" cx="50%" cy="38%" r="52%">
        <stop offset="0%" stop-color="#fed7aa" stop-opacity="0.4" />
        <stop offset="100%" stop-color="#fed7aa" stop-opacity="0" />
      </radialGradient>
      <filter id="shadowSoft" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.25"/>
      </filter>
    </defs>
    <!-- Background: Classroom / Room wall -->
    <rect width="640" height="360" fill="url(#bgGrad)" />
    <!-- Classroom Chalkboard / Whiteboard on wall behind -->
    <rect x="50" y="30" width="270" height="190" rx="8" fill="url(#boardGrad)" stroke="#475569" stroke-width="4" />
    <line x1="68" y1="65" x2="250" y2="65" stroke="#ffffff" stroke-width="2" stroke-opacity="0.65" stroke-dasharray="8 6" />
    <line x1="68" y1="95" x2="280" y2="95" stroke="#ffffff" stroke-width="2" stroke-opacity="0.5" stroke-dasharray="10 5" />
    <line x1="68" y1="125" x2="210" y2="125" stroke="#ffffff" stroke-width="2" stroke-opacity="0.4" stroke-dasharray="6 4" />
    <!-- Chart / Alphabet poster on right wall -->
    <rect x="375" y="30" width="215" height="190" rx="6" fill="#f8fafc" stroke="#94a3b8" stroke-width="2" opacity="0.9" />
    <line x1="395" y1="58" x2="565" y2="58" stroke="#3b82f6" stroke-width="2.5" />
    <circle cx="415" cy="85" r="9" fill="#ef4444" opacity="0.8" />
    <circle cx="445" cy="85" r="9" fill="#3b82f6" opacity="0.8" />
    <circle cx="475" cy="85" r="9" fill="#10b981" opacity="0.8" />
    <circle cx="505" cy="85" r="9" fill="#f59e0b" opacity="0.8" />
    <circle cx="535" cy="85" r="9" fill="#8b5cf6" opacity="0.8" />
    <line x1="395" y1="115" x2="565" y2="115" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3" />
    <line x1="395" y1="140" x2="540" y2="140" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3" />
    <line x1="395" y1="165" x2="550" y2="165" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="4 3" />

    <!-- Student Speaking Figure (Center) - Enforced larger and taller ("to và dài ra thêm 1 chút") -->
    <g filter="url(#shadowSoft)">
      <!-- Shoulders & Torso: larger, taller and broader (from y=220 to y=360) -->
      <path d="M 165 360 C 165 245, 235 220, 320 220 C 405 220, 475 245, 475 360 Z" fill="url(#shirtGrad)" />
      <!-- School uniform chest badge -->
      <rect x="235" y="275" width="28" height="24" rx="4" fill="#0369a1" stroke="#38bdf8" stroke-width="1.5" />
      <circle cx="249" cy="287" r="5" fill="#facc15" />
      <!-- Crisp White Collar -->
      <polygon points="288,220 320,270 352,220 334,220 320,250 306,220" fill="#ffffff" stroke="#cbd5e1" stroke-width="1" />
      <!-- Student Neck -->
      <rect x="298" y="198" width="44" height="26" rx="2" fill="#fed7aa" />
      <!-- Face Light Glow -->
      <circle cx="320" cy="160" r="76" fill="url(#faceLight)" />
      <!-- Hair Base & Head: scaled up ("to thêm 1 chút") -->
      <circle cx="320" cy="155" r="70" fill="#1e1b4b" />
      <!-- Student Face: taller and wider ("to và dài ra thêm 1 chút") -->
      <ellipse cx="320" cy="168" rx="52" ry="60" fill="#fed7aa" />
      <!-- Hair Style Front Bangs -->
      <path d="M 268 150 Q 320 105 372 150 Q 378 128 350 110 Q 320 102 290 110 Z" fill="#0f172a" />
      <!-- Eyebrows -->
      <path d="M 285 142 Q 298 137 310 141" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />
      <path d="M 330 141 Q 342 137 355 142" fill="none" stroke="#0f172a" stroke-width="2.5" stroke-linecap="round" />
      <!-- Modern Glasses Frame -->
      <rect x="282" y="148" width="32" height="22" rx="5" fill="rgba(255,255,255,0.08)" stroke="#78350f" stroke-width="2.2" />
      <rect x="326" y="148" width="32" height="22" rx="5" fill="rgba(255,255,255,0.08)" stroke="#78350f" stroke-width="2.2" />
      <line x1="314" y1="158" x2="326" y2="158" stroke="#78350f" stroke-width="2.2" />
      <!-- Eyes behind glasses with shiny catchlights -->
      <circle cx="298" cy="158" r="4.5" fill="#1e293b" />
      <circle cx="296.5" cy="156.5" r="1.5" fill="#ffffff" />
      <circle cx="342" cy="158" r="4.5" fill="#1e293b" />
      <circle cx="340.5" cy="156.5" r="1.5" fill="#ffffff" />
      <!-- Nose -->
      <path d="M 319 174 L 316 185 L 324 185" fill="none" stroke="#ea580c" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Expressive Speaking Mouth (Fluent English Speaking) -->
      <ellipse cx="320" cy="202" rx="14" ry="8" fill="#991b1b" />
      <rect x="312" y="196" width="16" height="4" rx="1" fill="#ffffff" />
      <ellipse cx="320" cy="205" rx="8" ry="3" fill="#f87171" />
    </g>

    <!-- Student Name Badge Overlay (Top Left) -->
    <g opacity="0.9">
      <rect x="18" y="14" width="180" height="26" rx="6" fill="#0f172a" fill-opacity="0.8" stroke="#0284c7" stroke-width="1" />
      <circle cx="30" cy="27" r="4" fill="#22c55e" />
      <text x="42" y="31" fill="#f8fafc" font-size="11" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif">${safeName}</text>
    </g>

    <!-- Live Recording Badge Overlay (Top Right) -->
    <g opacity="0.9">
      <rect x="522" y="14" width="100" height="26" rx="6" fill="#0f172a" fill-opacity="0.8" stroke="#ef4444" stroke-width="1" />
      <circle cx="536" cy="27" r="4" fill="#ef4444" />
      <text x="548" y="31" fill="#f8fafc" font-size="10.5" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif">HD &bull; LIVE</text>
    </g>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Helper to compute common evaluation properties
 */
function getEvaluationMetrics(data: ReportExportData) {
  const { scale, result } = data;
  const isVideo =
    !!result.hasVideo ||
    typeof result.scores?.presentation !== 'undefined' ||
    !!data.videoSnapshotUrl ||
    (data.taskTypeEn && data.taskTypeEn.toLowerCase().includes('video')) ||
    (data.taskTypeVi && data.taskTypeVi.toLowerCase().includes('video'));
  const criteriaCount = isVideo ? 7 : 6;
  const formatLabelEn = isVideo ? 'Video Recording (7 Criteria)' : 'Audio Recording (6 Criteria)';
  const formatLabelVi = isVideo ? 'Ghi hình qua Video (7 tiêu chí)' : 'Ghi âm Giọng nói (6 tiêu chí)';

  const overallNumeric = parseFloat(result.scores.overall) || 0;
  const achievementThreshold = scale === 100 ? 65 : 6.5;
  const excellenceThreshold = scale === 100 ? 80 : 8.0;

  const achievementEn =
    overallNumeric >= excellenceThreshold
      ? 'Outstanding Proficiency'
      : overallNumeric >= achievementThreshold
      ? 'Standard Achieved'
      : overallNumeric >= (scale === 100 ? 50 : 5.0)
      ? 'Intermediate Progress'
      : 'Needs Support & Practice';

  const achievementVi =
    overallNumeric >= excellenceThreshold
      ? 'Đạt loại Xuất sắc'
      : overallNumeric >= achievementThreshold
      ? 'Đạt chuẩn năng lực'
      : overallNumeric >= (scale === 100 ? 50 : 5.0)
      ? 'Mức Trung bình'
      : 'Cần tiếp tục rèn luyện';

  const cefrDesc =
    result.cefrDescriptionVi ||
    (result.cefr === 'Pre-A1'
      ? 'Tiền A1 (Khởi đầu)'
      : result.cefr === 'A1'
      ? 'Bậc 1 (Đạt chuẩn Tiểu học GDPT 2018 - Cambridge Movers)'
      : result.cefr === 'A2'
      ? 'Bậc 2 (Đạt chuẩn THCS GDPT 2018 - Cambridge Flyers/KET)'
      : 'Bậc 3 (Đạt chuẩn THPT GDPT 2018 - PET/B1)');

  const metrics = result.speechMetrics || {
    durationSeconds: 15,
    wordCount: 12,
    wordsPerMinute: 95,
    pauseCount: 1,
    fillerWordsCount: 0,
    fillerWordsList: [],
    vocabularyRichnessPercentage: 85,
    targetTaskAlignmentPercentage: 80,
  };

  const rubricItems = [
    {
      num: 1,
      enTitle: 'Pronunciation',
      viTitle: 'Phát âm',
      score: result.scores.pronunciation,
      feedbackE: result.feedback.pronunciation.e,
      feedbackV: result.feedback.pronunciation.v,
      color: '#0284c7',
      bgLight: '#f0f9ff',
      borderLight: '#bae6fd',
    },
    {
      num: 2,
      enTitle: 'Fluency',
      viTitle: 'Trôi chảy',
      score: result.scores.fluency,
      feedbackE: result.feedback.fluency.e,
      feedbackV: result.feedback.fluency.v,
      color: '#2563eb',
      bgLight: '#eff6ff',
      borderLight: '#bfdbfe',
    },
    {
      num: 3,
      enTitle: 'Intonation',
      viTitle: 'Ngữ điệu',
      score: result.scores.intonation,
      feedbackE: result.feedback.intonation.e,
      feedbackV: result.feedback.intonation.v,
      color: '#059669',
      bgLight: '#f0fdf4',
      borderLight: '#bbf7d0',
    },
    {
      num: 4,
      enTitle: 'Vocabulary',
      viTitle: 'Từ vựng',
      score: result.scores.vocabulary,
      feedbackE: result.feedback.vocabulary.e,
      feedbackV: result.feedback.vocabulary.v,
      color: '#9333ea',
      bgLight: '#faf5ff',
      borderLight: '#e9d5ff',
    },
    {
      num: 5,
      enTitle: 'Grammar',
      viTitle: 'Ngữ pháp',
      score: result.scores.grammar,
      feedbackE: result.feedback.grammar.e,
      feedbackV: result.feedback.grammar.v,
      color: '#e11d48',
      bgLight: '#fff1f2',
      borderLight: '#fecdd3',
    },
    {
      num: 6,
      enTitle: 'Task Completion',
      viTitle: 'Hoàn thành nhiệm vụ',
      score: result.scores.taskCompletion,
      feedbackE: result.feedback.taskCompletion.e,
      feedbackV: result.feedback.taskCompletion.v,
      color: '#d97706',
      bgLight: '#fffbeb',
      borderLight: '#fde68a',
    },
  ];

  if (isVideo && result.scores.presentation && result.feedback.presentation) {
    rubricItems.push({
      num: 7,
      enTitle: 'Presentation & Interaction',
      viTitle: 'Phong thái & Tương tác',
      score: result.scores.presentation,
      feedbackE: result.feedback.presentation.e,
      feedbackV: result.feedback.presentation.v,
      color: '#0d9488',
      bgLight: '#f0fdfa',
      borderLight: '#99f6e4',
    });
  }

  return {
    isVideo,
    criteriaCount,
    formatLabelEn,
    formatLabelVi,
    achievementEn,
    achievementVi,
    cefrDesc,
    metrics,
    rubricItems,
    comparisons: result.sentenceComparisons || [],
    phonemes: result.phonemeIssues || [],
    priorities: result.improvementPriorities || [],
    totalDurationSec: Math.max(
      3,
      Math.round(data.totalDurationSeconds || metrics.durationSeconds || 15)
    ),
    snapshotSecond: (() => {
      const dur = Math.max(
        3,
        Math.round(data.totalDurationSeconds || metrics.durationSeconds || 15)
      );
      if (typeof data.videoSnapshotSecond === 'number' && data.videoSnapshotSecond >= 0) {
        return Math.min(data.videoSnapshotSecond, dur);
      }
      return Math.max(1, Math.min(dur - 1, Math.round(dur * 0.35)));
    })(),
    progressPercent: (() => {
      const dur = Math.max(
        3,
        Math.round(data.totalDurationSeconds || metrics.durationSeconds || 15)
      );
      const snap =
        typeof data.videoSnapshotSecond === 'number' && data.videoSnapshotSecond >= 0
          ? Math.min(data.videoSnapshotSecond, dur)
          : Math.max(1, Math.min(dur - 1, Math.round(dur * 0.35)));
      return Math.min(100, Math.max(6, Math.round((snap / dur) * 100)));
    })(),
    captureTimestamp: (() => {
      if (data.videoSnapshotTime && data.videoSnapshotTime.trim()) {
        return data.videoSnapshotTime.trim();
      }
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const day = pad(now.getDate());
      const month = pad(now.getMonth() + 1);
      const year = now.getFullYear();
      const hours = pad(now.getHours());
      const minutes = pad(now.getMinutes());
      const seconds = pad(now.getSeconds());
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    })(),
    snapshotSrc:
      data.videoSnapshotUrl && data.videoSnapshotUrl.trim()
        ? data.videoSnapshotUrl
        : generateVideoSnapshotMockupSvg(data.studentName, data.grade, data.classNameVal),
  };
}

/**
 * Builds the standalone 2-page HTML document for preview, PDF generation, and printing.
 */
export function buildSpeakingReportHtml(data: ReportExportData, forPdf = false): string {
  const {
    studentName,
    grade,
    classNameVal,
    taskTypeEn,
    taskTypeVi,
    scale,
    result,
    assessmentDate = new Date().toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
  } = data;

  const {
    isVideo,
    criteriaCount,
    formatLabelEn,
    formatLabelVi,
    achievementEn,
    achievementVi,
    cefrDesc,
    metrics,
    rubricItems,
    comparisons,
    phonemes,
    priorities,
    totalDurationSec,
    snapshotSecond,
    progressPercent,
    captureTimestamp,
    snapshotSrc,
  } = getEvaluationMetrics(data);

  const radarSvg = generateRadarChartSvg(result);

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Phiếu kết quả luyện nói & đánh giá năng lực - ${studentName}</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background: ${forPdf ? '#ffffff' : '#e2e8f0'};
      color: #0f172a;
      line-height: 1.45;
      padding: ${forPdf ? '0' : '20px 10px'};
      -webkit-font-smoothing: antialiased;
    }
    .no-print {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 700;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
      border: none;
    }
    .btn-print {
      background: linear-gradient(135deg, #0284c7, #2563eb);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
    }
    .report-page {
      width: 100%;
      max-width: 800px;
      margin: 0 auto ${forPdf ? '0' : '24px'};
      background: #ffffff;
      box-shadow: ${forPdf ? 'none' : '0 10px 30px rgba(15, 23, 42, 0.08)'};
      border-radius: ${forPdf ? '0' : '16px'};
      border: ${forPdf ? 'none' : '1px solid #cbd5e1'};
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      page-break-inside: avoid;
      break-inside: avoid;
      height: ${forPdf ? '1120px' : 'auto'};
      min-height: ${forPdf ? '1120px' : 'auto'};
      box-sizing: border-box;
    }
    .report-page.page-1 {
      padding: 0;
    }
    .page-1-content {
      padding: 12px 24px 12px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 10px;
      box-sizing: border-box;
    }
    .page-inner {
      padding: 16px 26px 16px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .page-header-mini {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 8px;
      margin-bottom: 10px;
    }
    .header-mini-badge {
      background: #0284c7;
      color: #ffffff;
      font-size: 10px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      margin-right: 8px;
    }
    .header-mini-title {
      font-size: 12px;
      font-weight: 800;
      color: #334155;
      text-transform: uppercase;
    }
    .header-mini-right {
      font-size: 11px;
      font-weight: 800;
      color: #0284c7;
    }
    .report-header {
      background: linear-gradient(135deg, #071326 0%, #0d1e38 50%, #08203d 100%);
      color: #ffffff;
      padding: 10px 22px 9px;
      border-bottom: 3px solid #06b6d4;
      flex-shrink: 0;
    }
    .header-brand-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
      padding-bottom: 6px;
      border-bottom: 1px solid rgba(6, 182, 212, 0.25);
    }
    .brand-logo-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-text-col {
      display: flex;
      flex-direction: column;
    }
    .brand-app-title {
      font-size: 20px;
      font-weight: 900;
      letter-spacing: 1.2px;
      line-height: 1.15;
      color: #22d3ee;
      text-transform: uppercase;
      text-shadow: 0 0 12px rgba(34, 211, 238, 0.45);
    }
    .brand-app-sub {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 2px;
      line-height: 1.2;
      color: #38bdf8;
      text-transform: uppercase;
      margin-top: 1px;
    }
    .report-main-title-en {
      font-size: 14px;
      font-weight: 900;
      letter-spacing: -0.2px;
      line-height: 1.25;
      text-transform: uppercase;
      color: #ffffff;
      margin-top: 2px;
    }
    .report-main-title-vi {
      font-size: 10.5px;
      font-weight: 700;
      color: #e0f2fe;
      margin-top: 1px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .header-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 6px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 7px;
      border-radius: 9999px;
      font-size: 8.5px;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.18);
      border: 1px solid rgba(56, 189, 248, 0.35);
      color: #e0f2fe;
    }
    .student-info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 7px;
      margin-bottom: 0;
    }
    .info-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 7px;
      padding: 5px 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .info-label-en {
      font-size: 8px;
      font-weight: 800;
      text-transform: uppercase;
      color: #64748b;
      line-height: 1.2;
    }
    .info-label-vi {
      font-size: 7.5px;
      color: #94a3b8;
      margin-bottom: 1px;
      line-height: 1.1;
    }
    .info-val {
      font-size: 11.5px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
    }
    .overview-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 0;
    }
    .score-banner-card {
      background: #0b172e;
      border: 1.5px solid #1e293b;
      border-radius: 12px;
      padding: 14px 18px 12px;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 275px;
      height: 275px;
      box-sizing: border-box;
    }
    .score-banner-title-en {
      font-size: 13.5px;
      font-weight: 900;
      letter-spacing: 0.6px;
      color: #38bdf8;
      text-transform: uppercase;
    }
    .score-banner-title-vi {
      font-size: 9.5px;
      color: #94a3b8;
      margin-top: 2px;
      margin-bottom: 12px;
    }
    .score-display-box {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 12px;
    }
    .score-item {
      background: #050d1a;
      border: 1px solid #1e293b;
      border-radius: 8px;
      padding: 12px 8px;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .score-label-en {
      font-size: 9px;
      font-weight: 800;
      color: #94a3b8;
    }
    .score-big {
      font-size: 32px;
      font-weight: 900;
      color: #38bdf8;
      line-height: 1.1;
      margin: 4px 0 2px;
    }
    .score-max {
      font-size: 15px;
      color: #94a3b8;
      font-weight: 600;
    }
    .score-cefr-big {
      font-size: 32px;
      font-weight: 900;
      color: #facc15;
      line-height: 1.1;
      margin: 4px 0 2px;
    }
    .score-eval-vi {
      font-size: 10px;
      font-weight: 700;
      color: #34d399;
      line-height: 1.25;
    }
    .framework-badge {
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid #0284c7;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 9.5px;
      color: #e0f2fe;
      text-align: center;
      line-height: 1.35;
    }
    .radar-container-card {
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px 14px 8px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      min-height: 275px;
      height: 275px;
      box-sizing: border-box;
    }
    /* Video Recording Snapshot Box (Centered & Proportionate) */
    .video-capture-section {
      width: 100%;
      display: flex;
      justify-content: center;
      margin: 2px auto;
    }
    .video-player-card {
      width: 100%;
      max-width: 520px;
      background: #0b1528;
      border: 1.5px solid #1e293b;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.28);
    }
    .video-card-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 7px 14px;
      background: #081120;
      border-bottom: 1px solid #1e293b;
    }
    .video-card-title-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .video-card-rec-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ef4444;
      display: inline-block;
      box-shadow: 0 0 8px #ef4444;
    }
    .video-card-title {
      font-size: 11.5px;
      font-weight: 800;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }
    .video-card-time {
      font-size: 10.5px;
      font-weight: 600;
      color: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .video-screen-container {
      position: relative;
      width: 100%;
      height: 295px;
      background: #000000;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .video-snapshot-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      display: block;
      image-rendering: -webkit-optimize-contrast;
    }
    .video-player-controls-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 28px;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.55) 75%, transparent 100%);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      gap: 10px;
      z-index: 3;
      color: #ffffff;
      box-sizing: border-box;
    }
    .video-controls-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .ctrl-pause-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
    }
    .video-time-track {
      font-size: 10px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #ffffff;
      font-weight: 600;
    }
    .video-progress-bar-wrap {
      flex: 1;
      height: 3.5px;
      background: rgba(255, 255, 255, 0.35);
      border-radius: 2px;
      overflow: hidden;
      margin: 0 6px;
    }
    .video-progress-bar-fill {
      height: 100%;
      width: 25%;
      background: #06b6d4;
    }
    .video-controls-right {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #ffffff;
    }
    /* Audio Fallback Box */
    .audio-capture-section {
      margin-bottom: 0;
    }
    .audio-capture-rec-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #059669;
      display: inline-block;
      box-shadow: 0 0 6px rgba(5, 150, 105, 0.7);
    }
    .audio-badge-pill {
      background: rgba(5, 150, 105, 0.12);
      border: 1px solid rgba(5, 150, 105, 0.35);
      color: #059669;
      font-size: 8px;
      font-weight: 800;
      padding: 1.5px 6px;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .audio-player-mockup-frame {
      background: #050d1a;
      border: 1.5px solid #1e293b;
      border-radius: 8px;
      padding: 6px 10px 4px;
      box-shadow: 0 3px 12px rgba(2, 132, 199, 0.1);
    }
    .audio-waveform-container {
      width: 100%;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #020610;
      border-radius: 5px;
      overflow: hidden;
      padding: 0 6px;
      box-sizing: border-box;
    }
    .audio-bars-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2.5px;
      width: 100%;
      height: 38px;
    }
    .audio-wave-bar {
      flex: 1;
      min-width: 2px;
      max-width: 5px;
      border-radius: 1.5px;
      transition: height 0.2s;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 7px;
    }
    .metric-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-top: 3px solid #0284c7;
      border-radius: 7px;
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 70px;
    }
    .metric-title-en {
      font-size: 8.5px;
      font-weight: 800;
      color: #475569;
      line-height: 1.2;
    }
    .metric-title-vi {
      font-size: 7.5px;
      color: #94a3b8;
      margin-bottom: 1px;
      line-height: 1.1;
    }
    .metric-num {
      font-size: 15px;
      font-weight: 900;
      color: #0f172a;
      margin: 1px 0;
      line-height: 1.2;
    }
    .metric-sub-en {
      font-size: 8px;
      font-weight: 700;
      color: #0284c7;
      line-height: 1.2;
    }
    .metric-sub-vi {
      font-size: 7px;
      color: #64748b;
      line-height: 1.2;
    }
    .rubric-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 10px;
    }
    .rubric-card {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 84px;
    }
    .rubric-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
      min-height: 26px;
    }
    .rubric-card-title-en {
      font-size: 11.5px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.25;
    }
    .rubric-card-title-vi {
      font-size: 9.5px;
      color: #64748b;
      line-height: 1.2;
    }
    .rubric-score-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 11.5px;
      font-weight: 900;
      height: 24px;
      line-height: 24px;
      padding: 0 9px;
      border-radius: 6px;
      white-space: nowrap;
      flex-shrink: 0;
      box-sizing: border-box;
      letter-spacing: 0.3px;
    }
    .rubric-feedback-en {
      font-size: 9.5px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.35;
      margin-bottom: 2px;
    }
    .rubric-feedback-vi {
      font-size: 8.5px;
      color: #334155;
      line-height: 1.35;
    }
    .two-col-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }
    .detail-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 9px 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .comparison-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 6px 9px;
      margin-bottom: 5px;
    }
    .sentence-student {
      font-size: 9.5px;
      font-style: italic;
      color: #be123c;
      margin: 2px 0 3px;
    }
    .sentence-improved {
      font-size: 10px;
      font-weight: 800;
      color: #047857;
      margin: 2px 0 3px;
    }
    .pedagogy-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 5px;
      padding: 5px 8px;
      font-size: 8.5px;
      color: #166534;
      line-height: 1.35;
    }
    .phoneme-item {
      display: flex;
      align-items: flex-start;
      gap: 7px;
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: 6px;
      padding: 5px 7px;
      margin-bottom: 5px;
    }
    .phoneme-num {
      width: 17px;
      height: 17px;
      background: #fef3c7;
      color: #b45309;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 9px;
      font-weight: 800;
      flex-shrink: 0;
    }
    .transcript-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
      font-size: 10px;
      font-style: italic;
      color: #334155;
      line-height: 1.45;
    }
    .report-footer {
      border-top: 1.5px dashed #cbd5e1;
      padding-top: 10px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .sig-col {
      text-align: center;
    }
    .sig-title-en {
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
      color: #0f172a;
    }
    .sig-title-vi {
      font-size: 8.5px;
      color: #64748b;
      margin-bottom: 4px;
    }
    .sig-stamp {
      width: 46px;
      height: 46px;
      border: 1.5px solid #0284c7;
      border-radius: 50%;
      margin: 2px auto 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #0284c7;
    }
    .sig-line {
      font-size: 9.5px;
      font-weight: 700;
      color: #1e293b;
      border-top: 1px solid #94a3b8;
      display: inline-block;
      padding-top: 3px;
      min-width: 130px;
    }
    .sig-note {
      font-size: 8.5px;
      color: #94a3b8;
      margin-top: 2px;
    }
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
      .report-page {
        box-shadow: none;
        border: none;
        border-radius: 0;
        max-width: 100%;
        min-height: 285mm;
        page-break-after: always;
        break-after: page;
      }
      .report-page:last-child {
        page-break-after: avoid;
        break-after: avoid;
      }
    }
  </style>
</head>
<body>
  ${
    forPdf
      ? ''
      : `<!-- Print Toolbar -->
  <div class="no-print">
    <button class="btn-action btn-print" onclick="window.print()">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 6 2 18 2 18 9"></polyline>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
        <rect x="6" y="14" width="12" height="8"></rect>
      </svg>
      In phiếu / Lưu file PDF (Print or Save as PDF)
    </button>
  </div>`
  }

  <!-- PAGE 1: TỔNG QUAN KẾT QUẢ & TIÊU CHÍ -->
  <div class="report-page page-1">
    <!-- Header Banner -->
    <header class="report-header">
      <div class="header-brand-row">
        <div class="brand-logo-wrap">
          <div class="brand-text-col">
            <div class="brand-app-title">AI SPEAKWISE</div>
            <div class="brand-app-sub">SMART SPEAKING PRACTICE &amp; ASSESSMENT</div>
          </div>
        </div>
      </div>
      <h1 class="report-main-title-en">
        ENGLISH SPEAKING PRACTICE &amp; COMPETENCY ASSESSMENT REPORT
      </h1>
      <h2 class="report-main-title-vi">
        PHIẾU KẾT QUẢ LUYỆN NÓI &amp; ĐÁNH GIÁ NĂNG LỰC TIẾNG ANH
      </h2>
      <div class="header-badges">
        <span class="badge">AI Verified &amp; CEFR Benchmarked</span>
        <span class="badge">${formatLabelEn} (${formatLabelVi})</span>
        <span class="badge">Scale / Thang điểm: ${scale} pts</span>
      </div>
    </header>

    <div class="page-1-content">
      <!-- 6 Info Cards -->
      <section class="student-info-grid">
        <div class="info-card">
          <div class="info-label-en">Student Full Name</div>
          <div class="info-label-vi">Học sinh</div>
          <div class="info-val" style="color: #0284c7;">${studentName}</div>
        </div>
        <div class="info-card">
          <div class="info-label-en">Grade &amp; Class</div>
          <div class="info-label-vi">Lớp &amp; Khối học</div>
          <div class="info-val">${grade}/${classNameVal} <span style="font-size: 10.5px; font-weight: normal; color: #64748b;">(Khối ${grade})</span></div>
        </div>
        <div class="info-card">
          <div class="info-label-en">Task Type</div>
          <div class="info-label-vi">Dạng bài thực hành</div>
          <div class="info-val" style="font-size: 11.5px;">${taskTypeEn}</div>
          <div style="font-size: 9.5px; color: #64748b; font-style: italic;">(${taskTypeVi})</div>
        </div>
        <div class="info-card">
          <div class="info-label-en">Evaluation Date &amp; Time</div>
          <div class="info-label-vi">Thời gian đánh giá</div>
          <div class="info-val" style="font-size: 11.5px;">${assessmentDate}</div>
        </div>
        <div class="info-card">
          <div class="info-label-en">Recording Format &amp; Criteria</div>
          <div class="info-label-vi">Hình thức ghi âm &amp; Tiêu chí</div>
          <div class="info-val" style="font-size: 11.5px; color: #0d9488;">
            ${isVideo ? 'Video Recording (7 criteria)' : 'Audio Recording (6 criteria)'}
          </div>
          <div style="font-size: 9.5px; color: #64748b;">
            ${isVideo ? 'Ghi hình có video (7 tiêu chí)' : 'Ghi âm giọng nói (6 tiêu chí)'}
          </div>
        </div>
        <div class="info-card">
          <div class="info-label-en">Overall Achievement</div>
          <div class="info-label-vi">Xếp loại chung</div>
          <div class="info-val" style="color: #2563eb; font-size: 12px;">${achievementEn}</div>
          <div style="font-size: 9.5px; color: #64748b; font-weight: 700;">${achievementVi}</div>
        </div>
      </section>

      <!-- Overall Score & Radar Chart -->
      <section class="overview-grid">
        <div class="score-banner-card">
          <div>
            <div class="score-banner-title-en">OVERALL SPEAKING SCORE</div>
            <div class="score-banner-title-vi">Đánh giá tổng quan năng lực nói</div>
          </div>
          <div class="score-display-box">
            <div class="score-item">
              <div class="score-label-en">SCORE / ĐIỂM</div>
              <div class="score-big">${result.scores.overall}<span class="score-max">/${scale}</span></div>
              <div class="score-eval-vi">${achievementVi}</div>
            </div>
            <div class="score-item">
              <div class="score-label-en">CEFR LEVEL</div>
              <div class="score-cefr-big">${result.cefr}</div>
              <div class="score-eval-vi" style="color: #cbd5e1;">${cefrDesc}</div>
            </div>
          </div>
          <div class="framework-badge">
            <strong>Khung GDPT 2018:</strong> ${cefrDesc}
          </div>
        </div>
        <div class="radar-container-card">
          <div style="text-align: center; margin-bottom: 2px;">
            <div style="font-size: 13px; font-weight: 900; text-transform: uppercase; color: #0284c7; letter-spacing: 0.5px;">
              COMPETENCY SKILLS RADAR CHART
            </div>
            <div style="font-size: 9.5px; color: #64748b; margin-top: 2px;">
              Biểu đồ Năng lực ${criteriaCount} tiêu chí theo chuẩn GDPT 2018 &amp; CEFR
            </div>
          </div>
          ${radarSvg}
        </div>
      </section>

      ${
        isVideo || data.videoSnapshotUrl
          ? `<!-- STUDENT VIDEO RECORDING CAPTURE -->
      <section class="video-capture-section">
        <div class="video-player-card">
          <!-- Top bar inside card: Red dot + Title on left, Timestamp on right -->
          <div class="video-card-top-bar">
            <div class="video-card-title-wrap">
              <span class="video-card-rec-dot"></span>
              <span class="video-card-title">STUDENT VIDEO RECORDING CAPTURE</span>
            </div>
            <div class="video-card-time">${captureTimestamp}</div>
          </div>

          <!-- Video Viewport: Proportionate 16:9 frame -->
          <div class="video-screen-container">
            <img class="video-snapshot-img" src="${snapshotSrc}" alt="Student Speaking Video Snapshot" />

            <!-- Media player controls bar overlay matching Image 2 -->
            <div class="video-player-controls-bar">
              <div class="video-controls-left">
                <!-- Pause Icon (2 vertical bars) -->
                <svg class="ctrl-pause-btn" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" rx="1"></rect>
                  <rect x="14" y="4" width="4" height="16" rx="1"></rect>
                </svg>
                <span class="video-time-track">${formatTimeMmSs(snapshotSecond)} / ${formatTimeMmSs(totalDurationSec)}</span>
              </div>
              <div class="video-progress-bar-wrap">
                <div class="video-progress-bar-fill" style="width: ${progressPercent}%;"></div>
              </div>
              <div class="video-controls-right">
                <!-- Volume Icon -->
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                </svg>
                <!-- Fullscreen Icon -->
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <polyline points="9 21 3 21 3 15"></polyline>
                  <line x1="21" y1="3" x2="14" y2="10"></line>
                  <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
                <!-- Three-dots Menu Icon -->
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5"></circle>
                  <circle cx="12" cy="12" r="1.5"></circle>
                  <circle cx="12" cy="19" r="1.5"></circle>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>`
          : `<!-- STUDENT AUDIO RECORDING & ACOUSTIC ANALYSIS -->
      <section class="video-capture-section">
        <div class="video-player-card">
          <div class="video-card-top-bar">
            <div class="video-card-title-wrap">
              <span class="video-card-rec-dot" style="background: #059669; box-shadow: 0 0 6px #059669;"></span>
              <span class="video-card-title" style="color: #34d399;">STUDENT AUDIO RECORDING &bull; ACOUSTIC SYNC</span>
            </div>
            <div class="video-card-time">${captureTimestamp}</div>
          </div>
          <div class="audio-waveform-container" style="height: 90px; padding: 0 16px;">
            <div class="audio-bars-row">
              ${[
                15, 30, 48, 65, 38, 80, 92, 58, 32, 70, 88, 96, 72, 45, 62,
                90, 78, 55, 38, 66, 84, 94, 62, 42, 74, 88, 70, 52, 35, 68,
                82, 96, 80, 48, 65, 86, 72, 50, 32, 62, 88, 92, 68, 45, 72,
                90, 76, 52, 38, 65, 82, 94, 70, 48, 62, 84, 76, 54, 40, 68
              ]
                .map(
                  (h, i) =>
                    `<div class="audio-wave-bar" style="height: ${h}%; background: ${
                      i < Math.round((snapshotSecond / totalDurationSec) * 60) ? '#22d3ee' : '#38bdf8'
                    };"></div>`
                )
                .join('')}
            </div>
          </div>
          <div class="video-player-controls-bar" style="position: static; background: #050c18; border-top: 1px solid #1e293b;">
            <div class="video-controls-left">
              <svg class="ctrl-pause-btn" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              <span class="video-time-track">${formatTimeMmSs(snapshotSecond)} / ${formatTimeMmSs(totalDurationSec)}</span>
            </div>
            <div class="video-progress-bar-wrap">
              <div class="video-progress-bar-fill" style="width: ${progressPercent}%;"></div>
            </div>
            <div class="video-controls-right">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            </div>
          </div>
        </div>
      </section>`
      }

      <!-- Real-time Metrics -->
      <section>
        <div style="font-size: 11px; font-weight: 900; color: #0284c7; text-transform: uppercase; margin-bottom: 2px;">
          REAL-TIME SPEAKING METRICS &bull; CHỈ SỐ ĐO LƯỜNG BÀI NÓI THỰC TẾ
        </div>
        <div style="font-size: 8.5px; color: #64748b; margin-bottom: 6px;">
          Chuẩn đo lường GDPT 2018 &amp; CEFR Standards
        </div>
        <div class="metrics-grid">
          <div class="metric-card" style="border-top-color: #0284c7;">
            <div class="metric-title-en">Speaking Speed</div>
            <div class="metric-title-vi">Tốc độ nói</div>
            <div class="metric-num">${metrics.wordsPerMinute} <span style="font-size: 9px; font-weight: normal; color: #64748b;">WPM</span></div>
            <div class="metric-sub-en">Ideal speaking pace</div>
            <div class="metric-sub-vi">Nhịp điệu tự nhiên</div>
          </div>
          <div class="metric-card" style="border-top-color: #2563eb;">
            <div class="metric-title-en">Speech Volume</div>
            <div class="metric-title-vi">Dung lượng bài nói</div>
            <div class="metric-num">${metrics.wordCount} <span style="font-size: 9px; font-weight: normal; color: #64748b;">words</span></div>
            <div class="metric-sub-en">${metrics.durationSeconds}s duration</div>
            <div class="metric-sub-vi">Thời lượng nói hoàn thành tốt</div>
          </div>
          <div class="metric-card" style="border-top-color: #9333ea;">
            <div class="metric-title-en">Vocabulary Diversity</div>
            <div class="metric-title-vi">Độ phong phú từ vựng</div>
            <div class="metric-num" style="color: #9333ea;">${metrics.vocabularyRichnessPercentage}%</div>
            <div class="metric-sub-en" style="color: #9333ea;">Rich vocabulary</div>
            <div class="metric-sub-vi">Vốn từ phong phú phù hợp</div>
          </div>
          <div class="metric-card" style="border-top-color: #059669;">
            <div class="metric-title-en">Topic Alignment</div>
            <div class="metric-title-vi">Bám sát chủ đề</div>
            <div class="metric-num" style="color: #059669;">${metrics.targetTaskAlignmentPercentage}%</div>
            <div class="metric-sub-en" style="color: #059669;">Target accuracy</div>
            <div class="metric-sub-vi">Bám sát trọng tâm mục tiêu</div>
          </div>
        </div>
      </section>
    </div>
  </div>

  <!-- PAGE 2: ĐÁNH GIÁ CHI TIẾT TIÊU CHÍ RUBRIC -->
  <div class="report-page page-2">
    <div class="page-inner">
      <div>
        <div class="page-header-mini">
          <div>
            <span class="header-mini-badge">GDPT 2018</span>
            <span class="header-mini-title">PHIẾU ĐÁNH GIÁ NĂNG LỰC NÓI TIẾNG ANH - HỌC SINH: ${studentName.toUpperCase()} (${grade}/${classNameVal})</span>
          </div>
          <div class="header-mini-right">THANG ĐIỂM: ${scale} PTS</div>
        </div>
        <div style="margin-bottom: 8px;">
          <div style="font-size: 12.5px; font-weight: 900; color: #0284c7; text-transform: uppercase;">
            DETAILED RUBRIC CRITERIA EVALUATION (${criteriaCount} CRITERIA)
          </div>
          <div style="font-size: 9.5px; color: #64748b;">
            Đánh giá chi tiết theo ${criteriaCount} tiêu chí Rubric (${isVideo ? 'Bao gồm tiêu chí 7 dành cho Video' : 'Gồm 6 tiêu chí chuẩn Audio'})
          </div>
        </div>
        <div class="rubric-grid">
          ${rubricItems
            .map(
              (item) => `
            <div class="rubric-card" style="background: ${item.bgLight}; border-color: ${item.borderLight}; ${item.num === 7 ? 'grid-column: span 2;' : ''}">
              <div class="rubric-card-header">
                <div>
                  <div class="rubric-card-title-en">${item.num}. ${item.enTitle}</div>
                  <div class="rubric-card-title-vi">(${item.viTitle})</div>
                </div>
                <span class="rubric-score-badge" style="background: ${item.color};">
                  ${item.score} / ${scale}
                </span>
              </div>
              <div class="rubric-feedback-en">
                ${item.feedbackE}
              </div>
              <div class="rubric-feedback-vi">
                ${item.feedbackV}
              </div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <section class="two-col-details">
        <!-- Sentence Comparisons -->
        <div class="detail-card">
          <div style="margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0;">
            <div style="font-size: 11px; font-weight: 900; color: #0284c7; text-transform: uppercase;">
              WHAT YOU SAID VS NATIVE WAY
            </div>
            <div style="font-size: 9px; color: #64748b;">
              So sánh câu nói thực tế của học sinh vs Cách diễn đạt chuẩn
            </div>
          </div>
          ${
            comparisons.length > 0
              ? comparisons
                  .map(
                    (c) => `
              <div class="comparison-item">
                <div style="font-size: 8.5px; font-weight: 700; color: #e11d48; text-transform: uppercase;">
                  Student's sentence / Câu học sinh nói
                </div>
                <div class="sentence-student">"${c.studentSentence}"</div>
                <div style="font-size: 8.5px; font-weight: 700; color: #059669; text-transform: uppercase;">
                  Native refinement / Cách diễn đạt chuẩn &amp; hay hơn
                </div>
                <div class="sentence-improved">"${c.improvedSentence}"</div>
                <div class="pedagogy-box">
                  <strong>Giải thích sư phạm:</strong> ${c.explanationVi.replace(/^•\s*(\[[^\]]+\]:\s*)?/, '')}
                </div>
              </div>
            `
                  )
                  .join('')
              : `
              <div style="font-size: 10px; font-style: italic; color: #64748b; padding: 10px 0;">
                Chưa phát hiện lỗi ngữ pháp lớn trong bài. Câu nói lưu loát.
              </div>
            `
          }
        </div>

        <!-- Phoneme Insights -->
        <div class="detail-card">
          <div style="margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0;">
            <div style="font-size: 11px; font-weight: 900; color: #d97706; text-transform: uppercase;">
              PHONEME &amp; PRONUNCIATION INSIGHTS
            </div>
            <div style="font-size: 9px; color: #64748b;">
              Điểm cần chú ý &amp; phát âm (Ending sounds, Vowels, Stress)
            </div>
          </div>
          ${
            phonemes.length > 0
              ? phonemes
                  .map(
                    (p, idx) => `
              <div class="phoneme-item">
                <div class="phoneme-num">${idx + 1}</div>
                <div style="flex-grow: 1;">
                  <div style="display: flex; align-items: center; gap: 4px; flex-wrap: wrap;">
                    <span style="font-size: 11px; font-weight: 800; color: #0f172a;">"${p.word}"</span>
                    ${
                      p.phoneticExpected
                        ? `<span style="font-size: 9.5px; font-family: monospace; color: #0284c7; background: #e0f2fe; padding: 1px 4px; border-radius: 4px;">${p.phoneticExpected}</span>`
                        : ''
                    }
                    ${
                      p.errorLabelVi
                        ? `<span style="font-size: 8.5px; font-weight: bold; color: #b45309; background: #fef3c7; padding: 1px 4px; border-radius: 4px;">${p.errorLabelVi}</span>`
                        : ''
                    }
                  </div>
                  <div style="font-size: 9.5px; color: #475569; margin-top: 2px; line-height: 1.35;">
                    ${p.phoneticIssue}
                  </div>
                </div>
              </div>
            `
                  )
                  .join('')
              : `
              <div style="font-size: 10px; font-style: italic; color: #64748b; padding: 10px 0;">
                Các từ ngữ cốt lõi được phát âm rõ ràng và chuẩn xác.
              </div>
            `
          }
          <!-- Priority Actions -->
          ${
            priorities.length > 0
              ? `
            <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #e2e8f0;">
              <div style="font-size: 10px; font-weight: 800; color: #059669; text-transform: uppercase;">
                PRIORITY ACTION ITEMS TO BOOST NEXT BAND SCORE
              </div>
              <div style="font-size: 8.5px; color: #64748b; margin-bottom: 4px;">
                Nhiệm vụ ưu tiên để nâng band điểm tiếp theo
              </div>
              <div style="font-size: 9.5px; color: #1e293b; line-height: 1.4;">
                ${priorities.map((item) => `<div style="margin-bottom: 2px;">• ${item}</div>`).join('')}
              </div>
            </div>
          `
              : ''
          }
        </div>
      </section>

      <!-- Section 3: Verified Student Transcript -->
      <section>
        <div style="font-size: 10.5px; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 2px;">
          VERIFIED STUDENT TRANSCRIPT
        </div>
        <div style="font-size: 8.5px; color: #64748b; margin-bottom: 4px;">
          Bản ghi lời thoại thực tế của học sinh (Speech-to-Text Recognition)
        </div>
        <div class="transcript-box">
          "${result.transcript || 'Chưa có bản ghi lời thoại.'}"
        </div>
      </section>

      <!-- Section 4: Sign-off Footer -->
      <footer class="report-footer">
        <div class="sig-col">
          <div class="sig-title-en">AI SPEAKING ASSESSMENT ENGINE</div>
          <div class="sig-title-vi">Hệ thống AI đánh giá năng lực nói Tiếng Anh</div>
          <div class="sig-stamp">
            <span style="font-size: 7px; font-weight: 900;">VERIFIED</span>
            <span style="font-size: 6px; font-weight: 700;">GDPT 2018</span>
          </div>
          <div class="sig-line">SpeakWise AI Certified</div>
          <div class="sig-note">Mã định danh đánh giá: SW-${Date.now().toString().slice(-6)}</div>
        </div>
        <div class="sig-col">
          <div class="sig-title-en">TEACHER'S REMARKS &amp; SIGNATURE</div>
          <div class="sig-title-vi">Nhận xét &amp; Chữ ký của Giáo viên</div>
          <div style="height: 50px;"></div>
          <div class="sig-line">Giáo viên phụ trách</div>
          <div class="sig-note">Ngày: .......................................................</div>
        </div>
      </footer>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Downloads the bilingual assessment report as a Word document (.doc).
 */
export async function downloadSpeakingReportWord(data: ReportExportData): Promise<string> {
  const safeName = toSafeFileName(data.studentName);
  const safeGrade = data.grade.replace(/[^a-zA-Z0-9]/g, '');
  const safeClass = data.classNameVal.replace(/[^a-zA-Z0-9]/g, '');
  const fileName = `Phieu_Ket_Qua_Speaking_${safeName}_Lop_${safeGrade}_${safeClass}.doc`;

  if (!data.videoSnapshotUrl && (data.result.hasVideo || data.result.scores.presentation)) {
    try {
      const snapDetails = await captureVideoSnapshotDetails(undefined, data.videoSnapshotSecond);
      if (snapDetails && snapDetails.dataUrl) {
        data.videoSnapshotUrl = snapDetails.dataUrl;
        if (typeof data.videoSnapshotSecond !== 'number') {
          data.videoSnapshotSecond = snapDetails.capturedSecond;
        }
        if (!data.totalDurationSeconds && snapDetails.totalDuration > 0) {
          data.totalDurationSeconds = snapDetails.totalDuration;
        }
        if (!data.videoSnapshotTime) {
          const now = new Date();
          const pad = (n: number) => n.toString().padStart(2, '0');
          data.videoSnapshotTime = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        }
      }
    } catch (e) {
      console.warn('Auto capture video snapshot error:', e);
    }
  }

  let radarPng = '';
  try {
    radarPng = await generateRadarChartPngDataUrl(data.result);
  } catch (e) {
    console.warn('Radar PNG generation skipped:', e);
  }

  const wordContent = buildSpeakingReportHtml(data, false);
  const blob = new Blob(['\ufeff' + wordContent], {
    type: 'application/msword;charset=utf-8',
  });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  setTimeout(() => {
    document.body.removeChild(anchor);
    URL.revokeObjectURL(objectUrl);
  }, 1000);
  return fileName;
}

/**
 * Downloads the bilingual assessment report directly as a high-resolution PDF file (.pdf).
 */
export async function downloadSpeakingReportPdf(data: ReportExportData): Promise<string> {
  const safeName = toSafeFileName(data.studentName);
  const safeGrade = data.grade.replace(/[^a-zA-Z0-9]/g, '');
  const safeClass = data.classNameVal.replace(/[^a-zA-Z0-9]/g, '');
  const fileName = `Phieu_Ket_Qua_Speaking_${safeName}_Lop_${safeGrade}_${safeClass}.pdf`;

  if (!data.videoSnapshotUrl && (data.result.hasVideo || data.result.scores.presentation)) {
    try {
      const snapDetails = await captureVideoSnapshotDetails(undefined, data.videoSnapshotSecond);
      if (snapDetails && snapDetails.dataUrl) {
        data.videoSnapshotUrl = snapDetails.dataUrl;
        if (typeof data.videoSnapshotSecond !== 'number') {
          data.videoSnapshotSecond = snapDetails.capturedSecond;
        }
        if (!data.totalDurationSeconds && snapDetails.totalDuration > 0) {
          data.totalDurationSeconds = snapDetails.totalDuration;
        }
        if (!data.videoSnapshotTime) {
          const now = new Date();
          const pad = (n: number) => n.toString().padStart(2, '0');
          data.videoSnapshotTime = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        }
      }
    } catch (e) {
      console.warn('Auto capture video snapshot for PDF error:', e);
    }
  }

  const { jsPDF } = await import('jspdf');
  const html2canvasModule = await import('html2canvas');
  const html2canvas = ((html2canvasModule as any).default || html2canvasModule) as (
    element: HTMLElement,
    options?: any
  ) => Promise<HTMLCanvasElement>;

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-99999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.zIndex = '-9999';
  container.innerHTML = buildSpeakingReportHtml(data, true);
  document.body.appendChild(container);

  try {
    const pageElements = container.querySelectorAll<HTMLElement>('.report-page');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const marginX = 8;
    const marginY = 8;
    const printWidth = 210 - marginX * 2; // 194mm

    for (let i = 0; i < pageElements.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }
      const canvas = await html2canvas(pageElements[i], {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 800,
      });
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const printHeight = (canvas.height * printWidth) / canvas.width;
      const finalHeight = Math.min(printHeight, 281);
      const adjustedMarginY = Math.max(marginY, (297 - finalHeight) / 2);
      pdf.addImage(imgData, 'JPEG', marginX, adjustedMarginY, printWidth, finalHeight);
    }

    pdf.save(fileName);
    return fileName;
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

/**
 * Opens a print dialog for the bilingual assessment report directly in a popup window.
 */
export function printSpeakingReport(data: ReportExportData): void {
  const htmlContent = buildSpeakingReportHtml(data, false);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 400);
  }
}
