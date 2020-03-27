import { h, Component } from 'preact';
import { css } from 'emotion'
import htm from 'htm';

import * as THREE from 'three';

import { RaycasterEventListener } from '../../helpers/RaycasterEventListener';
import { IStlAnnotation } from '../../../vsc/project/model/StlInfo';
import { AnnotationItemComponent } from './AnnotationItemComponent';

const html = htm.bind(h);

export class AnnotationsComponent extends Component<IAnnotationsComponentProps, IAnnotationsComponentState> {
    private _raycastListener: RaycasterEventListener;

    public componentDidMount() {
        this.init();
    }

    public componentDidUpdate() {
        this.init();
    }

    public render() {
        let annotationItemList = undefined;
        if(this.props.showAnnotations) {
            annotationItemList = this.state.annotationList?.map((annotation, index) =>
                html`<${AnnotationItemComponent} scene=${this.props.scene} 
                    text=${annotation.text} index=${index+1} stlMesh=${this.props.stlMesh}
                    position=${new THREE.Vector3(annotation.x, annotation.y, annotation.z)}/>`
            );
        }
        return html`${annotationItemList}`;
    }

    public css(): string {
        return css``;
    }

    private init() {
        if(this.props.renderer !== undefined && this.props.camera !== undefined && this.props.stlMesh !== undefined) {
            if(this._raycastListener !== undefined) this._raycastListener.dispose();
            this._raycastListener = new RaycasterEventListener(
                this.props.renderer, 
                this.props.camera, 
                this.props.stlMesh,
                this.onIntersection.bind(this));
        }
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
            this.setState({ annotationList: newAnnotationList });
        }        
    };
}

export interface IAnnotationsComponentProps {
    showAnnotations: boolean;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    stlMesh: THREE.Mesh;
}

export interface IAnnotationsComponentState {
    annotationList: Array<IStlAnnotation>
}