import { Component } from 'preact';
import { StlViewerContext } from './threejs/StlViewerContext';
export declare class StlViewerComponent extends Component<StlViewerProps> {
    private _currentStlFileUrl?;
    private _mesh?;
    private _scene?;
    private _meshParent?;
    private _material?;
    private _controls?;
    private _camera?;
    private _renderer?;
    private _resizeHandler;
    componentDidMount(): Promise<void>;
    componentDidUpdate(): Promise<void>;
    componentWillUnmount(): void;
    render(): import("preact").VNode<any> | import("preact").VNode<any>[];
    resetCamera(): void;
    resizeRenderer(): void;
    private initScene;
    private loadStl;
    private updateSceneStl;
    private animate;
    private css;
}
interface StlViewerProps {
    stlFileUrl: string;
    color: number;
    onViewerInitiated: (stlViewerContext: StlViewerContext) => void;
}
export {};
