import { h, Component } from 'preact';
import { css } from 'emotion'
import htm from 'htm';

import { WebGLRenderer, Vector3, Object3D, Scene, BufferGeometry,
        Mesh, MeshPhongMaterial, PerspectiveCamera, 
        DirectionalLight, AmbientLight, Vector2 } from 'three';

import { Dimensions } from './threejs/Dimensions';
// @ts-ignore
import { STLLoader } from '../../threeLibs/STLLoader.js';
// @ts-ignore
import { OrbitControls } from '../../threeLibs/OrbitControls.js';
import { StlViewerContext } from './threejs/StlViewerContext';

const html = htm.bind(h);

export class StlViewerComponent extends Component<StlViewerProps> {
    private _currentStlFilePath?: string;
    private _mesh?: Mesh;
    private _scene?: Scene;
    private _meshParent?: Object3D;
    private _material?: MeshPhongMaterial;
    private _controls?: OrbitControls;
    private _camera?: PerspectiveCamera;
    private _renderer?: WebGLRenderer;
    private _resizeHandler: () => void = this.resizeRenderer.bind(this);

    public async componentDidMount() {
        this._currentStlFilePath = this.props.stlFilePath;
        this.initScene();
        this.updateSceneStl(await this.loadStl());        
        window.addEventListener('resize', this._resizeHandler);
    }

    public async componentDidUpdate() {
        if(this._currentStlFilePath !== this.props.stlFilePath) {
            this._currentStlFilePath = this.props.stlFilePath;
            this.updateSceneStl(await this.loadStl()); 
            this.resetCamera();
        }
        if(this._material !== undefined && this._material.color.getHex() !== this.props.color) {
            this._material.color.setHex(this.props.color);
        }
    }

    public componentWillUnmount() {        
        window.removeEventListener('resize', this._resizeHandler);
    }

    public render() {
        return html`<div className="${this.css()}"></div>`;
    }

    public resetCamera(): void {
        if(this._mesh === undefined || this._camera === undefined || this._camera === undefined) {
            throw 'Viewer was not initialized correctly!';
        }

        let stlDimensions = new Dimensions(this._mesh.geometry);
        let maxDimension = stlDimensions.MaxDimension;
        this._camera.lookAt(new Vector3(0, 0, 0));
        this._camera.position.set(0, maxDimension / 2, maxDimension);
        this._controls.target.set(0, 0, 0);
        this._controls.autoRotate = true;
    }

    public resizeRenderer(): void {
        if(this._renderer === undefined || this._camera === undefined) {
            throw 'Viewer was not initialized correctly!';
        }

        let boundingBox = (<HTMLElement>this.base).getBoundingClientRect();
        this._camera.aspect = boundingBox.width / boundingBox.height;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(boundingBox.width, boundingBox.height);
    }

    private initScene(): void {
        this._meshParent = new Object3D(); 

        this._scene = new Scene();
        this._scene.add(this._meshParent); 

        let directionalLightTop = new DirectionalLight(0xFFFFFF, 0.5);
        directionalLightTop.position.set(1, 5, 1);
        directionalLightTop.lookAt(new Vector3(0, 0, 0));

        let directionalLightBottom = new DirectionalLight(0xFFFFFF, 0.3);
        directionalLightBottom.position.set(1, -5, 1);
        directionalLightBottom.lookAt(new Vector3(0, 0, 0));

        this._scene.add(new AmbientLight(0xFFFFFF, 0.9));
        this._scene.add(directionalLightTop);          
        this._scene.add(directionalLightBottom);
        
        this._renderer = new WebGLRenderer( { antialias: true, alpha: true } );
        this.base!.appendChild(this._renderer.domElement);
        
        let boundingBox = (<HTMLElement>this.base).getBoundingClientRect();

        this._renderer.setSize(boundingBox.width, boundingBox.height);
        this._camera = new PerspectiveCamera(75, boundingBox.width / boundingBox.height, 0.1, 2000);        
        this._camera.lookAt(new Vector3(0, 0, 0));
        
        this._controls = new OrbitControls(this._camera, this.base);
        this._controls.target.set(0, 0, 0);
        this._controls.autoRotate = true;
        this._controls.update(); 

        if(this.props.onViewerInitiated !== undefined) {
            this.props.onViewerInitiated(new StlViewerContext(this._renderer, this._scene, this._camera));
        }
        this.animate();
    }

    private loadStl(): Promise<Mesh> {
        return new Promise((resolve) => {
            if(this.props.stlFilePath !== undefined)
            {
                let loader: any = new STLLoader();
                loader.load(this.props.stlFilePath, (geometry: BufferGeometry) => {                    
                    this._material = new MeshPhongMaterial({
                        color: this.props.color,
                        specular: 0x1F1F1F,
                        shininess: 25
                    });                    
                    resolve(new Mesh(geometry, this._material));
                });
            }
            else {
                resolve(undefined);
            }
        });        
    }

    private updateSceneStl(stlMesh: Mesh): void {
        if(this._meshParent === undefined || this._camera === undefined || this._scene === undefined) {
            throw 'Viewer was not initialized correctly!';
        }

        if(stlMesh === undefined) return;
        if(this._mesh !== undefined) this._meshParent.remove(this._mesh);
        
        this._mesh = stlMesh;
        this._mesh.name = StlViewerContext.STLMESH_NAME; 
        this._mesh.geometry.computeBoundingBox();
        this._mesh.geometry.computeVertexNormals();

        let stlDimensions = new Dimensions(this._mesh.geometry);
        let originCorrection = stlDimensions.getOriginCorrection();

        this._mesh.geometry.translate(originCorrection.x, originCorrection.y, originCorrection.z);
        this._mesh.rotateX(-Math.PI/2);
        this._mesh.rotateZ(Math.PI / 4);
        
        this._mesh.castShadow = true;
        this._mesh.receiveShadow = true;

        this._meshParent.add(this._mesh);

        let maxDimension = stlDimensions.MaxDimension;
        this._camera.position.set(0, maxDimension / 2, maxDimension);

        this._scene.dispatchEvent({ type: 'stlLoaded' });
    } 

    private animate(): void { 
        if(this._renderer === undefined || this._camera === undefined 
            || this._controls === undefined || this._scene === undefined) {
            throw 'Viewer was not initialized correctly!';
        }
        
        // If the viewer is not visible during the initialization,
        // the renderer couldn't be set to the correct size (display:none boundingbox = 0).
        // Thats why we check each animation frame, if the renderer was set.
        let target: Vector2 = new Vector2(0, 0);
        this._renderer.getSize(target);
        if(target.width === 0) {
            this.resizeRenderer();
        }

        requestAnimationFrame(this.animate.bind(this));
        this._controls.update();
        this._renderer.render(this._scene, this._camera);
    }    

    private css(): string {
        return css`
            width: 100%;
            height: 100%;
            background: radial-gradient(#FFFFFF, rgb(80, 80, 80));`;
    }
}

interface StlViewerProps {
    stlFilePath: string,
    color: number,
    onViewerInitiated: (stlViewerContext: StlViewerContext) => void
}