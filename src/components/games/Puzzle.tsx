// ==========================================================================
// PUZZLE COMPONENTS – MẬT MÃ THỜI GIAN
// 5 HISTORICAL MINIGAME ENGINES (ARCHIVAL STYLING)
// ==========================================================================

import { useState } from 'react';
import { ArrowUp, ArrowDown, Check, Search, MapPin, CheckCircle, XCircle } from 'lucide-react';
import type { TaskData } from '../../types/game';
import type { Answers } from '../../utils/answers';
import EvidenceBoard from './EvidenceBoard';

type Props = {
  task: TaskData;
  answers: Answers;
  onChange: (answers: Answers) => void;
};

// ==========================================================================
// 1. TIMELINE ORDER GAME (Sắp xếp dòng thời gian)
// ==========================================================================
export function TimelineOrderGame({ task, answers, onChange }: Props) {
  const [dragged, setDragged] = useState<string | null>(null);
  // Sort options according to current answers mapping
  const ordered = [...task.options].sort((a, b) => {
    const valA = Number(answers[a.id] ?? (task.options.length - task.options.indexOf(a)));
    const valB = Number(answers[b.id] ?? (task.options.length - task.options.indexOf(b)));
    return valA - valB;
  });

  const move = (index: number, delta: number) => {
    const next = [...ordered];
    const targetIdx = index + delta;
    if (targetIdx < 0 || targetIdx >= next.length) return;
    [next[index], next[targetIdx]] = [next[targetIdx], next[index]];
    onChange(Object.fromEntries(next.map((o, i) => [o.id, String(i + 1)])));
  };

  const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI'];

  return (
    <div className="space-y-3">
      <div className="text-xs text-[#8A9BB0] italic flex items-center gap-1.5 mb-2">
        <span>⏱️ Sắp xếp các sự kiện theo đúng tiến trình từ sớm đến muộn:</span>
      </div>

      <div className="space-y-2.5">
        {ordered.map((o, i) => (
          <div
            key={o.id}
            data-option-id={o.id}
            draggable
            onDragStart={event => { if (event.currentTarget.closest('fieldset:disabled')) { event.preventDefault(); return; } setDragged(o.id); event.dataTransfer.setData('text/plain', o.id); }}
            onDragOver={event => event.preventDefault()}
            onDrop={event => {
              event.preventDefault();
              if (event.currentTarget.closest('fieldset:disabled') || !dragged) return;
              const next = ordered.filter(item => item.id !== dragged);
              const item = ordered.find(item => item.id === dragged);
              if (!item) return;
              next.splice(i, 0, item);
              onChange(Object.fromEntries(next.map((item, idx) => [item.id, String(idx + 1)])));
              setDragged(null);
            }}
            className="dossier-card p-3 rounded flex items-center justify-between gap-3 border border-[#D6A75C]/30 bg-[#0F1726] hover:border-[#D6A75C] transition-all"
          >
            {/* Chronological badge */}
            <div className="w-8 h-8 rounded bg-[#D6A75C]/15 border border-[#D6A75C] text-[#D6A75C] font-['Cinzel',serif] font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
              {romanNumerals[i] || i + 1}
            </div>

            {/* Event Description */}
            <div className="text-xs text-[#E9D8B7] font-medium flex-1 leading-snug">
              {o.text}
            </div>

            {/* Move controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                aria-label={`Đưa lên: ${o.text}`}
                disabled={i === 0}
                onClick={() => move(i, -1)}
                className="w-7 h-7 rounded border border-[#D6A75C]/40 bg-[#162032] hover:bg-[#D6A75C]/20 text-[#D6A75C] flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                title="Đưa lên sớm hơn"
              >
                <ArrowUp size={13} />
              </button>
              <button
                type="button"
                aria-label={`Đưa xuống: ${o.text}`}
                disabled={i === ordered.length - 1}
                onClick={() => move(i, 1)}
                className="w-7 h-7 rounded border border-[#D6A75C]/40 bg-[#162032] hover:bg-[#D6A75C]/20 text-[#D6A75C] flex items-center justify-center disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                title="Đưa xuống muộn hơn"
              >
                <ArrowDown size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================================================
// 2. DOSSIER MATCH GAME (Ghép hồ sơ sự kiện - văn kiện)
// ==========================================================================
export function DossierMatchGame({ task, answers, onChange }: Props) {
  const matchTargets = task.matchTargets ?? [];

  return (
    <div className="space-y-4">
      <div className="text-xs text-[#8A9BB0] italic mb-1">
        <span>📂 Chọn một đích khớp tương ứng cho mỗi văn kiện / chủ trương dưới đây:</span>
      </div>

      <div className="space-y-4">
        {task.options.map(o => {
          const selectedTargetId = answers[o.id];
          return (
            <div
              key={o.id}
              className="dossier-card p-4 rounded-lg border border-[#D6A75C]/30 bg-[#0D1524]"
            >
              <div className="font-['Cinzel',serif] text-xs font-bold text-[#D6A75C] mb-3 pb-1 border-b border-[#D6A75C]/15 flex items-center justify-between">
                <span>{o.text}</span>
                {selectedTargetId && (
                  <span className="text-[10px] text-[#4ADE80] font-mono flex items-center gap-1 font-semibold">
                    <Check size={12} /> ĐÃ GHÉP
                  </span>
                )}
              </div>

              {/* Choices grid */}
              <div className="grid grid-cols-1 gap-2">
                {[...matchTargets].reverse().map(target => {
                  const isChecked = selectedTargetId === target.id;
                  return (
                    <label
                      key={target.id}
                      className={`text-xs p-2.5 rounded border cursor-pointer flex items-center justify-between gap-2 transition-all ${
                        isChecked
                          ? 'border-[#D6A75C] bg-[#D6A75C]/15 text-[#FFF0D0] shadow-sm font-semibold'
                          : 'border-[#D6A75C]/15 bg-[#162032]/50 text-[#8A9BB0] hover:bg-[#162032] hover:text-[#E9D8B7]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={o.id}
                          checked={isChecked}
                          onChange={() => onChange({ ...answers, [o.id]: target.id })}
                          className="sr-only"
                        />
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                          isChecked ? 'border-[#D6A75C] bg-[#D6A75C]' : 'border-[#8A9BB0]/40'
                        }`}>
                          {isChecked && <span className="w-1.5 h-1.5 rounded-full bg-[#0A1020]" />}
                        </span>
                        <span className="leading-snug">{target.text}</span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================================================
// 3. TRUTH OR MYTH GAME (Thẩm định dữ kiện lịch sử ĐÚNG / SAI)
// ==========================================================================
export function TruthOrMythGame({ task, answers, onChange }: Props) {
  return (
    <div className="space-y-3.5">
      <div className="text-xs text-[#8A9BB0] italic mb-1">
        <span>📜 Đóng dấu thẩm định nhận định sau là ĐÚNG hay SAI:</span>
      </div>

      <div className="space-y-3">
        {task.options.map((o, idx) => {
          const currentVal = answers[o.id];
          return (
            <div
              key={o.id}
              className="dossier-card p-3.5 rounded border border-[#D6A75C]/20 bg-[#0F1726]"
            >
              <div className="text-xs text-[#E9D8B7] leading-relaxed mb-3">
                <span className="font-bold text-[#D6A75C] mr-1.5">#{idx + 1}.</span>
                {o.text}
              </div>

              {/* Wooden stamp buttons */}
              <div className="flex items-center gap-3">
                {/* Stamp: ĐÚNG */}
                <button
                  type="button"
                  aria-pressed={currentVal === 'true'}
                  onClick={() => onChange({ ...answers, [o.id]: 'true' })}
                  className={`flex-1 py-1.5 px-3 rounded border text-xs font-['Cinzel',serif] font-bold flex items-center justify-center gap-1.5 transition-all ${
                    currentVal === 'true'
                      ? 'border-[#4ADE80] bg-[#4ADE80]/20 text-[#4ADE80] shadow-[0_0_12px_rgba(74,222,128,0.3)]'
                      : 'border-[#4ADE80]/30 text-[#8A9BB0] hover:border-[#4ADE80]/70 hover:text-[#4ADE80]'
                  }`}
                >
                  <CheckCircle size={14} />
                  <span>ĐÚNG</span>
                </button>

                {/* Stamp: SAI */}
                <button
                  type="button"
                  aria-pressed={currentVal === 'false'}
                  onClick={() => onChange({ ...answers, [o.id]: 'false' })}
                  className={`flex-1 py-1.5 px-3 rounded border text-xs font-['Cinzel',serif] font-bold flex items-center justify-center gap-1.5 transition-all ${
                    currentVal === 'false'
                      ? 'border-[#F87171] bg-[#F87171]/20 text-[#F87171] shadow-[0_0_12px_rgba(248,113,113,0.3)]'
                      : 'border-[#F87171]/30 text-[#8A9BB0] hover:border-[#F87171]/70 hover:text-[#F87171]'
                  }`}
                >
                  <XCircle size={14} />
                  <span>SAI</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ==========================================================================
// 4. DOCUMENT DETECTIVE GAME (Thám tử soi tài liệu)
// ==========================================================================
export function DocumentDetectiveGame({ task, answers, onChange }: Props) {
  const clues = task.clues ?? [];
  const [activeClue, setActiveClue] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="text-xs text-[#8A9BB0] italic flex items-center gap-1 mb-1">
        <Search size={14} className="text-[#D6A75C]" />
        <span>Soi chiếu từng manh mối và chọn luận điểm giải thích xác đáng nhất:</span>
      </div>

      <div className="space-y-4">
        <EvidenceBoard task={task} active={activeClue} onSelect={setActiveClue} />
        {clues.map((c, i) => (
          <div
            key={c.id}
            id={`clue-${c.id}`}
            className="dossier-card p-4 rounded-lg border border-[#D6A75C]/30 bg-[#0D1524]"
          >
            {/* Clue quote snippet */}
            <div className="parchment-sheet p-3 rounded mb-3 text-xs leading-relaxed">
              <div className="text-[10px] uppercase font-bold text-[#8D3038] tracking-wider mb-1 flex items-center gap-1">
                <span>🔍 ĐIỂM NÓNG LỊCH SỬ {i + 1}:</span>
              </div>
              <button type="button" onClick={() => setActiveClue(activeClue === c.id ? null : c.id)} aria-expanded={activeClue === c.id} className="text-[#8D3038] underline text-xs">{activeClue === c.id ? 'Thu gọn manh mối' : 'Soi nội dung manh mối'}</button>
              <blockquote hidden={activeClue !== c.id} className="italic text-[#24160A] font-['Playfair_Display',serif]">
                "{c.text}"
              </blockquote>
            </div>

            <div className="text-xs font-semibold text-[#E9D8B7] mb-2.5">
              {c.question}
            </div>

            {/* Deduction options */}
            <div className="space-y-2">
              {[...c.options].reverse().map(o => {
                const isSelected = answers[c.id] === o.id;
                return (
                  <label
                    key={o.id}
                    className={`block p-2.5 rounded border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#D6A75C] bg-[#D6A75C]/15 text-[#FFF0D0] font-semibold shadow-sm'
                        : 'border-[#D6A75C]/15 bg-[#162032]/40 text-[#8A9BB0] hover:bg-[#162032] hover:text-[#E9D8B7]'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="radio"
                        name={c.id}
                        checked={isSelected}
                        onChange={() => onChange({ ...answers, [c.id]: o.id })}
                        className="sr-only"
                      />
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected ? 'border-[#D6A75C] bg-[#D6A75C]' : 'border-[#8A9BB0]/40'
                      }`}>
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#0A1020]" />}
                      </span>
                      <span className="leading-snug">{o.text}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================================================
// 5. CAMPAIGN MAP GAME (Sa bàn quân sự tác chiến)
// ==========================================================================
export function CampaignMapGame({ task, answers, onChange }: Props) {
  const [active, setActive] = useState(task.options[0]?.id || '');

  return (
    <div className="space-y-4">
      <div className="text-xs text-[#8A9BB0] italic leading-relaxed">
        🗺️ Chọn mục tiêu rồi chạm ô để đặt ghim. Sa bàn quy ước 4×4 phục vụ trò chơi, không phải bản đồ địa lý.
      </div>

      {/* Target selector pills */}
      <div className="flex flex-wrap gap-2">
        {task.options.map(o => {
          const isAssigned = !!answers[o.id];
          const isCurrentActive = active === o.id;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={isCurrentActive}
              onClick={() => setActive(o.id)}
              className={`text-xs px-3 py-1.5 rounded border flex items-center gap-1.5 transition-all ${
                isCurrentActive
                  ? 'border-[#D6A75C] bg-[#D6A75C] text-[#0A1020] font-bold shadow-md'
                  : isAssigned
                    ? 'border-[#4ADE80]/50 bg-[#4ADE80]/10 text-[#4ADE80]'
                    : 'border-[#D6A75C]/30 bg-[#162032] text-[#8A9BB0] hover:text-[#E9D8B7]'
              }`}
            >
              <MapPin size={12} />
              <span>{o.text}</span>
              {isAssigned && <span>✓</span>}
            </button>
          );
        })}
      </div>

      {/* Military Field Sand Table (4x4 Grid) */}
      <div className="military-grid rounded-lg p-2.5 max-w-md mx-auto shadow-2xl">
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 16 }, (_, i) => {
            const row = Math.floor(i / 4);
            const col = i % 4;
            const coord = `${row},${col}`;

            // Check if any option is assigned here
            const assignedOption = task.options.find(o => answers[o.id] === coord);

            // Hint label for the cell
            const hintOption = task.options.find(
              o => `${o.mapCoord?.row},${o.mapCoord?.col}` === coord
            );

            return (
              <button
                key={i}
                type="button"
                aria-label={`Tọa độ hàng ${row + 1}, cột ${col + 1}`}
                onClick={() => onChange({ ...Object.fromEntries(Object.entries(answers).filter(([id, position]) => id === active || position !== coord)), [active]: coord })}
                className={`aspect-square rounded p-1 flex flex-col items-center justify-center border text-center transition-all ${
                  assignedOption
                    ? 'bg-[#8D3038]/60 border-[#D6A75C] shadow-[0_0_10px_rgba(214,167,92,0.4)]'
                    : 'bg-[#0D1812]/80 border-[#3F5E46]/60 hover:border-[#D6A75C]/60 hover:bg-[#1A261D]'
                }`}
              >
                <span className="text-[9px] font-mono text-[#8A9BB0]/60">
                  {row + 1}:{col + 1}
                </span>

                {assignedOption ? (
                  <div className="text-[10px] font-bold text-[#FFF0D0] flex flex-col items-center leading-tight mt-0.5">
                    <span className="text-sm">🚩</span>
                    <span className="truncate max-w-full px-1">{assignedOption.text}</span>
                  </div>
                ) : hintOption ? (
                  <span className="text-[9px] text-[#A3B899] font-medium line-clamp-2 leading-tight mt-0.5 px-0.5">
                    {hintOption.text === 'Him Lam'
                      ? 'Phía Bắc'
                      : hintOption.text === 'Đồi A1'
                        ? 'Điểm cao Đông'
                        : hintOption.text === 'Mường Thanh'
                          ? 'Sân bay trung tâm'
                          : 'Hầm chỉ huy'}
                  </span>
                ) : (
                  <span className="text-[9px] text-[#3F5E46]">—</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Master Dispatcher
const games = {
  'timeline-order': TimelineOrderGame,
  'dossier-match': DossierMatchGame,
  'truth-or-myth': TruthOrMythGame,
  'document-detective': DocumentDetectiveGame,
  'campaign-map': CampaignMapGame,
};

export default function Puzzle(props: Props) {
  const Game = games[props.task.taskType];
  return <Game key={props.task.id} {...props} />;
}
