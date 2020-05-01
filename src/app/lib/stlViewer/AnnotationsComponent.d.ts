import { Component } from 'preact';
import { StlViewerContext } from './threejs/StlViewerContext';
import { IStlAnnotation } from '../model/IStlAnnotation';
export declare class AnnotationsComponent extends Component<IAnnotationsComponentProps, IAnnotationsComponentState> {
    private _raycastListener?;
    private _initHandler;
    componentWillMount(): void;
    componentWillUnmount(): void;
    render(): import("preact").VNode<any> | import("preact").VNode<any>[];
    private initComponent;
    private onIntersection;
    private onAnnotationClicked;
    private onAnnotationSaved;
    private onAnnotationDeleted;
}
interface IAnnotationsComponentProps {
    isEditable: boolean;
    showAnnotations: boolean;
    stlViewerContext: StlViewerContext;
    annotationList: Array<IStlAnnotation>;
    onAnnotationListChanged: (annotationList: Array<IStlAnnotation>) => void;
}
interface IAnnotationsComponentState {
    annotationList: Array<IStlAnnotation>;
    activeAnnotation: number;
}
export {};
