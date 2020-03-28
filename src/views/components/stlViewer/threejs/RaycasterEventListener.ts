import * as THREE from 'three';
import { StlViewerContext } from './StlViewerContext';

export class RaycasterEventListener {
    private _mouseHandler = this.handleDblClick.bind(this);
    private _rendererDom: HTMLElement;

    constructor(
        private _stlViewerContext: StlViewerContext,
        private _objectName: string,
        private _onIntersection: (mouseX: number, mouseY: number, intersection: THREE.Intersection) => void) {
            this._rendererDom = this._stlViewerContext.renderer.domElement;
            this._rendererDom.addEventListener('dblclick', this._mouseHandler);
    }

    public dispose() {
        this._rendererDom.removeEventListener('dblclick', this._mouseHandler);
    }

    private handleDblClick(event: MouseEvent): void {
        let relevantObject = this._stlViewerContext.scene.getObjectByName(this._objectName);
        if(relevantObject !== undefined) {
            // set the mouse position with a coordinate system where the center
            // of the screen is the origin
            let boundingBox = this._rendererDom.getBoundingClientRect();
            let mouseX = (event.clientX / boundingBox.width) * 2 - 1;
            let mouseY = -(event.clientY / boundingBox.height) * 2 + 1;

            let raycaster = new THREE.Raycaster();
            raycaster.setFromCamera({x: mouseX, y: mouseY}, this._stlViewerContext.camera);

            let intersections = raycaster.intersectObject(relevantObject);
            if(intersections.length > 0) {
                // Only communicate the first intersection (nearest to camera)
                this._onIntersection(event.clientX, event.clientY, intersections[0]);
            }
        }
    };
}