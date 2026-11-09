// ==========================================================================
// HISTORY ARCHIVE PAGE (Màn 10) – MẬT MÃ THỜI GIAN
// THƯ VIỆN SỐ LỊCH SỬ & KHO TRA CỨU HỌC THUẬT VNR202
// ==========================================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, BookOpen, ExternalLink, Calendar, 
  ChevronDown, Globe, Bookmark, FileText 
} from 'lucide-react';
import { chapters } from '../data/chapters';

const fold = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();

const PERIOD_TABS = [
  { id: '', label: 'Tất Cả Thời Kỳ' },
  { id: '1930', label: '1930 · Khởi Nguồn' },
  { id: '1945', label: '1945 · Độc Lập' },
  { id: '1954', label: '1954 · Điện Biên' },
  { id: '1975', label: '1975 · Thống Nhất' },
  { id: '1986', label: '1986 · Đổi Mới' },
];

const MODERN_MILESTONES = [
  { year: '1987', title: 'Luật Đầu tư nước ngoài được ban hành', desc: 'Mở cửa chào đón các dòng vốn quốc tế, tạo đòn bẩy đột phá cho nền kinh tế thị trường định hướng XHCN.' },
  { year: '1995', title: 'Bình thường hóa quan hệ Việt - Mỹ & Gia nhập ASEAN', desc: 'Bước ngoặt ngoại giao lịch sử, phá vỡ thế bao vây cô lập, đưa Việt Nam hội nhập khu vực và toàn cầu.' },
  { year: '2007', title: 'Chính thức gia nhập Tổ chức Thương mại Thế giới (WTO)', desc: 'Khẳng định vị thế kinh tế độc lập, tự chủ và sẵn sàng cạnh tranh bình đẳng trên trường quốc tế.' },
  { year: 'Hiện nay', title: 'Đại hội XIII & Khát vọng Việt Nam hùng cường', desc: 'Phấn đấu đến năm 2045 đưa Việt Nam trở thành quốc gia phát triển, thu nhập cao.' },
];

