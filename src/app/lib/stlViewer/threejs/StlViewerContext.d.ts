import { WebGLRenderer, Scene, Camera, Mesh } from 'three';
export declare class StlViewerContext {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: Camera;
    static STLMESH_NAME: string;
    constructor(renderer: WebGLRenderer, scene: Scene, camera: Camera);
    addStlLoadedListener(callback: () => void): void;
    removeStlLoadedListener(callback: () => void): void;
    get StlMesh(): Mesh;
}
