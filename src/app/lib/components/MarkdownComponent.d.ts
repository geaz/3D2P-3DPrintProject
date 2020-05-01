import { Component } from 'preact';
interface MarkdownComponentProps {
    markdownUrl: string;
}
interface MarkdownComponentState {
    loading: boolean;
    content: string;
}
export declare class MarkdownComponent extends Component<MarkdownComponentProps, MarkdownComponentState> {
    private _mdRenderer;
    componentWillMount(): Promise<void>;
    render(): import("preact").VNode<any> | import("preact").VNode<any>[];
}
export {};
