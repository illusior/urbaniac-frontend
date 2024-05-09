import {
  UserConfig,
  defineConfig,
  loadEnv,
} from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';

type ViteServer = Exclude<UserConfig['server'], null | undefined>;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  const host: ViteServer['host'] = (() => {
    if (!('VITE_HOST' in env)) {
      return undefined;
    }

    return env.VITE_HOST;
  })();

  const vitePort: ViteServer['port'] = (() => {
    if (!('VITE_PORT' in env)) {
      return undefined;
    }

    const port = Number(env.VITE_PORT);
    if (Number.isNaN(port)) {
      return undefined;
    }

    return port;
  })();

  return {
    define: { __APP_ENV__: JSON.stringify(env.APP_ENV) },
    plugins: [
      react(),
    ],
    resolve: {
      alias: [
        {
          find: '~',
          replacement: path.resolve(__dirname, '../src'),
        },
      ],
    },
    server: {
      host: host,
      port: vitePort,
    },
  };
});
