import { h, Component } from 'preact';
import { css } from 'emotion'
import htm from 'htm';

import * as THREE from 'three';
import { Dimensions } from '../../helpers/Dimensions';

const html = htm.bind(h);

export class AnnotationItemComponent extends Component<IAnnotationItemComponentProps> {
    private _sprite: THREE.Sprite;
    
    public componentDidMount() {
        this.init();
    }

    public componentDidUpdate() {
        this.init();
    }

    public componentWillUnmount() {
        if(this.props.scene !== undefined && this._sprite !== undefined) {
            this.props.scene.remove(this._sprite);
        }
    }
    
    public render() {
        return html``;
    }

    public css() {

    }

    private init() {
        if(this._sprite === undefined && this.props.scene !== undefined) {
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
            let stlDimension = new Dimensions(this.props.stlMesh.geometry.boundingBox);
            let maxDimension = stlDimension.MaxDimension;

            this._sprite = new THREE.Sprite(spriteMaterial);
            this._sprite.position.set(this.props.position.x, this.props.position.y, this.props.position.z);
            this._sprite.scale.set(maxDimension/16, maxDimension /16, 1);

            this._sprite.onBeforeRender = (renderer, scene, camera, geometry, material, group) => {
                const meshDistance = camera.position.distanceTo(this.props.stlMesh.position);
                const spriteDistance = camera.position.distanceTo(this._sprite.position);
                let spriteBehindObject = spriteDistance > meshDistance;
                this._sprite.material.opacity = spriteBehindObject ? 0.1 : 1;
            };

            this.props.scene.add(this._sprite);
        }
    }
}

export interface IAnnotationItemComponentProps {
    text: string;
    index: number;
    scene: THREE.Scene;
    stlMesh: THREE.Mesh;
    position: THREE.Vector3;
}