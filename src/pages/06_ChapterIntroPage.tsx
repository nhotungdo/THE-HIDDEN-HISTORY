// ==========================================================================
// CHAPTER INTRO PAGE (Màn 06) – MẬT MÃ THỜI GIAN
// POSTER SỬ THI ĐIỆN ẢNH TỪNG THỜI KỲ LỊCH SỬ
// ==========================================================================

import { Link, Navigate, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass, Shield, Award, Sparkles, ScrollText, CheckCircle } from 'lucide-react';
import { chapters } from '../data/chapters';
import { useGame } from '../context/GameContext';
import { useAudio } from '../context/AudioContext';

const PERIOD_QUOTES: Record<number, { quote: string; author: string }> = {
  1930: {
    quote: 'Chủ trương làm tư sản dân quyền cách mạng và thổ địa cách mạng để đi tới xã hội cộng sản.',
    author: 'Nguyễn Ái Quốc – Chính cương vắn tắt của Đảng (1930)',
  },
  1945: {
    quote: 'Dù phải đốt cháy cả dãy Trường Sơn cũng phải kiên quyết giành cho được độc lập!',
    author: 'Chủ tịch Hồ Chí Minh – Chỉ thị tại Tân Trào (8/1945)',
  },
  1954: {
    quote: 'Chiến dịch này là một chiến dịch rất quan trọng... Tướng quân tại ngoại, trao cho chú toàn quyền quyết định. Trận này chắc thắng mới đánh, không chắc thắng không đánh.',
    author: 'Chủ tịch Hồ Chí Minh căn dặn Đại tướng Võ Nguyên Giáp',
  },
  1975: {
    quote: 'Thần tốc, thần tốc hơn nữa! Táo bạo, táo bạo hơn nữa! Tranh thủ từng giờ từng phút, xốc tới mặt trận, giải phóng miền Nam!',
    author: 'Mệnh lệnh lịch sử của Đại tướng Võ Nguyên Giáp (7/4/1975)',
  },
  1986: {
    quote: 'Đảng ta cần nhìn thẳng vào sự thật, đánh giá đúng sự thật, nói rõ sự thật... Đổi mới là đòi hỏi bức thiết của đất nước và thời đại.',
    author: 'Tổng Bí thư Trường Chinh – Đại hội đại biểu toàn quốc lần thứ VI',
  },
};

