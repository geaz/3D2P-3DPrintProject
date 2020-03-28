import * as THREE from 'three';

export class StlViewerContext {
    public static STLMESH_NAME: string = 'STL Mesh';

    constructor(
        public renderer: THREE.WebGLRenderer,
        public scene: THREE.Scene,
        public camera: THREE.Camera
    ) { }

    public addStlLoadedListener(callback: () => void) : void {
        this.scene.addEventListener('stlLoaded', callback);
    }

    public removeStlLoadedListener(callback: () => void) : void {
        this.scene.removeEventListener('stlLoaded', callback);
    }

    get StlMesh(): THREE.Mesh {
        return <THREE.Mesh>this.scene.getObjectByName(StlViewerContext.STLMESH_NAME);
    }
}