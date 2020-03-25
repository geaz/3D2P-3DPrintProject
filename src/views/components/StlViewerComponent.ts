import { h, Component, render } from 'preact';
import htm from 'htm';

import * as THREE from 'three';
import { STLLoader } from '../../../resources/libraries/STLLoader.js';
import { OrbitControls } from '../../../resources/libraries/OrbitControls.js';
import { Vector3 } from 'three';

const html = htm.bind(h);

export class StlViewerComponent extends Component<StlViewerProps> {
    private _controls: OrbitControls;
    private _camera: THREE.PerspectiveCamera;
    private _scene: THREE.Scene;
    private _renderer: THREE.WebGLRenderer;
    private _meshParent: THREE.Object3D;

    componentWillMount() {
        this.initViewer();        
    }

    componentDidUpdate() {
        this.initViewer();
    }

    render() {
        return html`<div id="stl-viewer"></div>`;
    }

    private initViewer() {
        this.loadStl().then((mesh: THREE.Mesh) => {
            if(mesh !== undefined) {
                let stlDimensions = this.prepareMesh(mesh);

                this._meshParent = new THREE.Object3D();
                this._meshParent.add(mesh);    

                this._scene = new THREE.Scene();
                this._scene.add(this._meshParent); 

                let directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.5);
                directionalLight.position.set(1, 5, 1);
                directionalLight.lookAt(new Vector3(0, 0, 0));

                this._scene.add(new THREE.AmbientLight(0xFFFFFF, 0.9));
				this._scene.add(directionalLight);          
                
                this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
                this._camera.position.set(0, stlDimensions.y / 2, stlDimensions.z * 5);
                this._camera.lookAt(new THREE.Vector3(0, 0, 0));
                
                this._controls = new OrbitControls(this._camera, document.querySelector('#app'));
                this._controls.target.set(0, 0, 0);
                this._controls.autoRotate = true;
                this._controls.update(); 
    
                this._renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
                this._renderer.setSize(window.innerWidth, window.innerHeight - 5);

                this.base.appendChild(this._renderer.domElement);
                this._animate();

                window.addEventListener( 'resize', () => { 
                    this._camera.aspect = window.innerWidth / window.innerHeight;
                    this._camera.updateProjectionMatrix();
                    this._renderer.setSize( window.innerWidth, window.innerHeight - 5);
                }, false );
            }
        });
    }

    private loadStl(): Promise<THREE.Mesh> {
        return new Promise((resolve) => {
            if(this.props.stlFilePath !== undefined)
            {
                let loader = new STLLoader();
                loader.load(this.props.stlFilePath, function (geometry: THREE.BufferGeometry) {                    
                    var material = new THREE.MeshPhongMaterial({
                        color: 0xF58026,
                        specular: 0x1F1F1F,
                        shininess: 25,
                        side: THREE.DoubleSide
                    });                    
                    resolve(new THREE.Mesh(geometry, material));
                });
            }
            else {
                resolve(undefined);
            }
        });        
    }

    private prepareMesh(mesh: THREE.Mesh): StlDimensions {
        mesh.geometry.computeBoundingBox();
        mesh.geometry.computeVertexNormals();

        let stlDimensions = new StlDimensions(mesh.geometry.boundingBox);
        let originCorrection = stlDimensions.getOriginCorrection();

        mesh.geometry.translate(originCorrection.x, originCorrection.y, originCorrection.z);
        mesh.rotateX(-Math.PI/2);
        mesh.rotateZ(Math.PI / 4);
        
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        return stlDimensions;
    }

    private _animate = () => { 
        requestAnimationFrame(this._animate);
        this._controls.update();
        this._renderer.render(this._scene, this._camera);
    };
}

interface StlViewerProps {
    stlFilePath: string
}

class StlDimensions {
    public x: number;
    public y: number;
    public z: number;
    
    constructor(public box: THREE.Box3) {
        this.x = box.max.x - box.min.x;
        this.y = box.max.y - box.min.y;
        this.z = box.max.z - box.min.z;
    }

    public getOriginCorrection(): { x: number, y: number, z: number } {
        let originCorrection = (max, min) => ((min - max) / 2) - min;
        return {
            x: originCorrection(this.box.max.x, this.box.min.x),
            y: originCorrection(this.box.max.y, this.box.min.y),
            z: originCorrection(this.box.max.z, this.box.min.z)
        };
    }
}