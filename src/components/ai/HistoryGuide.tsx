import { useEffect, useRef, useState } from 'react';
import type { TaskData } from '../../types/game';
export default function HistoryGuide({task}:{task:TaskData}){
 const [question,setQuestion]=useState('');const [answer,setAnswer]=useState('');const [status,setStatus]=useState('');const [busy,setBusy]=useState(false);const [mode,setMode]=useState('explain');const controller=useRef<AbortController|null>(null);
 useEffect(()=>()=>controller.current?.abort(),[]);
 const ask=async()=>{if(busy)return;setBusy(true);setStatus('Đang tra cứu…');controller.current=new AbortController();const timeout=setTimeout(()=>controller.current?.abort(),15000);try{
  const response=await fetch('/api/history-guide',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({taskId:task.id,question:question.trim()||'Giải thích bối cảnh của hồ sơ này',mode}),signal:controller.current.signal});
  if(!response.ok)throw new Error();const result=await response.json();if(typeof result.text!=='string')throw new Error();setAnswer(result.text);setStatus('Câu trả lời AI · hãy đối chiếu tư liệu.');
 }catch{setAnswer(mode==='explain'?task.historicalDocument.excerpt:task.aiHints.exploration);setStatus('Đang dùng tư liệu có sẵn vì AI trực tuyến chưa khả dụng. Nội dung dưới đây là phần đọc thêm, không phải trả lời riêng cho câu hỏi.')}finally{clearTimeout(timeout);setBusy(false)}};
 return <div className="stack"><label>Chế độ<select value={mode} onChange={e=>setMode(e.target.value)}><option value="explain">Giải thích tư liệu</option><option value="explore">Khám phá thêm</option></select></label><label>Câu hỏi về hồ sơ<input maxLength={500} value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Bạn muốn hiểu thêm điều gì?"/></label><button disabled={busy} onClick={ask}>{busy?'Đang trả lời…':'Hỏi cố vấn'}</button><p role="status">{status}</p><p className="document-text">{answer}</p><small>Nguồn: {task.historicalDocument.sourceCitation}</small></div>
}
