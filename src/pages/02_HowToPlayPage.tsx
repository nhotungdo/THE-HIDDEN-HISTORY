// ==========================================================================
// HOW TO PLAY PAGE (Màn 02) – MẬT MÃ THỜI GIAN
// SỔ TAY ĐẶC PHÁI VIÊN: QUY TẮC, CƠ CHẾ & HƯỚNG DẪN HÀNH TRÌNH
// ==========================================================================

import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Search, FileText, Puzzle, Trophy, Clock,
  Lightbulb, Star, Smartphone, Sparkles, ShieldCheck,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { hasExistingProgress } from '../utils/storage';

const STEPS = [
  {
    icon: <Search size={22} className="text-[#D6A75C]" aria-hidden="true" />,
    num: '01',
    title: 'Khám Phá Cổng Thời Gian',
    desc: 'Chọn một cổng lịch sử đã mở khóa trên sa bàn (1930 – 1986). Mỗi mốc son mở ra 3 nhiệm vụ giải mã theo thứ tự thời đại.',
  },
  {
    icon: <FileText size={22} className="text-[#D6A75C]" aria-hidden="true" />,
    num: '02',
    title: 'Khảo Cứu Tư Liệu Gốc',
    desc: 'Đọc kỹ các đoạn trích Cương lĩnh, Tuyên ngôn Độc lập, chỉ thị chiến dịch và nhật ký lịch sử trên chất liệu giấy dó cổ.',
  },
  {
    icon: <Puzzle size={22} className="text-[#D6A75C]" aria-hidden="true" />,
    num: '03',
    title: 'Giải Mã 5 Kiểu Mini-Game',
    desc: 'Vượt qua thử thách: sắp xếp timeline (↑/↓), ghép cặp hồ sơ, thẩm định mộc đỏ đúng/sai, soi mật mã và sa bàn chiến lược.',
  },
  {
    icon: <Trophy size={22} className="text-[#D6A75C]" aria-hidden="true" />,
    num: '04',
    title: 'Khôi Phục & Nhận Bằng 2K',
    desc: 'Mỗi chương hoàn tất sẽ mở khóa 1 cổ vật ký ức. Thu thập đủ 5 cổ vật để hợp nhất Biên niên ký và nhận Bằng vinh danh.',
  },
];

const RULES = [
  { 
    icon: <Star size={16} aria-hidden="true" />, 
    label: 'Cách Tính Điểm', 
    desc: '100 điểm/nhiệm vụ giải đúng. Chế độ Thử Thách cộng thêm +5 điểm cho mỗi 10 giây còn lại khi hoàn thành.' 
  },
  { 
    icon: <Lightbulb size={16} aria-hidden="true" />, 
    label: 'Quy Tắc Gợi Ý AI', 
    desc: 'Mỗi nhiệm vụ có tối đa 2 mức gợi ý từ Cố vấn lịch sử. Mỗi lần mở trừ 10 điểm và không thể hoàn tác.' 
  },
  { 
    icon: <Clock size={16} aria-hidden="true" />, 
    label: 'Chế Độ Trải Nghiệm', 
    desc: 'Chế độ Khám Phá không giới hạn thời gian. Chế độ Thử Thách đếm ngược 180 giây/nhiệm vụ để tăng tính kịch tính.' 
  },
  { 
    icon: <Smartphone size={16} aria-hidden="true" />, 
    label: 'Thiết Bị & Trợ Năng', 
    desc: 'Tối ưu 100% cho điện thoại, máy tính bảng và máy tính. Hỗ trợ thao tác chạm, chuột và phím bấm trợ năng.' 
  },
];

