// ==========================================
// TYPE SYSTEM – MẬT MÃ THỜI GIAN (VNR202)
// ==========================================

export type GameMode = 'exploration' | 'challenge';

export type TaskType =
  | 'timeline-order'       // Sắp xếp dòng thời gian
  | 'dossier-match'        // Ghép hồ sơ sự kiện
  | 'document-detective'   // Thám tử tư liệu
  | 'campaign-map'         // Bản đồ chiến dịch
  | 'truth-or-myth';       // Nhận định đúng/sai

export type ChapterStatus = 'locked' | 'unlocked' | 'in-progress' | 'completed';

// ==========================================
// PLAYER & PROFILE
// ==========================================

export interface PlayerProfile {
  nickname: string;
  avatarId: string;
  gameMode: GameMode;
  createdAt: string;
}

// ==========================================
// TASK / MINIGAME DATA
// ==========================================

export interface TaskOption {
  id: string;
  text: string;
  // For MCQ / truth-or-myth
  isCorrect?: boolean;
  // For dossier-match: which target id this connects to
  matchTargetId?: string;
  // For timeline-order: correct position (1-based)
  orderIndex?: number;
  // For campaign-map: grid coordinates
  mapCoord?: { row: number; col: number };
  // For document-detective: hotspot pixel position (% of image)
  hotspot?: { x: number; y: number };
}

export interface AIHints {
  level1: string;   // Nhẹ: chỉ điểm vào đoạn tư liệu
  level2: string;   // Sâu: gợi ý tư duy định hướng
  exploration: string; // Mở rộng: kiến thức chuyên sâu hơn
}

export interface HistoricalDocument {
  title: string;
  excerpt: string;
  imageUrl?: string;
  sourceCitation: string;
}

export interface TaskData {
  matchTargets?: { id: string; text: string }[];
  clues?: { id: string; text: string; question: string; options: { id: string; text: string; isCorrect: boolean }[] }[];
  id: string;
  title: string;
  taskType: TaskType;
  instructions: string;
  historicalDocument: HistoricalDocument;
  question: string;
  options: TaskOption[];
  correctAnswerIds: string[];     // ids of correct options
  correctAnswerSummary: string;   // Giải thích sau khi trả lời
  historicalLesson: string;       // Bài học lịch sử sâu sắc
  points: number;                 // Max points (giảm nếu dùng gợi ý)
  aiHints: AIHints;
}

// ==========================================
// CHAPTER / MEMORY FRAGMENT
// ==========================================

export interface MemoryFragment {
  id: string;
  name: string;         // Tên mảnh ký ức
  iconEmoji: string;    // Emoji đại diện nhanh
  imageUrl?: string;    // Ảnh cổ vật render
  description: string;
  historicalSignificance: string;
}

export interface ChapterData {
  id: number;           // 1-5
  year: number;         // 1930, 1945, 1954, 1975, 1986
  codeName: string;     // 'KHỞI NGUỒN', 'MÙA THU ĐỘC LẬP', ...
  title: string;        // Full chapter title
  slogan: string;       // Short dramatic tagline
  historicalContext: string;
  coverImage?: string;  // Path to chapter background image
  primaryColor: string; // Hex accent color for this chapter
  tasks: TaskData[];
  memoryFragment: MemoryFragment;
}

// ==========================================
// PLAYER PROGRESS (LOCALSTORAGE STATE)
// ==========================================

export interface TaskResult {
  taskId: string;
  completed: boolean;
  score: number;
  hintsUsed: number;
  timeSpent?: number; // seconds (challenge mode)
  answeredCorrectly: boolean;
}

export interface ChapterProgress {
  chapterId: number;
  status: ChapterStatus;
  taskResults: TaskResult[];
  totalScore: number;
  bestScore: number;
  completedAt?: string;
  hintsUsed: number;
}

export interface PlayerProgress {
  profile: PlayerProfile | null;
  chapters: Record<number, ChapterProgress>; // keyed by chapterId
  collectedFragments: string[];              // fragment ids
  totalScore: number;
  hintsUsedTotal: number;
  isCompletedAll: boolean;
  certificateIssuedAt?: string;
  certificateCode?: string;
  lastPlayedAt: string;
}

// ==========================================
// GAME CONTEXT STATE
// ==========================================

export interface GameContextState {
  progress: PlayerProgress;
  currentChapterId: number | null;
  currentTaskIndex: number;
  isGamePaused: boolean;
  soundEnabled: boolean;
}

export interface GameContextValue extends GameContextState {
  // Profile
  createProfile: (profile: PlayerProfile) => void;
  resetGame: () => void;
  // Navigation
  setCurrentChapter: (chapterId: number) => void;
  setCurrentTaskIndex: (index: number) => void;
  // Gameplay
  submitTaskResult: (result: TaskResult) => void;
  completeChapter: (chapterId: number) => void;
  completeAllChapters: () => void;
  // UI
  togglePause: () => void;
  toggleSound: () => void;
  // Computed helpers
  getChapterStatus: (chapterId: number) => ChapterStatus;
  getChapterProgress: (chapterId: number) => ChapterProgress | null;
  getTotalCompletedChapters: () => number;
}

// ==========================================
// HISTORY ARCHIVE TYPES
// ==========================================

export interface HistoricalEvent {
  id: string;
  date: string;        // e.g. "19/8/1945"
  year: number;
  title: string;
  description: string;
  significance: string;
  imageUrl?: string;
  tags: string[];
  source: string;
}

export interface HistoricalSource {
  id: string;
  title: string;
  author?: string;
  year?: number;
  type: 'textbook' | 'document' | 'photograph' | 'speech' | 'decree';
  url?: string;
}

// ==========================================
// AI GUIDE TYPES
// ==========================================

export type AIMode = 'hint' | 'explain' | 'explore';

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  mode: AIMode;
}

export interface AIGuideState {
  isOpen: boolean;
  isLoading: boolean;
  messages: AIMessage[];
  hintsUsedInTask: number;  // Cost deducted from score
  error: string | null;
}

// ==========================================
// CERTIFICATE
// ==========================================

export interface CertificateData {
  nickname: string;
  avatarId: string;
  totalScore: number;
  rank: string;         // 'Nhà sử học xuất sắc', 'Đặc phái viên huyền thoại', ...
  completedAt: string;
  code: string;         // VNR202-FPT-XXXXX
}

// ==========================================
// SOUND TYPES
// ==========================================

export type SoundEffect =
  | 'tick-tock'
  | 'page-flip'
  | 'unlock'
  | 'correct'
  | 'wrong'
  | 'hint'
  | 'fragment-collect'
  | 'warp'
  | 'victory'
  | 'button-click';

