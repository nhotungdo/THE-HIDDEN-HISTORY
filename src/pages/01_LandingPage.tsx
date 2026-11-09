// ==========================================================================
// LANDING PAGE (Màn 01) – MẬT MÃ THỜI GIAN (VNR202)
// BALANCED HISTORICAL GAME ARCHITECTURE · ĐẠI HỌC FPT
// ==========================================================================

import { useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Compass, ChevronDown, BookOpen, Shield, 
  Award, Sparkles, ArrowRight, CheckCircle2, Lock,
  FileText, MapPin, Feather
} from 'lucide-react';
import ParticleBackground from '../components/common/ParticleBackground';
import { useGame } from '../context/GameContext';
import { hasExistingProgress } from '../utils/storage';

const CHAPTERS = [
  { id: 1, year: 1930, name: 'KHỞI NGUỒN', desc: 'Hội nghị hợp nhất tại Cửu Long & Sự ra đời của Đảng Cộng sản Việt Nam', fragment: 'Ấn Vàng Khởi Nguồn', emoji: '🔑', color: '#8D3038' },
  { id: 2, year: 1945, name: 'MÙA THU ĐỘC LẬP', desc: 'Cách mạng Tháng Tám & Tuyên ngôn Độc lập khai sinh nước VNDCCH', fragment: 'Bản Thảo Độc Lập', emoji: '📜', color: '#D6A75C' },
  { id: 3, year: 1954, name: 'ĐƯỜNG ĐẾN ĐIỆN BIÊN', desc: 'Chiến thắng Điện Biên Phủ lừng lẫy năm châu, chấn động địa cầu', fragment: 'Ngọn Cờ Quyết Thắng', emoji: '🚩', color: '#4A7C59' },
  { id: 4, year: 1975, name: 'THỐNG NHẤT', desc: 'Đại thắng Mùa Xuân 1975 – Non sông thu về một mối sau 21 năm chia cắt', fragment: 'Ngôi Sao Thống Nhất', emoji: '⭐', color: '#2D5A8E' },
  { id: 5, year: 1986, name: 'BƯỚC NGOẶT ĐỔI MỚI', desc: 'Đại hội VI – Đường lối Đổi Mới toàn diện đưa đất nước vươn tầm thời đại', fragment: 'Bánh Răng Đổi Mới', emoji: '⚙️', color: '#6B8E23' },
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
    <div className="relative flex items-center justify-center">
      {/* Outer Golden Ambient Glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#D6A75C]/15 via-[#8D3038]/10 to-transparent blur-2xl pointer-events-none" />

      <svg 
        viewBox="0 0 200 200" 
        className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 drop-shadow-[0_0_35px_rgba(214,167,92,0.35)] relative z-10"
      >
        {/* Outer Dong Son / Gear Ring */}
        <circle cx="100" cy="100" r="98" fill="none" stroke="#D6A75C" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.6" />
        <circle cx="100" cy="100" r="93" fill="#0A1020" stroke="#D6A75C" strokeWidth="3" />
        <circle cx="100" cy="100" r="84" fill="none" stroke="#D6A75C" strokeWidth="1" strokeDasharray="4,6" opacity="0.75" />

        {/* 12 Hour Ticks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const isMajor = i % 3 === 0;
          const r1 = isMajor ? 72 : 76;
          const r2 = 82;
          const x1 = 100 + r1 * Math.cos(angle);
          const y1 = 100 + r1 * Math.sin(angle);
          const x2 = 100 + r2 * Math.cos(angle);
          const y2 = 100 + r2 * Math.sin(angle);
          return (
            <line 
              key={i} 
              x1={x1} 
              y1={y1} 
              x2={x2} 
              y2={y2} 
              stroke="#D6A75C" 
              strokeWidth={isMajor ? 2.8 : 1.2} 
            />
          );
        })}

        {/* 5 Milestone Years */}
        {[
          { year: 1930, angleDeg: -60 },
          { year: 1945, angleDeg: 0 },
          { year: 1954, angleDeg: 60 },
          { year: 1975, angleDeg: 120 },
          { year: 1986, angleDeg: 180 },
        ].map(({ year, angleDeg }) => {
          const angle = (angleDeg - 90) * (Math.PI / 180);
          const x = 100 + 55 * Math.cos(angle);
          const y = 100 + 55 * Math.sin(angle) + 3.5;
          return (
            <g key={year}>
              <circle 
                cx={100 + 55 * Math.cos(angle)} 
                cy={100 + 55 * Math.sin(angle)} 
                r="11" 
                fill="#162032" 
                stroke="#D6A75C" 
                strokeWidth="1" 
              />
              <text 
                x={x} 
                y={y} 
                textAnchor="middle" 
                fill="#E9D8B7" 
                fontSize="6.5" 
                fontFamily="Cinzel, serif" 
                fontWeight="bold"
              >
                {year}
              </text>
            </g>
          );
        })}

        {/* Inner concentric ring */}
        <circle cx="100" cy="100" r="32" fill="none" stroke="#D6A75C" strokeWidth="0.8" opacity="0.4" />

        {/* Minute Hand */}
        <line 
          ref={minuteHandRef} 
          x1="100" 
          y1="100" 
          x2="100" 
          y2="28" 
          stroke="#D6A75C" 
          strokeWidth="3" 
          strokeLinecap="round" 
        />
        {/* Second Hand */}
        <line 
          ref={secondHandRef} 
          x1="100" 
          y1="114" 
          x2="100" 
          y2="18" 
          stroke="#A31D1D" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
        />

        {/* Center Pivot & Ruby Jewel */}
        <circle cx="100" cy="100" r="6" fill="#D6A75C" />
        <circle cx="100" cy="100" r="3" fill="#8D3038" />
        <circle cx="100" cy="100" r="1" fill="#FFF2D6" />
      </svg>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { progress, getTotalCompletedChapters } = useGame();
  const hasProgress = hasExistingProgress();
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, -35]);

  const completedCount = getTotalCompletedChapters();

  const handleStart = () => {
    if (hasProgress) {
      navigate('/timeline');
    } else {
      navigate('/how-to-play');
    }
  };

  return (
    <div className="w-full relative overflow-x-hidden text-[#E9D8B7]">
      <ParticleBackground count={45} />

      {/* ====================================================================
          SECTION 1: HERO & CHRONOVISOR (BALANCED 2-COLUMN DESKTOP / STACKED MOBILE)
          ==================================================================== */}
      <motion.section
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-[calc(100vh-58px)] flex items-center justify-center px-4 py-10 sm:py-14 lg:py-16"
      >
        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Heading, Slogan, Story Hook & CTAs */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
            >
              {/* Top Academic Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#162032] border border-[#D6A75C]/40 text-xs font-mono text-[#D6A75C] tracking-widest uppercase mb-5 shadow-md">
                <Compass size={14} className="text-[#D6A75C]" />
                <span>ĐỒ ÁN TƯƠNG TÁC MÔN VNR202 · ĐẠI HỌC FPT</span>
              </div>

              {/* Main Title */}
              <h1 className="font-['Cinzel',serif] font-black text-4xl sm:text-5xl lg:text-6xl leading-[1.12] mb-3 tracking-wide">
                <span className="text-gold-foil block drop-shadow-md">MẬT MÃ THỜI GIAN</span>
              </h1>
              
              <p className="text-xs sm:text-sm font-mono tracking-[0.35em] uppercase text-[#D6A75C] mb-4">
                — THE HIDDEN HISTORY —
              </p>

              {/* Slogan Quote */}
              <div className="w-full max-w-xl border-l-2 border-[#D6A75C] pl-4 py-2 my-2 bg-gradient-to-r from-[#D6A75C]/10 to-transparent rounded-r text-left">
                <p className="text-sm sm:text-base text-[#F4EBD9] font-['Playfair_Display',serif] italic leading-relaxed">
                  "Giải mã quá khứ – Thấu hiểu lịch sử – Kết nối hiện tại."
                </p>
              </div>

              {/* Lead Paragraph */}
              <p className="text-xs sm:text-sm text-[#8A9BB0] leading-relaxed max-w-xl my-4 text-justify sm:text-left">
                Nhập vai Đặc phái viên của Viện Lưu trữ Thời gian, ngược dòng lịch sử bước vào 5 thời khắc quyết định vận mệnh dân tộc (1930 – 1986). Giải mã 15 cặp hồ sơ mật, trực tiếp chỉ huy sa bàn chiến lược và khôi phục toàn vẹn cuốn Đại Việt Biên Niên Ký.
              </p>

              {/* Call to Action Buttons */}
              <div className="mt-4 flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
                {hasProgress ? (
                  <>
                    <button
                      onClick={handleStart}
                      className="btn-heritage-primary text-sm px-8 py-3.5 shadow-2xl flex items-center justify-center gap-2.5"
                    >
                      <Sparkles size={16} />
                      <span>TIẾP TỤC HÀNH TRÌNH ({completedCount}/5 CỔ VẬT)</span>
                    </button>
                    <Link
                      to="/timeline"
                      className="btn-heritage-secondary text-xs px-6 py-3.5 flex items-center justify-center gap-2"
                    >
                      <MapPin size={15} />
                      <span>Bản Đồ Thời Gian</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleStart}
                      className="btn-heritage-primary text-sm px-8 py-3.5 shadow-2xl flex items-center justify-center gap-2.5"
                    >
                      <Sparkles size={16} />
                      <span>BẮT ĐẦU HÀNH TRÌNH GIẢI MÃ</span>
                    </button>
                    <Link
                      to="/how-to-play"
                      className="btn-heritage-secondary text-xs px-6 py-3.5 flex items-center justify-center gap-2"
                    >
                      <BookOpen size={15} />
                      <span>Hướng Dẫn Luật Chơi</span>
                    </Link>
                  </>
                )}
              </div>

              {/* Quick Feature Badges */}
              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-[11px] font-mono text-[#8A9BB0]">
                <span className="flex items-center gap-1.5 text-[#D6A75C]">
                  <CheckCircle2 size={13} /> Không Cần Đăng Nhập
                </span>
                <span className="flex items-center gap-1.5 text-[#D6A75C]">
                  <CheckCircle2 size={13} /> Lưu Trữ LocalStorage
                </span>
                <span className="flex items-center gap-1.5 text-[#D6A75C]">
                  <CheckCircle2 size={13} /> Chứng Nhận Danh Dự 2K
                </span>
              </div>
            </motion.div>

            {/* Right Column: Interactive Chronovisor Clock Emblem */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="lg:col-span-5 flex flex-col items-center justify-center"
            >
              <div className="p-4 sm:p-6 rounded-2xl bg-[#0F1726]/60 border border-[#D6A75C]/20 shadow-2xl backdrop-blur-sm relative">
                {/* Brass Screws at 4 corners */}
                <div className="absolute top-2 left-2 w-2 h-2 rounded-full border border-[#D6A75C]/60 bg-[#D6A75C]/20" />
                <div className="absolute top-2 right-2 w-2 h-2 rounded-full border border-[#D6A75C]/60 bg-[#D6A75C]/20" />
                <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full border border-[#D6A75C]/60 bg-[#D6A75C]/20" />
                <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full border border-[#D6A75C]/60 bg-[#D6A75C]/20" />

                <ClockAnimation />

                {/* Clock Status Tag */}
                <div className="mt-4 text-center">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-[#D6A75C] font-bold">
                    CỖ MÁY BIÊN NIÊN KÝ
                  </div>
                  <div className="text-[10px] text-[#8A9BB0] mt-0.5">
                    5 Vùng Thời Gian · 15 Hồ Sơ Tuyệt Mật
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Scroll Down Cue */}
          <div className="mt-8 lg:mt-12 flex justify-center">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2.2 }}
              className="text-[#D6A75C]/60 hover:text-[#D6A75C] flex flex-col items-center gap-1 text-[10px] font-mono tracking-widest cursor-pointer transition-colors"
              onClick={() => {
                document.getElementById('metrics-strip')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>CUỘN ĐỂ KHÁM PHÁ CHI TIẾT</span>
              <ChevronDown size={16} />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ====================================================================
          SECTION 2: METRICS & HIGHLIGHTS STRIP (DẢI THÔNG SỐ CÂN ĐỐI)
          ==================================================================== */}
      <section id="metrics-strip" className="relative z-10 border-y border-[#D6A75C]/20 bg-[#0B111E]/95 py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#D6A75C]/15">
            
            <div className="pt-3 sm:pt-0 sm:px-4 text-center">
              <div className="font-['Cinzel',serif] text-2xl sm:text-3xl font-bold text-gold-foil">
                1930 – 1986
              </div>
              <div className="text-xs font-bold text-[#E9D8B7] mt-1">
                5 MỐC SON LỊCH SỬ
              </div>
              <div className="text-[11px] text-[#8A9BB0] mt-0.5">
                Các bước ngoặt vận mệnh dân tộc
              </div>
            </div>

            <div className="pt-3 sm:pt-0 sm:px-4 text-center">
              <div className="font-['Cinzel',serif] text-2xl sm:text-3xl font-bold text-gold-foil">
                15 HỒ SƠ
              </div>
              <div className="text-xs font-bold text-[#E9D8B7] mt-1">
                5 CƠ CHẾ GIẢI MÃ
              </div>
              <div className="text-[11px] text-[#8A9BB0] mt-0.5">
                Sa bàn, timeline, mộc đỏ, tài liệu
              </div>
            </div>

            <div className="pt-3 sm:pt-0 sm:px-4 text-center">
              <div className="font-['Cinzel',serif] text-2xl sm:text-3xl font-bold text-gold-foil">
                05 CỔ VẬT
              </div>
              <div className="text-xs font-bold text-[#E9D8B7] mt-1">
                KHO TÀNG KÝ ỨC
              </div>
              <div className="text-[11px] text-[#8A9BB0] mt-0.5">
                Khôi phục Đại Việt Biên Niên Ký
              </div>
            </div>

            <div className="pt-3 sm:pt-0 sm:px-4 text-center">
              <div className="font-['Cinzel',serif] text-2xl sm:text-3xl font-bold text-gold-foil">
                CHUẨN 2K
              </div>
              <div className="text-xs font-bold text-[#E9D8B7] mt-1">
                BẰNG VINH DANH DANH DỰ
              </div>
              <div className="text-[11px] text-[#8A9BB0] mt-0.5">
                Hoa văn Trống đồng Đông Sơn
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: NARRATIVE DOSSIER & SỨ MỆNH ĐẶC PHÁI VIÊN (2-COLUMN BALANCED)
          ==================================================================== */}
      <section className="py-14 sm:py-20 px-4 relative z-10 bg-[#0A1020]/75">
        <div className="max-w-6xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left 7 Cols: Bức Thư Cơ Mật trên Giấy Dó Cổ */}
            <div className="lg:col-span-7">
              <div className="parchment-sheet p-6 sm:p-8 rounded-lg shadow-2xl relative h-full flex flex-col justify-between">
                <div className="brass-clip" />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="red-stamp text-xs">BỨC THƯ CƠ MẬT SỐ 2026</span>
                    <span className="text-xs font-mono text-[#8D3038] font-bold">VIỆN LƯU TRỮ VNR202</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold font-['Playfair_Display',serif] text-[#24160A] mb-3">
                    Sứ mệnh khôi phục cuốn "Đại Việt Biên Niên Ký Thời Đại Mới"
                  </h2>

                  <p className="text-xs sm:text-sm text-[#24160A] font-['Playfair_Display',serif] leading-relaxed text-justify mb-4">
                    "Năm 2026, kho lưu trữ thời gian phát hiện cuốn Biên niên ký ghi chép 5 bước ngoặt vận mệnh của dân tộc Việt Nam (1930, 1945, 1954, 1975, 1986) bị đứt gãy thành 5 mảnh ký ức. Là một Đặc Phái Viên được tuyển chọn, bạn có nhiệm vụ đi ngược dòng lịch sử, mở từng cặp hồ sơ tuyệt mật, giải mã các chỉ thị và sa bàn chiến lược để đưa những sự thật lịch sử trở lại ánh sáng."
                  </p>
                </div>

                <div className="border-t border-[#D5C29B] pt-4 mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-[#8D3038] font-bold">
                  <span>"Dân ta phải biết sử ta, cho tường gốc tích nước nhà Việt Nam."</span>
                  <span className="text-[#4A3A2A] font-normal italic">— Chủ tịch Hồ Chí Minh (1942)</span>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: 3 Chỉ Thị Chiến Lược Cho Đặc Phái Viên */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              <div className="dossier-card p-5 rounded-lg border border-[#D6A75C]/30 flex-1">
                <div className="flex items-center gap-2 mb-2 text-xs font-mono font-bold text-[#D6A75C]">
                  <FileText size={16} />
                  <span>CHỈ THỊ 01: KHẢO CỨU TƯ LIỆU GỐC</span>
                </div>
                <p className="text-xs text-[#8A9BB0] leading-relaxed">
                  Trực tiếp đối chiếu Cương lĩnh chính trị đầu tiên 1930, bản thảo Tuyên ngôn Độc lập 1945, chỉ thị Điện Biên Phủ 1954 và Mệnh lệnh Thống nhất 1975.
                </p>
              </div>

              <div className="dossier-card p-5 rounded-lg border border-[#D6A75C]/30 flex-1">
                <div className="flex items-center gap-2 mb-2 text-xs font-mono font-bold text-[#D6A75C]">
                  <Compass size={16} />
                  <span>CHỈ THỊ 02: GIẢI MÃ SA BÀN & DÒNG THỜI GIAN</span>
                </div>
                <p className="text-xs text-[#8A9BB0] leading-relaxed">
                  Sắp xếp chính xác trình tự lịch sử, định vị tọa độ chiến dịch trên bản đồ quân sự và dùng mộc thẩm định để phân định sự thật lịch sử.
                </p>
              </div>

              <div className="dossier-card p-5 rounded-lg border border-[#D6A75C]/30 flex-1">
                <div className="flex items-center gap-2 mb-2 text-xs font-mono font-bold text-[#D6A75C]">
                  <Feather size={16} />
                  <span>CHỈ THỊ 03: KHAI MỞ DI SẢN & BẰNG DANH DỰ</span>
                </div>
                <p className="text-xs text-[#8A9BB0] leading-relaxed">
                  Mỗi chương hoàn tất sẽ mở khóa 1 cổ vật ký ức. Hoàn thành trọn vẹn 5 chương để xuất Bằng Chứng Nhận Vinh Danh 2K mang dấu ấn Đại học FPT.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ====================================================================
          SECTION 4: 5 CỔNG THỜI GIAN LỊCH SỬ (1930 – 1986)
          ==================================================================== */}
      <section className="py-14 sm:py-20 px-4 relative z-10 border-t border-[#D6A75C]/15">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-10">
            <div className="text-xs font-mono tracking-[0.3em] uppercase text-[#D6A75C] mb-2">
              HÀNH TRÌNH 5 MỐC SON CHÓI LỌI
            </div>
            <h2 className="text-2xl sm:text-4xl font-['Cinzel',serif] font-bold text-gold-foil mb-3">
              5 CỔNG THỜI GIAN LỊCH SỬ
            </h2>
            <p className="text-xs sm:text-sm text-[#8A9BB0] max-w-xl mx-auto leading-relaxed">
              Mỗi cổng thời gian tương ứng với một chương lịch sử hào hùng cùng 3 nhiệm vụ giải mã chuyên sâu.
            </p>
          </div>

          {/* 5 Milestone Cards in Clean 5-column desktop / 2-column tablet / 1-column mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CHAPTERS.map((ch) => {
              const status = progress.chapters[ch.id]?.status ?? (ch.id === 1 ? 'unlocked' : 'locked');
              const isDone = status === 'completed';
              const isLocked = status === 'locked';

              return (
                <div
                  key={ch.id}
                  onClick={() => {
                    if (!isLocked) navigate(`/chapter/${ch.id}`);
                  }}
                  className={`dossier-card rounded-lg p-5 flex flex-col justify-between relative transition-all duration-300 min-h-[260px] ${
                    isDone
                      ? 'border-[#D6A75C] shadow-[0_0_20px_rgba(214,167,92,0.25)] hover:scale-[1.02] cursor-pointer'
                      : !isLocked
                        ? 'border-[#D6A75C]/40 hover:border-[#D6A75C] hover:scale-[1.02] cursor-pointer'
                        : 'border-[#D6A75C]/15 opacity-65 cursor-not-allowed'
                  }`}
                  style={{
                    background: `linear-gradient(145deg, ${ch.color}22 0%, #0F1726 100%)`,
                  }}
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-[#D6A75C] font-bold">CHƯƠNG 0{ch.id}</span>
                      {isDone ? (
                        <CheckCircle2 size={15} className="text-[#4ADE80]" />
                      ) : isLocked ? (
                        <Lock size={13} className="text-[#8A9BB0]" />
                      ) : (
                        <span className="text-[9px] text-[#D6A75C] font-mono font-bold px-1.5 py-0.5 rounded bg-[#D6A75C]/15 border border-[#D6A75C]/30">
                          SẴN SÀNG
                        </span>
                      )}
                    </div>

                    <div className="text-3xl mb-2">{ch.emoji}</div>
                    
                    <div className="font-['Cinzel',serif] text-xl font-bold text-[#E9D8B7] mb-0.5">
                      {ch.year}
                    </div>
                    
                    <div className="text-xs font-bold text-[#D6A75C] mb-2 leading-tight">
                      {ch.name}
                    </div>
                    
                    <p className="text-[11px] text-[#8A9BB0] leading-relaxed">
                      {ch.desc}
                    </p>
                  </div>

                  {/* Card Footer Artifact */}
                  <div className="pt-3 border-t border-[#D6A75C]/15 text-[10px] text-[#E9D8B7] flex items-center justify-between mt-4">
                    <span className="text-[#8A9BB0]">Cổ vật:</span>
                    <span className="text-[#D6A75C] font-semibold truncate ml-1">{ch.fragment}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/timeline"
              className="inline-flex items-center gap-2 text-xs font-mono text-[#D6A75C] hover:text-[#FFF2D6] transition-colors"
            >
              <span>Xem chi tiết trên Sa bàn Bản đồ thời gian</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 5: 4 TRỤ CỘT TRẢI NGHIỆM GIẢI MÃ HỌC THUẬT
          ==================================================================== */}
      <section className="py-14 sm:py-20 px-4 bg-[#0A1020]/90 border-t border-[#D6A75C]/15">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-10">
            <div className="text-xs font-mono tracking-[0.3em] uppercase text-[#D6A75C] mb-2">
              TRẢI NGHIỆM HỌC THUẬT TƯƠNG TÁC
            </div>
            <h2 className="text-2xl sm:text-4xl font-['Cinzel',serif] font-bold text-gold-foil mb-3">
              4 BƯỚC KHÁM PHÁ LỊCH SỬ
            </h2>
            <p className="text-xs sm:text-sm text-[#8A9BB0] max-w-xl mx-auto leading-relaxed">
              Vượt qua từng thử thách để chuyển hóa kiến thức giáo trình thành trải nghiệm sâu sắc.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                step: '01',
                icon: <BookOpen className="text-[#D6A75C]" size={22} />,
                title: 'Tư Liệu Gốc',
                desc: 'Đọc và đối chiếu các văn kiện Đảng, bản thảo Tuyên ngôn, bức điện mật của Đại tướng trên chất liệu giấy dó cổ.',
              },
              {
                step: '02',
                icon: <Compass className="text-[#D6A75C]" size={22} />,
                title: '5 Cơ Chế Giải Mã',
                desc: 'Sắp xếp dòng thời gian, sa bàn tác chiến quân sự, đối chiếu hồ sơ mật, kính lúp soi tư liệu và mộc thẩm định đúng/sai.',
              },
              {
                step: '03',
                icon: <Award className="text-[#D6A75C]" size={22} />,
                title: '5 Mảnh Ký Ức',
                desc: 'Thu thập 5 cổ vật thiêng liêng lưu giữ tại Viện Bảo Tàng để mở khóa nghi thức khải hoàn Biên niên ký.',
              },
              {
                step: '04',
                icon: <Shield className="text-[#D6A75C]" size={22} />,
                title: 'Bằng Vinh Danh 2K',
                desc: 'Nhận Bằng Chứng Nhận hoàn thành danh dự chuẩn in ấn 1920x1080 viền hoa văn Trống đồng Đông Sơn mang tên bạn.',
              },
            ].map(f => (
              <div
                key={f.step}
                className="dossier-card rounded-lg p-6 flex flex-col justify-between border border-[#D6A75C]/20 hover:border-[#D6A75C] transition-all min-h-[220px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-10 h-10 rounded-full bg-[#D6A75C]/15 border border-[#D6A75C]/30 flex items-center justify-center">
                      {f.icon}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#D6A75C]/60">
                      BƯỚC {f.step}
                    </span>
                  </div>
                  <h3 className="font-['Cinzel',serif] text-sm font-bold text-[#E9D8B7] mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs text-[#8A9BB0] leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 6: CAM KẾT HỌC THUẬT MÔN VNR202 – FPT UNIVERSITY
          ==================================================================== */}
      <section className="py-14 sm:py-20 px-4 bg-[#070B14] border-t border-[#D6A75C]/15">
        <div className="max-w-4xl mx-auto text-center">
          <div className="red-stamp text-xs mb-3">CHUẨN MỰC HỌC THUẬT VNR202</div>
          <h2 className="text-xl sm:text-3xl font-['Cinzel',serif] font-bold text-[#E9D8B7] mb-3">
            XÂY DỰNG DÀNH RIÊNG CHO SINH VIÊN ĐẠI HỌC FPT
          </h2>
          <p className="text-xs sm:text-sm text-[#8A9BB0] leading-relaxed mb-6 max-w-2xl mx-auto text-justify sm:text-center">
            Toàn bộ sự kiện, văn kiện và câu hỏi trong website bám sát theo khung chương trình Giáo trình Lịch sử Đảng Cộng sản Việt Nam của Bộ Giáo dục & Đào tạo. Hệ thống vận hành độc lập không cần cơ sở dữ liệu (Zero Backend), lưu giữ tiến độ an toàn trên từng trình duyệt.
          </p>

          <div className="flex flex-wrap justify-center gap-5 text-xs text-[#D6A75C] font-mono mb-8">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} /> 15 NHIỆM VỤ ĐÃ KIỂM ĐỊNH</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} /> CỐ VẤN LỊCH SỬ AI</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={13} /> XUẤT CHỨNG NHẬN 2K CHUẨN IN</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
            <button
              onClick={handleStart}
              className="btn-heritage-primary text-sm px-9 py-4 shadow-2xl flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              <span>KHAI MỞ HÀNH TRÌNH THỜI GIAN NGAY</span>
            </button>
            <Link
              to="/archive"
              className="btn-heritage-secondary text-xs px-6 py-3.5 flex items-center justify-center gap-2"
            >
              <BookOpen size={14} />
              <span>Khám Phá Thư Viện Lịch Sử</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
