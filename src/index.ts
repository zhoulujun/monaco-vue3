import MonacoEditor from './component/monaco';

MonacoEditor.install = (app: any) => {
  app.component(MonacoEditor.name, MonacoEditor);
};
export default MonacoEditor;
