# Monaco Editor Vue3
Monaco Editor is the code editor that powers VS Code, now it's available as a Vue3 component 
## Install
`monaco-vue3-editor` 依赖
```json
{
  "peerDependencies": {
    "vue": "^3.2.37",
    "monaco-editor": "^0.34.0",
    "monaco-promql": "^1.7.4"
  }
}
```
monaco-promql 根据项目情况添加
```shell
npm i monaco-vue3-editor monaco-editor
```
### 开启辅助功能
安装monaco-editor-webpack-plugin这个模块。
```shell
npm install monaco-editor-webpack-plugin
```
在webpack.config.js中进行配置，MonacoWebpackPlugin可以接受language和features来配置辅助功能，具体配置参数可以查看npm官网即可。
#### webpack
```javascript
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    plugins: [
        new MonacoWebpackPlugin()
    ]
}
```
### vue-cli  bkui-cli
```javascript
module.exports = {
    configureWebpack(_webpackConfig) {
        webpackConfig = _webpackConfig;
        webpackConfig.plugins.push(
            new MonacoWebpackPlugin({
                // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
                languages: ['json', 'sql']
            }),
        )
    }
}

```

## Usage
```tsx
import { defineComponent, ref } from 'vue';
import MonacoEditor from 'monaco-vue3-editor';

export default defineComponent({
  name: 'Demo',
  setup() {
    const formData = ref({
      query_text: 'select * from andy',
    });
    return {
      formData,
    };
  },
  render() {
    return (
            <div class='full-page'>
                <div>title</div>
                <div style='height:400px;'>
                    <MonacoEditor
                        theme='vs-dark'
                        language='sql'
                        v-model={this.formData.query_text}
                    />
                </div>
            </div>
    );
  },

});
```
## Props

| Name            | Type                                        | Default   | Description                                                                                                                                              | remark |
|-----------------|---------------------------------------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------------| --- |
| v-model         | `string`                                    |           | default value of the current model                                                                                                                       |  |
| language        | `string`                                    |           | language of the current model                                                                                                                            | languages supported by `monaco-editor` [view here](https://github.com/microsoft/monaco-editor/tree/main/src/basic-languages) |
| theme           | `string`                                    | `vs-dark` | VS code theme                                                                                                                                            | theme of the `monaco-editor` | `monaco.editor.defineTheme(...)` |
| showToolbox     | `boolean`                                   | `true`    | whether show  Toolbox                                                                                                                                           | theme of the `monaco-editor` | `monaco.editor.defineTheme(...)` |
| options         | `object`                                    | `{}`      | [IStandaloneEditorConstructionOptions](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IStandaloneEditorConstructionOptions.html) |  |
| width           | `number` \                                  | `string`  | `100%`                                                                                                                                                   | container width |  |
| height          | `number` \                                  | `string`  | `100%`                                                                                                                                                   | container height |  |
| onBeforeMount   | `(monaco: Monaco, dom:HTMLElement) => void` |           | execute before the editor instance is created                                                                                                            |  |

## Event

| Name            | Type                                                                          | Default   | Description                                                                                                                                              | remark |
|-----------------|-------------------------------------------------------------------------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------------------------| --- |
| onEditorMounted | `(editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco,dom:HTMLElement) => void` |           | execute after the editor instance has been created                                                                                                       |  |
| onChange        | `(value: string)`                                                             |           |                                                                                                                                                          | execute when  the changed value change | `monaco.editor.IModelContentChangedEvent) => void` |

## slots

| Name             | Description             |                                                                                                                                    
|------------------|-------------------------|
| loading          | Before Monaco init show |  
| tools            | tools                   |  
