// ==========================================
// PLAYER SETUP PAGE (Màn 03) – MẬT MÃ THỜI GIAN
// ==========================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle } from 'lucide-react';
import type { GameMode, PlayerProfile } from '../types/game';
import { useGame } from '../context/GameContext';

const AVATARS = [
  { id: 'historian', emoji: '🧑‍🏫', label: 'Nhà Sử Học' },
  { id: 'detective', emoji: '🕵️', label: 'Thám Tử Thời Gian' },
  { id: 'librarian', emoji: '👩‍💼', label: 'Nữ Liên Lạc Viên' },
  { id: 'soldier', emoji: '💂', label: 'Chiến Sĩ Giải Phóng' },
  { id: 'engineer', emoji: '👨‍💻', label: 'Kỹ Sư Đổi Mới' },
  { id: 'professor', emoji: '👴', label: 'Giáo Sư Cổ Văn' },
  { id: 'journalist', emoji: '📰', label: 'Nhà Báo Cách Mạng' },
  { id: 'student', emoji: '🎓', label: 'Sinh Viên FPT' },
];

const MODES: { id: GameMode; icon: string; name: string; desc: string }[] = [
  {
    id: 'exploration',
    icon: '🌿',
    name: 'Chế Độ Khám Phá',
    desc: 'Thong thả đọc tư liệu, không giới hạn thời gian. Phù hợp để ôn thi và khám phá sâu lịch sử.',
  },
  {
    id: 'challenge',
    icon: '⚡',
    name: 'Chế Độ Thử Thách',
    desc: 'Giới hạn 180 giây mỗi nhiệm vụ. Điểm thưởng tốc độ. Dành cho người muốn thách thức bản thân.',
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
    if (progress.profile && !window.confirm("Tạo hồ sơ mới sẽ thay thế tiến độ hiện tại. Tiếp tục?")) return;
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
    }, 1500);
  };

  const selectedAvatarData = AVATARS.find(a => a.id === selectedAvatar)!;

  return (
    <div className="min-h-screen bg-[#101827] pt-20 pb-16 px-4">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(141,48,56,0.06)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="text-[#D6A75C]/60 text-xs tracking-[0.4em] uppercase mb-3">Khởi Tạo Hồ Sơ</div>
          <h1 className="font-['Cinzel',serif] text-3xl text-[#E9D8B7] mb-3">ĐẶC PHÁI VIÊN THỜI GIAN</h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#D6A75C] to-transparent mx-auto" />
        </motion.div>

        {/* ID Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#162032] to-[#0A1020] border border-[#D6A75C]/30 rounded-lg p-6 mb-6 relative overflow-hidden"
        >
          {/* Card decorative corner */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#D6A75C]/5 border-b border-l border-[#D6A75C]/20 rounded-bl-lg" />

          <div className="text-[#D6A75C]/40 text-[10px] tracking-widest mb-4 font-mono">
            KHO LƯU TRỮ THỜI GIAN – HỒ SƠ ĐẶC PHÁI VIÊN
          </div>

          {/* Avatar preview */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full border-2 border-[#D6A75C] bg-[#D6A75C]/10 flex items-center justify-center text-3xl flex-shrink-0">
              {selectedAvatarData.emoji}
            </div>
            <div>
              <div className="text-[#E9D8B7] font-semibold">{nickname.trim() || 'Biệt Danh Của Bạn'}</div>
              <div className="text-[#8A9BB0] text-xs">{selectedAvatarData.label}</div>
              <div className="text-[#D6A75C]/60 text-[10px] mt-0.5">
                {gameMode === 'exploration' ? '🌿 Chế Độ Khám Phá' : '⚡ Chế Độ Thử Thách'}
              </div>
            </div>
          </div>

          {/* Nickname Input */}
          <div className="mb-5">
            <label className="text-[#E9D8B7] text-sm font-semibold mb-2 block">
              Biệt Danh <span className="text-[#8D3038]">*</span>
            </label>
            <input
              type="text"
              value={nickname}
              onChange={e => { setNickname(e.target.value); setError(''); }}
              placeholder="Nhập biệt danh của bạn (2-20 ký tự)"
              maxLength={20}
              className="w-full bg-[#0A1020] border border-[#D6A75C]/30 text-[#E9D8B7] placeholder:text-[#8A9BB0]/60 rounded px-4 py-3 text-sm outline-none focus:border-[#D6A75C] transition-colors"
            />
            <div className="flex justify-between mt-1">
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-[#8D3038] text-xs flex items-center gap-1"
                  >
                    <AlertCircle size={12} /> {error}
                  </motion.p>
                )}
              </AnimatePresence>
              <span className="text-[#8A9BB0] text-xs ml-auto">{nickname.length}/20</span>
            </div>
          </div>

          {/* Avatar selector */}
          <div className="mb-5">
            <label className="text-[#E9D8B7] text-sm font-semibold mb-3 block">Chọn Nhân Vật</label>
            <div className="grid grid-cols-4 gap-2">
              {AVATARS.map(avatar => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`flex flex-col items-center gap-1 p-2 rounded border transition-all duration-200 ${
                    selectedAvatar === avatar.id
                      ? 'border-[#D6A75C] bg-[#D6A75C]/15 scale-105'
                      : 'border-[#D6A75C]/20 bg-transparent hover:bg-[#D6A75C]/5'
                  }`}
                >
                  <span className="text-2xl">{avatar.emoji}</span>
                  <span className="text-[9px] text-[#8A9BB0] text-center leading-tight">{avatar.label}</span>
                  {selectedAvatar === avatar.id && (
                    <Check size={10} className="text-[#D6A75C]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mode selector */}
          <div>
            <label className="text-[#E9D8B7] text-sm font-semibold mb-3 block">Chế Độ Chơi</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MODES.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setGameMode(mode.id)}
                  className={`text-left p-4 rounded border transition-all duration-200 ${
                    gameMode === mode.id
                      ? 'border-[#D6A75C] bg-[#D6A75C]/10'
                      : 'border-[#D6A75C]/20 hover:bg-[#D6A75C]/5'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{mode.icon}</span>
                    <span className="text-[#E9D8B7] text-sm font-semibold">{mode.name}</span>
                    {gameMode === mode.id && <Check size={14} className="text-[#D6A75C] ml-auto" />}
                  </div>
                  <p className="text-[#8A9BB0] text-xs leading-relaxed">{mode.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <button
            onClick={handleSubmit}
            disabled={isConfirming}
            className={`btn-primary text-base px-10 py-4 ${isConfirming ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isConfirming ? '⏳ Đang Khởi Tạo...' : '🚀 KHỞI TẠO HỒ SƠ & VÀO KHO LƯU TRỮ'}
          </button>
          <p className="text-[#8A9BB0] text-xs mt-3">
            Dữ liệu được lưu cục bộ trên trình duyệt – không cần đăng nhập.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

