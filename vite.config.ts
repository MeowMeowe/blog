import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteEslint from 'vite-plugin-eslint';
// import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        viteEslint({
            failOnError: false
        })
        // createSvgIconsPlugin({
        //     iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        //     symbolId: 'icon-[dir]-[name]'
        // })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: "@import 'src/assets/style/public.scss';",
                javascriptEnabled: true,
                charset: false
            }
        }
    },
    build: {
        minify: 'terser', // 默认值：esbuild，它比 terser 快 20-40 倍，压缩率只差 1%-2%
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        }
    }
});