export default function ChapterIntroPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const game = useGame();
  const audio = useAudio();

  const c = chapters.find(item => item.id === Number(id));

  if (!c || game.getChapterStatus(c.id) === 'locked') {
    return <Navigate to="/timeline" replace />;
  }

  const status = game.getChapterStatus(c.id);
  const isCompleted = status === 'completed';
  const quoteData = PERIOD_QUOTES[c.year] || {
    quote: c.slogan,
    author: 'Kho Lưu Trữ Thời Gian VNR202',
  };

  const handleEnterGame = () => {
    audio.play('page-flip');
    if (isCompleted && !game.getChapterProgress(c.id)?.replayResults) game.replayChapter(c.id);
    game.setCurrentChapter(c.id);
    navigate(`/play/${c.id}`);
  };

  return (
    <div className="flex-1 w-full py-8 md:py-12 px-4 relative flex flex-col justify-center text-[#E9D8B7]">
      {/* Background period ambiance */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at 50% 20%, ${c.primaryColor} 0%, transparent 70%)`,
        }}
      />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(0,0,0,0.8)_0%,transparent_80%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto w-full">
        {/* Navigation Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 flex items-center justify-between"
        >
          <Link
            to="/timeline"
            className="inline-flex items-center gap-2 text-sm text-[#8A9BB0] hover:text-[#D6A75C] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Trở về Bản đồ thời gian</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="red-stamp text-[10px]">HỒ SƠ MẬT {c.year}</span>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-xs text-[#4ADE80] font-semibold bg-[#4ADE80]/10 px-2.5 py-1 rounded border border-[#4ADE80]/30">
                <CheckCircle size={14} /> ĐÃ KHÔI PHỤC
              </span>
            )}
          </div>
        </motion.div>

        {/* Poster Container */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="dossier-card border-dongson rounded-lg overflow-hidden p-6 md:p-10 relative"
          style={{
            borderColor: `${c.primaryColor}80`,
            boxShadow: `0 20px 50px -10px rgba(0,0,0,0.8), 0 0 30px ${c.primaryColor}20`,
          }}
        >
          {/* Header Banner */}
          <div className="text-center mb-8 border-b border-[#D6A75C]/20 pb-6 relative">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.3em] uppercase text-[#D6A75C] mb-2">
              <Compass size={14} />
              CỔNG THỜI GIAN SỐ 0{c.id} · NĂM {c.year}
            </div>

            <h1 className="text-3xl md:text-5xl font-['Cinzel',serif] font-black text-gold-foil mb-3 tracking-wider">
              {c.codeName}
            </h1>

            <p className="text-base md:text-lg text-[#E9D8B7] font-['Playfair_Display',serif] italic max-w-2xl mx-auto">
              "{c.slogan}"
            </p>
          </div>

          {/* Historical Context Quote */}
          <div className="parchment-sheet p-6 mb-8 rounded relative shadow-inner">
            <div className="brass-clip" />
            <div className="red-stamp absolute top-4 right-4 text-[10px] hidden sm:block">
              TƯ LIỆU GỐC
            </div>

            <div className="pl-2">
              <p className="text-sm md:text-base text-[#24160A] font-['Playfair_Display',serif] italic leading-relaxed mb-3">
                "{quoteData.quote}"
              </p>
              <div className="text-right text-xs text-[#8D3038] font-bold tracking-wide">
                — {quoteData.author}
              </div>
            </div>
          </div>

          {/* Context Overview & Task Briefing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Context (2 cols) */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2 text-[#D6A75C] font-['Cinzel',serif] text-sm font-bold tracking-wider">
                <ScrollText size={16} />
                BỐI CẢNH LỊCH SỬ THỜI ĐẠI
              </div>
              <p className="text-xs md:text-sm text-[#8A9BB0] leading-relaxed text-justify">
                {c.historicalContext}
              </p>

              {/* Tasks List */}
              <div className="pt-2">
                <div className="text-xs font-semibold text-[#E9D8B7] mb-2 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield size={14} className="text-[#D6A75C]" />
                  3 NHIỆM VỤ GIẢI MÃ BẮT BUỘC:
                </div>
                <div className="space-y-2">
                  {c.tasks.map((task, idx) => (
                    <div
                      key={task.id}
                      className="bg-[#0A1020]/70 border border-[#D6A75C]/15 rounded p-2.5 flex items-start gap-3"
                    >
                      <span className="w-5 h-5 rounded-full bg-[#D6A75C]/20 text-[#D6A75C] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-xs text-[#E9D8B7] font-semibold">{task.title}</div>
                        <div className="text-[11px] text-[#8A9BB0] leading-snug">{task.instructions}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Reward Artifact Column (1 col) */}
            <div className="bg-[#0D1524] border border-[#D6A75C]/30 rounded-lg p-5 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="text-[10px] uppercase font-mono tracking-widest text-[#D6A75C] mb-3">
                PHẦN THƯỞNG KHÔI PHỤC
              </div>

              {/* Glowing Fragment Icon */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F5CF8E]/20 to-[#9E7428]/20 border border-[#D6A75C] flex items-center justify-center text-4xl mb-4 animate-pulse-artifact shadow-lg">
                {c.memoryFragment.iconEmoji}
              </div>

              <div className="font-['Cinzel',serif] text-sm font-bold text-[#E9D8B7] mb-1">
                {c.memoryFragment.name}
              </div>

              <p className="text-[11px] text-[#8A9BB0] leading-relaxed mb-4">
                {c.memoryFragment.description}
              </p>

              <div className="mt-auto w-full pt-3 border-t border-[#D6A75C]/20 flex items-center justify-center gap-1 text-[11px] text-[#D6A75C]">
                <Award size={14} />
                <span>+300 Điểm Tối Đa</span>
              </div>
            </div>
          </div>

          {/* Action Call to Action */}
          <div className="text-center pt-2 border-t border-[#D6A75C]/20 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleEnterGame}
              className="btn-heritage-primary w-full sm:w-auto text-sm px-10 py-4 shadow-xl"
            >
              <Sparkles size={16} />
              {isCompleted ? 'GIẢI MÃ LẠI ĐỂ TỐI ƯU ĐIỂM' : 'BƯỚC VÀO PHÒNG GIẢI MÃ'}
            </button>
            <Link
              to="/timeline"
              className="btn-heritage-secondary w-full sm:w-auto text-xs py-3.5"
            >
              Xem Cổng Khác
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
