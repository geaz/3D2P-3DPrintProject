import { Component } from 'preact';
import { Vector2, Vector3 } from 'three';
import { StlViewerContext } from './threejs/StlViewerContext';
import { IStlAnnotation } from '../model/IStlAnnotation';
export declare class AnnotationItemComponent extends Component<IAnnotationItemComponentProps, IAnnotationItemComponentState> {
    private _mdRenderer;
    private _sprite?;
    private _textareaElement?;
    private _numberContainerElement?;
    private _initHandler;
    componentWillMount(): void;
    componentDidMount(): void;
    componentDidUpdate(): void;
    componentWillUnmount(): void;
    render(): import("preact").VNode<any> | import("preact").VNode<any>[];
    private initDepthSprite;
    private checkDepth;
    private onAnnotationSaved;
    private onAnnotationDeleted;
    private onNumberClicked;
    get Name(): string;
    get ShouldShow(): boolean;
    get ScreenPos(): Vector2;
    get DevicePos(): Vector3;
    get WorldPos(): Vector3;
    private css;
}
interface IAnnotationItemComponentProps {
    index: number;
    active: boolean;
    isEditable: boolean;
    annotation: IStlAnnotation;
    stlViewerContext: StlViewerContext;
    onClicked: (index: number) => void;
    onAnnotationSaved: (annotation: IStlAnnotation) => void;
    onAnnotationDeleted: (annotation: IStlAnnotation) => void;
}
interface IAnnotationItemComponentState {
    isEditMode: boolean;
}
export {};
