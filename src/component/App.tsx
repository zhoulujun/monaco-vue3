import { defineComponent, ref } from 'vue';
import MonacoEditor from './monaco/index';
import { Button } from 'bkui-vue';
// import MonacoEditor from '../../dist/index';
// import '../../dist/index.css';

export default defineComponent({
  name: 'Demo',
  setup() {
    const formData = ref({
      query_text: 'select * from andy',
    });
    const height = ref(300);
    return {
      formData,
      height
    };
  },
  render() {
    return (
      <div class="full-page">
        <div>title</div>
        <div><Button onClick={() => this.height = 400}>高度改为400px</Button></div>
        <div style="height:500px;background:#ccc;">
          <MonacoEditor
            theme="vs-dark"
            language="sql"
            title="SQL查询语句"
            height={this.height}
            v-model={this.formData.query_text}
          >
            {{
              loading: () => (<div>2222</div>),
            }}
          </MonacoEditor>
        </div>
      </div>
    );
  },

});
