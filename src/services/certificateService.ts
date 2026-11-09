import type { PlayerProgress } from '../types/game';
import { calculateRank } from '../utils/storage';
export function certificateCanvas(progress:PlayerProgress):HTMLCanvasElement {
 const canvas=document.createElement('canvas');canvas.width=1920;canvas.height=1080;
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Trình duyệt không hỗ trợ Canvas.');
 ctx.fillStyle='#101827';ctx.fillRect(0,0,1920,1080);ctx.strokeStyle='#D6A75C';ctx.lineWidth=4;ctx.strokeRect(45,45,1830,990);ctx.lineWidth=1;ctx.strokeRect(65,65,1790,950);
 ctx.textAlign='center';const line=(text:string,y:number,size:number,color='#E9D8B7')=>{ctx.fillStyle=color;ctx.font=`${size}px Georgia, serif`;ctx.fillText(text,960,y,1700)};
 line('MẬT MÃ THỜI GIAN · VNR202',170,38,'#D6A75C');line('CHỨNG NHẬN HOÀN THÀNH',310,66);line('Trao tặng người chơi',410,30);line(progress.profile?.nickname??'',520,80,'#D6A75C');line('Đã khôi phục 5 mảnh ký ức và hoàn thành 15 nhiệm vụ lịch sử',620,32);line(`${progress.totalScore} điểm · ${calculateRank(progress.totalScore)}`,700,36);line(new Date(progress.certificateIssuedAt!).toLocaleDateString('vi-VN'),790,28);line(progress.certificateCode??'',850,26);line('Chứng nhận trong trò chơi — không phải chứng chỉ chính thức của Đại học FPT',950,24);
 return canvas;
}
