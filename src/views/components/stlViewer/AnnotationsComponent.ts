import { h, Component } from 'preact';
import { css } from 'emotion'
import htm from 'htm';

import * as THREE from 'three';

import { RaycasterEventListener } from './threejs/RaycasterEventListener';
import { IStlAnnotation } from '../../../vsc/project/model/StlInfo';
import { AnnotationItemComponent } from './AnnotationItemComponent';
import { StlViewerContext } from './threejs/StlViewerContext';

const html = htm.bind(h);

export class AnnotationsComponent extends Component<IAnnotationsComponentProps, IAnnotationsComponentState> {
    private _raycastListener: RaycasterEventListener;

    public componentWillMount() {
        this.setState({ annotationList: this.props.annotationList });
        this._raycastListener = new RaycasterEventListener(
            this.props.stlViewerContext,
            StlViewerContext.STLMESH_NAME,
            this.onIntersection.bind(this));
    }

    public componentWillUnmount() {
        this._raycastListener.dispose();
    }

    public render() {
        let annotationItemList = undefined;
        if(this.props.showAnnotations) {
            annotationItemList = this.state.annotationList?.map((annotation, index) => {
                return html`<${AnnotationItemComponent} 
                    stlViewerContext=${this.props.stlViewerContext} annotation=${annotation}
                    index=${index} active=${this.state.activeAnnotation === index}
                    onClicked=${this.onAnnotationClicked.bind(this)}
                    onAnnotationSaved=${this.onAnnotationSaved.bind(this)}
                    onAnnotationDeleted=${this.onAnnotationDeleted.bind(this)} />`;}
            );
        }
        return html`${annotationItemList}`;
    }

    public css(): string {
        return css``;
    }

    private onIntersection(x: number, y:number, intersection: THREE.Intersection): void {
        if(this.props.showAnnotations) {
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
        this.props.onAnnotationListChanged(newAnnotationList);
        this.setState({ annotationList: newAnnotationList, activeAnnotation: -1 });
    }
}

export interface IAnnotationsComponentProps {
    annotationList: Array<IStlAnnotation>;
    showAnnotations: boolean;
    stlViewerContext: StlViewerContext;
    onAnnotationListChanged: (annotationList: Array<IStlAnnotation>) => void;
}

export interface IAnnotationsComponentState {
    annotationList: Array<IStlAnnotation>;
    activeAnnotation: number;
}