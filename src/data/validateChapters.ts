import type { ChapterData, TaskData } from '../types/game';

export function validateChapters(value: unknown): asserts value is ChapterData[] {
  const fail = (message: string): never => { throw new Error(`Dữ liệu lịch sử không hợp lệ: ${message}`); };
  if (!Array.isArray(value) || value.length !== 5) fail('cần đúng 5 chương');
  const ids = new Set<string>();
  for (const [index, chapter] of (value as ChapterData[]).entries()) {
    if (chapter.id !== index + 1 || chapter.year !== [1930, 1945, 1954, 1975, 1986][index]) fail('thứ tự chương/năm');
    if (![chapter.title, chapter.codeName, chapter.slogan, chapter.historicalContext, chapter.memoryFragment?.name, chapter.memoryFragment?.historicalSignificance].every(v => typeof v === 'string' && v.trim())) fail(`thông tin chương ${chapter.id}`);
    if (chapter.memoryFragment.id !== `fragment-${chapter.id}` || !Array.isArray(chapter.tasks) || chapter.tasks.length !== 3) fail(`mảnh ký ức/nhiệm vụ chương ${chapter.id}`);
    for (const task of chapter.tasks) {
      if (!task.id || ids.has(task.id)) fail('id nhiệm vụ bị thiếu/trùng');
      ids.add(task.id);
      if (![task.title, task.instructions, task.question, task.correctAnswerSummary, task.historicalLesson, task.historicalDocument?.title, task.historicalDocument?.excerpt, task.historicalDocument?.sourceCitation, task.aiHints?.level1, task.aiHints?.level2, task.aiHints?.exploration].every(v => typeof v === 'string' && v.trim()) || task.points !== 100) fail(task.id);
      if (!Array.isArray(task.options)) fail(`${task.id}: options`);
      const optionIds = task.options.map(o => o.id);
      if (new Set(optionIds).size !== optionIds.length || task.options.some(o => !o.id || !o.text)) fail(`${task.id}: lựa chọn`);
      switch (task.taskType) {
        case 'timeline-order': {
          const order = task.options.map(o => o.orderIndex).sort((a, b) => a! - b!);
          if (!order.length || !order.every((n, i) => n === i + 1)) fail(`${task.id}: thứ tự`);
          break;
        }
        case 'dossier-match': {
          const targets = task.matchTargets?.map(t => t.id) ?? [];
          if (!task.options.length || new Set(targets).size !== targets.length || !task.options.every(o => targets.includes(o.matchTargetId!))) fail(`${task.id}: ghép nối`);
          break;
        }
        case 'truth-or-myth':
          if (!task.options.length || !task.options.every(o => typeof o.isCorrect === 'boolean')) fail(`${task.id}: đúng/sai`);
          break;
        case 'campaign-map': {
          const coords = task.options.map(o => `${o.mapCoord?.row},${o.mapCoord?.col}`);
          if (!coords.length || new Set(coords).size !== coords.length || !task.options.every(o => o.mapCoord && [o.mapCoord.row, o.mapCoord.col].every(n => Number.isInteger(n) && n >= 0 && n < 4))) fail(`${task.id}: tọa độ`);
          break;
        }
        case 'document-detective':
          if (!task.clues?.length || new Set(task.clues.map(c => c.id)).size !== task.clues.length || !task.clues.every(c => c.text && c.question && c.options?.filter(o => o.isCorrect).length === 1 && new Set(c.options.map(o => o.id)).size === c.options.length)) fail(`${task.id}: manh mối`);
          break;
        default: fail(`${(task as TaskData).id}: loại game`);
      }
    }
  }
}
