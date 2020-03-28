import { h, Component } from 'preact';
import { css } from 'emotion'
import htm from 'htm';

import * as THREE from 'three';
import { Dimensions } from './threejs/Dimensions';
import { StlViewerContext } from './threejs/StlViewerContext';

const html = htm.bind(h);

export class AnnotationItemComponent extends Component<IAnnotationItemComponentProps, IAnnotationItemComponentState> {
    private _sprite: THREE.Sprite;
    
    public componentDidMount() {
        console.log("mounted");
        this.init();
        this.props.stlViewerContext.addStlLoadedListener(this.init.bind(this));
    }

    public componentWillUnmount() {
        if(this._sprite !== undefined) {
            this.props.stlViewerContext.scene.remove(this._sprite);
        }
        this.props.stlViewerContext.addStlLoadedListener(this.init.bind(this));
    }
    
    public render() {
        let annotationBox = undefined;
        if(true || this.state.annotationVisible) {
            annotationBox = html`
                <div className=${this.css()}>
                    <textarea></textarea>
                </div>`;
        }
        return html`${annotationBox}`;
    }

    public css() {
        console.log(this.props.position.y);
        return css`
            position: absolute;
            top: ${this.props.position.y}px;
            left: ${this.props.position.x}px;
            width: 450px;
            height: 250px;
            background: #404040;
            border-radius: 5px;`;
    }

    private init() {
        console.log("test");
        if(this.props.stlViewerContext.StlMesh !== undefined) {
            let canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            let ctx = canvas.getContext('2d');
            
            // Circle
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.beginPath();
            ctx.arc(32, 32, 30, 0, Math.PI * 2);
            ctx.fill();

            // Border
            ctx.strokeStyle = "rgb(255, 255, 255)";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(32, 32, 30, 0, Math.PI * 2);
            ctx.stroke();

            // Fill
            ctx.fillStyle = "rgb(255, 255, 255)";
            ctx.font = "bold 32px sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.props.index.toString(), 32, 32);

            let numberTexture = new THREE.CanvasTexture(canvas);
            let spriteMaterial = new THREE.SpriteMaterial({
                map: numberTexture,
                transparent: true,
                depthTest: false,
                depthWrite: false
            });
            let stlDimension = new Dimensions(this.props.stlViewerContext.StlMesh.geometry.boundingBox);
            let maxDimension = stlDimension.MaxDimension;

            this._sprite = new THREE.Sprite(spriteMaterial);
            this._sprite.name = `Annotation: ${this.props.index}`;
            this._sprite.position.set(this.props.position.x, this.props.position.y, this.props.position.z);
            this._sprite.scale.set(maxDimension/16, maxDimension /16, 1);

            this._sprite.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
                let boundingBox = renderer.domElement.getBoundingClientRect();
                var width = boundingBox.width, height = boundingBox.height;
                var widthHalf = width / 2, heightHalf = height / 2;

                var pos = this._sprite.position.clone();
                pos.project(camera);
                console.log(pos.x + " " + pos.y);
                // pos.x = ( pos.x * widthHalf ) + widthHalf;
                // pos.y = - ( pos.y * heightHalf ) + heightHalf;

                // let mouseX = (pos.x / boundingBox.width) * 2 - 1;
                // let mouseY = -(pos.y / boundingBox.height) * 2 + 1;

                let raycaster = new THREE.Raycaster();
                raycaster.setFromCamera({x: pos.x, y: pos.y}, camera);
                let intersections = raycaster.intersectObjects([this.props.stlViewerContext.StlMesh, this._sprite], true);

                let spriteVisible = true;
                if(intersections.length > 0) {
                    let obj1 = intersections[0];
                    let obj2 = intersections[1];

                    if(obj1.object.name !== `Annotation: ${this.props.index}`) {
                        let distObj1 = raycaster.ray.origin.distanceTo(obj1.point).toFixed(4);
                        let distObj2 = raycaster.ray.origin.distanceTo(obj2.point).toFixed(4);
                        spriteVisible = distObj1 === distObj2;
                    }
                }
                this._sprite.material.opacity = spriteVisible ? 1: 0.2;
            };

            this.props.stlViewerContext.scene.add(this._sprite);
        }
    }

   /* get ScreenPos(): THREE.Vector2 {
        return new THREE.Vector2(0, 0);
    }

    get DevicePos(): THREE.Vector2 {

    }

    get WorldPos(): THREE.Vector3 {
        
    }*/
}

export interface IAnnotationItemComponentProps {
    text: string;
    index: number;
    position: THREE.Vector3;
    stlViewerContext: StlViewerContext;
}

export interface IAnnotationItemComponentState {
    annotationVisible: boolean;
}