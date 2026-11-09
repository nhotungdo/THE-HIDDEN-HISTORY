import type { Answers } from './answers';

export const TASK_SECONDS = 180;
export interface TaskDraft { answers: Answers; hints: number; left: number; elapsed: number }

export function loadTaskDraft(key: string): TaskDraft {
  const empty: TaskDraft = { answers: {}, hints: 0, left: TASK_SECONDS, elapsed: 0 };
  try {
    const value = JSON.parse(sessionStorage.getItem(key) ?? 'null');
    if (!value || typeof value.answers !== 'object' || value.answers === null || Array.isArray(value.answers) || !Object.values(value.answers).every(v => typeof v === 'string') || !Number.isInteger(value.hints) || value.hints < 0 || value.hints > 2 || !Number.isFinite(value.left) || value.left < 0 || value.left > TASK_SECONDS) return empty;
    return { answers: value.answers, hints: value.hints, left: value.left, elapsed: Number.isFinite(value.elapsed) && value.elapsed >= 0 ? value.elapsed : 0 };
  } catch { return empty; }
}
