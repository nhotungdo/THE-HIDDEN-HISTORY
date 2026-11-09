// ==========================================
// FORMAT UTILITIES – MẬT MÃ THỜI GIAN
// ==========================================

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatScore(score: number): string {
  return score.toLocaleString('vi-VN') + ' điểm';
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function getChapterStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    locked: '🔒 Bị Khóa',
    unlocked: '🔓 Đã Mở',
    'in-progress': '⏳ Đang Giải Mã',
    completed: '✅ Đã Hoàn Thành',
  };
  return labels[status] ?? status;
}

export function getYearLabel(year: number): string {
  const labels: Record<number, string> = {
    1930: 'Khởi Nguồn',
    1945: 'Mùa Thu Độc Lập',
    1954: 'Đường Đến Điện Biên',
    1975: 'Thống Nhất',
    1986: 'Bước Ngoặt Đổi Mới',
  };
  return labels[year] ?? year.toString();
}

export function getRankLabel(totalScore: number): string {
  if (totalScore >= 1400) return '🏆 Đại Kiện Tướng Lịch Sử FPT';
  if (totalScore >= 1100) return '⭐ Đặc Phái Viên Huyền Thoại';
  if (totalScore >= 800)  return '📚 Nhà Sử Học Xuất Sắc';
  if (totalScore >= 500)  return '🔍 Thám Tử Thời Gian';
  return '📖 Nhà Nghiên Cứu Tập Sự';
}

export function getRankClean(totalScore: number): string {
  if (totalScore >= 1400) return 'Đại Kiện Tướng Lịch Sử FPT';
  if (totalScore >= 1100) return 'Đặc Phái Viên Huyền Thoại';
  if (totalScore >= 800)  return 'Nhà Sử Học Xuất Sắc';
  if (totalScore >= 500)  return 'Thám Tử Thời Gian';
  return 'Nhà Nghiên Cứu Tập Sự';
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

