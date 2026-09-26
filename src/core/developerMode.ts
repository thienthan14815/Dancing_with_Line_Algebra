import { create } from 'zustand';

export const DEVELOPER_MODE_KEY = 'linalglab:developer-mode';

export function readDeveloperMode(): boolean {
  try { return localStorage.getItem(DEVELOPER_MODE_KEY) === 'true'; }
  catch { return false; }
}

interface DeveloperModeState {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

/** Device preference only: excluded from synchronized learning data. */
export const useDeveloperMode = create<DeveloperModeState>((set) => ({
  enabled: readDeveloperMode(),
  setEnabled: (enabled) => {
    try { localStorage.setItem(DEVELOPER_MODE_KEY, String(enabled)); }
    catch { /* The switch still works when browser storage is unavailable. */ }
    set({ enabled });
  },
}));

export function isDeveloperMode(): boolean {
  return useDeveloperMode.getState().enabled;
}
