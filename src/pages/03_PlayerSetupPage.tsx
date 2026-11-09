// ==========================================================================
// PLAYER SETUP PAGE (Màn 03) – MẬT MÃ THỜI GIAN
// BALANCED 2-COLUMN ARCHIVIST DOSSIER INITIALIZATION
// ==========================================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Shield, Sparkles, User, Award } from 'lucide-react';
import type { GameMode, PlayerProfile } from '../types/game';
import { useGame } from '../context/GameContext';

const AVATARS = [
  { id: 'student', emoji: '🎓', label: 'Sinh Viên FPT' },
  { id: 'detective', emoji: '🕵️', label: 'Thám Tử Thời Gian' },
  { id: 'historian', emoji: '🧑‍🏫', label: 'Nhà Sử Học' },
  { id: 'soldier', emoji: '💂', label: 'Chiến Sĩ Giải Phóng' },
  { id: 'librarian', emoji: '👩‍💼', label: 'Nữ Liên Lạc Viên' },
  { id: 'engineer', emoji: '👨‍💻', label: 'Kỹ Sư Đổi Mới' },
  { id: 'professor', emoji: '👴', label: 'Giáo Sư Cổ Văn' },
  { id: 'journalist', emoji: '📰', label: 'Nhà Báo Cách Mạng' },
];

const MODES: { id: GameMode; icon: string; name: string; desc: string }[] = [
  {
    id: 'exploration',
    icon: '🌿',
    name: 'Chế Độ Khám Phá',
    desc: 'Thong thả đọc tư liệu, không giới hạn thời gian. Phù hợp để ôn tập và khám phá sâu lịch sử.',
  },
  {
    id: 'challenge',
    icon: '⚡',
    name: 'Chế Độ Thử Thách',
    desc: 'Giới hạn 180 giây mỗi nhiệm vụ. Thưởng điểm tốc độ. Dành cho người muốn thử thách phản xạ.',
  },
];

