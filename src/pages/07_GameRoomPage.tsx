// ==========================================================================
// GAME ROOM PAGE (Màn 07) – MẬT MÃ THỜI GIAN
// THE ARCHIVIST'S DESK – BÀN LÀM VIỆC CỦA ĐẶC PHÁI VIÊN LƯU TRỮ
// ==========================================================================

import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pause, Play, ArrowLeft, Clock, Lightbulb, CheckCircle2, 
  AlertCircle, BookOpen, Sparkles, X
} from 'lucide-react';
import { chapters } from '../data/chapters';
import { useGame } from '../context/GameContext';
import { useAudio } from '../context/AudioContext';
import HistoryGuide from '../components/ai/HistoryGuide';
import Puzzle from '../components/games/Puzzle';
import { isCorrect, type Answers } from '../utils/answers';
import { calculateTaskScore } from '../utils/storage';
import { loadTaskDraft } from '../utils/taskDraft';
import type { ChapterData } from '../types/game';
import { useDialog } from '../hooks/useDialog';
import NarrationButton from '../components/common/NarrationButton';

export default function GameRoomPage() {
  const { id } = useParams();
  const game = useGame();
  const c = chapters.find(item => item.id === Number(id));

  useEffect(() => {
    if (c) game.setCurrentChapter(c.id);
  }, [c, game.setCurrentChapter]);

  if (!c || game.getChapterStatus(c.id) === 'locked') {
    return <Navigate to="/timeline" replace />;
  }

  return <Room key={c.id} chapter={c} />;
}

