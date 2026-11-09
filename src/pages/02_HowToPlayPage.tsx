// ==========================================
// HOW TO PLAY PAGE (Màn 02) – MẬT MÃ THỜI GIAN
// ==========================================

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, FileText, Puzzle, Trophy, Clock, Lightbulb, Star, Smartphone } from 'lucide-react';

const STEPS = [
  {
    icon: <Search size={28} className="text-[#D6A75C]" />,
    num: '01',
    title: 'Khám Phá',
    desc: 'Chọn cổng thời gian đã được mở khóa. Mỗi cổng là một giai đoạn lịch sử trọng đại của dân tộc.',
  },
  {
    icon: <FileText size={28} className="text-[#D6A75C]" />,
    num: '02',
    title: 'Thu Thập Manh Mối',
    desc: 'Đọc tài liệu lịch sử được cung cấp trong Phòng Giải Mã. Mỗi tư liệu là mảnh ghép quan trọng.',
  },
  {
    icon: <Puzzle size={28} className="text-[#D6A75C]" />,
    num: '03',
    title: 'Giải Mã',
    desc: 'Vượt qua 3 nhiệm vụ của mỗi chương: sắp xếp dòng thời gian, ghép hồ sơ, phân tích tư liệu và bản đồ chiến dịch.',
  },
  {
    icon: <Trophy size={28} className="text-[#D6A75C]" />,
    num: '04',
    title: 'Nhận Phần Thưởng',
    desc: 'Thu thập Mảnh Ký Ức và điểm số. Đủ 5 mảnh sẽ hợp nhất Biên Niên Ký và nhận Chứng Nhận VNR202.',
  },
];

const RULES = [
  { icon: <Star size={16} />, label: 'Điểm', desc: '100 điểm mỗi nhiệm vụ đúng, trừ 10 điểm/gợi ý. Thử thách thưởng 5 điểm mỗi 10 giây còn lại.' },
  { icon: <Lightbulb size={16} />, label: 'Gợi ý', desc: 'Cố vấn dùng gợi ý biên soạn sẵn: tối đa 2 mức, trừ 10 điểm/mức.' },
  { icon: <Clock size={16} />, label: 'Thời gian', desc: 'Chế độ Khám Phá không giới hạn. Chế độ Thử Thách đếm ngược 180 giây/nhiệm vụ.' },
  { icon: <Smartphone size={16} />, label: 'Mobile', desc: 'Trên điện thoại: nhấn chọn thay vì kéo thả. Giao diện tự điều chỉnh theo màn hình.' },
];

export default function HowToPlayPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#101827] pt-20 pb-16 px-4">
      {/* BG gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(214,167,92,0.06)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <div className="text-[#D6A75C]/60 text-xs tracking-[0.4em] uppercase mb-3">Nhập Môn Đặc Phái Viên</div>
          <h1 className="font-['Cinzel',serif] text-3xl md:text-4xl text-[#E9D8B7] mb-3">
            HƯỚNG DẪN HÀNH TRÌNH
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D6A75C] to-transparent mx-auto" />
        </motion.div>

        {/* 4 Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              className="bg-dark-card rounded-lg p-6 flex gap-4 hover:border-[#D6A75C]/40 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#D6A75C]/10 border border-[#D6A75C]/30 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>
              <div>
                <div className="text-[#D6A75C]/50 text-xs font-mono mb-0.5">BƯỚC {step.num}</div>
                <h3 className="text-[#E9D8B7] font-['Cinzel',serif] font-semibold text-sm mb-2 tracking-wide">{step.title}</h3>
                <p className="text-[#8A9BB0] text-xs leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#0A1020] border border-[#D6A75C]/20 rounded-lg p-6 mb-8"
        >
          <h2 className="font-['Cinzel',serif] text-[#D6A75C] text-lg mb-5 text-center tracking-wide">
            QUY TẮC PHÒNG GIẢI MÃ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RULES.map((r, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded bg-[#D6A75C]/15 flex items-center justify-center flex-shrink-0 text-[#D6A75C] mt-0.5">
                  {r.icon}
                </div>
                <div>
                  <span className="text-[#E9D8B7] font-semibold text-sm">{r.label}: </span>
                  <span className="text-[#8A9BB0] text-xs">{r.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Lore box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="historical-document rounded mb-10 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-[#8D3038]" />
          <p className="text-sm leading-relaxed italic pl-4">
            <strong>Nhiệm vụ của bạn:</strong> Kho lưu trữ thời gian đang cần một Đặc Phái Viên dũng cảm để khôi phục cuốn{' '}
            <strong>"Đại Việt Biên Niên Ký Thời Đại Mới"</strong> bị chia thành 5 mảnh ký ức. Hành trình sẽ dẫn bạn qua
            những trang sử bi tráng nhất của dân tộc – từ ngày Đảng ra đời năm 1930 đến công cuộc Đổi Mới năm 1986.
            Mỗi mảnh ký ức bạn khôi phục là một dấu son lịch sử được thắp sáng lại.
          </p>
          <div className="text-right mt-3 text-xs text-[#8D3038] font-semibold pl-4">
            — Hồ Sơ Nhiệm Vụ Thời Gian #VNR202 —
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <button
            onClick={() => navigate('/setup')}
            className="btn-primary text-base px-12 py-4"
          >
            🕵️ TÔI ĐÃ SẴN SÀNG – TẠO HỒ SƠ
          </button>
          <p className="text-[#8A9BB0] text-xs mt-4">
            Nhấn để thiết lập hồ sơ Đặc Phái Viên và bắt đầu hành trình
          </p>
        </motion.div>
      </div>
    </div>
  );
}

