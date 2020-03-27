import { h, Component } from 'preact';
import { css } from 'emotion'
import htm from 'htm';

import * as THREE from 'three';

import { Dimensions } from '../helpers/Dimensions';
import { STLLoader } from '../../../resources/libraries/STLLoader.js';
import { OrbitControls } from '../../../resources/libraries/OrbitControls.js';

const html = htm.bind(h);

export class StlViewerComponent extends Component<StlViewerProps> {
    private _currentStlFilePath: string;
    private _mesh: THREE.Mesh;
    private _scene: THREE.Scene;
    private _meshParent: THREE.Object3D;
    private _material: THREE.MeshPhongMaterial;
    private _controls: OrbitControls;
    private _camera: THREE.PerspectiveCamera;
    private _renderer: THREE.WebGLRenderer;

    public async componentDidMount() {
        this.initScene();
        this._currentStlFilePath = this.props.stlFilePath;
        this.updateSceneStl(await this.loadStl()); 
    }

    public async componentDidUpdate() {
        if(this._currentStlFilePath !== this.props.stlFilePath) {
            this._currentStlFilePath = this.props.stlFilePath;
            this.updateSceneStl(await this.loadStl()); 
        }
        if(this._material !== undefined && this._material.color.getHex() !== this.props.color) {
            this._material.color.setHex(this.props.color);
        }
    }

    public render() {
        return html`<div className="${this.css()}"></div>`;
    }

    public css(): string {
        return css`
            flex-grow: 1;
            background: radial-gradient(#FFFFFF, rgb(80, 80, 80));`;
    }

    public resetCamera(): void {
        let stlDimensions = new Dimensions(this._mesh.geometry.boundingBox);
        let maxDimension = stlDimensions.MaxDimension;
        this._camera.lookAt(new THREE.Vector3(0, 0, 0));
        this._camera.position.set(0, maxDimension / 2, maxDimension * 2);
        this._controls.target.set(0, 0, 0);
        this._controls.autoRotate = true;
    }

    private initScene(): void {
        this._meshParent = new THREE.Object3D();  

        this._scene = new THREE.Scene();
        this._scene.add(this._meshParent); 

        let directionalLightTop = new THREE.DirectionalLight(0xFFFFFF, 0.5);
        directionalLightTop.position.set(1, 5, 1);
        directionalLightTop.lookAt(new THREE.Vector3(0, 0, 0));

        let directionalLightBottom = new THREE.DirectionalLight(0xFFFFFF, 0.3);
        directionalLightBottom.position.set(1, -5, 1);
        directionalLightBottom.lookAt(new THREE.Vector3(0, 0, 0));

        this._scene.add(new THREE.AmbientLight(0xFFFFFF, 0.9));
        this._scene.add(directionalLightTop);          
        this._scene.add(directionalLightBottom);
        
        this._renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
        this.base.appendChild(this._renderer.domElement);
        
        let boundingBox = (<HTMLElement>this.base).getBoundingClientRect();

        this._renderer.setSize(boundingBox.width, boundingBox.height - 5);
        this._camera = new THREE.PerspectiveCamera(75, boundingBox.width / boundingBox.height, 0.1, 2000);        
        this._camera.lookAt(new THREE.Vector3(0, 0, 0));
        
        this._controls = new OrbitControls(this._camera, this.base);
        this._controls.target.set(0, 0, 0);
        this._controls.autoRotate = true;
        this._controls.update(); 

        this.animate();

        window.addEventListener('resize', () => {            
            let boundingBox = (<HTMLElement>this.base).getBoundingClientRect();
            this._camera.aspect = boundingBox.width / boundingBox.height;
            this._camera.updateProjectionMatrix();
            this._renderer.setSize(boundingBox.width, boundingBox.height - 5);
        }, false );
    }

    private loadStl(): Promise<THREE.Mesh> {
        return new Promise((resolve) => {
            if(this.props.stlFilePath !== undefined)
            {
                let that = this;
                let loader = new STLLoader();
                loader.load(this.props.stlFilePath, function (geometry: THREE.BufferGeometry) {                    
                    that._material = new THREE.MeshPhongMaterial({
                        color: that.props.color,
                        specular: 0x1F1F1F,
                        shininess: 25,
                        side: THREE.DoubleSide
                    });                    
                    resolve(new THREE.Mesh(geometry, that._material));
                });
            }
            else {
                resolve(undefined);
            }
        });        
    }

    private updateSceneStl(stlMesh: THREE.Mesh): void {
        if(stlMesh === undefined) return;
        if(this._mesh !== undefined) this._meshParent.remove(this._mesh);
        
        this._mesh = stlMesh;
        this._mesh.geometry.computeBoundingBox();
        this._mesh.geometry.computeVertexNormals();

        let stlDimensions = new Dimensions(this._mesh.geometry.boundingBox);
        let originCorrection = stlDimensions.getOriginCorrection();

        this._mesh.geometry.translate(originCorrection.x, originCorrection.y, originCorrection.z);
        this._mesh.rotateX(-Math.PI/2);
        this._mesh.rotateZ(Math.PI / 4);
        
        this._mesh.castShadow = true;
        this._mesh.receiveShadow = true;

        this._meshParent.add(this._mesh);

        let maxDimension = stlDimensions.MaxDimension;
        this._camera.position.set(0, maxDimension / 2, maxDimension * 2);

        if(this.props.onSceneUpdated !== undefined) {
            this.props.onSceneUpdated(this._renderer, this._scene, this._camera, this._mesh);
        }
    } 

    private animate() { 
        requestAnimationFrame(this.animate.bind(this));
        this._controls.update();
        this._renderer.render(this._scene, this._camera);
    };
}

interface StlViewerProps {
    stlFilePath: string,
    color: number,
    onSceneUpdated: 
        (renderer: THREE.WebGLRenderer, scene: THREE.Scene, 
        camera: THREE.PerspectiveCamera, stlMesh: THREE.Mesh) => void
}