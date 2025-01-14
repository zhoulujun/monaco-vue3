# Monaco Editor Vue3
Monaco Editor is the code editor that powers VS Code, now it's available as a Vue3 component 
## Install
`monaco-vue3-editor` 依赖
```json
{
  "peerDependencies": {
    "bkui-vue": "^0.0.2-beta.25",
    "monaco-editor": "^0.41.0",
    "vue": "^3.2.37"
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

| Name          | Type          | Default | Description                                                                                                                                              | remark |
|---------------|---------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------| --- |
| v-model       | `string`      |         | default value of the current model                                                                                                                       |  |
| language      | `string`      |         | language of the current model                                                                                                                            | languages supported by `monaco-editor` [view here](https://github.com/microsoft/monaco-editor/tree/main/src/basic-languages) |
| theme         | `string`      | `vs-dark` | VS code theme                                                                                                                                            | theme of the `monaco-editor` | `monaco.editor.defineTheme(...)` |
| diffEditor  | `boolean`     | `false`  |                                                                                                                                                          | theme of the `monaco-editor` | `monaco.editor.defineTheme(...)` |
| isShowHeader  | `boolean`     | `true`  | whether show  header                                                                                                                                     | theme of the `monaco-editor` | `monaco.editor.defineTheme(...)` |
| title         | `string`      | ``      | title content                                                                                                                                            | theme of the `monaco-editor` | `monaco.editor.defineTheme(...)` |
| isShowToolbox | `boolean`     | `true`  | whether show  Toolbox                                                                                                                                    | theme of the `monaco-editor` | `monaco.editor.defineTheme(...)` |
| isShowTooltips | `boolean`     | `true`  | whether show  Toolbox  Tooltips                                                                                                                                  | theme of the `monaco-editor` | `monaco.editor.defineTheme(...)` |
| currentLang | `string`     |     | Toolbox tooltips defualt lang                                                                                                                            | theme of the `monaco-editor` | `monaco.editor.defineTheme(...)` |
| tooltips       | `object`      |         |                                                                                                                                                          |  |
| options       | `object`      | `{}`    | [IStandaloneEditorConstructionOptions](https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.IStandaloneEditorConstructionOptions.html) |  |
| width         | `number`      | `string` | `100%`                                                                                                                                                   | container width |  |
| height        | `number`      | `string` | `100%`                                                                                                                                                   | container height |  |
| onBeforeMount | `(monaco: Monaco, dom:HTMLElement) => void` |         | execute before the editor instance is created                                                                                                            |  |



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
| title            | title                   |  

## expose

```javascript
 expose({
  isFull,
  style,
  editor,
  domRef,
  loading,
  clearMistake,
  formatContext,
  fullScreen,
  resize,
});
```

### tooltips
tools tooltips

| props  | value                   |                                                                                                                                    
|--------|-------------------------|
| format | Format |  
| fullScreen  | Full Screen                   |  
| exitScreen  | Exit Full Screen                   |  
| adjustFontSize  | Adjusting the font size                  |
```javascript
function getTooltips() {
      if (props?.tooltips) {
        return props.tooltips;
      }
      const currentLang = props?.currentLang ?? localStorage.getItem('blueking_language');

      if (currentLang === 'en') {
        return {
          format: 'Format',
          fullScreen: 'Full Screen',
          exitScreen: 'Exit Full Screen',
          adjustFontSize: 'Adjusting the font size',
        };
      }
      return {
        format: '格式化',
        fullScreen: '全屏',
        exitScreen: '退出全屏',
        adjustFontSize: '调整字号大小',
      };
    }
```