export default function HowToPlayPage() {
  const navigate = useNavigate();
  const { getTotalCompletedChapters } = useGame();
  const hasProfile = hasExistingProgress();
  const completedCount = getTotalCompletedChapters();

  const handleStart = () => {
    navigate(hasProfile ? '/timeline' : '/setup');
  };

  return (
    <div className="flex-1 w-full px-4 py-8 md:py-12 relative text-[#E9D8B7]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(214,167,92,0.07)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <Link
            to="/"
            className="inline-flex items-center gap-2 min-h-10 text-sm text-[#8A9BB0] hover:text-[#D6A75C] transition-colors rounded px-1 py-2"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Về trang chủ</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="red-stamp text-[10px]">SỔ TAY ĐẶC PHÁI VIÊN · VNR202</span>
          </div>
        </div>

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-intro mb-10"
        >
          <span className="eyebrow">Cẩm Nang Nhập Môn</span>
          <h1 className="text-3xl md:text-5xl font-['Cinzel',serif] font-black text-gold-foil">
            HƯỚNG DẪN HÀNH TRÌNH
          </h1>
          <p className="page-lede">
            Bốn bước để đi từ kho lưu trữ năm 2026 ngược về 5 thời khắc quyết định của dân tộc. Không cần tài khoản, lưu tự động trên trình duyệt.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <span className="chip"><FileText size={12} aria-hidden="true" /> 15 hồ sơ mật</span>
            <span className="chip"><Puzzle size={12} aria-hidden="true" /> 5 cơ chế giải mã</span>
            <span className="chip"><Clock size={12} aria-hidden="true" /> 20–30 phút hoàn thành</span>
          </div>
        </motion.div>

        {/* ================================================================
            SECTION 1: 4 BƯỚC KHÁM PHÁ (THE 4-STEP PROGRESSION)
            ================================================================ */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#D6A75C]">
              TIẾN TRÌNH GIẢI MÃ
            </div>
            <h2 className="text-xl sm:text-2xl font-['Cinzel',serif] font-bold text-[#E9D8B7] mt-1">
              4 BƯỚC KHÔI PHỤC KÝ ỨC
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="dossier-card rounded-lg p-5 flex flex-col justify-between border border-[#D6A75C]/25 hover:border-[#D6A75C] transition-all min-h-[220px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-10 h-10 rounded-full bg-[#D6A75C]/15 border border-[#D6A75C]/35 flex items-center justify-center">
                      {step.icon}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#D6A75C]/70">
                      BƯỚC {step.num}
                    </span>
                  </div>
                  <h3 className="text-sm font-['Cinzel',serif] font-bold text-[#E9D8B7] mb-2 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#8A9BB0] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#D6A75C]/15 flex items-center justify-end text-[10px] text-[#D6A75C]/60 font-mono">
                  <span>Giai đoạn {step.num}/04</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================================================================
            SECTION 2: QUY TẮC PHÒNG GIẢI MÃ (RULES MATRIX)
            ================================================================ */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          aria-labelledby="rules-heading"
          className="dossier-card rounded-lg p-6 sm:p-8 mb-10 border border-[#D6A75C]/30"
        >
          <div className="text-center mb-6">
            <span className="red-stamp text-[10px] mb-2">QUY CHẾ PHÒNG GIẢI MÃ</span>
            <h2 id="rules-heading" className="font-['Cinzel',serif] text-gold-foil text-lg sm:text-xl font-bold tracking-wide mt-1">
              LUẬT CHƠI & ĐIỀU LỆ HỌC THUẬT
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RULES.map(r => (
              <div 
                key={r.label} 
                className="flex gap-3.5 items-start bg-[#0A1020]/60 border border-[#D6A75C]/15 rounded-md p-4 hover:border-[#D6A75C]/30 transition-colors"
              >
                <div className="w-8 h-8 rounded bg-[#D6A75C]/15 border border-[#D6A75C]/30 flex items-center justify-center shrink-0 text-[#D6A75C] mt-0.5">
                  {r.icon}
                </div>
                <div>
                  <div className="text-[#E9D8B7] font-semibold text-xs mb-1">
                    {r.label}
                  </div>
                  <div className="text-[#8A9BB0] text-xs leading-relaxed">
                    {r.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ================================================================
            SECTION 3: HỒ SƠ NHIỆM VỤ (LORE PARCHMENT DOCUMENT)
            ================================================================ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="parchment-sheet p-6 sm:p-8 rounded-lg shadow-2xl relative mb-10"
        >
          <div className="brass-clip" />
          
          <div className="flex items-center justify-between mb-3">
            <span className="red-stamp text-[9px]">LỜI DẶN ĐẶC PHÁI VIÊN</span>
            <span className="text-[10px] font-mono font-bold text-[#8D3038]">
              VIỆN LƯU TRỮ THỜI GIAN
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#24160A] font-['Playfair_Display',serif] leading-relaxed italic text-justify mb-4">
            "Cuốn <strong>'Đại Việt Biên Niên Ký Thời Đại Mới'</strong> là kho báu tri thức ghi chép 5 bước ngoặt lịch sử dân tộc. Hãy quan sát từng bức điện tín, đọc kỹ từng dòng văn kiện và suy ngẫm trước khi xác nhận đáp án. Sự kiên trì và lòng say mê lịch sử sẽ dẫn lối cho bạn tới chiến thắng khải hoàn."
          </p>

          <div className="border-t border-[#D5C29B] pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-[#8D3038] font-bold">
            <span>Hồ Sơ Nhiệm Vụ Khảo Sát #VNR202</span>
            <span className="text-[#4A3A2A] font-normal italic">— Hội Đồng Lưu Trữ (2026)</span>
          </div>
        </motion.div>

        {/* ================================================================
            SECTION 4: SINGLE CONFIDENT CALL TO ACTION
            ================================================================ */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center bg-[#0B111E]/80 border border-[#D6A75C]/20 rounded-xl p-8 max-w-2xl mx-auto shadow-2xl"
        >
          <h3 className="font-['Cinzel',serif] text-lg sm:text-xl font-bold text-[#E9D8B7] mb-2">
            {hasProfile ? 'SẴN SÀNG TIẾP TỤC HÀNH TRÌNH?' : 'BẠN ĐÃ SẴN SÀNG NHẬN NHIỆM VỤ?'}
          </h3>
          <p className="text-xs text-[#8A9BB0] mb-6 max-w-md mx-auto leading-relaxed">
            {hasProfile
              ? `Hồ sơ của bạn đã hoàn thành ${completedCount}/5 chương lịch sử. Tiếp tục mở khóa các mốc son tiếp theo!`
              : 'Khởi tạo biệt danh và chọn nhân vật đại diện để chính thức gia nhập đội ngũ Đặc Phái Viên.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center">
            <button
              type="button"
              onClick={handleStart}
              className="btn-heritage-primary w-full sm:w-auto text-sm px-10 py-4 shadow-2xl flex items-center justify-center gap-2"
            >
              <Sparkles size={16} aria-hidden="true" />
              <span>{hasProfile ? `TIẾP TỤC HÀNH TRÌNH (${completedCount}/5)` : 'TÔI ĐÃ HIỂU – KHỞI TẠO HỒ SƠ'}</span>
            </button>
            <Link
              to="/"
              className="btn-heritage-secondary w-full sm:w-auto text-xs px-6 py-3.5 flex items-center justify-center gap-2"
            >
              <span>Về Trang Chủ</span>
            </Link>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-[#8A9BB0]">
            <ShieldCheck size={13} className="text-[#D6A75C]" />
            <span>Lưu tự động trên thiết bị · Không cần đăng ký tài khoản</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
