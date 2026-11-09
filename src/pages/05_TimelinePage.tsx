// ==========================================
// TIME PORTAL PAGE (Màn 05) – MẬT MÃ THỜI GIAN
// Central hub: 5 time gates
// ==========================================

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Lock, CheckCircle2, PlayCircle, ChevronRight,
  Award, BookOpen, Compass, ArrowRight,
} from 'lucide-react';
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

const STATUS_LABEL: Record<ChapterStatus, string> = {
  completed: 'HOÀN THÀNH',
  'in-progress': 'ĐANG CHƠI',
  unlocked: 'SẴN SÀNG',
  locked: 'BỊ KHÓA',
};

function StatusIcon({ status }: { status: ChapterStatus }) {
  switch (status) {
    case 'completed': return <CheckCircle2 size={16} className="text-[#4ADE80]" aria-hidden="true" />;
    case 'in-progress': return <PlayCircle size={16} className="text-[#D6A75C]" aria-hidden="true" />;
    case 'unlocked': return <ChevronRight size={16} className="text-[#D6A75C]" aria-hidden="true" />;
    default: return <Lock size={16} className="text-[#8A9BB0]" aria-hidden="true" />;
  }
}

export default function TimelinePage() {
  const navigate = useNavigate();
  const { getChapterStatus, getChapterProgress, progress, getTotalCompletedChapters } = useGame();
  const totalDone = getTotalCompletedChapters();

  const continuePortal =
    PORTALS.find(portal => getChapterStatus(portal.id) === 'in-progress') ??
    PORTALS.find(portal => getChapterStatus(portal.id) === 'unlocked') ??
    null;

  const handlePortalClick = (portalId: number) => {
    const status = getChapterStatus(portalId);
    if (status === 'locked') return;
    navigate(`/chapter/${portalId}`);
  };

  return (
    <div className="flex-1 w-full py-8 md:py-12 px-4 text-[#E9D8B7] relative">
      {/* BG */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(214,167,92,0.07)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="page-intro"
        >
          <span className="red-stamp text-[10px]">SA BÀN KHÔNG GIAN THỜI GIAN</span>
          <h1 className="text-3xl md:text-5xl font-['Cinzel',serif] font-black text-gold-foil">
            BẢN ĐỒ THỜI GIAN
          </h1>
          <p className="page-lede">
            Chọn một cổng thời gian đã mở khóa để bắt đầu giải mã. Thu thập đủ 5 mảnh ký ức để hợp nhất cuốn Biên Niên Ký.
          </p>

          {/* Progress */}
          <div className="max-w-sm w-full mt-3">
            <div className="flex justify-between text-xs text-[#8A9BB0] mb-2">
              <span>Tiến Độ Khôi Phục</span>
              <span className="text-[#D6A75C] font-semibold tabular-nums">{totalDone}/5 Mảnh Ký Ức</span>
            </div>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Tiến độ khôi phục mảnh ký ức"
              aria-valuemin={0}
              aria-valuemax={5}
              aria-valuenow={totalDone}
            >
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${(totalDone / 5) * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {continuePortal && (
            <button
              type="button"
              onClick={() => handlePortalClick(continuePortal.id)}
              className="btn-heritage-primary text-xs px-6 py-3 mt-2"
            >
              <Compass size={15} aria-hidden="true" />
              {getChapterStatus(continuePortal.id) === 'in-progress'
                ? `TIẾP TỤC CHƯƠNG 0${continuePortal.id} · ${continuePortal.year}`
                : `BẮT ĐẦU CHƯƠNG 0${continuePortal.id} · ${continuePortal.year}`}
            </button>
          )}
        </motion.div>

        {/* Timeline connector + Portals */}
        <div className="relative">
          {/* Horizontal connector line (desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D6A75C]/30 to-transparent -translate-y-1/2 z-0" aria-hidden="true" />

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
                  transition={{ delay: i * 0.1 }}
                  className={isLastOdd ? 'sm:col-span-2 sm:max-w-sm sm:mx-auto lg:max-w-none lg:col-span-1 w-full' : 'w-full'}
                >
                  <button
                    type="button"
                    onClick={() => handlePortalClick(portal.id)}
                    disabled={isLocked}
                    aria-label={`Cổng thời gian ${portal.year} – ${portal.codeName}: ${STATUS_LABEL[status]}`}
                    className={`group w-full h-full min-h-[268px] text-left rounded-lg border transition-all duration-300 overflow-hidden flex flex-col ${
                      isLocked
                        ? 'border-[#D6A75C]/10 opacity-55 cursor-not-allowed'
                        : isCompleted
                          ? 'border-[#D6A75C] shadow-[0_0_20px_rgba(214,167,92,0.3)] cursor-pointer hover:-translate-y-1'
                          : 'border-[#D6A75C]/30 hover:border-[#D6A75C] hover:shadow-[0_0_18px_rgba(214,167,92,0.2)] hover:-translate-y-1 cursor-pointer'
                    }`}
                    style={{
                      background: isLocked
                        ? '#0A1020'
                        : `linear-gradient(135deg, ${portal.primaryColor}20 0%, #0F1B2D 100%)`,
                    }}
                  >
                    {/* Top section */}
                    <div className="p-4 flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[9px] font-mono tracking-widest ${isLocked ? 'text-[#3A4A5A]' : 'text-[#D6A75C]'}`}>
                          CỔNG 0{portal.id}
                        </span>
                        <StatusIcon status={status} />
                      </div>

                      <div className={`text-3xl mb-1.5 transition-transform duration-300 ${!isLocked ? 'group-hover:scale-110' : ''}`} aria-hidden="true">
                        {isLocked ? '🔒' : portal.emoji}
                      </div>

                      <div
                        className="font-['Cinzel',serif] font-bold text-2xl leading-none"
                        style={{ color: isLocked ? '#3A4A5A' : portal.primaryColor }}
                      >
                        {portal.year}
                      </div>
                      <div className={`text-[10px] font-semibold tracking-wider mt-1.5 leading-snug ${isLocked ? 'text-[#3A4A5A]' : 'text-[#E9D8B7]'}`}>
                        {portal.codeName}
                      </div>

                      <p className={`text-[11px] leading-relaxed mt-2.5 line-clamp-3 ${isLocked ? 'text-[#3A4A5A]' : 'text-[#8A9BB0]'}`}>
                        {portal.desc}
                      </p>

                      {!isLocked && (
                        <div className="mt-3 flex items-start gap-1.5 text-[10px] text-[#E9D8B7]">
                          <Award size={12} className="text-[#D6A75C] shrink-0 mt-0.5" aria-hidden="true" />
                          <span className="text-[#8A9BB0]">Cổ vật:</span>
                          <span className="text-[#D6A75C] font-semibold leading-snug">{portal.fragment}</span>
                        </div>
                      )}
                    </div>

                    {/* Status bar */}
                    <div className={`px-3 py-2 border-t shrink-0 ${isLocked ? 'border-[#D6A75C]/10' : 'border-[#D6A75C]/15'}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[9px] font-semibold tracking-wide ${
                          isCompleted ? 'text-[#4ADE80]'
                          : status === 'in-progress' ? 'text-[#D6A75C]'
                          : status === 'unlocked' ? 'text-[#D6A75C]/80'
                          : 'text-[#3A4A5A]'
                        }`}>
                          {isLocked ? `MỞ KHÓA SAU CHƯƠNG 0${portal.id - 1}` : STATUS_LABEL[status]}
                        </span>
                        {isCompleted && chProgress && (
                          <span className="text-[#D6A75C] text-[9px] font-mono tabular-nums">{chProgress.bestScore}đ</span>
                        )}
                      </div>

                      {isCompleted && chProgress && (
                        <div
                          className="progress-track mt-1.5"
                          style={{ height: 3 }}
                          role="progressbar"
                          aria-label={`Điểm tốt nhất chương ${portal.id}`}
                          aria-valuemin={0}
                          aria-valuemax={300}
                          aria-valuenow={chProgress.bestScore}
                        >
                          <div
                            className="progress-fill"
                            style={{ width: `${Math.min(100, (chProgress.bestScore / 300) * 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-3 mt-10"
        >
          <button
            type="button"
            onClick={() => navigate('/collection')}
            className="btn-heritage-secondary text-xs px-4 py-2.5"
          >
            <Award size={14} aria-hidden="true" />
            <span>Bộ Sưu Tập Ký Ức ({progress.collectedFragments.length}/5)</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/archive')}
            className="btn-heritage-secondary text-xs px-4 py-2.5"
          >
            <BookOpen size={14} aria-hidden="true" />
            <span>Thư Viện Lịch Sử</span>
          </button>
          {totalDone === 5 && (
            <button
              type="button"
              onClick={() => navigate('/ending')}
              className="btn-heritage-primary text-xs px-5 py-3"
            >
              🏆 XEM KẾT THÚC & NHẬN CHỨNG NHẬN
            </button>
          )}
        </motion.div>

        {totalDone < 5 && (
          <p className="text-center text-[11px] text-[#8A9BB0] mt-4 flex items-center justify-center gap-1.5">
            <ArrowRight size={12} className="text-[#D6A75C]" aria-hidden="true" />
            Hoàn thành cả 3 nhiệm vụ của một chương để mở khóa cổng tiếp theo.
          </p>
        )}
      </div>
    </div>
  );
}
