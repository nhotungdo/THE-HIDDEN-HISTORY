import { useEffect, lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import { AudioProvider } from './context/AudioContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { MotionConfig } from 'framer-motion';

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

function Protected({ children }: { children: ReactNode }) {
  const { progress } = useGame();
  return progress.profile ? <>{children}</> : <Navigate to="/setup" replace />;
}

function Shell() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  const routes: [string, ReactNode][] = [
    ['/story', <Story />],
    ['/timeline', <Timeline />],
    ['/chapter/:id', <Chapter />],
    ['/play/:id', <Game />],
    ['/result/:id', <Result />],
    ['/collection', <Collection />],
    ['/ending', <Ending />],
    ['/certificate', <Certificate />],
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#070D18] text-[#E9D8B7] relative overflow-x-hidden selection:bg-[#D6A75C]/30 selection:text-[#FFF2D6]">
      <a href="#main-content" className="skip-link">Bỏ qua điều hướng, tới nội dung chính</a>
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 w-full flex flex-col pt-[58px] outline-none">
        <Suspense
          fallback={
            <div
              className="flex-1 min-h-[60vh] flex flex-col items-center justify-center gap-4 py-24 text-center"
              role="status"
              aria-live="polite"
            >
              <div className="w-10 h-10 rounded-full border-2 border-[#D6A75C] border-t-transparent animate-spin" />
              <div className="text-xs font-mono text-[#D6A75C] tracking-widest uppercase">
                ĐANG MỞ HỒ SƠ LƯU TRỮ...
              </div>
              <p className="text-[11px] text-[#8A9BB0]">Hồ sơ thời gian đang được tải, vui lòng đợi trong giây lát.</p>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/how-to-play" element={<HowToPlay />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/archive" element={<Archive />} />
            {routes.map(([path, element]) => (
              <Route key={path} path={path} element={<Protected>{element}</Protected>} />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <GameProvider>
          <AudioProvider>
            <Shell />
          </AudioProvider>
        </GameProvider>
      </BrowserRouter>
    </MotionConfig>
  );
}
