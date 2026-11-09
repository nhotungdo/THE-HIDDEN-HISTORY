import { Link, Navigate, useParams } from 'react-router-dom';
import { chapters } from '../data/chapters';
import { useGame } from '../context/GameContext';
export default function ChapterIntroPage(){
 const {id}=useParams(); const game=useGame(); const c=chapters.find(c=>c.id===Number(id));
 if(!c || game.getChapterStatus(c.id)==='locked') return <Navigate to="/timeline" replace/>;
 return <main className="page stack"><Link to="/timeline">← Bản đồ thời gian</Link><p className="eyebrow">CHƯƠNG {c.id} / {c.year}</p><h1>{c.codeName}</h1><p className="lead">{c.slogan}</p><section className="panel stack"><h2>{c.title}</h2><p>{c.historicalContext}</p><ol>{c.tasks.map(t=><li key={t.id}>{t.title}</li>)}</ol><p>Phần thưởng: {c.memoryFragment.iconEmoji} {c.memoryFragment.name}</p><Link className="action" to={`/play/${c.id}`} onClick={()=>game.setCurrentChapter(c.id)}>Bước vào phòng giải mã</Link></section></main>;
}
