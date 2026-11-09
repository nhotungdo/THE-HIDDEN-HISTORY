import { useEffect, useState } from 'react';
import { useGame } from '../../context/GameContext';

export default function NarrationButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);
  const [error, setError] = useState('');
  const { soundEnabled } = useGame();
  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);
  useEffect(() => { if (!soundEnabled && 'speechSynthesis' in window) { window.speechSynthesis.cancel(); setSpeaking(false); } }, [soundEnabled]);
  if (!('speechSynthesis' in window)) return null;
  const toggle = () => {
    if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); return; }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'vi-VN'; utterance.rate = .9;
    utterance.voice = window.speechSynthesis.getVoices().find(v => v.lang.startsWith('vi')) ?? null;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => { setSpeaking(false); setError('Thiết bị chưa hỗ trợ giọng đọc này.'); };
    setError(''); setSpeaking(true); window.speechSynthesis.speak(utterance);
  };
  return <div><button type="button" className="btn-heritage-secondary text-xs" disabled={!soundEnabled} aria-pressed={speaking} onClick={toggle}>{speaking ? 'Dừng thuyết minh' : 'Nghe thuyết minh'}</button>{error && <p role="status">{error}</p>}</div>;
}
