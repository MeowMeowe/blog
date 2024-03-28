import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteEslint from 'vite-plugin-eslint';
import { visualizer } from 'rollup-plugin-visualizer'; // 打包分析
import obfuscatorPlugin from 'rollup-plugin-javascript-obfuscator'; // 代码混淆
// import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'; // svg图标

import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        visualizer({
            emitFile: true,
            filename: 'stats.html',
            open: true
        }),
        viteEslint({
            failOnError: false
        }),
        {
            apply: 'build',
            ...obfuscatorPlugin({
                options: {
                    // Your javascript-obfuscator options here
                    // See what's allowed: https://github.com/javascript-obfuscator/javascript-obfuscator
                    compact: true,
                    controlFlowFlattening: false,
                    deadCodeInjection: false,
                    debugProtection: false,
                    debugProtectionInterval: 0,
                    disableConsoleOutput: true,
                    identifierNamesGenerator: 'hexadecimal',
                    log: false,
                    numbersToExpressions: false,
                    renameGlobals: false,
                    selfDefending: true,
                    simplify: true,
                    splitStrings: false,
                    stringArray: true,
                    stringArrayCallsTransform: false,
                    stringArrayEncoding: [],
                    stringArrayIndexShift: true,
                    stringArrayRotate: true,
                    stringArrayShuffle: true,
                    stringArrayWrappersCount: 1,
                    stringArrayWrappersChainedCalls: true,
                    stringArrayWrappersParametersMaxCount: 2,
                    stringArrayWrappersType: 'variable',
                    stringArrayThreshold: 0.75,
                    unicodeEscapeSequence: false
                }
            })
        }
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
    server: {
        open: true,
        cors: true,
        proxy: {
            '/api': {
                target: 'https://meowgod.com/',
                changeOrigin: true
            }
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
