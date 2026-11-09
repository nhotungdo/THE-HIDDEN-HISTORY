// ==========================================================================
// LEVEL RESULT PAGE (Màn 08) – MẬT MÃ THỜI GIAN
// BẢNG VINH DANH KHẢI HOÀN & TRAO THƯỞNG MẢNH KÝ ỨC
// ==========================================================================

import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Award, CheckCircle, ArrowRight, RotateCcw, 
  BookOpen, ChevronDown 
} from 'lucide-react';
import { chapters } from '../data/chapters';
import { useGame } from '../context/GameContext';
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
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="dossier-card border-dongson rounded-lg p-6 md:p-10 text-center relative shadow-2xl"
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
          <p className="text-sm text-[#8A9BB0] mb-8">
            Năm {c.year} · {c.codeName}
          </p>

          {/* Floating Memory Fragment Artifact */}
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
          <p className="text-xs text-[#8A9BB0] max-w-lg mx-auto mb-6 leading-relaxed">
            {c.memoryFragment.description}
          </p>

          {/* Score & Statistics Strip */}
          <div className="grid grid-cols-3 gap-3 bg-[#0A1020]/90 border border-[#D6A75C]/25 rounded-lg p-4 mb-8">
            <div>
              <div className="text-[10px] text-[#8A9BB0] uppercase font-mono">Điểm Đạt Được</div>
              <div className="text-xl font-bold font-mono text-[#D6A75C]">{p.totalScore}đ</div>
            </div>
            <div className="border-x border-[#D6A75C]/15">
              <div className="text-[10px] text-[#8A9BB0] uppercase font-mono">Nhiệm Vụ</div>
              <div className="text-xl font-bold font-mono text-[#4ADE80]">3/3</div>
            </div>
            <div>
              <div className="text-[10px] text-[#8A9BB0] uppercase font-mono">Gợi Ý Đã Dùng</div>
              <div className="text-xl font-bold font-mono text-[#E9D8B7]">{p.hintsUsed}</div>
            </div>
          </div>

          {/* Historical Significance Parchment */}
          <p className="text-xs text-[#8A9BB0] mb-6">Điểm tốt nhất: {p.bestScore}đ · Thời gian: {Math.floor(p.taskResults.reduce((sum, result) => sum + (result.timeSpent ?? 0), 0) / 60)} phút {p.taskResults.reduce((sum, result) => sum + (result.timeSpent ?? 0), 0) % 60} giây</p>
          <div className="parchment-sheet p-5 rounded text-left mb-8 relative">
            <div className="text-xs font-bold text-[#8D3038] uppercase font-['Playfair_Display',serif] tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen size={14} />
              Ý NGHĨA LỊCH SỬ CỐT LÕI (VNR202)
            </div>
            <p className="text-xs text-[#24160A] font-['Playfair_Display',serif] italic leading-relaxed">
              "{c.memoryFragment.historicalSignificance}"
            </p>
          </div>

          {/* Task Accordion Summary */}
          <div className="text-left space-y-2 mb-8">
            <div className="text-xs font-semibold text-[#8A9BB0] uppercase tracking-wider mb-2">
              TỔNG KẾT BÀI HỌC CÁC NHIỆM VỤ:
            </div>
            {c.tasks.map(t => (
              <details
                key={t.id}
                className="bg-[#0A1020]/60 border border-[#D6A75C]/20 rounded p-3 text-xs group cursor-pointer"
              >
                <summary className="font-semibold text-[#E9D8B7] flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-[#4ADE80]" />
                    {t.title}
                  </span>
                  <ChevronDown size={14} className="text-[#8A9BB0] group-open:rotate-180 transition-transform" />
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
              <ArrowRight size={14} />
            </Link>

            <Link
              to="/collection"
              className="btn-heritage-secondary w-full sm:w-auto text-xs py-3 px-6"
            >
              <Award size={14} />
              <span>Xem Bộ Sưu Tập</span>
            </Link>

            <Link
              to={`/chapter/${c.id}`}
              className="p-2.5 rounded text-[#8A9BB0] hover:text-[#D6A75C] transition-colors text-xs flex items-center gap-1"
              title="Chơi lại để tối ưu điểm"
            >
              <RotateCcw size={13} />
              <span>Chơi lại</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
