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
        this.init();
        this.props.stlViewerContext.addStlLoadedListener(this.init.bind(this));
    }

    public componentWillUnmount() {
        if(this._sprite !== undefined) {
            this.props.stlViewerContext.scene.remove(this._sprite);
        }
        this.props.stlViewerContext.removeStlLoadedListener(this.init.bind(this));
    }
    
    public render() {
        let annotationBox = undefined;
        if(true || this.state.annotationVisible) {
            annotationBox = html`
                <div className=${this.css()}>
                    <div class="annotation">
                        <textarea placeholder="Enter your annotation."></textarea>
                    </div>
                </div>`;
        }
        return html`${annotationBox}`;
    }

    public css() {
        return css`
            position: absolute;
            top: ${this.state.annotationPos?.y - 145}px;
            left: ${this.state.annotationPos?.x + 25}px;
              
            .annotation {
                display:flex;
                width: 200px;
                height: 150px;
                position:relative;
                background: rgb(17, 17, 17, 0.8);
            }
              
            .annotation::before {
                content: '';
                position:absolute;
                right:100%;
                bottom:0;
                border-bottom: 5px solid transparent;
                border-right: 5px solid rgb(17, 17, 17, 0.8);
                border-top: 5px solid transparent;
                clear: both;
            }

            textarea {
                border:0;
                flex-grow:1;
                color: white;
                margin: 10px;
                resize: none;
                background: transparent;
            
                &:focus {
                    outline: none !important;
                }
            }`;
    }

    private init() {
        if(this.props.stlViewerContext.StlMesh !== undefined) {
            let canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            let ctx = canvas.getContext('2d');
            
            // Circle
            if(this.props.active) ctx.fillStyle = "rgb(255, 0, 0)";
            else ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.beginPath();
            ctx.arc(32, 32, 30, 0, Math.PI * 2);
            ctx.fill();

            // Border
            ctx.strokeStyle = "rgb(255, 255, 255)";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(32, 32, 30, 0, Math.PI * 2);
            ctx.stroke();

            // Text
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
                let devicePos = this.DevicePos;
                let raycaster = new THREE.Raycaster();
                raycaster.setFromCamera({x: devicePos.x, y: devicePos.y}, camera);
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
                this.setState({ annotationPos: this.ScreenPos });
            };

            this.props.stlViewerContext.scene.add(this._sprite);
        }
    }

    get ScreenPos(): THREE.Vector2 {
        let boundingBox = this.props.stlViewerContext.renderer.domElement.getBoundingClientRect();
        var width = boundingBox.width, height = boundingBox.height;
        var widthHalf = width / 2, heightHalf = height / 2;

        let devicePos = this.DevicePos;
        return new THREE.Vector2(( devicePos.x * widthHalf ) + widthHalf, -( devicePos.y * heightHalf ) + heightHalf);
    }

    get DevicePos(): THREE.Vector3 {
        var pos = this._sprite.position.clone();
        return pos.project(this.props.stlViewerContext.camera);
    }

    get WorldPos(): THREE.Vector3 {
        return this._sprite.position;
    }
}

export interface IAnnotationItemComponentProps {
    text: string;
    index: number;
    active: boolean;
    position: THREE.Vector3;
    stlViewerContext: StlViewerContext;
}

export interface IAnnotationItemComponentState {
    annotationVisible: boolean;
    annotationPos: THREE.Vector2;
}