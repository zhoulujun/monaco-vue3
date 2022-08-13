import { FunctionalComponent, HTMLAttributes } from 'vue';
export interface IIconBaseProps extends HTMLAttributes {
    width?: number | string;
    height?: number | string;
    fill?: string;
}
export interface IBkIconProps extends IIconBaseProps {
    data: any;
    name: string;
}
declare const bkIcon: FunctionalComponent<IBkIconProps>;
export default bkIcon;
