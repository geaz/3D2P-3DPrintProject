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

    public componentDidMount() {
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
            annotationItemList = this.state.annotationList?.map((annotation, index) =>
                html`<${AnnotationItemComponent} 
                    stlViewerContext=${this.props.stlViewerContext} 
                    text=${annotation.text} index=${index+1} active=${this.state.activeAnnotation === index}
                    position=${new THREE.Vector3(annotation.x, annotation.y, annotation.z)}/>`
            );
        }
        return html`${annotationItemList}`;
    }

    public css(): string {
        return css``;
    }

    private onIntersection(x: number, y:number, intersection: THREE.Intersection): void {
        if(this.props.showAnnotations) {
            let newAnnotation = <IStlAnnotation>{};
            newAnnotation.x = intersection.point.x;
            newAnnotation.y = intersection.point.y;
            newAnnotation.z = intersection.point.z;
            
            let newAnnotationList = this.state.annotationList;
            if(newAnnotationList === undefined) newAnnotationList = new Array<IStlAnnotation>();

            newAnnotationList.push(newAnnotation);
            this.setState({ annotationList: newAnnotationList, activeAnnotation: newAnnotationList.length - 1 });
        }        
    };
}

export interface IAnnotationsComponentProps {
    showAnnotations: boolean;
    stlViewerContext: StlViewerContext;
}

export interface IAnnotationsComponentState {
    annotationList: Array<IStlAnnotation>;
    activeAnnotation: number;
}