export default function HistoryArchivePage() {
  const [query, setQuery] = useState('');
  const [period, setPeriod] = useState('');

  const entries = chapters
    .flatMap(c => c.tasks.map(t => ({ c, t })))
    .filter(({ c, t }) => 
      (!period || String(c.year) === period) &&
      fold(t.title + ' ' + t.historicalDocument.excerpt + ' ' + t.historicalLesson + ' ' + t.historicalDocument.title).includes(fold(query))
    );

  return (
    <div className="flex-1 w-full py-8 md:py-12 px-4 text-[#E9D8B7] relative">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(214,167,92,0.06)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto w-full">
        
        {/* Title Header */}
        <div className="text-center mb-10">
          <div className="text-xs font-mono tracking-[0.3em] uppercase text-[#D6A75C] mb-2">
            KHO TƯ LIỆU VĂN KIỆN LỊCH SỬ
          </div>
          <h1 className="text-3xl md:text-5xl font-['Cinzel',serif] font-black text-gold-foil mb-3">
            THƯ VIỆN LỊCH SỬ VNR202
          </h1>
          <p className="text-xs md:text-sm text-[#8A9BB0] max-w-xl mx-auto leading-relaxed">
            Tra cứu tự do các văn kiện, mốc son và luận điểm trọng tâm phục vụ ôn tập môn học Lịch sử Đảng Cộng sản Việt Nam tại Đại học FPT.
          </p>
        </div>

        {/* Search & Period Filter Box */}
        <div className="dossier-card border-dongson rounded-lg p-5 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A9BB0]" />
              <input
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Tìm kiếm sự kiện, nhân vật, văn kiện, mốc thời gian..."
                className="w-full bg-[#0A1020] border border-[#D6A75C]/30 text-xs md:text-sm text-[#E9D8B7] placeholder:text-[#8A9BB0]/60 rounded-md pl-10 pr-4 py-3 outline-none focus:border-[#D6A75C] transition-colors"
              />
            </div>

            {/* Total Results Stamp */}
            <div className="shrink-0">
              <span className="red-stamp text-[11px]">
                {entries.length} HỒ SƠ LƯU TRỮ
              </span>
            </div>
          </div>

          {/* Period Filter Tabs */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-[#D6A75C]/15">
            {PERIOD_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setPeriod(tab.id)}
                className={`text-xs px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${
                  period === tab.id
                    ? 'bg-[#D6A75C] text-[#0A1020] font-bold shadow-md'
                    : 'bg-[#162032] text-[#8A9BB0] hover:text-[#E9D8B7] border border-[#D6A75C]/15'
                }`}
              >
                <Calendar size={12} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search Results List */}
        <div className="space-y-4 mb-12">
          {entries.map(({ c, t }, idx) => (
            <motion.details
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="dossier-card rounded-lg overflow-hidden border border-[#D6A75C]/25 group cursor-pointer"
            >
              <summary className="p-4 bg-[#162032]/70 flex items-center justify-between gap-3 select-none">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded bg-[#D6A75C]/20 text-[#D6A75C] font-mono font-bold text-xs flex items-center justify-center shrink-0 border border-[#D6A75C]/40">
                    {c.year}
                  </span>
                  <div>
                    <div className="text-xs md:text-sm font-semibold text-[#E9D8B7] group-hover:text-[#D6A75C] transition-colors">
                      {t.title}
                    </div>
                    <div className="text-[10px] text-[#8A9BB0]">
                      {t.historicalDocument.title}
                    </div>
                  </div>
                </div>
                <ChevronDown size={16} className="text-[#8A9BB0] group-open:rotate-180 transition-transform shrink-0" />
              </summary>

              <div className="p-5 border-t border-[#D6A75C]/15 space-y-4 bg-[#0A1020]/50 text-xs">
                {/* Parchment Document Excerpt */}
                <div className="parchment-sheet p-4 rounded relative">
                  <div className="text-[10px] uppercase font-bold text-[#8D3038] tracking-wider mb-1 flex items-center gap-1">
                    <FileText size={12} /> TRÍCH VĂN KIỆN LỊCH SỬ:
                  </div>
                  <blockquote className="text-[#24160A] font-['Playfair_Display',serif] italic leading-relaxed">
                    "{t.historicalDocument.excerpt}"
                  </blockquote>
                </div>

                {/* Explanation */}
                <div className="bg-[#121C2B] p-3 rounded border border-[#D6A75C]/15">
                  <div className="text-[#D6A75C] font-semibold mb-1 flex items-center gap-1">
                    <Bookmark size={12} /> Phân Tích & Giải Thích:
                  </div>
                  <p className="text-[#8A9BB0] leading-relaxed">
                    {t.correctAnswerSummary}
                  </p>
                </div>

                {/* Historical Lesson */}
                <div className="bg-[#121C2B] p-3 rounded border border-[#D6A75C]/15">
                  <div className="text-[#4ADE80] font-semibold mb-1">
                    📖 Ý Nghĩa Bài Học (Trọng Tâm Ôn Thi VNR202):
                  </div>
                  <p className="text-[#E9D8B7] leading-relaxed">
                    {t.historicalLesson}
                  </p>
                </div>

                {/* Source Citation */}
                <div className="text-[10px] text-[#8A9BB0] pt-1 flex items-center gap-1.5 font-mono">
                  <BookOpen size={11} className="text-[#D6A75C]" />
                  <span><strong>Nguồn:</strong> {t.historicalDocument.sourceCitation}</span>
                </div>
              </div>
            </motion.details>
          ))}

          {entries.length === 0 && (
            <div className="text-center py-12 text-[#8A9BB0] text-sm">
              Không tìm thấy hồ sơ nào phù hợp với từ khóa <span className="text-[#D6A75C]">"{query}"</span>.
            </div>
          )}
        </div>

        {/* Modern Vietnam History Extension (Post-1986) */}
        <div className="dossier-card border-dongson rounded-lg p-6 md:p-8 mb-12">
          <div className="text-center mb-6">
            <span className="red-stamp text-[10px] mb-2">TIẾP NỐI THỜI ĐẠI</span>
            <h2 className="text-xl md:text-2xl font-['Cinzel',serif] font-bold text-gold-foil">
              VIỆT NAM HỘI NHẬP & PHÁT TRIỂN (SAU 1986)
            </h2>
            <p className="text-xs text-[#8A9BB0] mt-1 max-w-lg mx-auto">
              Từ Đại hội VI năm 1986, đất nước chuyển mình mạnh mẽ trên con đường công nghiệp hóa, hiện đại hóa và hội nhập quốc tế.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MODERN_MILESTONES.map((m, idx) => (
              <div
                key={idx}
                className="bg-[#0A1020]/70 border border-[#D6A75C]/20 rounded-lg p-4"
              >
                <div className="font-['Cinzel',serif] font-bold text-[#D6A75C] text-sm mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#D6A75C]" />
                  {m.year} · {m.title}
                </div>
                <p className="text-xs text-[#8A9BB0] leading-relaxed pl-4">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Academic References & Open Sources */}
        <div className="bg-[#0D1524] border border-[#D6A75C]/25 rounded-lg p-6">
          <h3 className="font-['Cinzel',serif] text-sm font-bold text-[#D6A75C] mb-3 flex items-center gap-2">
            <Globe size={16} />
            NGUỒN THAM KHẢO & CỔNG THÔNG TIN HỌC THUẬT
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <a
              href="https://tulieuvankien.dangcongsan.vn/"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded bg-[#162032] border border-[#D6A75C]/15 hover:border-[#D6A75C] text-[#E9D8B7] flex items-center justify-between transition-colors group"
            >
              <span>Văn Kiện Đảng Toàn Tập</span>
              <ExternalLink size={13} className="text-[#8A9BB0] group-hover:text-[#D6A75C]" />
            </a>
            <a
              href="https://baotanglichsu.vn/"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded bg-[#162032] border border-[#D6A75C]/15 hover:border-[#D6A75C] text-[#E9D8B7] flex items-center justify-between transition-colors group"
            >
              <span>Bảo Tàng Lịch Sử Quốc Gia</span>
              <ExternalLink size={13} className="text-[#8A9BB0] group-hover:text-[#D6A75C]" />
            </a>
            <a
              href="https://www.wto.org/english/thewto_e/countries_e/vietnam_e.htm"
              target="_blank"
              rel="noreferrer"
              className="p-3 rounded bg-[#162032] border border-[#D6A75C]/15 hover:border-[#D6A75C] text-[#E9D8B7] flex items-center justify-between transition-colors group"
            >
              <span>WTO – Dữ Liệu Việt Nam</span>
              <ExternalLink size={13} className="text-[#8A9BB0] group-hover:text-[#D6A75C]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
