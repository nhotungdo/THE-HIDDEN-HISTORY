import type { TaskData } from '../../types/game';

/** Original vector illustration: never presented as a historical facsimile. */
export default function EvidenceBoard({ task, active, onSelect }: { task: TaskData; active: string | null; onSelect: (id: string) => void }) {
  return <figure className="evidence-board">
    <svg viewBox="0 0 600 360" role="img" aria-label={`Bản dựng minh họa: ${task.historicalDocument.title}`}>
      <rect width="600" height="360" rx="8" fill="#e9d8b7"/>
      <rect x="18" y="18" width="564" height="324" fill="none" stroke="#9e7428" strokeDasharray="4 5"/>
      <text x="42" y="55" fill="#8d3038" fontSize="15" fontFamily="serif">VIỆN LƯU TRỮ THỜI GIAN · HỒ SƠ GIẢI MÃ</text>
      {[95, 175, 255].map(y => <g key={y}><path d={`M42 ${y}h510m-510 16h430m-430 16h475`} stroke="#9e7428" opacity=".35"/></g>)}
      {(task.clues ?? []).map((clue, index) => <text key={clue.id} x="85" y={112 + index * 80} textLength="420" lengthAdjust="spacingAndGlyphs" fill="#24160a" fontSize="16" fontFamily="serif">{clue.text.slice(0, 85)}</text>)}
    </svg>
    <div className="evidence-hotspots">{task.clues?.map((clue, index) => <button type="button" key={clue.id} style={{ top: `${27 + index * 22}%` }} aria-pressed={active === clue.id} aria-controls={`clue-${clue.id}`} aria-label={`Soi manh mối ${index + 1}`} onClick={() => onSelect(clue.id)}>{index + 1}</button>)}</div>
    <figcaption>Bản dựng minh họa bằng vector, không phải ảnh chụp tư liệu gốc. Chạm số để soi manh mối.</figcaption>
  </figure>;
}
