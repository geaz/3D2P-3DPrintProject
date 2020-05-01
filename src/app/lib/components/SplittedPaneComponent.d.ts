import { Component } from 'preact';
interface SplittedPaneComponentProps {
    leftPaneComponent: Component;
    rightPaneComponent: Component;
}
export declare class SplittedPaneComponent extends Component<SplittedPaneComponentProps> {
    private _leftPaneSize;
    render(): import("preact").VNode<any> | import("preact").VNode<any>[];
    private css;
}
export {};
