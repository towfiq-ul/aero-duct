import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = parseInt(env.PORT || '3000', 10); console.log("CONFIG PORT:", port);
  const isDeploy = mode === 'production' || mode === 'sit';

  return {
    // GitHub Pages hosts the site at /aero-duct/ — set base for production/sit builds.
    // Local dev stays at "/" so hot-reload and asset paths work without a prefix.
    base: isDeploy ? '/aero-duct/' : '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: port,
      strictPort: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  }
})