export default function PlayerSetupPage() {
  const navigate = useNavigate();
  const { createProfile, progress } = useGame();
  const [nickname, setNickname] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('student');
  const [gameMode, setGameMode] = useState<GameMode>('exploration');
  const [error, setError] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const validate = (): boolean => {
    if (nickname.trim().length < 2) {
      setError('Biệt danh phải có ít nhất 2 ký tự.');
      return false;
    }
    if (nickname.trim().length > 20) {
      setError('Biệt danh không được vượt quá 20 ký tự.');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    setError('');
    if (!validate()) return;
    if (progress.profile && !window.confirm('Tạo hồ sơ mới sẽ thay thế tiến độ hiện tại. Tiếp tục?')) {
      return;
    }
    setIsConfirming(true);

    const profile: PlayerProfile = {
      nickname: nickname.trim(),
      avatarId: selectedAvatar,
      gameMode,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      createProfile(profile);
      navigate('/story');
    }, 1200);
  };

  const selectedAvatarData = AVATARS.find(a => a.id === selectedAvatar)!;

  return (
    <div className="flex-1 w-full py-8 md:py-12 px-4 relative flex flex-col justify-center text-[#E9D8B7]">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(214,167,92,0.06)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        
        {/* Header Title */}
        <div className="text-center mb-8">
          <div className="red-stamp text-[10px] mb-2">HỒ SƠ KHẢO SÁT VNR202</div>
          <h1 id="setup-heading" className="text-3xl md:text-5xl font-['Cinzel',serif] font-black text-gold-foil mb-2">
            THIẾT LẬP ĐẶC PHÁI VIÊN
          </h1>
          <p className="text-xs sm:text-sm text-[#8A9BB0] max-w-md mx-auto">
            Khởi tạo căn cước nhà nghiên cứu thời gian để bước vào kho lưu trữ cơ mật.
          </p>
        </div>

        {/* 2-Column Balanced Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ================================================================
              LEFT: LIVE ARCHIVIST ID CARD PREVIEW (5 COLS)
              ================================================================ */}
          <div className="md:col-span-5 md:sticky md:top-24 order-2 md:order-1">
            <div className="parchment-sheet p-6 rounded-lg shadow-2xl relative border border-[#D5C29B]">
              <div className="brass-clip" />

              <div className="flex items-center justify-between mb-6 pt-1 pl-4">
                <span className="red-stamp text-[9px]">THẺ ĐẶC PHÁI VIÊN</span>
                <span className="text-[10px] font-mono font-bold text-[#8D3038]">
                  ID #2026-FPT
                </span>
              </div>

              {/* Big Avatar Portrait */}
              <div className="flex flex-col items-center text-center my-4">
                <div className="w-24 h-24 rounded-full bg-[#162032] border-2 border-[#8D3038] flex items-center justify-center text-5xl mb-3 shadow-lg">
                  {selectedAvatarData.emoji}
                </div>

                <div className="font-['Playfair_Display',serif] font-bold text-lg text-[#24160A] truncate max-w-full">
                  {nickname.trim() || 'Biệt Danh Của Bạn'}
                </div>

                <div className="text-xs text-[#8D3038] font-semibold mt-0.5">
                  {selectedAvatarData.label}
                </div>

                <div className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-black/5 text-[10px] font-mono text-[#4A3A2A]">
                  <span>{gameMode === 'exploration' ? '🌿 Chế độ Khám phá' : '⚡ Chế độ Thử thách'}</span>
                </div>
              </div>

              {/* ID Details Strip */}
              <div className="border-t border-[#D5C29B] pt-4 space-y-1.5 text-[11px] text-[#4A3A2A] font-sans">
                <div className="flex justify-between">
                  <span className="text-[#8A9BB0]">Đơn vị công tác:</span>
                  <span className="font-semibold text-[#24160A]">Viện Lưu Trữ Thời Gian</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A9BB0]">Môn học:</span>
                  <span className="font-semibold text-[#24160A]">VNR202 – Đại học FPT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8A9BB0]">Trạng thái:</span>
                  <span className="font-semibold text-[#8D3038]">Sẵn sàng tiếp nhận nhiệm vụ</span>
                </div>
              </div>
            </div>

            <div className="mt-3 text-center text-[10px] text-[#8A9BB0] flex items-center justify-center gap-1">
              <Shield size={12} className="text-[#D6A75C]" />
              <span>Hồ sơ lưu trữ cục bộ trên trình duyệt – Không cần mật khẩu.</span>
            </div>
          </div>

          {/* ================================================================
              RIGHT: SETUP FORM (7 COLS)
              ================================================================ */}
          <div className="md:col-span-7 order-1 md:order-2">
            <form
              noValidate
              onSubmit={event => { event.preventDefault(); handleSubmit(); }}
              aria-labelledby="setup-heading"
              className="dossier-card border-dongson p-5 sm:p-8 rounded-lg shadow-2xl space-y-6"
            >
              
              {/* Nickname Input */}
              <div>
                <label
                  htmlFor="envoy-nickname"
                  className="text-xs font-semibold text-[#E9D8B7] uppercase tracking-wider mb-2 flex items-center gap-1.5"
                >
                  <User size={14} className="text-[#D6A75C]" aria-hidden="true" />
                  <span>Biệt Danh Nhà Nghiên Cứu</span>
                  <span className="text-[#F87171]" aria-hidden="true">*</span>
                </label>

                <input
                  id="envoy-nickname"
                  name="nickname"
                  type="text"
                  value={nickname}
                  onChange={e => {
                    setNickname(e.target.value);
                    setError('');
                  }}
                  placeholder="Nhập tên hoặc biệt danh của bạn (2 - 20 ký tự)"
                  maxLength={20}
                  autoFocus
                  autoComplete="off"
                  enterKeyHint="done"
                  aria-invalid={error ? true : undefined}
                  aria-describedby="nickname-help"
                  className="w-full bg-[#0A1020] border border-[#D6A75C]/35 text-[#E9D8B7] placeholder:text-[#8A9BB0]/50 rounded-md px-4 py-3 text-sm outline-none focus:border-[#D6A75C] transition-colors"
                />

                <div className="flex justify-between items-center mt-1.5">
                  <AnimatePresence>
                    {error ? (
                      <motion.p
                        id="nickname-help"
                        role="alert"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-[#F87171] text-xs flex items-center gap-1"
                      >
                        <AlertCircle size={12} aria-hidden="true" /> {error}
                      </motion.p>
                    ) : (
                      <span id="nickname-help" className="text-[10px] text-[#8A9BB0]">Tên này sẽ xuất hiện trên Bằng Chứng Nhận</span>
                    )}
                  </AnimatePresence>
                  <span className="text-[10px] font-mono text-[#8A9BB0] tabular-nums">{nickname.length}/20</span>
                </div>
              </div>

              {/* Avatar Selector Grid */}
              <div>
                <label className="text-xs font-semibold text-[#E9D8B7] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Award size={14} className="text-[#D6A75C]" />
                  <span>Chọn Nhân Vật Đại Diện</span>
                </label>

                <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                  {AVATARS.map(avatar => {
                    const isSelected = selectedAvatar === avatar.id;
                    return (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setSelectedAvatar(avatar.id)}
                        aria-pressed={isSelected}
                        title={avatar.label}
                        className={`flex flex-col items-center justify-center gap-1 min-h-[74px] p-2 rounded-md border transition-all ${
                          isSelected
                            ? 'border-[#D6A75C] bg-[#D6A75C]/20 shadow-[0_0_12px_rgba(214,167,92,0.3)] scale-105'
                            : 'border-[#D6A75C]/15 bg-[#0A1020]/60 hover:border-[#D6A75C]/40 text-[#8A9BB0]'
                        }`}
                      >
                        <span className="text-2xl">{avatar.emoji}</span>
                        <span className={`text-[10px] text-center leading-tight font-medium ${
                          isSelected ? 'text-[#E9D8B7]' : 'text-[#8A9BB0]'
                        }`}>
                          {avatar.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Game Mode Selector */}
              <div>
                <label className="text-xs font-semibold text-[#E9D8B7] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#D6A75C]" />
                  <span>Chọn Chế Độ Trải Nghiệm</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MODES.map(mode => {
                    const isSelected = gameMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setGameMode(mode.id)}
                        aria-pressed={isSelected}
                        className={`text-left p-3.5 rounded-md border transition-all ${
                          isSelected
                            ? 'border-[#D6A75C] bg-[#D6A75C]/15 shadow-sm'
                            : 'border-[#D6A75C]/15 bg-[#0A1020]/50 hover:border-[#D6A75C]/40'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-[#E9D8B7] flex items-center gap-1.5">
                            <span>{mode.icon}</span>
                            <span>{mode.name}</span>
                          </span>
                          {isSelected && <Check size={14} className="text-[#D6A75C]" />}
                        </div>
                        <p className="text-[11px] text-[#8A9BB0] leading-snug">
                          {mode.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isConfirming}
                  className="btn-heritage-primary w-full text-sm py-4 shadow-xl"
                >
                  {isConfirming ? (
                    <span className="w-4 h-4 rounded-full border-2 border-[#0A1020]/40 border-t-[#0A1020] animate-spin" aria-hidden="true" />
                  ) : (
                    <Sparkles size={16} aria-hidden="true" />
                  )}
                  <span>{isConfirming ? 'ĐANG KHỞI TẠO HỒ SƠ...' : 'KHỞI TẠO HỒ SƠ & VÀO KHO LƯU TRỮ'}</span>
                </button>
                <p className="text-center text-[10px] text-[#8A9BB0] mt-3">
                  Không cần đăng nhập · Có thể tạo lại hồ sơ bất cứ lúc nào
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
