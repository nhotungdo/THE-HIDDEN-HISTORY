// ==========================================================================
// CERTIFICATE CANVAS GENERATOR (2K HIGH RESOLUTION)
// BẰNG DANH DỰ LỊCH SỬ CHUẨN IN ẤN VÀ NỘP BÁO CÁO VNR202
// ==========================================================================

import type { PlayerProgress } from '../types/game';
import { calculateRank } from '../utils/storage';

export function certificateCanvas(progress: PlayerProgress): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Trình duyệt không hỗ trợ Canvas.');

  // Safe helper for gradient or flat color (safe for test mock & real browser)
  let bgFill: string | CanvasGradient = '#101827';
  if (typeof ctx.createRadialGradient === 'function') {
    try {
      const bgGrad = ctx.createRadialGradient(960, 540, 100, 960, 540, 1000);
      bgGrad.addColorStop(0, '#131E30');
      bgGrad.addColorStop(1, '#070B14');
      bgFill = bgGrad;
    } catch {
      bgFill = '#101827';
    }
  }
  ctx.fillStyle = bgFill;
  ctx.fillRect(0, 0, 1920, 1080);

  // 2. Double Gold Foil Borders
  ctx.strokeStyle = '#D6A75C';
  ctx.lineWidth = 6;
  ctx.strokeRect(40, 40, 1840, 1000);

  // Inner thin border
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = '#F5CF8E';
  ctx.strokeRect(55, 55, 1810, 970);

  // Dashed Dong Son accent border
  if (typeof ctx.setLineDash === 'function') {
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(214, 167, 92, 0.4)';
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(70, 70, 1780, 940);
    ctx.setLineDash([]); // reset
  }

  // 3. Corner Ornaments (Decorative 4 corners)
  const drawCorner = (x: number, y: number, rot: number) => {
    if (typeof ctx.save !== 'function') return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = '#D6A75C';
    ctx.fillRect(0, 0, 35, 4);
    ctx.fillRect(0, 0, 4, 35);
    if (typeof ctx.beginPath === 'function') {
      ctx.beginPath();
      ctx.arc(8, 8, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };
  drawCorner(85, 85, 0);
  drawCorner(1835, 85, Math.PI / 2);
  drawCorner(1835, 995, Math.PI);
  drawCorner(85, 995, -Math.PI / 2);

  // 4. Central Dong Son Sun Emblem / Clock Emblem at Top
  if (typeof ctx.save === 'function') {
    ctx.save();
    ctx.translate(960, 130);
    ctx.strokeStyle = '#D6A75C';
    ctx.lineWidth = 2;
    if (typeof ctx.beginPath === 'function') {
      ctx.beginPath();
      ctx.arc(0, 0, 24, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, 18, 0, Math.PI * 2);
      ctx.stroke();

      // Rays
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI) / 6;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * 26, Math.sin(angle) * 26);
        ctx.lineTo(Math.cos(angle) * 32, Math.sin(angle) * 32);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // 5. Typography Rendering
  ctx.textAlign = 'center';

  // Subtitle / Header
  ctx.font = '700 20px "Cinzel", serif';
  ctx.fillStyle = '#D6A75C';
  ctx.fillText('ĐẠI HỌC FPT · BỘ MÔN VNR202 – LỊCH SỬ ĐẢNG CỘNG SẢN VIỆT NAM', 960, 200);

  // Main Certificate Title
  ctx.font = '900 48px "Cinzel", serif';
  let titleGrad: string | CanvasGradient = '#D6A75C';
  if (typeof ctx.createLinearGradient === 'function') {
    try {
      const grad = ctx.createLinearGradient(600, 240, 1320, 240);
      grad.addColorStop(0, '#F5CF8E');
      grad.addColorStop(0.5, '#D6A75C');
      grad.addColorStop(1, '#9E7428');
      titleGrad = grad;
    } catch {
      titleGrad = '#D6A75C';
    }
  }
  ctx.fillStyle = titleGrad;
  ctx.fillText('CHỨNG NHẬN HOÀN THÀNH DANH DỰ', 960, 275);

  ctx.font = 'italic 20px "Playfair Display", serif';
  ctx.fillStyle = '#8A9BB0';
  ctx.fillText('Trao tặng người chơi', 960, 335);

  // Recipient Name (Pass exact nickname so unit tests and UI match)
  ctx.font = '800 64px "Playfair Display", "Cinzel", serif';
  ctx.fillStyle = '#F5CF8E';
  const nickname = progress.profile?.nickname || 'Đặc Phái Viên Thời Gian';
  ctx.fillText(nickname, 960, 420);

  // Decorative divider line under name
  if (typeof ctx.beginPath === 'function') {
    ctx.strokeStyle = '#D6A75C';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(760, 445);
    ctx.lineTo(1160, 445);
    ctx.stroke();
  }

  // Achievement Description
  ctx.font = '400 22px "Be Vietnam Pro", sans-serif';
  ctx.fillStyle = '#E9D8B7';
  ctx.fillText(
    'Đã giải mã thành công 5 Cổng Không Gian Lịch Sử (1930 · 1945 · 1954 · 1975 · 1986)',
    960,
    500
  );
  ctx.fillText(
    'Vượt qua 15 nhiệm vụ học thuật và khôi phục trọn vẹn cuốn Đại Việt Biên Niên Ký Thời Đại Mới',
    960,
    538
  );

  // Rank & Score Ribbon Box
  ctx.fillStyle = '#162236';
  ctx.fillRect(710, 580, 500, 60);
  ctx.strokeStyle = '#D6A75C';
  ctx.lineWidth = 1;
  ctx.strokeRect(710, 580, 500, 60);

  ctx.font = '700 24px "Cinzel", serif';
  ctx.fillStyle = '#F5CF8E';
  const rank = calculateRank(progress.totalScore);
  ctx.fillText(`DANH HIỆU: ${rank.toUpperCase()}`, 960, 618);

  // Detailed Stats (Contains totalScore so lines.some(s => s.includes('1350')) passes)
  ctx.font = '500 20px "Be Vietnam Pro", sans-serif';
  ctx.fillStyle = '#8A9BB0';
  ctx.fillText(
    `${progress.totalScore} điểm tích lũy  |  Nhiệm vụ: 15/15  |  Cổ vật: 5/5 Mảnh Ký Ức`,
    960,
    685
  );

  // 6. Red Official Stamp (Con Dấu Mộc Đỏ)
  if (typeof ctx.save === 'function') {
    ctx.save();
    ctx.translate(1420, 780);
    ctx.rotate(-0.08); // Slight realistic tilt

    ctx.strokeStyle = '#A31D1D';
    ctx.fillStyle = '#A31D1D';
    ctx.lineWidth = 3;

    if (typeof ctx.beginPath === 'function') {
      ctx.beginPath();
      ctx.arc(0, 0, 70, 0, Math.PI * 2);
      ctx.stroke();

      if (typeof ctx.setLineDash === 'function') {
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(0, 0, 62, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }

    ctx.font = '28px sans-serif';
    ctx.fillText('★', 0, 8);

    ctx.font = '800 10px "Cinzel", serif';
    ctx.fillText('VIỆN LƯU TRỮ VNR202', 0, -32);
    ctx.fillText('ĐẠI HỌC FPT', 0, -20);
    ctx.fillText('ĐÃ XÁC THỰC', 0, 36);
    ctx.font = '700 9px font-mono';
    ctx.fillText('VERIFIED 2026', 0, 48);

    ctx.restore();
  }

  // 7. Signature & Date Section
  ctx.textAlign = 'left';
  ctx.font = '400 18px "Be Vietnam Pro", sans-serif';
  ctx.fillStyle = '#8A9BB0';
  const issueDate = progress.certificateIssuedAt
    ? new Date(progress.certificateIssuedAt).toLocaleDateString('vi-VN')
    : new Date().toLocaleDateString('vi-VN');
  ctx.fillText(`Ngày cấp: ${issueDate}`, 320, 800);
  ctx.fillText(`Mã chứng nhận: ${progress.certificateCode || 'VNR202-FPT-001'}`, 320, 830);

  ctx.textAlign = 'center';
  ctx.fillText('ĐẠI DIỆN HỘI ĐỒNG LƯU TRỮ THỜI GIAN', 1420, 890);
  ctx.font = 'italic 16px "Playfair Display", serif';
  ctx.fillStyle = '#D6A75C';
  ctx.fillText('GS. Đặng Vũ Triết – Ban Học Thuật VNR202', 1420, 915);

  // 8. Footer Academic Disclaimer (Contains "không phải chứng chỉ chính thức")
  ctx.textAlign = 'center';
  ctx.font = '400 13px "Be Vietnam Pro", sans-serif';
  ctx.fillStyle = 'rgba(138, 155, 176, 0.6)';
  ctx.fillText(
    'Chứng nhận trong trò chơi — không phải chứng chỉ chính thức của Đại học FPT.',
    960,
    985
  );

  return canvas;
}
