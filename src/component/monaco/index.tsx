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
import Code from '../icons/code';
import FullScreen from '../icons/filliscreen-line';
import UnFullScreen from '../icons/unfull-screen';
import './index.scss';
// const monaco = await import(/* webpackPrefetch: true;" */'monaco-editor');

export default defineComponent({
  name: 'MonacoEditor',
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
      default: 'sql',
    },
    theme: {
      type: String,
      default: 'vs-dark',
    },
    onBeforeMount: {
      type: Function,
      default() {},
    },
    options: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
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

    async function  initMonaco() {
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
      await props?.onBeforeMount(monaco, dom.value);
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


    function format() {
      // editor?.getAction('editor.action.formatDocument')
      // @ts-ignore
      editor?.trigger('anyString', 'editor.action.formatDocument');
      // editor?.setValue(editor?.getValue())
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
      if (slots?.tools) {
        return slots?.tools(editor);
      }
      return (
                <div class='monaco-editor-toolbox'>
                    <div
                        class='tools-item'
                        onClick={format}
                    >
                        <Code/>
                    </div>
                    <div
                        class='tools-item'
                        onClick={fullScreen}
                    >
                        {isFull.value ? <UnFullScreen/> : <FullScreen/>}
                    </div>
                </div>
      );
    }

    return {
      style,
      toolsRender,
      dom,
      loading,
    };
  },
  render() {
    return (
            <div
                class='monaco-editor-wrap monaco-editor'
                style={this.style}
            >
                {this.loading ? this.$slots.loading?.() ?? '' : ''}
                {this.toolsRender()}
                <div ref='dom' class='monaco-editor-content'/>
            </div>
    );
  },
});
