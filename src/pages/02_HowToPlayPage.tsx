// ==========================================================================
// HOW TO PLAY PAGE (Màn 02) – MẬT MÃ THỜI GIAN
// BRIEFING FOR THE TIME ENVOY: FLOW, RULES & DOSSIER SETUP
// ==========================================================================

import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Search, FileText, Puzzle, Trophy, Clock,
  Lightbulb, Star, Smartphone, Sparkles, Compass, ShieldCheck,
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { hasExistingProgress } from '../utils/storage';

const STEPS = [
  {
    icon: <Search size={24} className="text-[#D6A75C]" aria-hidden="true" />,
    num: '01',
    title: 'Khám Phá',
    desc: 'Chọn một cổng thời gian đã mở khóa. Mỗi cổng là một giai đoạn lịch sử trọng đại của dân tộc.',
  },
  {
    icon: <FileText size={24} className="text-[#D6A75C]" aria-hidden="true" />,
    num: '02',
    title: 'Thu Thập Manh Mối',
    desc: 'Đọc tư liệu gốc trong Phòng Giải Mã. Mỗi trích dẫn, mỗi bức điện đều là mảnh ghép quan trọng.',
  },
  {
    icon: <Puzzle size={24} className="text-[#D6A75C]" aria-hidden="true" />,
    num: '03',
    title: 'Giải Mã',
    desc: 'Vượt qua 3 nhiệm vụ mỗi chương: sắp xếp dòng thời gian, ghép hồ sơ, soi tư liệu, thẩm định đúng/sai và sa bàn chiến dịch.',
  },
  {
    icon: <Trophy size={24} className="text-[#D6A75C]" aria-hidden="true" />,
    num: '04',
    title: 'Khôi Phục Ký Ức',
    desc: 'Nhận mảnh ký ức và điểm số. Đủ 5 mảnh sẽ hợp nhất Biên Niên Ký và mở khóa chứng nhận VNR202.',
  },
];

