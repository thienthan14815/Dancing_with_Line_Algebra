import type { ReactNode } from 'react';
import TopBar from './TopBar';
import BottomNav from './nav/BottomNav';

/** Khung 1 cột: TopBar trên · nội dung định tuyến · BottomNav đáy (thay sidebar). */
export default function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="dl-shell">
      <TopBar />
      <main className="dl-content">{children}</main>
      <BottomNav />
    </div>
  );
}
