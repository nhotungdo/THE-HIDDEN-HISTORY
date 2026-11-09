// ==========================================
// TIME PORTAL PAGE (Màn 05) – MẬT MÃ THỜI GIAN
// Central hub: 5 time gates
// ==========================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CheckCircle2, PlayCircle, ChevronRight, Award, BookOpen } from 'lucide-react';
import { useGame } from '../context/GameContext';
import type { ChapterStatus } from '../types/game';

const PORTALS = [
  {
    id: 1,
    year: 1930,
    codeName: 'KHỞI NGUỒN',
    desc: 'Sự ra đời của Đảng Cộng sản Việt Nam – Hội nghị hợp nhất tại Hồng Kông ngày 3/2/1930.',
    emoji: '🔑',
    primaryColor: '#8D3038',
    fragment: 'Ấn Vàng Khởi Nguồn',
  },
  {
    id: 2,
    year: 1945,
    codeName: 'MÙA THU ĐỘC LẬP',
    desc: 'Cách mạng Tháng Tám và sự ra đời của nước Việt Nam Dân chủ Cộng hòa ngày 2/9/1945.',
    emoji: '📜',
    primaryColor: '#D6A75C',
    fragment: 'Bản Thảo Độc Lập',
  },
  {
    id: 3,
    year: 1954,
    codeName: 'ĐƯỜNG ĐẾN ĐIỆN BIÊN',
    desc: 'Chiến thắng Điện Biên Phủ ngày 7/5/1954 – Mốc son chói lọi trong lịch sử nhân loại.',
    emoji: '🚩',
    primaryColor: '#4A7C59',
    fragment: 'Ngọn Cờ Quyết Thắng',
  },
  {
    id: 4,
    year: 1975,
    codeName: 'THỐNG NHẤT',
    desc: 'Đại thắng mùa Xuân 1975 – Non sông thu về một mối sau 21 năm chia cắt.',
    emoji: '⭐',
    primaryColor: '#2D5A8E',
    fragment: 'Ngôi Sao Thống Nhất',
  },
  {
    id: 5,
    year: 1986,
    codeName: 'BƯỚC NGOẶT ĐỔI MỚI',
    desc: 'Đại hội VI – Chính sách Đổi Mới toàn diện đưa Việt Nam bước vào kỷ nguyên hội nhập.',
    emoji: '⚙️',
    primaryColor: '#6B8E23',
    fragment: 'Bánh Răng Đổi Mới',
  },
];

function StatusIcon({ status }: { status: ChapterStatus }) {
  switch (status) {
    case 'completed':  return <CheckCircle2 size={16} className="text-[#4ADE80]" />;
    case 'in-progress': return <PlayCircle size={16} className="text-[#D6A75C]" />;
    case 'unlocked':  return <ChevronRight size={16} className="text-[#D6A75C]" />;
    default:           return <Lock size={16} className="text-[#8A9BB0]" />;
  }
}

