import { CSSProperties } from 'vue';
import './index.scss';
declare const _default: import("vue").DefineComponent<Readonly<import("vue").ComponentPropsOptions<{
    [x: string]: unknown;
}>>, {
    style: import("vue").ComputedRef<CSSProperties>;
    toolsRender: () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>[] | JSX.Element;
    dom: import("vue").Ref<HTMLElement>;
    loading: import("vue").Ref<boolean>;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("change" | "update:modelValue" | "editorMounted")[], "change" | "update:modelValue" | "editorMounted", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<readonly string[] | import("vue").ExtractPropTypes<Readonly<import("vue").ComponentObjectPropsOptions<{
    [x: string]: unknown;
}>>>> & {
    onChange?: (...args: any[]) => any;
    "onUpdate:modelValue"?: (...args: any[]) => any;
    onEditorMounted?: (...args: any[]) => any;
}, {
    [x: number]: string;
} | {}>;
export default _default;
