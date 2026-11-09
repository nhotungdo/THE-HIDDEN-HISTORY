// ==========================================================================
// ENDING PAGE (Màn 11) – MẬT MÃ THỜI GIAN
// ĐẠI KẾT CỤC: HỢP NHẤT ĐẠI VIỆT BIÊN NIÊN KÝ THỜI ĐẠI MỚI
// ==========================================================================

import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Award, ArrowRight, BookOpen, Feather } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { chapters } from '../data/chapters';
import MemoryArtifact from '../components/common/MemoryArtifact';
import { useAudio } from '../context/AudioContext';
import { calculateRank } from '../utils/storage';

export default function EndingPage() {
  const { progress, setReflection } = useGame();
  const reflection = progress.reflection ?? '';
  const { play } = useAudio();
  useEffect(() => { if (progress.isCompletedAll) play('victory'); }, [progress.isCompletedAll, play]);

  useEffect(() => {
    if (progress.isCompletedAll && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Epic gold confetti explosion
      void confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#D6A75C', '#F5CF8E', '#9E7428', '#8D3038', '#FFFFFF'],
      });
    }
  }, [progress.isCompletedAll]);

  if (!progress.isCompletedAll) {
    return <Navigate to="/collection" replace />;
  }

  const nickname = progress.profile?.nickname ?? 'Đặc Phái Viên';

  return (
    <div className="flex-1 w-full py-8 md:py-12 px-4 text-[#E9D8B7] relative flex flex-col justify-center">
      {/* Radiant celebratory background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(214,167,92,0.15)_0%,transparent_70%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(141,48,56,0.1)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="dossier-card border-dongson rounded-lg p-6 md:p-12 text-center relative shadow-2xl"
        >
          {/* Top Seal */}
          <div className="mb-4">
            <span className="red-stamp text-xs tracking-widest">
              ĐÃ HỢP NHẤT TOÀN DIỆN KÝ ỨC THỜI GIAN
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-5xl font-['Cinzel',serif] font-black text-gold-foil mb-3 tracking-wider">
            KHẢI HOÀN BIÊN NIÊN KÝ
          </h1>

          <p className="text-sm md:text-base text-[#E9D8B7] font-['Playfair_Display',serif] italic mb-4 max-w-2xl mx-auto">
            Chúc mừng Đặc Phái Viên <strong className="text-[#D6A75C]">{nickname}</strong>! Bạn đã vượt qua 15 thử thách giải mã, khôi phục trọn vẹn 5 mảnh ký ức thời gian.
          </p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <span className="chip">Tổng điểm: {progress.totalScore}đ</span>
            <span className="chip">Gợi ý đã dùng: {progress.hintsUsedTotal}</span>
            <span className="chip border-[#D6A75C]/50 text-[#F5CF8E]">Danh hiệu: {calculateRank(progress.totalScore)}</span>
          </div>

          {/* Unified Ancient Chronicle Book Visualization */}
          <div className="parchment-sheet p-8 rounded-lg max-w-2xl mx-auto mb-8 shadow-2xl relative border-2 border-[#D6A75C]/60">
            <div className="brass-clip" />
            <div className="text-xs uppercase font-mono tracking-[0.3em] text-[#8D3038] font-bold mb-4">
              ĐẠI VIỆT BIÊN NIÊN KÝ THỜI ĐẠI MỚI (1930 – 1986)
            </div>

            {/* 5 Icons Row */}
            <div className="flex justify-center gap-4 flex-wrap mb-6 chronicle-fusion">
              {chapters.map((c, index) => (
                <div
                  key={c.id}
                  style={{ animationDelay: `${index * .2}s` }}
                  className="flex flex-col items-center p-3 rounded bg-black/10 border border-[#8D3038]/30 w-24 shadow-inner"
                >
                  <span className="block w-16 h-16 mb-1"><MemoryArtifact chapterId={c.id} name={c.memoryFragment.name} /></span>
                  <span className="text-[10px] font-bold text-[#8D3038] font-mono">{c.year}</span>
                  <span className="text-[9px] text-[#24160A] font-semibold text-center leading-tight">
                    {c.memoryFragment.name}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-xs text-[#24160A] font-['Playfair_Display',serif] italic leading-relaxed text-justify mb-4">
              "Lịch sử không chỉ là những trang sách đã khép lại, mà là ngọn đuốc soi sáng hiện tại và tương lai. Từng quyết sách của năm 1930, từng hy sinh của năm 1945, 1954, 1975, và từng bước chuyển mình can trường năm 1986 là bệ phóng để thế hệ trẻ hôm nay tiếp tục xây dựng một Việt Nam độc lập, tự chủ và thịnh vượng."
            </p>

            <div className="text-right text-[11px] font-bold text-[#8D3038]">
              — Lời Kết Viện Lưu Trữ Thời Gian VNR202 —
            </div>
          </div>

          {/* Reflection Question for Student */}
          <div className="bg-[#0A1020]/80 border border-[#D6A75C]/30 rounded-lg p-5 max-w-xl mx-auto text-left mb-8">
            <label
              htmlFor="ending-reflection"
              className="text-xs font-semibold text-[#D6A75C] mb-2 uppercase tracking-wide flex items-center gap-1.5"
            >
              <Feather size={14} aria-hidden="true" />
              Cảm Nhận Của Bạn Về Giá Trị Lịch Sử (Lưu vào chứng nhận danh dự):
            </label>
            <textarea
              id="ending-reflection"
              maxLength={300}
              value={reflection}
              aria-describedby="reflection-help"
              onChange={e => {
                setReflection(e.target.value);
              }}
              placeholder="Đối với bạn, bài học lớn nhất mà lịch sử trao lại cho thế hệ trẻ hôm nay là gì? (Ví dụ: Tinh thần độc lập tự cường, đổi mới sáng tạo, đoàn kết dân tộc...)"
              rows={3}
              className="w-full bg-[#162032] border border-[#D6A75C]/25 rounded p-3 text-xs text-[#E9D8B7] placeholder:text-[#8A9BB0]/60 outline-none focus:border-[#D6A75C] transition-colors resize-none leading-relaxed"
            />
            <div id="reflection-help" className="flex justify-between gap-2 text-[10px] text-[#8A9BB0] mt-1.5">
              <span>Tự động lưu vào hồ sơ và in trên chứng nhận.</span>
              <span className="font-mono tabular-nums shrink-0">{reflection.length}/300 ký tự</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/certificate"
              className="btn-heritage-primary w-full sm:w-auto text-sm px-8 py-4 shadow-2xl"
            >
              <Award size={18} aria-hidden="true" />
              <span>NHẬN CHỨNG NHẬN HOÀN THÀNH DANH DỰ</span>
              <ArrowRight size={16} aria-hidden="true" />
            </Link>

            <Link
              to="/collection"
              className="btn-heritage-secondary w-full sm:w-auto text-xs py-3.5 px-6"
            >
              <BookOpen size={14} aria-hidden="true" />
              <span>Xem Lại Bộ Sưu Tập</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
