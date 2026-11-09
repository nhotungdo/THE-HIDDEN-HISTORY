// ==========================================
// LOCALSTORAGE UTILITY – MẬT MÃ THỜI GIAN
// ==========================================

import type { PlayerProgress, ChapterProgress, ChapterStatus } from '../types/game';

const STORAGE_KEY = 'vnr202_matma_thoigian_v1';

// ==========================================
// DEFAULT STATE
// ==========================================

export const DEFAULT_CHAPTER_PROGRESS = (chapterId: number): ChapterProgress => ({
  chapterId,
  status: chapterId === 1 ? 'unlocked' : 'locked',
  taskResults: [],
  totalScore: 0,
  bestScore: 0,
  hintsUsed: 0,
});

export const DEFAULT_PROGRESS: PlayerProgress = {
  profile: null,
  chapters: {
    1: DEFAULT_CHAPTER_PROGRESS(1),
    2: DEFAULT_CHAPTER_PROGRESS(2),
    3: DEFAULT_CHAPTER_PROGRESS(3),
    4: DEFAULT_CHAPTER_PROGRESS(4),
    5: DEFAULT_CHAPTER_PROGRESS(5),
  },
  collectedFragments: [],
  totalScore: 0,
  hintsUsedTotal: 0,
  isCompletedAll: false,
  lastPlayedAt: new Date().toISOString(),
};

// ==========================================
// SAVE / LOAD
// ==========================================

export function saveProgress(progress: PlayerProgress): void {
  try {
    const serialized = JSON.stringify({
      ...progress,
      lastPlayedAt: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.error('[Storage] Failed to save progress:', err);
  }
}

export function loadProgress(): PlayerProgress | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlayerProgress;
    parsed.reflection ??= localStorage.getItem('vnr202-reflection') ?? '';
    if (!parsed || !parsed.chapters || !parsed.profile || typeof parsed.profile.nickname !== 'string' || !['exploration', 'challenge'].includes(parsed.profile.gameMode) || !Array.isArray(parsed.collectedFragments) || !Number.isFinite(parsed.totalScore)) return null;
    // Ensure all 5 chapters exist in loaded state (migration safety)
    for (let i = 1; i <= 5; i++) {
      if (!parsed.chapters[i]) {
        parsed.chapters[i] = DEFAULT_CHAPTER_PROGRESS(i);
      }
      const c = parsed.chapters[i];
      if (c.replayResults !== undefined && (!Array.isArray(c.replayResults) || c.replayResults.some(r => !r || typeof r.taskId !== 'string' || !Number.isFinite(r.score) || !Number.isFinite(r.hintsUsed)))) return null;
      if (!Array.isArray(c.taskResults) || !['locked','unlocked','in-progress','completed'].includes(c.status) || !Number.isFinite(c.totalScore) || !Number.isFinite(c.bestScore) || !Number.isFinite(c.hintsUsed) || c.taskResults.some(r => !r || typeof r.taskId !== 'string' || !Number.isFinite(r.score) || !Number.isFinite(r.hintsUsed))) return null;
    }
    return parsed;
  } catch (err) {
    console.error('[Storage] Failed to load progress:', err);
    return null;
  }
}

export function clearProgress(): void {
  try { localStorage.removeItem(STORAGE_KEY); localStorage.removeItem('vnr202-reflection'); } catch { /* Private browsing may disable storage. */ }
}

export function hasExistingProgress(): boolean {
  const progress = loadProgress();
  return progress !== null && progress.profile !== null;
}

// ==========================================
// CHAPTER HELPERS
// ==========================================

export function computeChapterStatus(
  chapterId: number,
  progress: PlayerProgress
): ChapterStatus {
  const chapterProgress = progress.chapters[chapterId];
  if (!chapterProgress) return 'locked';
  return chapterProgress.status;
}

export function unlockNextChapter(
  completedChapterId: number,
  progress: PlayerProgress
): PlayerProgress {
  const nextId = completedChapterId + 1;
  if (nextId > 5) return progress;

  const updatedChapters = { ...progress.chapters };
  if (updatedChapters[nextId].status === 'locked') {
    updatedChapters[nextId] = {
      ...updatedChapters[nextId],
      status: 'unlocked',
    };
  }

  return { ...progress, chapters: updatedChapters };
}

// ==========================================
// SCORE HELPERS
// ==========================================

export const SCORE_CONFIG = {
  basePoints: 100,
  hint1Penalty: 10,   // -10 points per level 1 hint
  hint2Penalty: 20,   // -20 points per level 2 hint
  challengeSpeedBonus: (secondsLeft: number) => Math.floor(secondsLeft / 10) * 5,
  minScore: 10,       // Cannot go below 10 for a correct answer
};

export function calculateTaskScore(
  basePoints: number,
  hintsUsed: number,
  hintPenaltyPerHint: number,
  secondsLeft?: number
): number {
  const hintPenalty = hintsUsed * hintPenaltyPerHint;
  const speedBonus = secondsLeft !== undefined
    ? SCORE_CONFIG.challengeSpeedBonus(secondsLeft)
    : 0;
  return Math.max(SCORE_CONFIG.minScore, basePoints - hintPenalty + speedBonus);
}

// ==========================================
// RANK / TITLE CALCULATION
// ==========================================

export function calculateRank(totalScore: number): string {
  if (totalScore >= 1400) return 'Đại Kiện Tướng Lịch Sử FPT';
  if (totalScore >= 1100) return 'Đặc Phái Viên Huyền Thoại';
  if (totalScore >= 800)  return 'Nhà Sử Học Xuất Sắc';
  if (totalScore >= 500)  return 'Thám Tử Thời Gian';
  return 'Nhà Nghiên Cứu Tập Sự';
}

// ==========================================
// CERTIFICATE CODE GENERATOR
// ==========================================

export function generateCertificateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'VNR202-FPT-';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
