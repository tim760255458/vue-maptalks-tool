import { fileURLToPath, URL } from 'node:url'
import { resolve } from 'path'

import { defineConfig } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import libCss from 'vite-plugin-libcss'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue2(),
    // libCss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    cssCodeSplit: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'vueMaptalksTool',
      fileName: 'vue-maptalks-tool'
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue', 'maptalks', 'maptalks/dist/maptalks.css'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
          maptalks: 'maptalks'
        }
      }
    }
  }
})
