import {
  computed,
  CSSProperties,
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  ref, shallowRef,
  watch,
} from 'vue';
import * as monaco from 'monaco-editor';
import './index.scss';
import { bkTooltips } from 'bkui-vue';
import { Code, UnfullScreen, FilliscreenLine } from 'bkui-vue/lib/icon';
import { format } from 'sql-formatter';
import { props } from '@/component/monaco/props';


export default defineComponent({
  name: 'MonacoEditor',
  directives: { bkTooltips },
  props,
  emits: ['update:modelValue', 'change', 'editorMounted'],
  setup(props, { emit, slots }) {
    const editor = shallowRef<monaco.editor.IStandaloneCodeEditor>(null);
    const dom = ref<HTMLElement>();
    const isFull = ref(false);
    const loading = ref(true);
    const style = computed<CSSProperties>(() => {
      if (isFull.value) {
        return {
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 999999999,
          width: '100%',
          height: '100%',
        };
      }
      return {
        width: typeof props.width === 'number' ? `${props.width}px` : props.width,
        height: typeof props.height === 'number' ? `${props.height}px` : props.height,
      };
    });
    const tooltips: Record<string, string> = getTooltips();

    function getTooltips() {
      if (props?.tooltips) {
        return props.tooltips;
      }
      const currentLang = localStorage.getItem('blueking_language');

      if (currentLang !== 'zh-cn') {
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


    async function initMonaco() {
      if (!dom.value) {
        console.error('monaco editor dom is null');
        return;
      }
      const { modelValue, language, theme, options } = props;
      if (typeof props?.onBeforeMount === 'function') {
        await props?.onBeforeMount?.(monaco, dom.value);
      }
      editor.value = monaco.editor.create(dom.value, {
        value: modelValue,
        language,
        theme,
        wordWrap: 'on',
        ...options,
      });
      loading.value = false;
      editor.value.onDidChangeModelContent(() => {
        const value = editor.value.getValue() || '';
        emit('update:modelValue', value);
        emit('change', value);
      });
      emit('editorMounted', editor, dom.value);
    }

    function clearMistake() {
      monaco.editor.setModelMarkers(
        editor.value.getModel(),
        'eslint',
        [],
      );
    }

    function markMistake(range: any, type: keyof typeof monaco.MarkerSeverity, message: string) {
      const { startLineNumber, endLineNumber, startColumn, endColumn } = range;
      monaco.editor.setModelMarkers(
        editor.value.getModel(),
        'eslint',
        [{
          startLineNumber,
          endLineNumber,
          startColumn,
          endColumn,
          severity: monaco.MarkerSeverity[type], // type可以是Error,Warning,Info
          message,
        }],
      );
    }

    function formatSql(needValue: number) {
      clearMistake();
      try {
        editor.value.setValue(format(editor.value.getValue()));
      } catch (e) {
        const { message } = e;
        const list = message.split(' ');
        const line = list.indexOf('line');
        const column = list.indexOf('column');
        markMistake({
          startLineNumber: Number(list[line + 1]),
          endLineNumber: Number(list[line + 1]),
          startColumn: Number(list[column + 1]),
          endColumn: Number(list[column + 1]),
        }, 'Error', message);
      }
      if (needValue) {
        return editor.value.getValue();
      }
    }


    function formatContext() {
      if (props.language === 'sql') {
        formatSql(0);
        return;
      }
      // @ts-ignore
      editor.value?.trigger('anyString', 'editor.action.formatDocument');
      try {
        editor.value?.setValue(editor.value?.getValue());
      } catch (e) {
        console.error(e);
      }
    }

    function fullScreen() {
      isFull.value = !isFull.value;
      nextTick(() => {
        editor.value?.layout();
      });
    }

    function toolsRender() {
      if (!props.showToolbox) {
        return null;
      }
      if (typeof slots?.tools === 'function') {
        return slots?.tools(editor);
      }
      if (!props.isShowTooltips) {
        return (
          <div class="monaco-editor-toolbox">
            <div class="tools-item" onClick={formatContext}>
              <Code/>
            </div>
            <div class="tools-item" onClick={fullScreen}>
              {isFull.value ? <UnfullScreen/> : <FilliscreenLine/>}
            </div>
          </div>
        );
      }
      // {...(props.isShowTooltips ? { 'v-bkTooltips': { content: tooltips.format } } : {})}
      return (
        <div class="monaco-editor-toolbox">
          <div
            v-bkTooltips={{ content: tooltips.format }}
            class="tools-item"
            onClick={formatContext}
          >
            <Code/>
          </div>
          <div
            v-bkTooltips={{ content: isFull.value ? tooltips.exitScreen : tooltips.fullScreen }}
            class="tools-item"
            onClick={fullScreen}
          >
            {isFull.value ? <UnfullScreen/> : <FilliscreenLine/>}
          </div>
        </div>
      );
    }


    onMounted(() => {
      initMonaco();
    });
    onUnmounted(() => {
      editor.value?.dispose();
      editor.value = null;
    });
    watch(
      () => props.modelValue,
      (newVal) => {
        if (editor.value && newVal !== editor.value.getValue()) {
          editor.value.setValue(newVal);
        }
      },
    );
    watch(
      () => props.language,
      (language) => {
        if (language && editor) {
          const model = editor.value.getModel();
          model && monaco.editor.setModelLanguage(model, language);
        }
      },
    );
    watch(
      () => props.theme,
      (theme) => {
        if (theme && editor) {
          monaco.editor.setTheme(theme);
        }
      },
    );

    return {
      style,
      editor,
      toolsRender,
      dom,
      loading,
    };
  },
  render() {
    return (
      <div
        class="monaco-editor-wrap monaco-editor"
        style={this.style}
      >
        {this.loading ? this.$slots.loading?.() ?? '' : ''}
        {this.toolsRender()}
        <div ref="dom" class="monaco-editor-content"/>
      </div>
    );
  },
});
