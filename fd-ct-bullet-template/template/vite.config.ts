import { fileURLToPath, URL } from 'node:url';

import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
const buildConfig = require('./build-user/config');
import { getPages, getBase } from './build-user/tool';
import { visualizer } from 'rollup-plugin-visualizer';
import type { IEnv } from './build-user/tool';
import externalGlobals from 'rollup-plugin-external-globals';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [
      vue(),
      vueJsx(),
      visualizer({
        open: false,
        gzipSize: true, // 分析图生成的文件名
        brotliSize: true, // 收集 brotli 大小并将其显示
        filename: 'report.html' // 分析图生成的文件名
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    publicPath:
      env.VITE_ENV !== 'development'
        ? buildConfig.envConfig[env.VITE_ENV]['domainUrl'] + buildConfig.appUrl
        : '/',
    envDir: '../../',
    root: 'src/pages', //项目根路径
    base: getBase(env.VITE_ENV as IEnv),
    publicDir: '../../public', //相对于项目根路径root设置
    //构建
    build: {
      emptyOutDir: true,
      outDir: '../../dist', //相对于项目根路径root设置
      assetsDir: 'assets',
      assetsInlineLimit: 10240, //小于10Kb的资源内联为base64编码
      rollupOptions: {
        input: getPages(),
        external: ['vue', 'element-plus', '@element-plus/icons-vue', 'vue-demi'],
        plugins: [
          externalGlobals({
            vue: 'Vue',
            'element-plus': 'ElementPlus',
            // 👇 配置 vue-demi 全局变量 👇
            'vue-demi': 'VueDemi',
            '@element-plus/icons-vue': 'ElementPlusIconsVue'
          })
        ]
      }
    },
    server: buildConfig.devServer
  };
});
