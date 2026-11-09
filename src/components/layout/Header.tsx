// ==========================================
// HEADER COMPONENT – MẬT MÃ THỜI GIAN
// ==========================================

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Volume2, VolumeX, BookOpen, HelpCircle, Info, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';

export default function Header() {
  const { soundEnabled, toggleSound } = useGame();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Trang Chủ', icon: <Info size={16} /> },
    { to: '/how-to-play', label: 'Hướng Dẫn', icon: <HelpCircle size={16} /> },
    { to: '/archive', label: 'Thư Viện Lịch Sử', icon: <BookOpen size={16} /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A1020]/90 backdrop-blur-md border-b border-[#D6A75C]/20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D6A75C] to-[#A87A30] flex items-center justify-center text-xs font-bold text-[#0A1020] group-hover:scale-110 transition-transform">
            🕐
          </div>
          <div className="hidden sm:block">
            <div className="text-[#D6A75C] font-['Cinzel',serif] font-bold text-sm leading-none tracking-widest">
              MẬT MÃ THỜI GIAN
            </div>
            <div className="text-[#8A9BB0] text-[10px] tracking-wider">VNR202 – FPT UNIVERSITY</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-1.5 text-sm font-medium transition-all duration-200 hover:text-[#D6A75C] ${
                location.pathname === link.to
                  ? 'text-[#D6A75C]'
                  : 'text-[#8A9BB0]'
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Sound toggle */}
          <button
            onClick={toggleSound}
            className="w-9 h-9 rounded-full border border-[#D6A75C]/30 flex items-center justify-center text-[#D6A75C] hover:bg-[#D6A75C]/10 transition-all"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden w-9 h-9 rounded-full border border-[#D6A75C]/30 flex items-center justify-center text-[#D6A75C]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#D6A75C]/20 bg-[#0A1020]/95 overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-3">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-2 text-[#8A9BB0] hover:text-[#D6A75C] py-2 border-b border-[#D6A75C]/10 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

