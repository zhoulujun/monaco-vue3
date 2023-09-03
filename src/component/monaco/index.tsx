import {
  computed,
  CSSProperties,
  defineComponent,
  nextTick,
  onMounted,
  onUnmounted,
  PropType,
  ref,
  watch,
} from 'vue';
import * as monaco from 'monaco-editor';
import { promLanguageDefinition } from 'monaco-promql';
import './index.scss';
import { bkTooltips } from 'bkui-vue';
import { Code, UnfullScreen, FilliscreenLine } from 'bkui-vue/lib/icon';
// const monaco = await import(/* webpackPrefetch: true;" */'monaco-editor');

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import { format } from 'sql-formatter';
import { language } from 'monaco-promql/promql/promql';

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

if (!window.MonacoEnvironment) {
  window.MonacoEnvironment = {
    // 提供一个定义worker路径的全局变量
    getWorker(_: any, label: string) {
      if (label === 'json') {
        // eslint-disable-next-line new-cap
        return new jsonWorker();
      }
      if (label === 'typescript' || label === 'javascript') {
        // eslint-disable-next-line new-cap
        return new tsWorker();
      }
      // eslint-disable-next-line new-cap
      return new editorWorker(); // 基础功能文件， 提供了所有语言通用功能 无论使用什么语言，monaco都会去加载他。
    },
  };
}


export default defineComponent({
  name: 'MonacoEditor',
  directives: { bkTooltips },
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    original: {
      type: String,
      default: '',
    },
    showToolbox: {
      type: Boolean,
      default: true,
    },
    diffEditor: {
      type: Boolean,
      default: false,
    },
    isFull: {
      type: Boolean,
      default: false,
    },
    language: {
      type: String,
      default: 'sql',
    },
    line: {
      type: Number,
      default: null,
    },
    width: {
      type: String || Number,
      default: '100%',
    },
    height: {
      type: String || Number,
      default: '100%',
    },
    keywords: {
      type: Array as PropType<string[]>,
      default: (): string[] => [],
    },
    theme: {
      type: String,
      default: 'vs-dark',
    },
    onBeforeMount: {
      type: Function as PropType<(monacoLib: any, dom: HTMLElement) => any>,
    },
    options: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
    tooltips: {
      type: Object as PropType<Record<string, string>>,
      default: null,
    },
    isShowTooltips: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:modelValue', 'change', 'editorMounted'],
  setup(props, { emit, slots }) {
    let editor: monaco.editor.IStandaloneCodeEditor;
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
      if (props.tooltips) {
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
      if (language === 'promql') {
        const languageId = promLanguageDefinition.id;
        monaco.languages.register(promLanguageDefinition);
        monaco.languages.onLanguage(languageId, () => {
          promLanguageDefinition.loader().then((mod: any) => {
            const obj = mod.completionItemProvider.provideCompletionItems();
            let arr = [...obj.suggestions];
            arr = arr.map(ele => ({ ...ele, detail: 'Function' }));
            const list = props.keywords.map(keyword => (
              { label: keyword, insertText: keyword, kind: 17, insertTextRules: 4, detail: 'Metric' }
            ));
            arr = arr.concat(list);
            console.log('mod.language', mod.language);

            monaco.languages.setMonarchTokensProvider(languageId, mod.language);
            monaco.languages.setLanguageConfiguration(languageId, mod.languageConfiguration);
            monaco.languages.registerCompletionItemProvider(languageId, {
              provideCompletionItems: () => ({ suggestions: arr }),
            });
          });
        });
      }
      if (typeof props?.onBeforeMount === 'function') {
        await props?.onBeforeMount?.(monaco, dom.value);
      }
      editor = monaco.editor.create(dom.value, {
        value: modelValue,
        language,
        theme,
        wordWrap: 'on',
        ...options,
      });
      loading.value = false;
      editor.onDidChangeModelContent(() => {
        const value = editor.getValue() || '';
        emit('update:modelValue', value);
        emit('change', value);
      });
      emit('editorMounted', editor, dom.value);
    }


    function formatContext() {
      // const action = editor?.getAction('editor.action.formatDocument');
      // action.run();
      // @ts-ignore
      if (props.language === 'sql') {
        try {
          editor?.setValue(format(editor.getValue()));
        } catch (e) {
          console.error(e);
        }
        return;
      }
      // @ts-ignore
      editor?.trigger('anyString', 'editor.action.formatDocument');
      try {
        editor?.setValue(editor?.getValue());
      } catch (e) {
        console.error(e);
      }
    }

    onMounted(() => {
      initMonaco();
    });
    onUnmounted(() => {
      editor?.dispose();
      editor = null;
    });
    watch(
      () => props.modelValue,
      (newVal) => {
        if (editor && newVal !== editor.getValue()) {
          editor.setValue(newVal);
        }
      },
    );
    watch(
      () => props.language,
      (language) => {
        if (language && editor) {
          const model = editor.getModel();
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
    watch(
      () => props.line,
      (line) => {
        line && editor?.revealLine(line!);
      },
    );

    function fullScreen() {
      isFull.value = !isFull.value;
      nextTick(() => {
        editor?.layout();
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
