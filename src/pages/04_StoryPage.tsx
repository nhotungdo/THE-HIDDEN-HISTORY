// ==========================================
// STORY PAGE (Màn 04) – MẬT MÃ THỜI GIAN
// Opening cinematic narrative
// ==========================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import NarrationButton from '../components/common/NarrationButton';

const STORY_LINES = [
  'Năm 2026, Viện Lưu Trữ Thời Gian phát hiện một sự cố nghiêm trọng...',
  'Cuốn "Đại Việt Biên Niên Ký Thời Đại Mới" – biên bản trung thực nhất về lịch sử Việt Nam hiện đại – đã bị phân rã thành 5 mảnh ký ức.',
  'Mỗi mảnh gắn với một khúc quanh sinh tử của dân tộc: 1930, 1945, 1954, 1975 và 1986.',
  'Nếu không được khôi phục, những trang sử hào hùng này sẽ biến mất vĩnh viễn khỏi ký ức thời gian.',
  'Hội Đồng Lưu Trữ đã lựa chọn BẠN – một Đặc Phái Viên đặc biệt – để thực hiện nhiệm vụ này.',
  'Hành trình khôi phục ký ức lịch sử bắt đầu từ bây giờ...',
];

const LOCKED_PAGES = [
  { year: 1930, label: 'Khởi Nguồn', emoji: '🔑' },
  { year: 1945, label: 'Mùa Thu Độc Lập', emoji: '📜' },
  { year: 1954, label: 'Điện Biên', emoji: '🚩' },
  { year: 1975, label: 'Thống Nhất', emoji: '⭐' },
  { year: 1986, label: 'Đổi Mới', emoji: '⚙️' },
];

export default function StoryPage() {
  const navigate = useNavigate();
  const { progress } = useGame();
  const [lineIndex, setLineIndex] = useState(0);
  const [showMission, setShowMission] = useState(false);
  const [bookOpen, setBookOpen] = useState(false);

  const nickname = progress.profile?.nickname ?? 'Đặc Phái Viên';

  useEffect(() => {
    if (lineIndex < STORY_LINES.length) {
      const delay = lineIndex === 0 ? 1000 : 2800;
      const timer = setTimeout(() => {
        setLineIndex(i => i + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setShowMission(true), 500);
      return () => clearTimeout(timer);
    }
  }, [lineIndex]);

  useEffect(() => {
    const timer = setTimeout(() => setBookOpen(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAcceptMission = () => {
    navigate('/timeline');
  };

  const handleSkip = () => {
    navigate('/timeline');
  };

  return (
    <div className="flex-1 w-full py-8 md:py-12 flex flex-col items-center justify-center px-4 relative overflow-hidden text-[#E9D8B7]">

      {/* Ambient bg */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(214,167,92,0.08)_0%,transparent_60%)]" />

      {/* Skip button */}
      <button
        onClick={handleSkip}
        className="fixed top-20 right-6 text-[#8A9BB0] text-xs hover:text-[#D6A75C] transition-colors z-40 border border-[#D6A75C]/30 bg-[#0A1020]/80 backdrop-blur px-3 py-1.5 rounded"
      >
        Bỏ Qua →
      </button>

      <div className="relative z-10 max-w-3xl w-full mx-auto">
        <div className="flex justify-center mb-4"><NarrationButton text={STORY_LINES.join(' ')} /></div>

        {/* Ancient book */}
        <motion.div
          initial={{ rotateX: -90, opacity: 0 }}
          animate={bookOpen ? { rotateX: 0, opacity: 1 } : {}}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="relative mx-auto mb-10"
          style={{ perspective: 800 }}
        >
          <div className="relative bg-gradient-to-br from-[#2D1B00] to-[#1A0F00] border-2 border-[#D6A75C]/40 rounded-lg p-6 shadow-2xl max-w-lg mx-auto">
            {/* Book spine decoration */}
            <div className="absolute top-0 left-0 w-3 h-full bg-gradient-to-r from-[#A87A30] to-[#D6A75C]/30 rounded-l-lg" />

            <div className="pl-4">
              <div className="text-center mb-4">
                <div className="text-[#D6A75C] font-['Cinzel',serif] font-bold text-lg tracking-widest mb-1">
                  ĐẠI VIỆT BIÊN NIÊN KÝ
                </div>
                <div className="text-[#D6A75C]/50 font-['Cinzel',serif] text-xs tracking-[0.3em]">THỜI ĐẠI MỚI</div>
                <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D6A75C]/50 to-transparent mx-auto mt-3" />
              </div>

              {/* 5 locked pages */}
              <div className="flex justify-center gap-2 flex-wrap">
                {LOCKED_PAGES.map((page, i) => (
                  <motion.div
                    key={page.year}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.2 }}
                    className="flex flex-col items-center bg-[#E9D8B7]/10 border border-[#D6A75C]/20 rounded px-2 py-2 w-16"
                  >
                    <span className="text-xl mb-1">🔒</span>
                    <span className="text-[#D6A75C] text-[9px] font-['Cinzel',serif] font-bold">{page.year}</span>
                    <span className="text-[#8A9BB0] text-[8px] text-center leading-tight mt-0.5">{page.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Typewriter story lines */}
        <div className="min-h-[200px] space-y-3 mb-8">
          <AnimatePresence>
            {STORY_LINES.slice(0, lineIndex).map((line, i) => {
              const isLast = i === lineIndex - 1;
              return (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`text-sm leading-relaxed ${
                    i === 4
                      ? 'text-[#D6A75C] font-semibold text-base'
                      : isLast
                        ? 'text-[#E9D8B7]'
                        : 'text-[#8A9BB0]'
                  }`}
                >
                  {line.includes('BẠN')
                    ? line.replace('BẠN', `${nickname.toUpperCase()}`)
                    : line}
                </motion.p>
              );
            })}
          </AnimatePresence>

          {/* Blinking cursor */}
          {lineIndex < STORY_LINES.length && (
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-0.5 h-4 bg-[#D6A75C] ml-1 align-middle"
            />
          )}
        </div>

        {/* Accept mission CTA */}
        <AnimatePresence>
          {showMission && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="text-center"
            >
              <div className="text-[#8A9BB0] text-xs mb-4 tracking-widest uppercase">
                – Hội Đồng Lưu Trữ Thời Gian –
              </div>
              <button
                onClick={handleAcceptMission}
                className="btn-heritage-primary text-sm px-10 py-4 shadow-2xl"
              >
                ⚡ TIẾP NHẬN NHIỆM VỤ THỜI GIAN
              </button>
              <p className="text-[#8A9BB0] text-xs mt-3 italic">
                Cuốn Biên Niên Ký đang chờ bạn khôi phục, {nickname}.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
