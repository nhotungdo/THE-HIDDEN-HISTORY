// ==========================================
// FOOTER COMPONENT – MẬT MÃ THỜI GIAN
// ==========================================

import { Link } from 'react-router-dom';
import { ArrowUp, BookOpen, Compass, HelpCircle, ShieldCheck } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export default function Footer() {
  const { progress } = useGame();
  const hasProfile = progress.profile !== null;

  const navLinks = [
    { to: '/', label: 'Trang chủ', icon: <Compass size={13} /> },
    { to: '/how-to-play', label: 'Hướng dẫn', icon: <HelpCircle size={13} /> },
    { to: '/archive', label: 'Thư viện lịch sử', icon: <BookOpen size={13} /> },
    ...(hasProfile ? [{ to: '/timeline', label: 'Bản đồ thời gian', icon: <Compass size={13} /> }] : []),
  ];

  return (
    <footer className="bg-[#06101A] border-t border-[#D6A75C]/15 mt-auto pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-8 h-8 rounded-full border border-[#D6A75C]/60 bg-[#D6A75C]/10 flex items-center justify-center text-sm" aria-hidden="true">
                ⏳
              </span>
              <h3 className="text-[#D6A75C] font-['Cinzel',serif] font-bold text-sm tracking-widest">
                MẬT MÃ THỜI GIAN
              </h3>
            </div>
            <p className="text-[#8A9BB0] text-xs leading-relaxed max-w-xs">
              Website game tương tác khám phá lịch sử Việt Nam hiện đại dành cho sinh viên môn VNR202.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-mono text-[#8A9BB0]">
              <ShieldCheck size={12} className="text-[#D6A75C]" aria-hidden="true" />
              Tiến độ chỉ lưu trên trình duyệt của bạn
            </p>
          </div>

          {/* Navigation */}
          <nav aria-label="Liên kết chân trang">
            <h4 className="text-[#E9D8B7] font-semibold mb-3 text-sm">Điều Hướng</h4>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center gap-2 min-h-10 text-xs text-[#8A9BB0] hover:text-[#D6A75C] transition-colors py-2"
                  >
                    <span className="text-[#D6A75C]/70" aria-hidden="true">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Course Info */}
          <div>
            <h4 className="text-[#E9D8B7] font-semibold mb-3 text-sm">Thông Tin Môn Học</h4>
            <ul className="space-y-1.5 text-xs text-[#8A9BB0]">
              <li>📚 Môn: VNR202 – Lịch sử Đảng CSVN</li>
              <li>🏫 Trường: Đại học FPT</li>
              <li>📖 Giáo trình: Bộ Giáo dục &amp; Đào tạo</li>
            </ul>
          </div>

          {/* Sources */}
          <div>
            <h4 className="text-[#E9D8B7] font-semibold mb-3 text-sm">Nguồn Tư Liệu</h4>
            <ul className="space-y-1.5 text-xs text-[#8A9BB0]">
              <li>• Giáo trình Lịch sử Đảng CSVN – Bộ GD&amp;ĐT 2021</li>
              <li>• Lịch sử Việt Nam – Viện Sử học</li>
              <li>• Văn kiện Đảng toàn tập – NXB Chính trị QG</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#D6A75C]/10 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[#8A9BB0] text-[11px] text-center sm:text-left">
            Cốt truyện hư cấu · Nội dung học tập cần đối chiếu giáo trình của lớp
          </p>
          <div className="flex items-center gap-4">
            <p className="text-[#D6A75C]/60 text-[11px]">
              © 2026 THE HIDDEN HISTORY – Đồ án môn VNR202
            </p>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1 min-h-10 text-[11px] text-[#8A9BB0] hover:text-[#D6A75C] border border-[#D6A75C]/25 hover:border-[#D6A75C]/60 rounded-full px-3 py-2 transition-colors"
            >
              <ArrowUp size={12} aria-hidden="true" />
              Lên đầu
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
