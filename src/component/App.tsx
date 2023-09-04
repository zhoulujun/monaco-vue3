import { defineComponent, ref } from 'vue';
import MonacoEditor from './monaco/index';
// import MonacoEditor from '../../dist/index';
// import '../../dist/index.css';

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
      <div class="full-page">
        <div>title</div>
        <div style="height:400px;">
          <MonacoEditor
            theme="vs-dark"
            language="sql"
            title="SQL查询语句"
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
