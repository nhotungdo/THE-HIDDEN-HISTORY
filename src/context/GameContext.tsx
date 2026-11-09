// ==========================================
// GAME CONTEXT – MẬT MÃ THỜI GIAN (VNR202)
// Central state management + LocalStorage sync
// ==========================================

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { chapters } from '../data/chapters';
import type {
  GameContextValue,
  GameContextState,
  PlayerProfile,
  PlayerProgress,
  TaskResult,
  ChapterStatus,
  ChapterProgress,
} from '../types/game';
import {
  loadProgress,
  saveProgress,
  clearProgress,
  DEFAULT_PROGRESS,
  unlockNextChapter,
  generateCertificateCode,
} from '../utils/storage';

// ==========================================
// ACTION TYPES
// ==========================================

type GameAction =
  | { type: 'LOAD_PROGRESS'; payload: PlayerProgress }
  | { type: 'CREATE_PROFILE'; payload: PlayerProfile }
  | { type: 'RESET_GAME' }
  | { type: 'SET_CURRENT_CHAPTER'; payload: number }
  | { type: 'REPLAY_CHAPTER'; payload: number }
  | { type: 'SET_REFLECTION'; payload: string }
  | { type: 'SET_CURRENT_TASK_INDEX'; payload: number }
  | { type: 'SUBMIT_TASK_RESULT'; payload: TaskResult }
  | { type: 'COMPLETE_CHAPTER'; payload: number }
  | { type: 'COMPLETE_ALL_CHAPTERS' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'TOGGLE_SOUND' };

// ==========================================
// INITIAL STATE
// ==========================================

export const initialState: GameContextState = {
  progress: DEFAULT_PROGRESS,
  currentChapterId: null,
  currentTaskIndex: 0,
  isGamePaused: false,
  soundEnabled: true,
};

// ==========================================
// REDUCER
// ==========================================

