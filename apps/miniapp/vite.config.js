import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => [
          'view', 'scroll-view', 'text', 'image', 'button', 'input',
          'swiper', 'swiper-item', 'navigator', 'form', 'textarea',
          'checkbox', 'radio', 'picker', 'icon', 'progress', 'slider',
          'switch', 'audio', 'video', 'map', 'canvas', 'web-view',
          'rich-text', 'cell', 'cell-group', 'field', 'tabs', 'tab',
          'tab-bar', 'tab-bar-item', 'grid', 'grid-item', 'list',
          'list-item', 'notice-bar', 'search', 'sticky', 'skeleton',
          'overlay', 'popup', 'action-sheet', 'dialog', 'dropdown-menu',
          'dropdown-item', 'loading', 'tag', 'badge', 'notify', 'toast',
          'collapse', 'collapse-item', 'count-down', 'divider',
          'empty', 'fab', 'floating-panel', 'gesture', 'highlight',
          'image-preview', 'index-bar', 'index-anchor', 'link',
          'nav-bar', 'number-keyboard', 'overlay', 'passphrase',
          'popover', 'pull-refresh', 'rate', 'result', 'share-sheet',
          'sidebar', 'sidebar-item', 'sign', 'step', 'steps',
          'swipe-cell', 'switch-cell', 'tab-swipe', 'text-cell',
          'time-picker', 'tree-select', 'uploader', 'virtual-list',
          'watermark',
        ].includes(tag),
      },
    },
  })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'uni': path.resolve(__dirname, 'src/uni-stubs.ts'),
    },
  },
  optimizeDeps: {
    exclude: ['@dcloudio/uni-app', '@dcloudio/uni-h5', '@dcloudio/uni-components', '@dcloudio/vite-plugin-uni', '@dcloudio/uni-cli-shared'],
    include: ['vue', 'vue-router', 'pinia', 'axios'],
  },
  server: {
    port: 5173,
    host: true,
    allowedHosts: ['.monkeycode-ai.online'],
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})