// ==========================================================================
// LEVEL RESULT PAGE (Màn 08) – MẬT MÃ THỜI GIAN
// BẢNG VINH DANH KHẢI HOÀN & TRAO THƯỞNG MẢNH KÝ ỨC
// ==========================================================================

import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award, CheckCircle, ArrowRight, RotateCcw,
  BookOpen, ChevronDown, Clock, Lightbulb, Trophy,
} from 'lucide-react';
import { chapters } from '../data/chapters';
import { useGame } from '../context/GameContext';
import { calculateRank } from '../utils/storage';
import MemoryArtifact from '../components/common/MemoryArtifact';

export default function LevelResultPage() {
  const { id } = useParams();
  const game = useGame();
  const c = chapters.find(item => item.id === Number(id));
  const p = c && game.getChapterProgress(c.id);

  if (!c || p?.status !== 'completed') {
    return <Navigate to="/timeline" replace />;
  }

  const isAllCompleted = game.getTotalCompletedChapters() === 5;
  const totalSeconds = p.taskResults.reduce((sum, result) => sum + (result.timeSpent ?? 0), 0);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const rank = calculateRank(game.progress.totalScore);

  return (
    <div className="flex-1 w-full py-8 md:py-12 px-4 text-[#E9D8B7] relative flex flex-col justify-center">
      {/* Background celebration glow */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${c.primaryColor} 0%, transparent 70%)`,
        }}
      />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(214,167,92,0.1)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="dossier-card border-dongson rounded-lg p-5 sm:p-6 md:p-10 text-center relative shadow-2xl"
        >
          {/* Top Stamp */}
          <div className="mb-4">
            <span className="red-stamp text-xs tracking-widest">
              HỒ SƠ ĐÃ KHÔI PHỤC THÀNH CÔNG
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl md:text-4xl font-['Cinzel',serif] font-black text-gold-foil mb-2">
            HOÀN THÀNH CHƯƠNG 0{c.id}
          </h1>
          <p className="text-sm text-[#8A9BB0] mb-2">
            Năm {c.year} · {c.codeName}
          </p>
          <span className="chip mb-7">
            <Trophy size={12} aria-hidden="true" /> {rank}
          </span>

          {/* Memory Fragment Artifact */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', damping: 12 }}
            className="w-28 h-28 rounded-full bg-gradient-to-br from-[#F5CF8E]/30 to-[#9E7428]/20 border-2 border-[#D6A75C] flex items-center justify-center text-5xl mx-auto mb-4 animate-pulse-artifact shadow-2xl"
          >
            <MemoryArtifact chapterId={c.id} name={c.memoryFragment.name} />
          </motion.div>

          {/* Fragment Name & Description */}
          <div className="font-['Cinzel',serif] text-lg font-bold text-[#E9D8B7] mb-1">
            {c.memoryFragment.name}
          </div>
          <p className="text-xs text-[#8A9BB0] max-w-lg mx-auto mb-2 leading-relaxed">
            {c.memoryFragment.description}
          </p>
          <p className="text-[10px] text-[#4ADE80] mb-7 inline-flex items-center gap-1.5">
            <CheckCircle size={12} aria-hidden="true" /> Đã lưu vào Viện Bảo Tàng Ký Ức
          </p>

          {/* Score & Statistics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#D6A75C]/15 border border-[#D6A75C]/25 rounded-lg overflow-hidden mb-8">
            <div className="bg-[#0A1020] p-3.5">
              <div className="text-[10px] text-[#8A9BB0] uppercase font-mono mb-1">Điểm Chương</div>
              <div className="text-lg font-bold font-mono text-[#D6A75C] tabular-nums">{p.totalScore}đ</div>
            </div>
            <div className="bg-[#0A1020] p-3.5">
              <div className="text-[10px] text-[#8A9BB0] uppercase font-mono mb-1">Điểm Tốt Nhất</div>
              <div className="text-lg font-bold font-mono text-[#F5CF8E] tabular-nums">{p.bestScore}đ</div>
            </div>
            <div className="bg-[#0A1020] p-3.5">
              <div className="text-[10px] text-[#8A9BB0] uppercase font-mono mb-1 flex items-center justify-center gap-1">
                <Lightbulb size={10} aria-hidden="true" /> Gợi Ý
              </div>
              <div className="text-lg font-bold font-mono text-[#E9D8B7] tabular-nums">{p.hintsUsed}/2</div>
            </div>
            <div className="bg-[#0A1020] p-3.5">
              <div className="text-[10px] text-[#8A9BB0] uppercase font-mono mb-1 flex items-center justify-center gap-1">
                <Clock size={10} aria-hidden="true" /> Thời Gian
              </div>
              <div className="text-lg font-bold font-mono text-[#E9D8B7] tabular-nums">
                {minutes}′{seconds.toString().padStart(2, '0')}″
              </div>
            </div>
          </div>

          {/* Historical Significance Parchment */}
          <div className="parchment-sheet p-5 rounded text-left mb-8 relative">
            <div className="text-xs font-bold text-[#8D3038] uppercase font-['Playfair_Display',serif] tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen size={14} aria-hidden="true" />
              Ý NGHĨA LỊCH SỬ CỐT LÕI (VNR202)
            </div>
            <p className="text-xs text-[#24160A] font-['Playfair_Display',serif] italic leading-relaxed">
              "{c.memoryFragment.historicalSignificance}"
            </p>
          </div>

          {/* Task Accordion Summary */}
          <div className="text-left space-y-2 mb-8">
            <h2 className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider mb-2">
              Tổng kết bài học các nhiệm vụ
            </h2>
            {c.tasks.map(t => (
              <details
                key={t.id}
                className="bg-[#0A1020]/60 border border-[#D6A75C]/20 rounded p-3 text-xs group"
              >
                <summary className="font-semibold text-[#E9D8B7] flex items-center justify-between gap-2 min-h-10 py-1.5">
                  <span className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#4ADE80] shrink-0" aria-hidden="true" />
                    {t.title}
                  </span>
                  <ChevronDown size={14} className="text-[#8A9BB0] group-open:rotate-180 transition-transform shrink-0" aria-hidden="true" />
                </summary>
                <p className="text-[#8A9BB0] mt-2 pt-2 border-t border-[#D6A75C]/10 leading-relaxed pl-6">
                  {t.historicalLesson}
                </p>
              </details>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={isAllCompleted ? '/ending' : '/timeline'}
              className="btn-heritage-primary w-full sm:w-auto text-xs py-3.5 px-8"
            >
              <span>{isAllCompleted ? 'HỢP NHẤT BIÊN NIÊN KÝ' : 'TIẾP TỤC HÀNH TRÌNH'}</span>
              <ArrowRight size={14} aria-hidden="true" />
            </Link>

            <Link
              to="/collection"
              className="btn-heritage-secondary w-full sm:w-auto text-xs py-3 px-6"
            >
              <Award size={14} aria-hidden="true" />
              <span>Xem Bộ Sưu Tập</span>
            </Link>

            <Link
              to={`/chapter/${c.id}`}
              className="min-h-10 p-2.5 px-3 rounded text-[#8A9BB0] hover:text-[#D6A75C] transition-colors text-xs flex items-center justify-center gap-1"
              title="Chơi lại để tối ưu điểm"
            >
              <RotateCcw size={13} aria-hidden="true" />
              <span>Chơi lại</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