function Room({ chapter: c }: { chapter: ChapterData }) {
  const game = useGame();
  const audio = useAudio();
  const navigate = useNavigate();

  // Determine current active task
  const [index, setIndex] = useState(() => {
    const p = game.getChapterProgress(c.id);
    if (!p) return 0;
    const firstUnfinished = c.tasks.findIndex(
      t => !(p.replayResults ?? p.taskResults).some(r => r.taskId === t.id && r.completed)
    );
    return firstUnfinished < 0 ? 0 : firstUnfinished;
  });

  const task = c.tasks[index];
  const chapterProgress = game.getChapterProgress(c.id);
  const draftKey = `vnr202-draft-${game.progress.profile?.createdAt}-${chapterProgress?.runNumber ?? 0}-${task.id}`;

  const loadDraft = () => {
    return loadTaskDraft(draftKey);
  };

  const [answers, setAnswers] = useState<Answers>(() => loadDraft()?.answers ?? {});
  const [hints, setHints] = useState<number>(() => loadDraft()?.hints ?? 0);
  const [left, setLeft] = useState<number>(() => loadDraft()?.left ?? 180);
  const [elapsed, setElapsed] = useState<number>(() => loadDraft().elapsed);

  const isCompletedAlready = (chapterProgress?.replayResults ?? chapterProgress?.taskResults)?.some(
    r => r.taskId === task.id && r.completed
  ) ?? false;

  const [solved, setSolved] = useState(isCompletedAlready);
  const [feedback, setFeedback] = useState(isCompletedAlready ? task.correctAnswerSummary : '');
  const [guideOpen, setGuideOpen] = useState(false);
  const guideRef = useDialog(guideOpen, () => setGuideOpen(false));
  const [isWrong, setIsWrong] = useState(false);

  const challenge = game.progress.profile?.gameMode === 'challenge';
  useEffect(() => {
    if (!game.isGamePaused && !solved) audio.playLoop('tick-tock', .015);
    return () => audio.stop('tick-tock');
  }, [game.isGamePaused, solved, audio.playLoop, audio.stop]);

  // Session persistence
  useEffect(() => {
    try {
      sessionStorage.setItem(draftKey, JSON.stringify({ answers, hints, left, elapsed }));
    } catch {
      /* ignore */
    }
  }, [draftKey, answers, hints, left, elapsed]);

  // Challenge timer
  useEffect(() => {
    if (game.isGamePaused || solved || (challenge && left <= 0)) return;
    let previous = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      const seconds = Math.floor((now - previous) / 1000);
      if (seconds < 1) return;
      previous += seconds * 1000;
      setElapsed(n => n + (challenge ? Math.min(seconds, left) : seconds));
      if (challenge) setLeft(n => Math.max(0, n - seconds));
    }, 1000);
    return () => clearInterval(timer);
  }, [challenge, game.isGamePaused, solved, left]);

  const handleSubmit = () => {
    if (solved || game.isGamePaused || (challenge && left === 0)) return;

    if (!isCorrect(task, answers)) {
      setIsWrong(true);
      setFeedback('Dữ kiện chưa khớp với hồ sơ lưu trữ. Hãy đối chiếu lại tư liệu và tái thẩm định.');
      audio.play('wrong');
      setTimeout(() => setIsWrong(false), 800);
      return;
    }

    setSolved(true);
    setFeedback(task.correctAnswerSummary);
    audio.play('correct');

    game.submitTaskResult({
      taskId: task.id,
      completed: true,
      answeredCorrectly: true,
      hintsUsed: hints,
      score: calculateTaskScore(task.points, hints, 10, challenge ? left : undefined),
      timeSpent: elapsed,
    });
  };

  const handleNext = () => {
    if (!solved) return;
    try {
      sessionStorage.removeItem(draftKey);
    } catch {
      /* ignore */
    }

    if (index === c.tasks.length - 1) {
      game.completeChapter(c.id);
      audio.play('fragment-collect');
      navigate(`/result/${c.id}`);
    } else {
      audio.play('page-flip');
      const nextIdx = index + 1;
      setIndex(nextIdx);
      setAnswers({});
      setHints(0);
      setLeft(180);
      setElapsed(0);
      setSolved(false);
      setFeedback('');
      setGuideOpen(false);
    }
  };

  const currentScore = chapterProgress?.replayResults?.reduce((sum, result) => sum + result.score, 0) ?? chapterProgress?.totalScore ?? 0;

  return (
    <div className="flex-1 w-full py-6 md:py-8 px-4 text-[#E9D8B7] relative">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* ==================================================================
            TOP NAVIGATION & COMMAND BAR (STICKY COMMAND HUD)
            ================================================================== */}
        <div className="dossier-card px-4 py-3 mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#D6A75C]/30 sticky top-[60px] z-30 bg-[#070D18]/95 backdrop-blur-md shadow-xl">
          {/* Left: Back & Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link
              to="/timeline"
              className="p-1.5 rounded hover:bg-[#D6A75C]/10 text-[#8A9BB0] hover:text-[#D6A75C] transition-colors"
              title="Về bản đồ thời gian"
            >
              <ArrowLeft size={18} />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Cinzel',serif] text-[#D6A75C] font-bold text-sm tracking-wider">
                  NĂM {c.year} · {c.codeName}
                </span>
                <span className="text-[10px] font-mono text-[#8A9BB0] bg-[#0A1020] px-2 py-0.5 rounded border border-[#D6A75C]/20">
                  NHIỆM VỤ {index + 1}/3
                </span>
              </div>
              <div className="text-[11px] text-[#8A9BB0] truncate max-w-xs sm:max-w-md">
                {task.title}
              </div>
            </div>
          </div>

          {/* Right: Progress, Score & Timer */}
          <div className="flex items-center gap-4">
            {/* Challenge Mode Timer */}
            {challenge && (
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded border font-mono text-xs font-bold ${
                left < 30 ? 'bg-[#8D3038]/30 border-[#8D3038] text-[#F87171] animate-pulse' : 'bg-[#0A1020] border-[#D6A75C]/30 text-[#D6A75C]'
              }`}>
                <Clock size={14} />
                <span>{Math.floor(left / 60)}:{(left % 60).toString().padStart(2, '0')}</span>
              </div>
            )}

            {/* Score */}
            <div className="text-right">
              <div className="text-[10px] text-[#8A9BB0] uppercase tracking-wider">Điểm Chương</div>
              <div className="font-mono text-sm font-bold text-[#D6A75C]">
                {currentScore} <span className="text-[10px] font-normal text-[#8A9BB0]">đ</span>
              </div>
            </div>

            {/* Pause Button */}
            <button
              onClick={game.togglePause}
              className="p-2 rounded border border-[#D6A75C]/30 hover:bg-[#D6A75C]/10 text-[#D6A75C] transition-colors"
              title={game.isGamePaused ? 'Tiếp tục' : 'Tạm dừng'}
            >
              {game.isGamePaused ? <Play size={16} /> : <Pause size={16} />}
            </button>
          </div>
        </div>

        {/* 3-Step Milestone Progress Bar */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {c.tasks.map((t, idx) => {
            const isDone = (chapterProgress?.replayResults ?? chapterProgress?.taskResults)?.some(r => r.taskId === t.id && r.completed);
            const isCurrent = idx === index;
            return (
              <div
                key={t.id}
                className={`h-2 rounded transition-all duration-300 ${
                  isDone
                    ? 'bg-gradient-to-r from-[#D6A75C] to-[#F5CF8E] shadow-[0_0_8px_rgba(214,167,92,0.5)]'
                    : isCurrent
                      ? 'bg-[#D6A75C]/40 animate-pulse'
                      : 'bg-[#162032]'
                }`}
              />
            );
          })}
        </div>

        {/* ==================================================================
            MAIN CONTENT AREA: ARCHIVIST'S DESK (2 COLUMNS)
            ================================================================== */}
        {game.isGamePaused ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="dossier-card max-w-lg mx-auto p-8 text-center my-12"
          >
            <div className="w-16 h-16 rounded-full bg-[#D6A75C]/10 border border-[#D6A75C] flex items-center justify-center text-3xl mx-auto mb-4">
              ⏳
            </div>
            <h2 className="text-xl font-['Cinzel',serif] text-[#D6A75C] font-bold mb-2">
              HÀNH TRÌNH TẠM DỪNG
            </h2>
            <p className="text-xs text-[#8A9BB0] leading-relaxed mb-6">
              Thời gian và tiến độ đã được giữ nguyên trong phiên làm việc. Hãy hít một hơi thật sâu trước khi tiếp tục giải mã.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={game.togglePause} className="btn-heritage-primary text-xs py-3 px-6">
                Tiếp Tục Giải Mã
              </button>
              <button
                onClick={() => { game.togglePause(); navigate('/timeline'); }}
                className="btn-heritage-secondary text-xs py-3 px-6"
              >
                Về Bản Đồ Thời Gian
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* ==============================================================
                COLUMN 1 (LEFT 5 COLS): TƯ LIỆU GỐC & CẶP HỒ SƠ GIẤY DÓ
                ============================================================== */}
            <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-[132px] self-start max-h-[calc(100vh-145px)] overflow-y-auto pr-1">
              <div className="parchment-sheet p-6 rounded relative shadow-2xl">
                {/* Vintage Brass Clip */}
                <div className="brass-clip" />

                {/* Secret Stamp */}
                <div className="flex items-center justify-between mb-4 pl-4 pt-1">
                  <span className="red-stamp text-[10px]">
                    TUYỆT MẬT · NĂM {c.year}
                  </span>
                  <span className="text-[10px] font-mono text-[#4A3A2A] font-bold">
                    HỒ SƠ #{task.id.toUpperCase()}
                  </span>
                </div>

                {/* Document Title */}
                <h3 className="text-base font-bold text-[#24160A] font-['Playfair_Display',serif] mb-3 leading-snug border-b border-[#D5C29B] pb-2">
                  {task.historicalDocument.title}
                </h3>

                {/* Excerpt with aged typography */}
                <div className="text-xs md:text-sm text-[#24160A] font-['Playfair_Display',serif] italic leading-relaxed text-justify mb-4 bg-black/[0.02] p-3 rounded border-l-2 border-[#8D3038]">
                  "{task.historicalDocument.excerpt}"
                </div>

                {/* Citation */}
                <div className="mb-3"><NarrationButton text={task.historicalDocument.excerpt} /></div>
                <div className="text-[11px] text-[#4A3A2A] font-sans border-t border-[#D5C29B] pt-3 flex items-start gap-1.5">
                  <BookOpen size={13} className="shrink-0 mt-0.5 text-[#8D3038]" />
                  <span>
                    <strong>Nguồn trích dẫn:</strong> {task.historicalDocument.sourceCitation}
                  </span>
                </div>
              </div>

              {/* AI Counselor Quick Bar */}
              <div className="bg-[#121C2B] border border-[#D6A75C]/25 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#D6A75C]/15 border border-[#D6A75C]/30 flex items-center justify-center text-[#D6A75C]">
                    <Lightbulb size={16} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#E9D8B7]">Cố Vấn Lịch Sử</div>
                    <div className="text-[10px] text-[#8A9BB0]">
                      {hints === 0 ? 'Chưa dùng gợi ý (Tối đa 100đ)' : `Đã dùng ${hints} gợi ý (-${hints * 10}đ)`}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setGuideOpen(true)}
                  className="btn-heritage-secondary text-[11px] py-1.5 px-3"
                >
                  Mở Cố Vấn
                </button>
              </div>
            </div>

            {/* ==============================================================
                COLUMN 2 (RIGHT 7 COLS): KHUNG GIẢI ĐỐ TƯƠNG TÁC
                ============================================================== */}
            <div className="lg:col-span-7">
              <div className="dossier-card border-dongson p-6 rounded-lg relative">
                
                {/* Header question instructions */}
                <div className="mb-5 border-b border-[#D6A75C]/20 pb-3">
                  <div className="text-xs font-mono text-[#D6A75C] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Sparkles size={13} />
                    CHỈ THỊ GIẢI MÃ
                  </div>
                  <h2 className="text-base md:text-lg font-bold text-[#E9D8B7] leading-snug">
                    {task.instructions}
                  </h2>
                </div>

                {/* Interactive Minigame Stage */}
                <div className={`mb-6 ${isWrong ? 'animate-bounce' : ''}`}>
                  <fieldset disabled={solved || (challenge && left === 0)}>
                    <Puzzle task={task} answers={answers} onChange={setAnswers} />
                  </fieldset>
                </div>

                {/* Challenge Timeout Alert */}
                {!solved && feedback && <p role="alert" className="feedback-error">{feedback}</p>}
                {challenge && left === 0 && !solved && (
                  <div className="bg-[#8D3038]/20 border border-[#8D3038] rounded p-4 mb-4 text-center">
                    <AlertCircle size={24} className="text-[#F87171] mx-auto mb-2" />
                    <div className="text-sm font-bold text-[#F87171] mb-1">ĐÃ HẾT THỜI GIAN THỬ THÁCH</div>
                    <p className="text-xs text-[#8A9BB0] mb-3">
                      Hồ sơ chưa được giải mã kịp thời. Hãy đọc lại tư liệu gốc và thử lại với 180 giây mới.
                    </p>
                    <button
                      onClick={() => { setLeft(180); setFeedback(''); }}
                      className="btn-heritage-primary text-xs py-2 px-6"
                    >
                      Thử Lại Nhiệm Vụ (180s)
                    </button>
                  </div>
                )}

                {/* Action Submit Button */}
                {!solved && !(challenge && left === 0) && (
                  <div className="pt-2">
                    <button
                      onClick={handleSubmit}
                      className="btn-heritage-primary w-full text-sm py-3.5 shadow-lg"
                    >
                      <CheckCircle2 size={16} />
                      XÁC NHẬN GIẢI MÃ HỒ SƠ
                    </button>
                  </div>
                )}

                {/* Feedback & Historical Lesson (Shown when Solved) */}
                <AnimatePresence>
                  {solved && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 space-y-4"
                    >
                      {/* Success Badge */}
                      <div className="bg-[#4ADE80]/10 border border-[#4ADE80]/40 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-[#4ADE80] font-bold text-sm mb-1.5">
                          <CheckCircle2 size={18} />
                          HỒ SƠ ĐÃ ĐƯỢC GIẢI MÃ CHÍNH XÁC!
                        </div>
                        <p className="text-xs text-[#E9D8B7] leading-relaxed">
                          {feedback}
                        </p>
                      </div>

                      {/* Deep Historical Lesson Box */}
                      <div className="parchment-sheet p-4 rounded text-xs leading-relaxed">
                        <div className="text-[#8D3038] font-bold font-['Playfair_Display',serif] uppercase tracking-wider mb-1">
                          📖 BÀI HỌC LỊCH SỬ THỜI ĐẠI:
                        </div>
                        <p className="text-[#24160A] italic font-['Playfair_Display',serif]">
                          "{task.historicalLesson}"
                        </p>
                      </div>

                      {/* Next Task or Complete Button */}
                      <button
                        onClick={handleNext}
                        className="btn-heritage-primary w-full text-sm py-4 shadow-xl"
                      >
                        <Sparkles size={16} />
                        {index === c.tasks.length - 1 ? 'KHÔI PHỤC MẢNH KÝ ỨC NGAY' : 'TIẾP TỤC NHIỆM VỤ TIẾP THEO →'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            AI COUNSELOR SLIDE-OVER DRAWER / MODAL
            ================================================================== */}
        <AnimatePresence>
          {guideOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <motion.div
                ref={guideRef} role="dialog" aria-modal="true" aria-label="Cố vấn lịch sử" tabIndex={-1}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="dossier-card border-dongson w-full max-w-lg p-6 rounded-lg relative max-h-[85vh] flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#D6A75C]/20 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#D6A75C]/20 text-[#D6A75C] flex items-center justify-center">
                      <Lightbulb size={18} />
                    </div>
                    <div>
                      <h3 className="font-['Cinzel',serif] text-sm font-bold text-[#E9D8B7]">
                        CỐ VẤN LỊCH SỬ VIỆN LƯU TRỮ
                      </h3>
                      <div className="text-[10px] text-[#8A9BB0]">
                        Gợi ý từng bước · Mỗi mức gợi ý trừ 10 điểm
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setGuideOpen(false)}
                    aria-label="Đóng cố vấn"
                    className="p-1 rounded text-[#8A9BB0] hover:text-[#E9D8B7]"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto space-y-4 pr-1 text-xs">
                  {/* Hint Step 1 */}
                  <div className="bg-[#0A1020] border border-[#D6A75C]/20 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#D6A75C] font-semibold">Gợi ý Mức 1: Định Hướng Tư Liệu</span>
                      {hints >= 1 ? (
                        <span className="text-[#4ADE80] text-[10px]">Đã mở</span>
                      ) : (
                        <button
                          disabled={solved}
                          onClick={() => { setHints(1); audio.play('hint'); }}
                          className="btn-heritage-secondary text-[10px] py-0.5 px-2"
                        >
                          Mở khóa (-10đ)
                        </button>
                      )}
                    </div>
                    {hints >= 1 ? (
                      <p className="text-[#8A9BB0] mt-1 leading-relaxed">{task.aiHints.level1}</p>
                    ) : (
                      <p className="text-[#8A9BB0]/50 italic">Nhấn mở khóa để xem chỉ dẫn điểm mấu chốt trong văn bản gốc.</p>
                    )}
                  </div>

                  {/* Hint Step 2 */}
                  <div className="bg-[#0A1020] border border-[#D6A75C]/20 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[#D6A75C] font-semibold">Gợi ý Mức 2: Phân Tích Chuyên Sâu</span>
                      {hints >= 2 ? (
                        <span className="text-[#4ADE80] text-[10px]">Đã mở</span>
                      ) : (
                        <button
                          disabled={hints < 1 || solved}
                          onClick={() => { setHints(2); audio.play('hint'); }}
                          className="btn-heritage-secondary text-[10px] py-0.5 px-2 disabled:opacity-30"
                        >
                          Mở khóa (-10đ)
                        </button>
                      )}
                    </div>
                    {hints >= 2 ? (
                      <p className="text-[#8A9BB0] mt-1 leading-relaxed">{task.aiHints.level2}</p>
                    ) : (
                      <p className="text-[#8A9BB0]/50 italic">Mở khóa gợi ý mức 1 trước để tiếp cận gợi ý phân tích.</p>
                    )}
                  </div>

                  {/* Free Q&A after solved */}
                  {solved && (
                    <div className="border-t border-[#D6A75C]/20 pt-3">
                      <div className="text-[#D6A75C] font-semibold mb-2">
                        💬 Khám Phá Thêm Cùng Trợ Lý Lịch Sử:
                      </div>
                      <HistoryGuide key={task.id} task={task} />
                    </div>
                  )}
                </div>

                {/* Footer close */}
                <div className="pt-4 border-t border-[#D6A75C]/20 mt-auto text-right">
                  <button
                    onClick={() => setGuideOpen(false)}
                    className="btn-heritage-secondary text-xs py-2 px-5"
                  >
                    Đóng Cửa Sổ Cố Vấn
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
