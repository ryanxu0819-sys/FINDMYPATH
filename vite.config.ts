import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Prevent "process is not defined" error in browser by replacing it with a string literal
      // If env.API_KEY is undefined, it falls back to empty string to prevent crashes
      'process.env.API_KEY': JSON.stringify(env.API_KEY || ''),
    },
  };
});
