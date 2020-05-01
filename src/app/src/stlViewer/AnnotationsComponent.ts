import { h, Component } from 'preact';
import htm from 'htm';

import { Intersection } from 'three';
import { RaycasterEventListener } from './threejs/RaycasterEventListener';
import { AnnotationItemComponent } from './AnnotationItemComponent';
import { StlViewerContext } from './threejs/StlViewerContext';
import { IStlAnnotation } from '../model/IStlAnnotation';

const html = htm.bind(h);

export class AnnotationsComponent extends Component<IAnnotationsComponentProps, IAnnotationsComponentState> {
    private _raycastListener?: RaycasterEventListener;
    private _initHandler: () => void = this.initComponent.bind(this);

    public componentWillMount() {
        this.props.stlViewerContext.addStlLoadedListener(this._initHandler);
    }

    public componentWillUnmount() {
        if(this._raycastListener !== undefined){
            this._raycastListener.dispose();
        }     
        this.props.stlViewerContext.removeStlLoadedListener(this._initHandler);   
    }

    public render() {
        let annotationItemList = undefined;
        if(this.props.showAnnotations) {
            annotationItemList = this.state.annotationList?.map((annotation, index) => {
                return html`<${AnnotationItemComponent} 
                    isEditable=${this.props.isEditable}
                    annotation=${annotation}
                    stlViewerContext=${this.props.stlViewerContext}
                    index=${index}
                    active=${this.state.activeAnnotation === index}
                    onClicked=${this.onAnnotationClicked.bind(this)}
                    onAnnotationSaved=${this.onAnnotationSaved.bind(this)}
                    onAnnotationDeleted=${this.onAnnotationDeleted.bind(this)} />`;}
            );
        }
        return html`${annotationItemList}`;
    }

    private initComponent(): void {
        if(this._raycastListener !== undefined){
            this._raycastListener.dispose();
        } 
        this._raycastListener = new RaycasterEventListener(
            this.props.stlViewerContext,
            StlViewerContext.STLMESH_NAME,
            this.onIntersection.bind(this));
        this.setState({
            activeAnnotation: -1, 
            annotationList: this.props.annotationList 
        });
    }

    private onIntersection(x: number, y:number, intersection: Intersection): void {
        if(this.props.showAnnotations && this.props.isEditable) {
            let annotationList = this.state.annotationList;
            let id = annotationList.length === 0
                ? 0
                : Math.max.apply(Math, annotationList.map(function(o) { return o.id; })) + 1;

            let newAnnotation = <IStlAnnotation>{};
            newAnnotation.id = id;
            newAnnotation.x = intersection.point.x;
            newAnnotation.y = intersection.point.y;
            newAnnotation.z = intersection.point.z;
            
            annotationList.push(newAnnotation);
            this.setState({ annotationList: annotationList, activeAnnotation: annotationList.length - 1 });
        }        
    }

    private onAnnotationClicked(index: number): void {
        if(this.state.activeAnnotation === index) this.setState({ activeAnnotation: -1 });
        else this.setState({ activeAnnotation: index });
    }

    private onAnnotationSaved(annotation: IStlAnnotation): void {
        let savedAnnotation = this.state.annotationList.filter(a => a.id == annotation.id);
        if(savedAnnotation.length === 1) {
            savedAnnotation[0].text = annotation.text;
            if(this.props.onAnnotationListChanged !== undefined) {
                this.props.onAnnotationListChanged(this.state.annotationList);
            }
        }
    }

    private onAnnotationDeleted(annotation: IStlAnnotation): void {
        let newAnnotationList = this.state.annotationList;
        newAnnotationList.forEach((item, index) => {
            if(item.id === annotation.id) {
                newAnnotationList.splice(index, 1);
                return;
            }
        });
        if(this.props.onAnnotationListChanged !== undefined) {
            this.props.onAnnotationListChanged(newAnnotationList);
        }
        this.setState({ annotationList: newAnnotationList, activeAnnotation: -1 });
    }
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