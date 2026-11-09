import type { TaskData } from '../types/game';
export type Answers = Record<string,string>;
export function isCorrect(task: TaskData, answers: Answers): boolean {
 if(task.taskType==='document-detective') return !!task.clues?.every(c=>c.options.find(o=>o.id===answers[c.id])?.isCorrect);
 return task.options.every(o=>answers[o.id] === (task.taskType==='timeline-order' ? String(o.orderIndex) : task.taskType==='dossier-match' ? o.matchTargetId : task.taskType==='campaign-map' ? `${o.mapCoord?.row},${o.mapCoord?.col}` : String(o.isCorrect)));
}
