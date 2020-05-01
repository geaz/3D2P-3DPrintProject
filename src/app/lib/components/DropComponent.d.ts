import { Component } from 'preact';
interface DropComponentProps {
    visibleDrop: boolean;
    content: string;
    onDrop: (fileDataUrl: string) => Promise<void>;
}
interface DropComponentState {
    dragging: boolean;
    loading: boolean;
}
export declare class DropComponent extends Component<DropComponentProps, DropComponentState> {
    private eventCounter;
    private _dragEnterHandler;
    private _dragLeaveHandler;
    private _dragOverHandler;
    private _dropHandler;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): import("preact").VNode<any> | import("preact").VNode<any>[];
    private handleDragEnter;
    private handleDragLeave;
    private handleDragOver;
    private handleDrop;
    private css;
}
export {};