export function gameReducer(state: GameContextState, action: GameAction): GameContextState {
  switch (action.type) {

    case 'LOAD_PROGRESS':
      return { ...state, progress: action.payload };

    case 'CREATE_PROFILE': {
      const newProgress: PlayerProgress = {
        ...DEFAULT_PROGRESS,
        profile: action.payload,
        lastPlayedAt: new Date().toISOString(),
      };
      return { ...initialState, soundEnabled: state.soundEnabled, progress: newProgress };
    }

    case 'RESET_GAME':
      return { ...initialState };

    case 'SET_CURRENT_CHAPTER':
      if (!state.progress.profile || !state.progress.chapters[action.payload] || state.progress.chapters[action.payload].status === 'locked') return state;
      return {
        ...state,
        currentChapterId: action.payload,
        currentTaskIndex: 0,
        isGamePaused: false,
        // Mark as in-progress
        progress: {
          ...state.progress,
          chapters: {
            ...state.progress.chapters,
            [action.payload]: {
              ...state.progress.chapters[action.payload],
              status: state.progress.chapters[action.payload].status === 'unlocked'
                ? 'in-progress'
                : state.progress.chapters[action.payload].status,
            },
          },
        },
      };

    case 'SET_CURRENT_TASK_INDEX':
      return { ...state, currentTaskIndex: action.payload };

    case 'SET_REFLECTION':
      return { ...state, progress: { ...state.progress, reflection: action.payload.slice(0, 300) } };

    case 'REPLAY_CHAPTER': {
      const chapter = state.progress.chapters[action.payload];
      if (!state.progress.profile || chapter?.status !== 'completed') return state;
      return {
        ...state, currentChapterId: action.payload, currentTaskIndex: 0, isGamePaused: false,
        progress: { ...state.progress, chapters: { ...state.progress.chapters,
          [action.payload]: { ...chapter, replayResults: [], runNumber: (chapter.runNumber ?? 0) + 1 },
        } },
      };
    }

    case 'SUBMIT_TASK_RESULT': {
      const result = action.payload;
      const chapterId = state.currentChapterId;
      if (!chapterId) return state;

      const chapter = state.progress.chapters[chapterId];
      if (chapter.status === 'locked' || !chapters.find(c => c.id === chapterId)?.tasks.some(t => t.id === result.taskId) || !result.completed || !result.answeredCorrectly || !Number.isFinite(result.score) || result.score < 0 || !Number.isInteger(result.hintsUsed) || result.hintsUsed < 0 || result.hintsUsed > 2) return state;
      if (chapter.replayResults) {
        const results = chapter.replayResults.filter(r => r.taskId !== result.taskId);
        return { ...state, progress: { ...state.progress, chapters: { ...state.progress.chapters,
          [chapterId]: { ...chapter, replayResults: [...results, result] },
        } } };
      }
      // Replace or add task result
      const existingIdx = chapter.taskResults.findIndex(r => r.taskId === result.taskId);
      const newResults = existingIdx >= 0
        ? chapter.taskResults.map((r, i) => i === existingIdx ? result : r)
        : [...chapter.taskResults, result];

      const newChapterScore = newResults.reduce((sum, r) => sum + r.score, 0);
      const newTotalScore = Object.values(state.progress.chapters)
        .filter(c => c.chapterId !== chapterId)
        .reduce((sum, c) => sum + c.totalScore, 0) + newChapterScore;

      return {
        ...state,
        progress: {
          ...state.progress,
          totalScore: newTotalScore,
          hintsUsedTotal: state.progress.hintsUsedTotal + result.hintsUsed - (existingIdx >= 0 ? chapter.taskResults[existingIdx].hintsUsed : 0),
          lastPlayedAt: new Date().toISOString(),
          chapters: {
            ...state.progress.chapters,
            [chapterId]: {
              ...chapter,
              taskResults: newResults,
              totalScore: newChapterScore,
              hintsUsed: newResults.reduce((sum, r) => sum + r.hintsUsed, 0),
            },
          },
        },
      };
    }

    case 'COMPLETE_CHAPTER': {
      const chapterId = action.payload;
      const chapter = state.progress.chapters[chapterId];
      const results = chapter?.replayResults ?? chapter?.taskResults;
      if (!chapter || !results || !chapters.find(c => c.id === chapterId)?.tasks.every(t => results.some(r => r.taskId === t.id && r.completed && r.answeredCorrectly))) return state;
      const chapterScore = results.reduce((s, r) => s + r.score, 0);
      const fragment = `fragment-${chapterId}`;
      const alreadyHasFragment = state.progress.collectedFragments.includes(fragment);

      let updatedProgress: PlayerProgress = {
        ...state.progress,
        totalScore: state.progress.totalScore - chapter.totalScore + chapterScore,
        hintsUsedTotal: state.progress.hintsUsedTotal - chapter.hintsUsed + results.reduce((s, r) => s + r.hintsUsed, 0),
        collectedFragments: alreadyHasFragment
          ? state.progress.collectedFragments
          : [...state.progress.collectedFragments, fragment],
        chapters: {
          ...state.progress.chapters,
          [chapterId]: {
            ...chapter,
            replayResults: undefined,
            taskResults: results,
            hintsUsed: results.reduce((s, r) => s + r.hintsUsed, 0),
            status: 'completed' as ChapterStatus,
            totalScore: chapterScore,
            bestScore: Math.max(chapter.bestScore, chapterScore),
            completedAt: new Date().toISOString(),
          },
        },
      };

      // Unlock next chapter
      updatedProgress = unlockNextChapter(chapterId, updatedProgress);

      return { ...state, progress: updatedProgress };
    }

    case 'COMPLETE_ALL_CHAPTERS': {
      if (state.progress.isCompletedAll || !Object.values(state.progress.chapters).every(c => c.status === 'completed')) return state;
      const code = generateCertificateCode();
      return {
        ...state,
        progress: {
          ...state.progress,
          isCompletedAll: true,
          certificateIssuedAt: new Date().toISOString(),
          certificateCode: code,
        },
      };
    }

    case 'TOGGLE_PAUSE':
      return { ...state, isGamePaused: !state.isGamePaused };

    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };

    default:
      return state;
  }
}