const RULES = [
  { icon: <Star size={16} aria-hidden="true" />, label: 'Điểm', desc: '100 điểm mỗi nhiệm vụ đúng, trừ 10 điểm mỗi gợi ý. Chế độ Thử Thách cộng 5 điểm cho mỗi 10 giây còn lại.' },
  { icon: <Lightbulb size={16} aria-hidden="true" />, label: 'Gợi ý', desc: 'Cố vấn lịch sử mở tối đa 2 mức gợi ý, mỗi mức trừ 10 điểm và không thể hoàn tác.' },
  { icon: <Clock size={16} aria-hidden="true" />, label: 'Thời gian', desc: 'Chế độ Khám Phá không giới hạn. Chế độ Thử Thách đếm ngược 180 giây cho mỗi nhiệm vụ.' },
  { icon: <Smartphone size={16} aria-hidden="true" />, label: 'Thiết bị', desc: 'Trên điện thoại, dùng nút mũi tên và chạm chọn thay cho kéo thả. Mọi màn hình đều dùng được bàn phím.' },
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
        {/* Breadcrumb */}
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <Link
            to="/"
            className="inline-flex items-center gap-2 min-h-10 text-sm text-[#8A9BB0] hover:text-[#D6A75C] transition-colors rounded px-1 py-2"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Về trang chủ</span>
          </Link>
          <span className="red-stamp text-[10px]">SỔ TAY ĐẶC PHÁI VIÊN</span>
        </div>

        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-intro"
        >
          <span className="eyebrow">Nhập môn Đặc Phái Viên</span>
          <h1 className="text-3xl md:text-5xl font-['Cinzel',serif] font-black text-gold-foil">
            HƯỚNG DẪN HÀNH TRÌNH
          </h1>
          <p className="page-lede">
            Bốn bước để đi từ kho lưu trữ năm 2026 ngược về 5 thời khắc quyết định của dân tộc. Không cần đăng nhập, không cần cài đặt gì thêm.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-1">
            <span className="chip"><FileText size={12} aria-hidden="true" /> 15 hồ sơ mật</span>
            <span className="chip"><Puzzle size={12} aria-hidden="true" /> 5 cơ chế giải mã</span>
            <span className="chip"><Clock size={12} aria-hidden="true" /> 20–30 phút</span>
          </div>
        </motion.div>

        {/* Primary actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
        >
          <button type="button" onClick={handleStart} className="btn-heritage-primary w-full sm:w-auto text-sm px-8 py-3.5">
            <Sparkles size={16} aria-hidden="true" />
            {hasProfile ? `TIẾP TỤC HÀNH TRÌNH (${completedCount}/5)` : 'TẠO HỒ SƠ & BẮT ĐẦU'}
          </button>
          {hasProfile && (
            <Link to="/timeline" className="btn-heritage-secondary w-full sm:w-auto text-xs px-6 py-3.5">
              <Compass size={15} aria-hidden="true" />
              Mở bản đồ thời gian
            </Link>
          )}
        </motion.div>

        {/* 4 Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-dark-card p-5 flex gap-4 hover:border-[#D6A75C]/45 transition-colors"
            >
              <div className="shrink-0">
                <div className="w-12 h-12 rounded-full bg-[#D6A75C]/10 border border-[#D6A75C]/30 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>
              <div>
                <div className="text-[#D6A75C]/60 text-[10px] font-mono tracking-widest mb-1">BƯỚC {step.num}</div>
                <h2 className="text-[#E9D8B7] font-['Cinzel',serif] font-semibold text-sm mb-1.5 tracking-wide">{step.title}</h2>
                <p className="text-[#8A9BB0] text-xs leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rules */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          aria-labelledby="rules-heading"
          className="dossier-card rounded-lg p-5 sm:p-6 mb-8"
        >
          <h2 id="rules-heading" className="font-['Cinzel',serif] text-[#D6A75C] text-base mb-5 text-center tracking-wide">
            QUY TẮC PHÒNG GIẢI MÃ
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {RULES.map(r => (
              <div key={r.label} className="flex gap-3 items-start bg-[#0A1020]/50 border border-[#D6A75C]/12 rounded-md p-3">
                <div className="w-7 h-7 rounded bg-[#D6A75C]/15 flex items-center justify-center shrink-0 text-[#D6A75C] mt-0.5">
                  {r.icon}
                </div>
                <div>
                  <span className="text-[#E9D8B7] font-semibold text-xs">{r.label}: </span>
                  <span className="text-[#8A9BB0] text-xs leading-relaxed">{r.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Lore document */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="historical-document mb-10 relative overflow-hidden"
        >
          <p className="text-sm leading-relaxed italic">
            <strong>Nhiệm vụ của bạn:</strong> Kho lưu trữ thời gian cần một Đặc Phái Viên khôi phục cuốn{' '}
            <strong>"Đại Việt Biên Niên Ký Thời Đại Mới"</strong> đã vỡ thành 5 mảnh ký ức. Hành trình đưa bạn qua
            những trang sử bi tráng nhất của dân tộc — từ ngày Đảng ra đời năm 1930 đến công cuộc Đổi Mới năm 1986.
            Mỗi mảnh ký ức được khôi phục là một dấu son lịch sử được thắp sáng lại.
          </p>
          <div className="text-right mt-3 text-xs text-[#8D3038] font-semibold">
            — Hồ Sơ Nhiệm Vụ Thời Gian #VNR202 —
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <button type="button" onClick={handleStart} className="btn-heritage-primary w-full sm:w-auto text-sm px-10 py-4">
            <ShieldCheck size={16} aria-hidden="true" />
            {hasProfile ? 'QUAY LẠI BẢN ĐỒ THỜI GIAN' : 'TÔI ĐÃ SẴN SÀNG – TẠO HỒ SƠ'}
          </button>
          <p className="text-[#8A9BB0] text-xs mt-4">
            Hồ sơ được lưu ngay trên trình duyệt này, không cần tài khoản.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
