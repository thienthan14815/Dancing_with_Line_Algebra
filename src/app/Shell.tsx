import type { ReactNode } from 'react';
import TopBar from './TopBar';
import BottomNav from './nav/BottomNav';
import DeveloperBanner from './developer/DeveloperBanner';
import { useDeveloperMode } from '../core/developerMode';

/** Khung 1 cột: TopBar trên · nội dung định tuyến · BottomNav đáy (thay sidebar). */
export default function Shell({ children }: { children: ReactNode }) {
  const developerMode = useDeveloperMode((state) => state.enabled);
  return (
    <div className="dl-shell">
      <TopBar />
      <DeveloperBanner />
      <main className="dl-content" key={developerMode ? 'preview' : 'learning'}>{children}</main>
      <BottomNav />
    </div>
  );
}
