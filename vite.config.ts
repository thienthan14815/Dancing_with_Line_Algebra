/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Lắng nghe cả IPv4 lẫn IPv6 — máy này Vite mặc định chỉ bind ::1
  // khiến trình duyệt mở "localhost" (phân giải IPv4) không vào được.
  server: {
    host: true,
  },
  test: {
    globals: true,
    environment: 'node',
  },
});
