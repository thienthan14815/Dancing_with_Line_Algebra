import { useState, type ReactNode } from 'react';
import TopBar from './TopBar';
import SideNav from './nav/SideNav';

/** Khung giao diện: SideNav + TopBar + nội dung định tuyến. */
export default function Shell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={`dl-shell ${collapsed ? 'nav-collapsed' : ''}`}>
      <SideNav collapsed={collapsed} />
      <div className="dl-shell-main">
        <TopBar onMenu={() => setCollapsed((c) => !c)} />
        <main className="dl-content">{children}</main>
      </div>
    </div>
  );
}
