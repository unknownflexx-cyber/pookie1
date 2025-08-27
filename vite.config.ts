// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/pookie1/', // <-- change to match the repo name exactly
  plugins: [react()],
});
