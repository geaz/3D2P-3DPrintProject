import { WebGLRenderer, Scene, Mesh, Object3D, MeshPhongMaterial, PerspectiveCamera, 
    DirectionalLight, Vector3, AmbientLight, Vector2, BufferGeometry } from "three";
// @ts-ignore
import { STLLoader } from "../../threeLibs/STLLoader.js";
// @ts-ignore
import { OrbitControls } from "../../threeLibs/OrbitControls.js";
import { Dimensions } from "./Dimensions";

export class StlViewerContext {
    public static STLMESH_NAME: string = "STL Mesh";
    
    private _scene: Scene;
    private _meshParent: Object3D;
    private _renderer: WebGLRenderer;
    private _camera: PerspectiveCamera;
    private _controls: OrbitControls;

    private _mesh?: Mesh;
    private _material?: MeshPhongMaterial;

    constructor(private _hostElement: HTMLDivElement) {
        this._meshParent = new Object3D();

        this._scene = new Scene();
        this._scene.add(this._meshParent);

        let directionalLightTop = new DirectionalLight(0xffffff, 0.5);
        directionalLightTop.position.set(1, 5, 1);
        directionalLightTop.lookAt(new Vector3(0, 0, 0));

        let directionalLightBottom = new DirectionalLight(0xffffff, 0.3);
        directionalLightBottom.position.set(1, -5, 1);
        directionalLightBottom.lookAt(new Vector3(0, 0, 0));

        this._scene.add(new AmbientLight(0xffffff, 0.9));
        this._scene.add(directionalLightTop);
        this._scene.add(directionalLightBottom);

        this._renderer = new WebGLRenderer({ antialias: true, alpha: true });
        this._hostElement.appendChild(this._renderer.domElement);
        let boundingBox = this._hostElement.getBoundingClientRect();
        this._renderer.setSize(boundingBox.width, boundingBox.height);
        this._camera = new PerspectiveCamera(75, boundingBox.width / boundingBox.height, 0.1, 2000);
        this._camera.lookAt(new Vector3(0, 0, 0));

        this._controls = new OrbitControls(this._camera, this._hostElement);
        this._controls.target.set(0, 0, 0);
        this._controls.autoRotate = true;
        this._controls.update();
        
        this.animate();
    }

    public resetCamera(): void {
        if (this._mesh === undefined) {
            throw "No mesh loaded!";
        }

        let stlDimensions = new Dimensions(this._mesh.geometry);
        let maxDimension = stlDimensions.MaxDimension;
        this._camera.lookAt(new Vector3(0, 0, 0));
        this._camera.position.set(0, maxDimension / 2, maxDimension);
        this._controls.target.set(0, 0, 0);
        this._controls.autoRotate = true;
    }

    public resizeRenderer(): void {
        // Set renderer to zero to set the div to maximal width and height
        // Otherwise, if the div is normally smaller then the previous canvas size
        // the boundingbox would be 'wrong' (old width, because has fixed defined sizes)
        this._renderer.setSize(0, 0);

        let boundingBox = this._hostElement.getBoundingClientRect();
        this._camera.aspect = boundingBox.width / boundingBox.height;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(boundingBox.width, boundingBox.height);
    }

    public async loadStl(stlFileUrl: string, color: number): Promise<void> {
        let mesh = await new Promise<Mesh | undefined>((resolve) => {
            if (stlFileUrl !== undefined) {
                let loader: any = new STLLoader();
                loader.load(stlFileUrl, (geometry: BufferGeometry) => {
                    this._material = new MeshPhongMaterial({
                        color: color,
                        specular: 0x1f1f1f,
                        shininess: 25,
                    });
                    resolve(new Mesh(geometry, this._material));
                });
            } else {
                resolve(undefined);
            }
        });
        if(mesh !== undefined) this.updateSceneStl(mesh);
    }

    public addStlLoadedListener(callback: () => void): void {
        this._scene?.addEventListener("stlLoaded", callback);
    }

    public removeStlLoadedListener(callback: () => void): void {
        this._scene?.removeEventListener("stlLoaded", callback);
    }

    private updateSceneStl(stlMesh: Mesh): void {
        if (stlMesh === undefined) return;
        if (this._mesh !== undefined) this._meshParent.remove(this._mesh);

        this._mesh = stlMesh;
        this._mesh.name = StlViewerContext.STLMESH_NAME;
        this._mesh.geometry.computeBoundingBox();
        this._mesh.geometry.computeVertexNormals();

        let stlDimensions = new Dimensions(this._mesh.geometry);
        let originCorrection = stlDimensions.getOriginCorrection();

        this._mesh.geometry.translate(originCorrection.x, originCorrection.y, originCorrection.z);
        this._mesh.rotateX(-Math.PI / 2);
        this._mesh.rotateZ(Math.PI / 4);

        this._mesh.castShadow = true;
        this._mesh.receiveShadow = true;

        this._meshParent.add(this._mesh);

        let maxDimension = stlDimensions.MaxDimension;
        this._camera.position.set(0, maxDimension / 2, maxDimension);

        this._scene.dispatchEvent({ type: "stlLoaded" });
    }

    private animate(): void {
        // If the viewer is not visible during the initialization,
        // the renderer couldn't be set to the correct size (display:none boundingbox = 0).
        // Thats why we check each animation frame, if the renderer was set.
        let target: Vector2 = new Vector2(0, 0);
        this._renderer.getSize(target);
        if (target.width === 0) {
            this.resizeRenderer();
        }

        requestAnimationFrame(this.animate.bind(this));
        this._controls.update();
        this._renderer.render(this._scene, this._camera);
    }

    get StlMesh(): Mesh | undefined {
        return <Mesh>this._scene?.getObjectByName(StlViewerContext.STLMESH_NAME);
    }

    get Scene(): Scene {
        return this._scene;
    }

    get Renderer(): WebGLRenderer {
        return this._renderer;
    }

    get Camera(): PerspectiveCamera {
        return this._camera;
    }
}
