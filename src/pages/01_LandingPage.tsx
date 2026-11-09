// ==========================================
// LANDING PAGE (Màn 01) – MẬT MÃ THỜI GIAN
// ==========================================

import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Clock, BookOpen, Shield } from 'lucide-react';
import ParticleBackground from '../components/common/ParticleBackground';
import { useGame } from '../context/GameContext';
import { hasExistingProgress } from '../utils/storage';

const CHAPTERS = [
  { year: 1930, name: 'KHỞI NGUỒN', desc: 'Sự ra đời của Đảng Cộng sản Việt Nam', emoji: '🔑', color: '#8D3038' },
  { year: 1945, name: 'MÙA THU ĐỘC LẬP', desc: 'Cách mạng Tháng Tám & Tuyên ngôn Độc lập', emoji: '📜', color: '#D6A75C' },
  { year: 1954, name: 'ĐƯỜNG ĐẾN ĐIỆN BIÊN', desc: 'Chiến thắng vĩ đại trong lịch sử nhân loại', emoji: '🚩', color: '#4A7C59' },
  { year: 1975, name: 'THỐNG NHẤT', desc: 'Non sông thu về một mối', emoji: '⭐', color: '#2D5A8E' },
  { year: 1986, name: 'BƯỚC NGOẶT ĐỔI MỚI', desc: 'Chuyển mình để vươn lên', emoji: '⚙️', color: '#6B8E23' },
];

