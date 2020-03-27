import * as THREE from 'three';

export class RaycasterEventListener {
    private _mouseHandler = this.handleDblClick.bind(this);

    constructor(
        private _renderer: THREE.WebGLRenderer,
        private _camera: THREE.PerspectiveCamera,
        private _stlMesh: THREE.Mesh,
        private _onIntersection: (mouseX: number, mouseY: number, intersection: THREE.Intersection) => void) {
            this._renderer.domElement.addEventListener('dblclick', this._mouseHandler);
    }

    public dispose() {
        this._renderer.domElement.removeEventListener('dblclick', this._mouseHandler);
    }

    private handleDblClick(event: MouseEvent): void {
        // set the mouse position with a coordinate system where the center
        // of the screen is the origin
        let boundingBox = this._renderer.domElement.getBoundingClientRect();
        let mouseX = (event.clientX / boundingBox.width) * 2 - 1;
        let mouseY = -(event.clientY / boundingBox.height) * 2 + 1;

        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({x: mouseX, y: mouseY}, this._camera);

        let intersections = raycaster.intersectObjects([this._stlMesh]);
        if(intersections.length > 0) {
            // Only communicate the first intersection (nearest to camera)
            this._onIntersection(event.clientX, event.clientY, intersections[0]);
        }
    };
}