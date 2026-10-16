import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const devPort = Number(env.VITE_DEV_PORT || 5173);

  return {
    server: {
      host: env.VITE_DEV_HOST || 'localhost',
      port: devPort,
      strictPort: true,
      hmr: {
        host: env.VITE_HMR_HOST || 'localhost',
        protocol: env.VITE_HMR_PROTOCOL || 'ws',
        clientPort: Number(env.VITE_HMR_CLIENT_PORT || devPort),
      },
    },
  };
});