function ClockAnimation() {
  const secondHandRef = useRef<SVGLineElement>(null);
  const minuteHandRef = useRef<SVGLineElement>(null);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const s = now.getSeconds();
      const m = now.getMinutes();
      const sDeg = s * 6;
      const mDeg = m * 6 + s * 0.1;
      if (secondHandRef.current) {
        secondHandRef.current.style.transform = `rotate(${sDeg}deg)`;
        secondHandRef.current.style.transformOrigin = '50% 50%';
      }
      if (minuteHandRef.current) {
        minuteHandRef.current.style.transform = `rotate(${mDeg}deg)`;
        minuteHandRef.current.style.transformOrigin = '50% 50%';
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <svg viewBox="0 0 200 200" className="w-48 h-48 md:w-64 md:h-64 drop-shadow-2xl">
      {/* Clock face */}
      <circle cx="100" cy="100" r="95" fill="#0A1020" stroke="#D6A75C" strokeWidth="4" />
      <circle cx="100" cy="100" r="85" fill="none" stroke="#D6A75C" strokeWidth="1" strokeDasharray="4,8" />
      {/* Hour markers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = 100 + 72 * Math.cos(angle);
        const y1 = 100 + 72 * Math.sin(angle);
        const x2 = 100 + 82 * Math.cos(angle);
        const y2 = 100 + 82 * Math.sin(angle);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D6A75C" strokeWidth={i % 3 === 0 ? 3 : 1.5} />;
      })}
      {/* Year labels */}
      {[1930, 1945, 1954, 1975, 1986].map((year, i) => {
        const angles = [-60, 0, 60, 120, 180];
        const angle = (angles[i] - 90) * (Math.PI / 180);
        const x = 100 + 55 * Math.cos(angle);
        const y = 100 + 55 * Math.sin(angle) + 4;
        return (
          <text key={year} x={x} y={y} textAnchor="middle" fill="#E9D8B7" fontSize="8" fontFamily="Cinzel, serif">
            {year}
          </text>
        );
      })}
      {/* Minute hand */}
      <line ref={minuteHandRef} x1="100" y1="100" x2="100" y2="30" stroke="#D6A75C" strokeWidth="3" strokeLinecap="round" />
      {/* Second hand */}
      <line ref={secondHandRef} x1="100" y1="115" x2="100" y2="20" stroke="#8D3038" strokeWidth="1.5" strokeLinecap="round" />
      {/* Center dot */}
      <circle cx="100" cy="100" r="5" fill="#D6A75C" />
      <circle cx="100" cy="100" r="2" fill="#0A1020" />
    </svg>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { progress } = useGame();
  const hasProgress = hasExistingProgress();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, -80]);

  const completedCount = Object.values(progress.chapters).filter(c => c.status === 'completed').length;

  const handleStart = () => {
    if (hasProgress) {
      navigate('/timeline');
    } else {
      navigate('/how-to-play');
    }
  };

  const handleNewGame = () => {
    navigate('/how-to-play');
  };

  return (
    <div className="min-h-screen bg-[#101827] relative overflow-x-hidden">
      <ParticleBackground count={40} />

      {/* ===== HERO SECTION ===== */}
      <motion.section
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20 pb-16"
      >
        {/* Background decorative layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A1020] via-[#101827] to-[#162032] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(214,167,92,0.08)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">

          {/* Clock */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="flex justify-center mb-8"
          >
            <ClockAnimation />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="text-[#D6A75C]/60 text-sm tracking-[0.4em] uppercase mb-3 font-['Be_Vietnam_Pro',sans-serif]">
              VNR202 – FPT UNIVERSITY
            </div>
            <h1 className="font-['Cinzel',serif] font-black text-4xl md:text-6xl lg:text-7xl leading-tight mb-4">
              <span className="text-gold-gradient block">MẬT MÃ</span>
              <span className="text-gold-gradient block">THỜI GIAN</span>
            </h1>
            <p className="text-[#E9D8B7]/70 text-sm md:text-base tracking-widest uppercase mb-2 font-['Be_Vietnam_Pro',sans-serif]">
              — THE HIDDEN HISTORY —
            </p>
            <p className="text-[#8A9BB0] text-sm md:text-base italic max-w-lg mx-auto">
              Giải mã quá khứ – Thấu hiểu lịch sử – Kết nối hiện tại
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {hasProgress ? (
              <>
                <button
                  onClick={handleStart}
                  className="btn-primary text-base px-8 py-4"
                >
                  ⏰ TIẾP TỤC HÀNH TRÌNH ({completedCount}/5 Chương)
                </button>
                <button
                  onClick={handleNewGame}
                  className="btn-secondary text-sm px-6 py-3"
                >
                  Bắt Đầu Từ Đầu
                </button>
              </>
            ) : (
              <button
                onClick={handleStart}
                className="btn-primary text-lg px-10 py-4"
              >
                ⏳ BẮT ĐẦU HÀNH TRÌNH
              </button>
            )}
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-[#D6A75C]/40 flex flex-col items-center gap-1"
            >
              <span className="text-xs tracking-widest">KHÁM PHÁ</span>
              <ChevronDown size={20} />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* ===== FEATURES SECTION ===== */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-['Cinzel',serif] text-2xl md:text-3xl text-[#D6A75C] mb-3">
              CÁCH THỨC HÀNH TRÌNH
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D6A75C] to-transparent mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Clock className="text-[#D6A75C]" size={32} />,
                title: 'Vượt Qua 5 Mốc Lịch Sử',
                desc: 'Từ 1930 đến 1986, mỗi chương là một bước ngoặt vận mệnh dân tộc. Khám phá, giải mã và khôi phục ký ức.',
              },
              {
                icon: <Shield className="text-[#D6A75C]" size={32} />,
                title: 'Giải Mã 15 Nhiệm Vụ',
                desc: 'Phòng giải mã với 5 loại mini-game: sắp xếp dòng thời gian, ghép hồ sơ, thám tử tư liệu, bản đồ chiến dịch.',
              },
              {
                icon: <BookOpen className="text-[#D6A75C]" size={32} />,
                title: 'Nhận Chứng Nhận Danh Dự',
                desc: 'Thu thập đủ 5 mảnh ký ức, hợp nhất Biên niên ký và nhận chứng nhận VNR202 mang tên riêng của bạn.',
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-dark-card rounded-lg p-6 text-center hover:border-[#D6A75C]/40 transition-all duration-300 hover:transform hover:-translate-y-1"
              >
                <div className="flex justify-center mb-4">{f.icon}</div>
                <h3 className="text-[#E9D8B7] font-['Cinzel',serif] font-semibold text-sm mb-3 tracking-wide">{f.title}</h3>
                <p className="text-[#8A9BB0] text-xs leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 5 CHAPTERS PREVIEW ===== */}
      <section className="relative z-10 py-16 px-4 bg-[#0A1020]/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-['Cinzel',serif] text-2xl md:text-3xl text-[#D6A75C] mb-3">
              5 CỔNG THỜI GIAN
            </h2>
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D6A75C] to-transparent mx-auto mb-4" />
            <p className="text-[#8A9BB0] text-sm max-w-xl mx-auto">
              Mỗi cổng thời gian là một giai đoạn lịch sử – một cuộc phiêu lưu giải mã riêng biệt đang chờ bạn.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CHAPTERS.map((ch, i) => {
              const chStatus = progress.chapters[i + 1]?.status ?? 'locked';
              const isCompleted = chStatus === 'completed';
              return (
                <motion.div
                  key={ch.year}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`relative rounded-lg overflow-hidden border transition-all duration-300 cursor-default ${
                    isCompleted
                      ? 'border-[#D6A75C] shadow-[0_0_20px_rgba(214,167,92,0.3)]'
                      : 'border-[#D6A75C]/20'
                  }`}
                  style={{ background: `linear-gradient(135deg, ${ch.color}22 0%, #0A102080 100%)` }}
                >
                  <div className="p-4 text-center">
                    <div className="text-3xl mb-2">{ch.emoji}</div>
                    <div className="text-[#D6A75C] font-['Cinzel',serif] font-bold text-lg">{ch.year}</div>
                    <div className="text-[#E9D8B7] text-xs font-semibold mt-1 tracking-wide">{ch.name}</div>
                    <div className="text-[#8A9BB0] text-[10px] mt-2 leading-relaxed">{ch.desc}</div>
                    {isCompleted && (
                      <div className="mt-2 text-xs text-[#D6A75C] font-semibold">✅ Đã Giải Mã</div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative z-10 py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="font-['Cinzel',serif] text-2xl md:text-3xl text-gold-gradient mb-4">
            LỊCH SỬ ĐANG CHỜ BẠN GIẢI MÃ
          </h2>
          <p className="text-[#8A9BB0] text-sm mb-8 leading-relaxed">
            Mỗi câu đố là một trang sử. Mỗi mảnh ký ức là một bài học. Hành trình phiêu lưu lịch sử đang chờ bạn bắt đầu.
          </p>
          <button onClick={handleStart} className="btn-primary text-base px-10 py-4">
            ⏳ KHAI MỞ HÀNH TRÌNH NGAY
          </button>
        </motion.div>
      </section>
    </div>
  );
}

