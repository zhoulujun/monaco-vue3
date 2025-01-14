import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx()
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "MonacoEditor",
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        "vue",
        "monaco-editor",
        "bkui-vue",
        "monaco-promql",
        "monaco-editor/esm/vs/editor/editor.worker?worker",
        "monaco-editor/esm/vs/editor/editor.worker",
        "monaco-editor/esm/vs/language/typescript/ts.worker?worker",
        "monaco-editor/esm/vs/language/typescript/ts.worker?",
        'monaco-editor/esm/vs/language/json/json.worker?worker',
        'monaco-editor/esm/vs/language/json/json.worker'
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
        },
      },
    },
  }
})