// ==========================================
// CONTEXT CREATION
// ==========================================

const GameContext = createContext<GameContextValue | null>(null);

// ==========================================
// PROVIDER
// ==========================================

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState, s => ({...s, progress: loadProgress() ?? structuredClone(DEFAULT_PROGRESS)}));

  // Auto-save on progress change
  useEffect(() => {
    if (state.progress.profile !== null) {
      saveProgress(state.progress);
    }
  }, [state.progress]);

  // ==========================================
  // ACTIONS
  // ==========================================

  const createProfile = useCallback((profile: PlayerProfile) => {
    dispatch({ type: 'CREATE_PROFILE', payload: profile });
  }, []);

  const resetGame = useCallback(() => {
    clearProgress();
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const setCurrentChapter = useCallback((chapterId: number) => {
    dispatch({ type: 'SET_CURRENT_CHAPTER', payload: chapterId });
  }, []);

  const replayChapter = useCallback((chapterId: number) => {
    dispatch({ type: 'REPLAY_CHAPTER', payload: chapterId });
  }, []);
  const setReflection = useCallback((text: string) => {
    dispatch({ type: 'SET_REFLECTION', payload: text });
  }, []);

  const setCurrentTaskIndex = useCallback((index: number) => {
    dispatch({ type: 'SET_CURRENT_TASK_INDEX', payload: index });
  }, []);

  const submitTaskResult = useCallback((result: TaskResult) => {
    dispatch({ type: 'SUBMIT_TASK_RESULT', payload: result });
  }, []);

  const completeChapter = useCallback((chapterId: number) => {
    dispatch({ type: 'COMPLETE_CHAPTER', payload: chapterId });
    // If all 5 chapters done, trigger completion
    const allDone = [1, 2, 3, 4, 5].every(id => {
      if (id === chapterId) return true; // This one just completed
      return state.progress.chapters[id]?.status === 'completed';
    });
    if (allDone) {
      dispatch({ type: 'COMPLETE_ALL_CHAPTERS' });
    }
  }, [state.progress.chapters]);

  const completeAllChapters = useCallback(() => {
    dispatch({ type: 'COMPLETE_ALL_CHAPTERS' });
  }, []);

  const togglePause = useCallback(() => {
    dispatch({ type: 'TOGGLE_PAUSE' });
  }, []);

  const toggleSound = useCallback(() => {
    dispatch({ type: 'TOGGLE_SOUND' });
  }, []);

  // ==========================================
  // COMPUTED HELPERS
  // ==========================================

  const getChapterStatus = useCallback((chapterId: number): ChapterStatus => {
    return state.progress.chapters[chapterId]?.status ?? 'locked';
  }, [state.progress.chapters]);

  const getChapterProgress = useCallback((chapterId: number): ChapterProgress | null => {
    return state.progress.chapters[chapterId] ?? null;
  }, [state.progress.chapters]);

  const getTotalCompletedChapters = useCallback((): number => {
    return Object.values(state.progress.chapters)
      .filter(c => c.status === 'completed').length;
  }, [state.progress.chapters]);

  const value: GameContextValue = {
    ...state,
    createProfile,
    resetGame,
    setCurrentChapter,
    replayChapter,
    setReflection,
    setCurrentTaskIndex,
    submitTaskResult,
    completeChapter,
    completeAllChapters,
    togglePause,
    toggleSound,
    getChapterStatus,
    getChapterProgress,
    getTotalCompletedChapters,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// ==========================================
// HOOK
// ==========================================

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) {
    throw new Error('useGame must be used within <GameProvider>');
  }
  return ctx;
}

export { GameContext };

