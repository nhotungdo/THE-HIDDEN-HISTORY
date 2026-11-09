import { createContext, useContext, useRef, useEffect, useCallback, type ReactNode } from 'react';
import type { SoundEffect } from '../types/game';
import { useGame } from './GameContext';
import { synthesizeSound } from '../services/soundManager';
type AudioControls={play:(sound:SoundEffect,volume?:number)=>void;stop:(sound:SoundEffect)=>void;playLoop:(sound:SoundEffect,volume?:number)=>void;stopAll:()=>void};
const AudioState=createContext<AudioControls|null>(null);
export function AudioProvider({children}:{children:ReactNode}){
 const {soundEnabled}=useGame();const context=useRef<AudioContext|null>(null);const loops=useRef(new Map<SoundEffect,ReturnType<typeof setInterval>>());
 const stop=useCallback((sound:SoundEffect)=>{clearInterval(loops.current.get(sound));loops.current.delete(sound)},[]);
 const stopAll=useCallback(()=>{loops.current.forEach(clearInterval);loops.current.clear();void context.current?.suspend()},[]);
 const play=useCallback((sound:SoundEffect,volume=.08)=>{if(!soundEnabled)return;try{const ctx=context.current??(context.current=new window.AudioContext());void ctx.resume().catch(()=>{});synthesizeSound(ctx,sound,Math.min(Math.max(volume,0),.15))}catch{/* Audio is optional. */}},[soundEnabled]);
 const playLoop=useCallback((sound:SoundEffect,volume=.05)=>{stop(sound);if(soundEnabled){play(sound,volume);loops.current.set(sound,setInterval(()=>play(sound,volume),1000))}},[play,soundEnabled,stop]);
 useEffect(()=>{if(!soundEnabled)stopAll();return stopAll},[soundEnabled,stopAll]);
 return <AudioState.Provider value={{play,stop,playLoop,stopAll}}>{children}</AudioState.Provider>;
}
export function useAudio(){const value=useContext(AudioState);if(!value)throw new Error('Missing AudioProvider');return value}
