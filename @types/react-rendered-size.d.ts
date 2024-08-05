declare module "react-rendered-size" {
    export function getRenderedSize(element: ReactElement, containerWidth: number, containerOptions?: any): {
        height: number;
        width: number;
    };
    export function getRenderedHeight(...args: Array<any>[]): number;
    export function getRenderedWidth(...args: Array<any>[]): number;
    export default getRenderedSize;
}