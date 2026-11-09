import { useId } from 'react';

export default function MemoryArtifact({ chapterId, name, rotation = 0 }: { chapterId: number; name: string; rotation?: number }) {
  const id = useId().replace(/:/g, '');
  return <svg viewBox="0 0 120 120" role="img" aria-label={name} className="memory-artifact" style={{ transform: `perspective(600px) rotateY(${rotation}deg) rotateX(8deg)` }}>
    <defs><linearGradient id={id} x2="1" y2="1"><stop stopColor="#fff0c0"/><stop offset=".45" stopColor="#d6a75c"/><stop offset="1" stopColor="#76501e"/></linearGradient></defs>
    <circle cx="60" cy="60" r="53" fill="#101827" stroke={`url(#${id})`} strokeWidth="3"/>
    <circle cx="60" cy="60" r="46" fill="none" stroke="#d6a75c" strokeDasharray="2 5"/>
    <g fill={`url(#${id})`} stroke="#f5cf8e" strokeWidth="1.5" strokeLinejoin="round">
      {chapterId === 1 && <><path d="M37 64h46v23H37zM43 58h34v6H43zM48 42l12-9 12 9v16H48z"/><path d="M53 75h14M60 69v12" fill="none"/></>}
      {chapterId === 2 && <><path d="M38 32h39v48H38zM77 32q12-2 9 10H77M38 80q-10-2-8 9h47q10 0 8-9z"/><path d="M46 45h23M46 54h23M46 63h16" stroke="#76501e"/></>}
      {chapterId === 3 && <><path d="M42 92V28" fill="none" strokeWidth="4"/><path d="M44 30q17-8 39 2v33q-20-10-39-2z"/><path d="m63 39 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="#8d3038"/></>}
      {chapterId === 4 && <path d="m60 26 10 23 26 3-20 18 6 25-22-13-22 13 6-25-20-18 26-3z"/>}
      {chapterId === 5 && <><path d="m51 28 18 0 3 11 10 6 11-3 9 16-8 8v11l8 8-9 16-11-3-10 6-3 11H51l-3-11-10-6-11 3-9-16 8-8V66l-8-8 9-16 11 3 10-6z" transform="translate(8 -5) scale(.85)"/><circle cx="60" cy="56" r="16" fill="#101827"/></>}
    </g>
  </svg>;
}
