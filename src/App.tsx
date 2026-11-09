import { useEffect, lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import { AudioProvider } from './context/AudioContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
const Landing = lazy(() => import('./pages/01_LandingPage'));
const HowToPlay = lazy(() => import('./pages/02_HowToPlayPage'));
const Setup = lazy(() => import('./pages/03_PlayerSetupPage'));
const Story = lazy(() => import('./pages/04_StoryPage'));
const Timeline = lazy(() => import('./pages/05_TimelinePage'));
const Chapter = lazy(() => import('./pages/06_ChapterIntroPage'));
const Game = lazy(() => import('./pages/07_GameRoomPage'));
const Result = lazy(() => import('./pages/08_LevelResultPage'));
const Collection = lazy(() => import('./pages/09_CollectionPage'));
const Archive = lazy(() => import('./pages/10_HistoryArchivePage'));
const Ending = lazy(() => import('./pages/11_EndingPage'));
const Certificate = lazy(() => import('./pages/12_CertificatePage'));
function Protected({children}:{children:ReactNode}){const {progress}=useGame();return progress.profile?children:<Navigate to="/setup" replace/>}
function Shell(){const {pathname}=useLocation();useEffect(()=>{window.scrollTo(0,0)},[pathname]);const routes: [string, ReactNode][] = [['/story',<Story/>],['/timeline',<Timeline/>],['/chapter/:id',<Chapter/>],['/play/:id',<Game/>],['/result/:id',<Result/>],['/collection',<Collection/>],['/ending',<Ending/>],['/certificate',<Certificate/>]];return <><Header/><Suspense fallback={<main className="page" role="status">Đang mở hồ sơ…</main>}><Routes><Route path="/" element={<Landing/>}/><Route path="/how-to-play" element={<HowToPlay/>}/><Route path="/setup" element={<Setup/>}/><Route path="/archive" element={<Archive/>}/>{routes.map(([path,element])=><Route key={path} path={path} element={<Protected>{element}</Protected>}/>)}<Route path="*" element={<Navigate to="/" replace/>}/></Routes></Suspense><Footer/></>}
export default function App(){return <BrowserRouter><GameProvider><AudioProvider><Shell/></AudioProvider></GameProvider></BrowserRouter>}
