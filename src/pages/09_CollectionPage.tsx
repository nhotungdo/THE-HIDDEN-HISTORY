// ==========================================================================
// COLLECTION PAGE (Màn 09) – MẬT MÃ THỜI GIAN
// PHÒNG TRƯNG BÀY BẢO TÀNG KÝ ỨC THỜI GIAN
// ==========================================================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Award, Sparkles, Lock, BookOpen, X, CheckCircle } from 'lucide-react';
import { chapters } from '../data/chapters';
import { useGame } from '../context/GameContext';
import MemoryArtifact from '../components/common/MemoryArtifact';
import { useDialog } from '../hooks/useDialog';

export default function CollectionPage() {
  const game = useGame();
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const dialogRef = useDialog(selectedChapterId !== null, () => setSelectedChapterId(null));

  const completedCount = game.getTotalCompletedChapters();
  const isAllUnlocked = completedCount === 5;

  const selectedChapter = selectedChapterId
    ? chapters.find(c => c.id === selectedChapterId)
    : null;

  return (
    <div className="flex-1 w-full py-8 md:py-12 px-4 text-[#E9D8B7] relative">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(214,167,92,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto w-full">
        
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/timeline"
            className="inline-flex items-center gap-2 min-h-10 text-sm text-[#8A9BB0] hover:text-[#D6A75C] transition-colors py-2"
          >
            <ArrowLeft size={16} />
            <span>Trở về Bản đồ thời gian</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="red-stamp text-[10px]">VIỆN BẢO TÀNG VNR202</span>
          </div>
        </div>

        {/* Page Title & Progress */}
        <div className="text-center mb-12">
          <div className="text-xs font-mono tracking-[0.3em] uppercase text-[#D6A75C] mb-2">
            KHO LƯU TRỮ CỔ VẬT LỊCH SỬ
          </div>
          <h1 className="text-3xl md:text-5xl font-['Cinzel',serif] font-black text-gold-foil mb-3">
            BỘ SƯU TẬP KÝ ỨC
          </h1>
          <p className="text-xs md:text-sm text-[#8A9BB0] max-w-xl mx-auto leading-relaxed mb-6">
            Nơi lưu giữ 5 Mảnh Ký Ức thiêng liêng tương ứng với 5 mốc son chói lọi của lịch sử Việt Nam hiện đại.
          </p>

          <div className="inline-flex items-center gap-2 bg-[#162032] border border-[#D6A75C]/30 rounded-full px-4 py-1.5 text-xs text-[#D6A75C]">
            <Award size={15} aria-hidden="true" />
            <span>Đã khôi phục: <strong className="tabular-nums">{completedCount}/5 Mảnh Ký Ức</strong></span>
          </div>

          <div
            className="progress-track max-w-xs mx-auto mt-4"
            role="progressbar"
            aria-label="Tiến độ bộ sưu tập ký ức"
            aria-valuemin={0}
            aria-valuemax={5}
            aria-valuenow={completedCount}
          >
            <div className="progress-fill" style={{ width: `${(completedCount / 5) * 100}%` }} />
          </div>
        </div>

        {completedCount === 0 && (
          <div className="dossier-card rounded-lg p-5 sm:p-6 mb-8 border-dashed text-center">
            <p className="text-xs text-[#8A9BB0] leading-relaxed mb-4">
              Viện Bảo Tàng đang trống. Hoàn thành nhiệm vụ đầu tiên để khôi phục cổ vật và mở khóa tủ trưng bày.
            </p>
            <Link to="/timeline" className="btn-heritage-secondary text-xs px-5 py-2.5">
              Mở Bản Đồ Thời Gian
            </Link>
          </div>
        )}

        {/* 5 Museum Pedestals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          {chapters.map((c, idx) => {
            const isUnlocked = game.progress.collectedFragments.includes(c.memoryFragment.id);
            const p = game.getChapterProgress(c.id);
            const isLastOdd = idx === 4;

            return (
              <motion.button
                type="button"
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                disabled={!isUnlocked}
                className={`dossier-card rounded-lg p-5 flex flex-col items-center text-center relative transition-all duration-300 w-full ${
                  isLastOdd ? 'sm:col-span-2 lg:col-span-1 sm:max-w-xs sm:mx-auto lg:max-w-none' : ''
                } ${
                  isUnlocked
                    ? 'border-[#D6A75C] shadow-[0_0_20px_rgba(214,167,92,0.2)] hover:scale-[1.03] cursor-pointer'
                    : 'border-[#D6A75C]/15 opacity-60 cursor-default'
                }`}
                onClick={() => { setRotation(0); setSelectedChapterId(c.id); }}
                aria-label={isUnlocked ? `Xem cổ vật ${c.memoryFragment.name} năm ${c.year}` : `${c.memoryFragment.name} chưa được khôi phục`}
              >
                {/* Year Badge */}
                <div className="text-[10px] font-mono text-[#D6A75C] uppercase tracking-widest mb-3">
                  NĂM {c.year}
                </div>

                {/* Pedestal & Spotlight */}
                <div className="relative my-3">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl border transition-transform ${
                      isUnlocked
                        ? 'border-[#D6A75C] bg-gradient-to-br from-[#F5CF8E]/20 to-[#9E7428]/20 animate-pulse-artifact'
                        : 'border-[#8A9BB0]/20 bg-[#0A1020]'
                    }`}
                  >
                    {isUnlocked ? <MemoryArtifact chapterId={c.id} name={c.memoryFragment.name} /> : <Lock size={24} className="text-[#8A9BB0]" />}
                  </div>
                </div>

                {/* Name */}
                <div className="font-['Cinzel',serif] text-xs font-bold text-[#E9D8B7] mb-1">
                  {c.memoryFragment.name}
                </div>

                {/* Status or Details button */}
                <div className="mt-auto pt-3 text-[11px] w-full border-t border-[#D6A75C]/15">
                  {isUnlocked ? (
                    <span className="text-[#4ADE80] font-semibold flex items-center justify-center gap-1">
                      <CheckCircle size={12} /> Đã Khôi Phục ({p?.bestScore}đ)
                    </span>
                  ) : (
                    <span className="text-[#8A9BB0]/60">Chưa khôi phục</span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Grand Finale Trigger */}
        <div className="text-center pt-4">
          {isAllUnlocked ? (
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
            >
              <Link
                to="/ending"
                className="btn-heritage-primary text-sm px-10 py-4 shadow-2xl"
              >
                <Sparkles size={16} />
                KÍCH HOẠT HỢP NHẤT ĐẠI VIỆT BIÊN NIÊN KÝ
              </Link>
              <p className="text-xs text-[#8A9BB0] mt-3">
                Cả 5 mảnh ký ức đã sẵn sàng để tái hợp nhất cuốn sách lịch sử!
              </p>
            </motion.div>
          ) : (
            <div className="text-xs text-[#8A9BB0]">
              Khôi phục đủ 5/5 mảnh ký ức để mở khóa Nghi thức Hợp nhất và nhận Chứng nhận hoàn thành VNR202.
            </div>
          )}
        </div>

        {/* Detailed Artifact Modal */}
        <AnimatePresence>
          {selectedChapter && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedChapterId(null)}
            >
              <motion.div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="artifact-title"
                tabIndex={-1}
                onClick={event => event.stopPropagation()}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="dossier-card border-dongson modal-panel w-full max-w-md p-6 rounded-lg relative text-center"
              >
                <button
                  type="button"
                  onClick={() => setSelectedChapterId(null)}
                  aria-label="Đóng cổ vật"
                  className="absolute top-3 right-3 p-2 rounded-full text-[#8A9BB0] hover:text-[#E9D8B7] hover:bg-white/5"
                >
                  <X size={18} aria-hidden="true" />
                </button>

                <div className="w-24 h-24 rounded-full bg-[#D6A75C]/15 border-2 border-[#D6A75C] flex items-center justify-center text-5xl mx-auto mb-4 animate-pulse-artifact">
                  <MemoryArtifact chapterId={selectedChapter.id} name={selectedChapter.memoryFragment.name} rotation={rotation} />
                </div>
                <div className="mb-5">
                  <div className="flex items-center justify-between text-[11px] text-[#8A9BB0] mb-1.5">
                    <label htmlFor="artifact-rotation">Xoay cổ vật minh họa</label>
                    <span className="font-mono text-[#D6A75C] tabular-nums">{rotation}°</span>
                  </div>
                  <input
                    id="artifact-rotation"
                    type="range"
                    min={-60}
                    max={60}
                    value={rotation}
                    onChange={event => setRotation(Number(event.target.value))}
                    className="block w-full accent-[#D6A75C]"
                  />
                </div>

                <div className="red-stamp text-[10px] mb-2">BẢO VẬT LỊCH SỬ</div>
                <h3 id="artifact-title" className="font-['Cinzel',serif] text-lg font-bold text-gold-foil mb-2">
                  {selectedChapter.memoryFragment.name}
                </h3>
                <p className="text-xs text-[#8A9BB0] leading-relaxed mb-4">
                  {selectedChapter.memoryFragment.description}
                </p>

                <div className="parchment-sheet p-4 rounded text-left text-xs mb-6">
                  <div className="text-[#8D3038] font-bold font-['Playfair_Display',serif] uppercase tracking-wider mb-1 flex items-center gap-1">
                    <BookOpen size={13} /> Ý Nghĩa Lịch Sử:
                  </div>
                  <p className="text-[#24160A] italic font-['Playfair_Display',serif]">
                    "{selectedChapter.memoryFragment.historicalSignificance}"
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Link
                    to={`/chapter/${selectedChapter.id}`}
                    className="btn-heritage-secondary text-xs py-2.5 px-5"
                  >
                    Khám Phá Lại Chương
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedChapterId(null)}
                    className="btn-heritage-primary text-xs py-2.5 px-5"
                  >
                    Đóng
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