export default function TimelinePage() {
  const navigate = useNavigate();
  const { getChapterStatus, getChapterProgress, progress, getTotalCompletedChapters } = useGame();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const totalDone = getTotalCompletedChapters();

  const handlePortalClick = (portalId: number) => {
    const status = getChapterStatus(portalId);
    if (status === 'locked') return;
    navigate(`/chapter/${portalId}`);
  };

  return (
    <div className="flex-1 w-full py-8 md:py-12 px-4 text-[#E9D8B7] relative overflow-hidden">
      {/* BG */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(214,167,92,0.07)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="red-stamp text-[10px] mb-2">SA BÀN KHÔNG GIAN THỜI GIAN</div>
          <h1 className="font-['Cinzel',serif] text-3xl md:text-5xl font-black text-gold-foil mb-2">
            BẢN ĐỒ THỜI GIAN
          </h1>
          <p className="text-[#8A9BB0] text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Chọn một cổng thời gian đã được mở khóa để bắt đầu giải mã. Thu thập đủ 5 mảnh ký ức để hợp nhất cuốn Biên Niên Ký.
          </p>

          {/* Progress bar */}
          <div className="max-w-xs mx-auto mt-6">
            <div className="flex justify-between text-xs text-[#8A9BB0] mb-2">
              <span>Tiến Độ Khôi Phục</span>
              <span className="text-[#D6A75C] font-semibold">{totalDone}/5 Mảnh Ký Ức</span>
            </div>
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(totalDone / 5) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Timeline connector + Portals */}
        <div className="relative">
          {/* Horizontal connector line (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D6A75C]/30 to-transparent -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
            {PORTALS.map((portal, i) => {
              const status = getChapterStatus(portal.id);
              const chProgress = getChapterProgress(portal.id);
              const isLocked = status === 'locked';
              const isCompleted = status === 'completed';
              const isLastOdd = i === 4;

              return (
                <motion.div
                  key={portal.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12 }}
                  className={`relative ${isLastOdd ? 'sm:col-span-2 lg:col-span-1 sm:max-w-sm sm:mx-auto lg:max-w-none w-full' : ''}`}
                  onMouseEnter={() => setHoveredId(portal.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <button
                    onClick={() => handlePortalClick(portal.id)}
                    disabled={isLocked}
                    className={`w-full text-left rounded-lg border transition-all duration-300 overflow-hidden ${
                      isLocked
                        ? 'border-[#D6A75C]/10 opacity-50 cursor-not-allowed'
                        : isCompleted
                          ? 'border-[#D6A75C] shadow-[0_0_20px_rgba(214,167,92,0.3)] cursor-pointer'
                          : 'border-[#D6A75C]/30 hover:border-[#D6A75C] hover:shadow-[0_0_15px_rgba(214,167,92,0.2)] cursor-pointer'
                    }`}
                    style={{
                      background: isLocked
                        ? '#0A1020'
                        : `linear-gradient(135deg, ${portal.primaryColor}20 0%, #0F1B2D 100%)`,
                    }}
                  >
                    {/* Top section */}
                    <div className="p-4 text-center">
                      <div className={`text-4xl mb-2 transition-transform duration-300 ${hoveredId === portal.id && !isLocked ? 'scale-110' : ''}`}>
                        {isLocked ? '🔒' : portal.emoji}
                      </div>
                      <div
                        className="font-['Cinzel',serif] font-bold text-xl"
                        style={{ color: isLocked ? '#3A4A5A' : portal.primaryColor }}
                      >
                        {portal.year}
                      </div>
                      <div className={`text-[10px] font-semibold tracking-wider mt-1 ${isLocked ? 'text-[#3A4A5A]' : 'text-[#E9D8B7]'}`}>
                        {portal.codeName}
                      </div>
                    </div>

                    {/* Status bar */}
                    <div className={`px-3 py-2 border-t ${isLocked ? 'border-[#D6A75C]/05' : 'border-[#D6A75C]/15'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <StatusIcon status={status} />
                          <span className={`text-[9px] font-semibold tracking-wide ${
                            isCompleted ? 'text-[#4ADE80]'
                            : status === 'in-progress' ? 'text-[#D6A75C]'
                            : status === 'unlocked' ? 'text-[#D6A75C]/80'
                            : 'text-[#3A4A5A]'
                          }`}>
                            {isCompleted ? 'HOÀN THÀNH'
                              : status === 'in-progress' ? 'ĐANG CHƠI'
                              : status === 'unlocked' ? 'SẴN SÀNG'
                              : 'BỊ KHÓA'}
                          </span>
                        </div>
                        {isCompleted && chProgress && (
                          <span className="text-[#D6A75C] text-[9px] font-mono">
                            {chProgress.bestScore}đ
                          </span>
                        )}
                      </div>

                      {/* Score bar for completed */}
                      {isCompleted && chProgress && (
                        <div className="progress-track mt-1.5" style={{ height: 3 }}>
                          <div
                            className="progress-fill"
                            style={{ width: `${Math.min(100, (chProgress.bestScore / 300) * 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Tooltip on hover */}
                  <AnimatePresence>
                    {hoveredId === portal.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#162032] border border-[#D6A75C]/30 rounded p-3 shadow-xl z-20 pointer-events-none"
                      >
                        <div className="text-[#D6A75C] text-xs font-['Cinzel',serif] font-bold mb-1">{portal.year} – {portal.codeName}</div>
                        <p className="text-[#8A9BB0] text-[10px] leading-relaxed">{portal.desc}</p>
                        {!isLocked && (
                          <div className="mt-2 text-[#E9D8B7] text-[9px]">
                            🏆 Phần thưởng: <span className="text-[#D6A75C]">{portal.fragment}</span>
                          </div>
                        )}
                        {isLocked && (
                          <div className="mt-2 text-[#8A9BB0] text-[9px]">
                            🔒 Hoàn thành chương {portal.id - 1} để mở khóa.
                          </div>
                        )}
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#D6A75C]/30" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-3 mt-10"
        >
          <button
            onClick={() => navigate('/collection')}
            className="btn-heritage-secondary text-xs px-4 py-2.5 flex items-center gap-2"
          >
            <Award size={14} />
            <span>Bộ Sưu Tập Ký Ức ({progress.collectedFragments.length}/5)</span>
          </button>
          <button
            onClick={() => navigate('/archive')}
            className="btn-heritage-secondary text-xs px-4 py-2.5 flex items-center gap-2"
          >
            <BookOpen size={14} />
            <span>Thư Viện Lịch Sử</span>
          </button>
          {totalDone === 5 && (
            <button
              onClick={() => navigate('/ending')}
              className="btn-heritage-primary text-xs px-5 py-2.5 shadow-xl"
            >
              🏆 XEM KẾT THÚC & NHẬN CHỨNG NHẬN
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

