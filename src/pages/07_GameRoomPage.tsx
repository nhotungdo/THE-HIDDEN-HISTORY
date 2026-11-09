import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { chapters } from '../data/chapters';
import { useGame } from '../context/GameContext';
import { useAudio } from '../context/AudioContext';
import HistoryGuide from '../components/ai/HistoryGuide';
import Puzzle from '../components/games/Puzzle';
import { isCorrect, type Answers } from '../utils/answers';
import { calculateTaskScore } from '../utils/storage';
import type { ChapterData } from '../types/game';
export default function GameRoomPage(){
 const {id}=useParams(); const game=useGame(); const c=chapters.find(c=>c.id===Number(id));
 useEffect(()=>{if(c) game.setCurrentChapter(c.id)},[c,game.setCurrentChapter]);
 if(!c || game.getChapterStatus(c.id)==='locked')return <Navigate to="/timeline" replace/>;
 return <Room key={c.id} chapter={c}/>;
}
function Room({chapter:c}:{chapter:ChapterData}){
 const game=useGame(), audio=useAudio(), navigate=useNavigate();
 const [index,setIndex]=useState(()=>{const p=game.getChapterProgress(c.id);return p?.status==='completed'?0:(c.tasks.findIndex(t=>!p?.taskResults.some(r=>r.taskId===t.id&&r.completed)) < 0 ? 2 : c.tasks.findIndex(t=>!p?.taskResults.some(r=>r.taskId===t.id&&r.completed)))});
 const task=c.tasks[index];
 const draftKey=`vnr202-draft-${game.progress.profile?.createdAt}-${task.id}`;
 const loadDraft=()=>{try{return JSON.parse(sessionStorage.getItem(draftKey)??'null')}catch{return null}};
 const [answers,setAnswers]=useState<Answers>(()=>loadDraft()?.answers??{});
 const [hints,setHints]=useState<number>(()=>loadDraft()?.hints??0);
 const [left,setLeft]=useState<number>(()=>loadDraft()?.left??180);
 const finishedBeforeReload=game.getChapterProgress(c.id)?.status!=='completed' && c.tasks.every(t=>game.getChapterProgress(c.id)?.taskResults.some(r=>r.taskId===t.id&&r.completed));
 const [feedback,setFeedback]=useState(finishedBeforeReload?task.correctAnswerSummary:'');const [solved,setSolved]=useState(finishedBeforeReload);const [guide,setGuide]=useState(false);
 const challenge=game.progress.profile?.gameMode==='challenge';
 useEffect(()=>{try{sessionStorage.setItem(draftKey,JSON.stringify({answers,hints,left}))}catch{/* The current session can continue without storage. */}},[draftKey,answers,hints,left]);
 useEffect(()=>{if(!challenge||game.isGamePaused||solved||left<=0)return;const timer=setInterval(()=>setLeft(n=>Math.max(0,n-1)),1000);return()=>clearInterval(timer)},[challenge,game.isGamePaused,solved,left]);
 const submit=()=>{if(solved||game.isGamePaused||(challenge&&left===0))return;if(!isCorrect(task,answers)){setFeedback('Chưa chính xác. Hãy đối chiếu lại tư liệu và thử lại.');audio.play('wrong');return;}setSolved(true);setFeedback(task.correctAnswerSummary);audio.play('correct');game.submitTaskResult({taskId:task.id,completed:true,answeredCorrectly:true,hintsUsed:hints,score:calculateTaskScore(task.points,hints,10,challenge?left:undefined),timeSpent:180-left});};
 const next=()=>{try{sessionStorage.removeItem(draftKey)}catch{/* optional storage */}if(index===c.tasks.length-1){game.completeChapter(c.id);navigate(`/result/${c.id}`)}else{setIndex(index+1);setAnswers({});setHints(0);setLeft(180);setSolved(false);setFeedback('');setGuide(false)}};
 return <main className="page stack"><div className="toolbar"><span>{c.year} · Nhiệm vụ {index+1}/3</span><strong>{game.getChapterProgress(c.id)?.totalScore??0} điểm</strong>{challenge&&<span role="timer">{left}s</span>}<button onClick={game.togglePause}>Tạm dừng</button></div><progress max="3" value={index+(solved?1:0)}/><h1>{task.title}</h1>
 {game.isGamePaused?<section className="panel stack"><h2>Hành trình tạm dừng</h2><p>Đồng hồ đã dừng. Đáp án và gợi ý được giữ trong phiên trình duyệt.</p><button onClick={game.togglePause}>Tiếp tục</button><button onClick={()=>{game.togglePause();navigate('/timeline')}}>Lưu và về bản đồ</button></section>:<>
 <div className="game-columns"><aside className="panel parchment stack"><p className="eyebrow">HỒ SƠ LỊCH SỬ</p><h2>{task.historicalDocument.title}</h2><p className="document-text">{task.historicalDocument.excerpt}</p><small>{task.historicalDocument.sourceCitation}</small></aside><section className="panel stack"><p>{task.instructions}</p><fieldset disabled={solved||(challenge&&left===0)}><Puzzle task={task} answers={answers} onChange={setAnswers}/></fieldset>{challenge&&left===0&&!solved?<><p role="alert">Hết giờ. Hãy đọc lại tư liệu rồi thử lại nhiệm vụ.</p><button onClick={()=>{setLeft(180);setFeedback('')}}>Thử lại — 180 giây</button></>:!solved&&<button className="action" onClick={submit}>Xác nhận giải mã</button>}<div role="status">{feedback}</div>{solved&&<><p>{task.historicalLesson}</p><button className="action" onClick={next}>{index===2?'Nhận mảnh ký ức':'Nhiệm vụ tiếp theo'}</button></>}</section></div>
 <button onClick={()=>setGuide(!guide)}>💡 Cố vấn lịch sử {guide?'−':'+'}</button>{guide&&<section className="panel stack"><h2>Cố vấn lịch sử</h2><p>Gợi ý biên soạn sẵn · mỗi mức trừ 10 điểm. Hỏi đáp mở sau khi giải đúng nhiệm vụ.</p><button disabled={hints>=2||solved||(challenge&&left===0)} onClick={()=>{setHints(hints+1);audio.play('hint')}}>Gợi ý mức {Math.min(2,hints+1)}</button>{hints>0&&<p>{task.aiHints.level1}</p>}{hints>1&&<p>{task.aiHints.level2}</p>}{solved&&<HistoryGuide key={task.id} task={task}/>}<small>Nguồn: {task.historicalDocument.sourceCitation}</small><button onClick={()=>setGuide(false)}>Đóng cố vấn</button></section>}</>}
 </main>;
}
