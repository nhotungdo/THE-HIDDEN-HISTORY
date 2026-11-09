// ==========================================
// FOOTER COMPONENT – MẬT MÃ THỜI GIAN
// ==========================================

export default function Footer() {
  return (
    <footer className="bg-[#06101A] border-t border-[#D6A75C]/15 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Brand */}
          <div>
            <h3 className="text-[#D6A75C] font-['Cinzel',serif] font-bold mb-2 text-sm tracking-widest">
              🕐 MẬT MÃ THỜI GIAN
            </h3>
            <p className="text-[#8A9BB0] text-xs leading-relaxed">
              Website game tương tác khám phá lịch sử Việt Nam hiện đại dành cho sinh viên môn VNR202.
            </p>
          </div>

          {/* Course Info */}
          <div>
            <h4 className="text-[#E9D8B7] font-semibold mb-2 text-sm">Thông Tin Môn Học</h4>
            <div className="space-y-1 text-xs text-[#8A9BB0]">
              <p>📚 Môn: VNR202 – Lịch sử Đảng CSVN</p>
              <p>🏫 Trường: Đại học FPT</p>
              <p>📖 Giáo trình: Bộ Giáo dục & Đào tạo</p>
            </div>
          </div>

          {/* Sources */}
          <div>
            <h4 className="text-[#E9D8B7] font-semibold mb-2 text-sm">Nguồn Tư Liệu</h4>
            <div className="space-y-1 text-xs text-[#8A9BB0]">
              <p>• Giáo trình Lịch sử Đảng CSVN – Bộ GD&ĐT 2021</p>
              <p>• Lịch sử Việt Nam – Viện Sử học</p>
              <p>• Văn kiện Đảng toàn tập – NXB Chính trị QG</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#D6A75C]/10 pt-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-[#8A9BB0] text-xs text-center">
            Cốt truyện hư cấu · Nội dung học tập cần đối chiếu giáo trình của lớp
          </p>
          <p className="text-[#D6A75C]/60 text-xs">
            © 2026 THE HIDDEN HISTORY – Đồ án môn VNR202
          </p>
        </div>
      </div>
    </footer>
  );
}

