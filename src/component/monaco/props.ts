import { ExtractPropTypes, PropType } from 'vue/dist/vue';

export const props = {
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
  },
  isShowTooltips: {
    type: Boolean,
    default: true,
  },
  tableNames: {
    type: Array as PropType<string[]>,
    default: (): string[] => [],
  },
  tableFields: {
    type: Object as PropType<Record<string, []>>,
    default: (): Record<string, []> => ({}),
  },
  dbName: {
    type: String,
  },
  suggestion: {
    type: Boolean,
    default: true,
  },
};
export type MonacoEditorProps = ExtractPropTypes<typeof props>;
