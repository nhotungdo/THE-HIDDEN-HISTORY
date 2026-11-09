// ==========================================================================
// HEADER COMPONENT – MẬT MÃ THỜI GIAN (VNR202)
// RE-ARRANGED ARCHIVAL COMMAND BAR & NAVIGATION
// ==========================================================================

import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Volume2, VolumeX, BookOpen, HelpCircle, Compass, 
  Award, Menu, X, Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { calculateRank } from '../../utils/storage';

export default function Header() {
  const { soundEnabled, toggleSound, progress, getTotalCompletedChapters } = useGame();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Chapter, play and result screens belong to the timeline section.
  const isRouteActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    if (location.pathname === to || location.pathname.startsWith(`${to}/`)) return true;
    if (to === '/timeline' && /^\/(chapter|play|result)\//.test(location.pathname)) return true;
    return false;
  };

  // Navigating away always closes the drawer.
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // While the drawer is open: lock the page and support Escape.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileMenuOpen]);

  const hasProfile = progress.profile !== null;
  const completedCount = getTotalCompletedChapters();
  const isAllCompleted = progress.isCompletedAll || completedCount === 5;

  const navLinks = [
    { to: '/', label: 'Trang Chủ', icon: <Compass size={15} /> },
    ...(hasProfile
      ? [
          { to: '/timeline', label: 'Bản Đồ Thời Gian', icon: <Compass size={15} />, badge: `${completedCount}/5` },
          { to: '/collection', label: 'Bảo Tàng Ký Ức', icon: <Award size={15} />, badge: completedCount > 0 ? `${completedCount}` : undefined },
        ]
      : []),
    { to: '/archive', label: 'Thư Viện Lịch Sử', icon: <BookOpen size={15} /> },
    { to: '/how-to-play', label: 'Hướng Dẫn', icon: <HelpCircle size={15} /> },
    ...(isAllCompleted
      ? [{ to: '/certificate', label: 'Chứng Nhận', icon: <Trophy size={15} />, highlight: true }]
      : []),
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#070D18]/90 backdrop-blur-md border-b border-[#D6A75C]/25 transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-3">
        
        {/* ==================================================================
            LEFT: LOGO & BRANDING
            ================================================================== */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group shrink-0 rounded py-0.5 focus-visible:outline-offset-4"
          aria-label="Mật Mã Thời Gian – về trang chủ"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#F5CF8E] via-[#D6A75C] to-[#9E7428] p-0.5 shadow-[0_0_12px_rgba(214,167,92,0.3)] group-hover:scale-105 transition-transform" aria-hidden="true">
            <div className="w-full h-full rounded-full bg-[#0A1020] flex items-center justify-center text-sm font-bold text-[#D6A75C]">
              ⏳
            </div>
          </div>
          <div>
            <div className="text-gold-foil font-['Cinzel',serif] font-black text-xs sm:text-sm leading-none tracking-wider">
              MẬT MÃ THỜI GIAN
            </div>
            <div className="text-[#8A9BB0] text-[9px] font-mono tracking-widest mt-0.5">
              VNR202 · ĐẠI HỌC FPT
            </div>
          </div>
        </Link>

        {/* ==================================================================
            CENTER: DESKTOP NAVIGATION
            ================================================================== */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map(link => {
            const isActive = isRouteActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={isActive ? 'page' : undefined}
                className={`relative px-3 py-2 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 ${
                  isActive
                    ? 'text-[#FFF0D0] bg-[#D6A75C]/15 border border-[#D6A75C]/40 shadow-sm'
                    : link.highlight
                      ? 'text-[#F5CF8E] border border-[#D6A75C]/30 bg-[#162032] hover:bg-[#D6A75C]/20'
                      : 'text-[#8A9BB0] hover:text-[#E9D8B7] hover:bg-[#162032]/50'
                }`}
              >
                <span className={isActive ? 'text-[#D6A75C]' : 'text-[#8A9BB0]'}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
                {link.badge && (
                  <span className="ml-1 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-[#D6A75C]/20 text-[#D6A75C] border border-[#D6A75C]/30">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* ==================================================================
            RIGHT: PLAYER STATUS & UTILITY CONTROLS
            ================================================================== */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Player Mini Status Pill (if profile exists) */}
          {hasProfile && (
            <Link
              to="/timeline"
              className="hidden sm:flex items-center gap-2 bg-[#121C2B] hover:bg-[#1A263D] border border-[#D6A75C]/30 rounded-full pl-1.5 pr-3 py-1 transition-colors"
              title="Xem hồ sơ & hành trình"
            >
              <div className="w-6 h-6 rounded-full bg-[#D6A75C]/20 text-xs flex items-center justify-center border border-[#D6A75C]/50">
                ⭐
              </div>
              <div className="text-left">
                <div className="text-[11px] font-bold text-[#E9D8B7] leading-none">
                  {progress.profile?.nickname}
                </div>
                <div className="text-[9px] text-[#D6A75C] font-mono leading-none mt-0.5">
                  {progress.totalScore}đ · {calculateRank(progress.totalScore)}
                </div>
              </div>
            </Link>
          )}

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={toggleSound}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
              soundEnabled
                ? 'border-[#D6A75C]/40 bg-[#D6A75C]/10 text-[#D6A75C] hover:bg-[#D6A75C]/20'
                : 'border-[#8A9BB0]/30 bg-transparent text-[#8A9BB0]/60 hover:text-[#8A9BB0]'
            }`}
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            aria-label={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          {/* Mobile Drawer Menu Toggle */}
          <button
            type="button"
            className="lg:hidden w-10 h-10 rounded-full border border-[#D6A75C]/30 flex items-center justify-center text-[#D6A75C] hover:bg-[#D6A75C]/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ==================================================================
          MOBILE NAVIGATION DRAWER
          ================================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-[#D6A75C]/20 bg-[#0A1020]/95 backdrop-blur-md overflow-hidden max-h-[calc(100vh-58px)] overflow-y-auto"
          >
            <div className="px-4 py-4 space-y-1.5">
              
              {/* Mobile Player Summary */}
              {hasProfile && (
                <div className="p-3 mb-2 rounded bg-[#121C2B] border border-[#D6A75C]/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎓</span>
                    <div>
                      <div className="text-xs font-bold text-[#E9D8B7]">{progress.profile?.nickname}</div>
                      <div className="text-[10px] text-[#D6A75C] font-mono">{progress.totalScore}đ · {completedCount}/5 Cổ vật</div>
                    </div>
                  </div>
                  <Link
                    to="/timeline"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-heritage-secondary text-[10px] py-1 px-2.5"
                  >
                    Bản Đồ
                  </Link>
                </div>
              )}

              {/* Links */}
              {navLinks.map(link => {
                const isActive = isRouteActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center justify-between min-h-11 py-2.5 px-3 rounded text-sm transition-colors ${
                      isActive
                        ? 'text-[#D6A75C] bg-[#D6A75C]/10 font-bold border-l-2 border-[#D6A75C]'
                        : 'text-[#8A9BB0] hover:text-[#E9D8B7]'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center gap-2">
                      {link.icon}
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#D6A75C]/20 text-[#D6A75C]">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Mobile primary action */}
              <div className="pt-2 mt-2 border-t border-[#D6A75C]/15">
                {hasProfile ? (
                  <Link
                    to="/timeline"
                    className="btn-heritage-primary w-full text-[11px] py-3"
                  >
                    <Compass size={14} aria-hidden="true" />
                    Tiếp tục hành trình ({completedCount}/5)
                  </Link>
                ) : (
                  <Link
                    to="/setup"
                    className="btn-heritage-primary w-full text-[11px] py-3"
                  >
                    <Compass size={14} aria-hidden="true" />
                    Tạo hồ sơ Đặc Phái Viên
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
