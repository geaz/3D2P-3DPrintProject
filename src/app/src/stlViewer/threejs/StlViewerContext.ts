import { WebGLRenderer, Scene, Camera, Mesh } from "three";

export class StlViewerContext {
    public static STLMESH_NAME: string = "STL Mesh";

    constructor(public renderer: WebGLRenderer, public scene: Scene, public camera: Camera) {}

    public addStlLoadedListener(callback: () => void): void {
        this.scene.addEventListener("stlLoaded", callback);
    }

    public removeStlLoadedListener(callback: () => void): void {
        this.scene.removeEventListener("stlLoaded", callback);
    }

    get StlMesh(): Mesh {
        return <Mesh>this.scene.getObjectByName(StlViewerContext.STLMESH_NAME);
    }
}
