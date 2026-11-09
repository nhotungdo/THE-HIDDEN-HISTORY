// ==========================================================================
// CERTIFICATE PAGE (Màn 12) – MẬT MÃ THỜI GIAN
// TRƯNG BÀY VÀ XUẤT BẰNG CHỨNG NHẬN DANH DỰ ĐỘ PHÂN GIẢI CAO 2K
// ==========================================================================

import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Award, RotateCcw, AlertCircle, Share2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { certificateCanvas } from '../services/certificateService';
import { useDialog } from '../hooks/useDialog';

export default function CertificatePage() {
  const { progress, resetGame } = useGame();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [confirmModal, setConfirmModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialogRef = useDialog(confirmModal, () => setConfirmModal(false));

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
    if (progress.isCompletedAll) {
      try {
        await document.fonts.ready;
        if (cancelled) return;
        const canvas = certificateCanvas(progress);
        setImageUrl(canvas.toDataURL('image/png'));
      } catch (err) {
        console.error(err);
        setError('Không thể khởi tạo ảnh chứng nhận. Vui lòng thử lại trên trình duyệt khác.');
      }
    }
    };
    void render();
    return () => { cancelled = true; };
  }, [progress]);

  if (!progress.isCompletedAll) {
    return <Navigate to="/timeline" replace />;
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`${progress.profile?.nickname} đã hoàn thành Mật Mã Thời Gian – VNR202 với ${progress.totalScore} điểm. ${window.location.origin}`);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch { setError('Không thể sao chép. Bạn có thể tải ảnh PNG để chia sẻ.'); }
  };

  return (
    <div className="flex-1 w-full py-8 md:py-12 px-4 text-[#E9D8B7] relative flex flex-col justify-center">
      {/* Background radial gold glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(214,167,92,0.1)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="text-xs font-mono tracking-[0.3em] uppercase text-[#D6A75C] mb-2">
            HỘI ĐỒNG LƯU TRỮ VNR202 – ĐẠI HỌC FPT
          </div>
          <h1 className="text-3xl md:text-5xl font-['Cinzel',serif] font-black text-gold-foil mb-2">
            CHỨNG NHẬN VINH DANH
          </h1>
          <p className="text-xs md:text-sm text-[#8A9BB0] max-w-lg mx-auto">
            Ghi nhận thành tích giải mã xuất sắc của bạn trong hành trình khám phá 5 mốc son lịch sử Việt Nam hiện đại.
          </p>
        </div>

        {/* Certificate Display Frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="dossier-card border-dongson rounded-lg p-3 md:p-6 mb-8 shadow-2xl relative bg-[#070B14]"
        >
          {imageUrl ? (
            <div className="rounded overflow-hidden shadow-2xl border border-[#D6A75C]/40">
              <img
                src={imageUrl}
                alt={`Chứng nhận hoàn thành của ${progress.profile?.nickname}`}
                className="w-full h-auto block"
              />
            </div>
          ) : (
            <div className="aspect-[16/9] flex items-center justify-center bg-[#0D1524] rounded text-sm text-[#8A9BB0]">
              Đang kết xuất bằng chứng nhận độ nét cao...
            </div>
          )}

          {error && (
            <div className="text-[#F87171] text-xs text-center mt-3 flex items-center justify-center gap-1">
              <AlertCircle size={14} /> {error}
            </div>
          )}
        </motion.div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          {imageUrl && (
            <a
              href={imageUrl}
              download={`Chung_Nhan_VNR202_${progress.certificateCode || 'FPT'}.png`}
              className="btn-heritage-primary text-xs py-3.5 px-8 shadow-xl"
            >
              <Download size={16} />
              <span>TẢI ẢNH CHỨNG NHẬN 2K (PNG)</span>
            </a>
          )}

          <button
            onClick={handleCopyLink}
            className="btn-heritage-secondary text-xs py-3 px-6"
          >
            <Share2 size={15} />
            <span>{copied ? 'Đã Sao Chép Liên Kết!' : 'Chia Sẻ Thành Tích'}</span>
          </button>

          <Link
            to="/collection"
            className="btn-heritage-secondary text-xs py-3 px-6"
          >
            <Award size={15} />
            <span>Xem Viện Bảo Tàng</span>
          </Link>

          <button
            onClick={() => setConfirmModal(true)}
            className="p-3 text-xs text-[#8A9BB0] hover:text-[#F87171] transition-colors flex items-center gap-1.5"
            title="Xóa hồ sơ và bắt đầu lại hành trình mới"
          >
            <RotateCcw size={14} />
            <span>Khởi Động Lại</span>
          </button>
        </div>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {confirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <motion.div
                ref={dialogRef} role="dialog" aria-modal="true" aria-label="Khởi động lại hành trình" tabIndex={-1}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="dossier-card border-dongson w-full max-w-md p-6 rounded-lg text-center"
              >
                <div className="w-12 h-12 rounded-full bg-[#8D3038]/20 text-[#8D3038] flex items-center justify-center mx-auto mb-3">
                  <AlertCircle size={24} />
                </div>
                <h3 className="font-['Cinzel',serif] text-base font-bold text-[#E9D8B7] mb-2">
                  XÁC NHẬN KHỞI ĐỘNG LẠI HÀNH TRÌNH?
                </h3>
                <p className="text-xs text-[#8A9BB0] leading-relaxed mb-6">
                  Toàn bộ tiến độ giải mã, điểm số và hồ sơ lưu trữ trên trình duyệt này sẽ được làm mới để bạn có thể bắt đầu lại từ Chương 1.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      resetGame();
                      navigate('/setup');
                    }}
                    className="btn-heritage-primary text-xs py-2.5 px-5 bg-[#8D3038] border-[#8D3038]"
                  >
                    Xóa và Bắt Đầu Lại
                  </button>
                  <button
                    onClick={() => setConfirmModal(false)}
                    className="btn-heritage-secondary text-xs py-2.5 px-5"
                  >
                    Giữ Lại Hồ Sơ
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
