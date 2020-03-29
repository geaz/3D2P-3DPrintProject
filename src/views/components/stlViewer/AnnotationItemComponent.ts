import { h, Component } from 'preact';
import { css } from 'emotion'
import htm from 'htm';

import * as THREE from 'three';
import { StlViewerContext } from './threejs/StlViewerContext';
import { WebGLRenderer } from 'three';

const html = htm.bind(h);

export class AnnotationItemComponent extends Component<IAnnotationItemComponentProps, IAnnotationItemComponentState> {
    private _sprite: THREE.Sprite;
    private _textareaElement: HTMLElement;
    private _numberContainerElement: HTMLElement;
    private _initHandler: () => void = this.initDepthSprite.bind(this);
    private _mouseHandler: () => void = () => { if(this.props.active) this.onNumberClicked(); };

    public componentWillMount() {
        this.initDepthSprite();
        this.setState({ text: this.props.text });
        
        this.props.stlViewerContext.addStlLoadedListener(this._initHandler);
        this.props.stlViewerContext.renderer.domElement.addEventListener('mousedown', this._mouseHandler);
        this.props.stlViewerContext.renderer.domElement.addEventListener('wheel', this._mouseHandler);
    }

    public componentDidMount() {
        this._textareaElement?.focus();
    }

    public componentDidUpdate() {
        this._textareaElement?.focus();
    }

    public componentWillUnmount() {
        if(this._sprite !== undefined) {
            this.props.stlViewerContext.scene.remove(this._sprite);
        }
        this.props.stlViewerContext.removeStlLoadedListener(this._initHandler);
        this.props.stlViewerContext.renderer.domElement.removeEventListener('mousedown', this._mouseHandler);
        this.props.stlViewerContext.renderer.domElement.removeEventListener('wheel', this._mouseHandler);
    }
    
    public render() {
        let annotationBox = undefined;
        if(this.props.active) {
            annotationBox = html
                `<div class="annotation">
                    <textarea placeholder="Annotation" oninput=${this.onTextChanged.bind(this)}
                        ref=${(textarea) => { this._textareaElement = textarea; }}>${this.state.text}</textarea>
                </div>`;
        }

        return html
            `<div className=${this.css()}>
                <div class="number-container" 
                ref=${(numberContainer) => { this._numberContainerElement = numberContainer; }}
                onclick="${this.onNumberClicked.bind(this)}">
                    <div class="number">${this.props.index + 1}</div>
                </div>
                ${annotationBox}
            </div>`;
    }

    public css() {
        return css`
            display:flex;
            position: absolute;

            .number-container {
                z-index: 1;
                width:32px;
                height:32px;
                color: #eee;
                border-radius: 5px;
                border: 1px solid #eee;
                background: rgb(0, 0, 0, 0.8);

                ${this.props.active && css
                    `color: red;`}

                &:hover {
                    color: red;
                    cursor: pointer;
                }
            }
            
            .number {
                font-size: 18px;
                font-weight: bold;
                text-align:center;
                line-height:32px;
                font-family: sans-serif;
            }
            
            .annotation {
                z-index: 2;
                margin-left: 15px;
                display:flex;
                width: 200px;
                height: 150px;
                position:relative;
                background: rgb(17, 17, 17, 0.8);

                &::before {
                    content: '';
                    position:absolute;
                    right:100%;
                    top: 10px;
                    border-bottom: 5px solid transparent;
                    border-right: 5px solid rgb(17, 17, 17, 0.8);
                    border-top: 5px solid transparent;
                    clear: both;
                }
            }

            textarea {
                border:0;
                flex-grow:1;
                color: white;
                margin: 10px;
                resize: none;
                font-size: 1rem;
                background: transparent;
            
                &:focus {
                    outline: none !important;
                }
            }`;
    }

    private initDepthSprite(): void {
        if(this.props.stlViewerContext.StlMesh !== undefined) {
            let canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;

            let ctx = canvas.getContext('2d');
            ctx.fillRect(0, 0, 64, 64);

            let numberTexture = new THREE.CanvasTexture(canvas);
            let spriteMaterial = new THREE.SpriteMaterial({ map: numberTexture, opacity: 0 });

            this._sprite = new THREE.Sprite(spriteMaterial);
            this._sprite.name = this.Name;
            this._sprite.onBeforeRender = this.checkDepth.bind(this);
            this._sprite.position.set(this.props.position.x, this.props.position.y, this.props.position.z);

            this.props.stlViewerContext.scene.add(this._sprite);
        }
    }

    private checkDepth(renderer : THREE.WebGLRenderer, scene, camera, geometry, material, group): void {
        if(this.ShouldShow) {
            let devicePos = this.DevicePos;
            let raycaster = new THREE.Raycaster();
            raycaster.setFromCamera({x: devicePos.x, y: devicePos.y}, camera);

            let numberVisible = true;
            let intersections = raycaster.intersectObjects([this.props.stlViewerContext.StlMesh, this._sprite], true);        
            if(intersections.length > 0) {
                let obj1 = intersections[0];
                let obj2 = intersections[1];

                // Even, if the depth tested sprite is not the first intersected object,
                // it could be the case, that the sprite and the stl have the same distance.
                // In this case the number should be visible too.
                if(obj1.object.name !== this.Name) {
                    let distObj1 = raycaster.ray.origin.distanceTo(obj1.point).toFixed(4);
                    let distObj2 = raycaster.ray.origin.distanceTo(obj2.point).toFixed(4);
                    numberVisible = distObj1 === distObj2;
                }
            }
            
            // Don't update the css by state updates of the component,
            // to minimze the performance impact
            let screenPos = this.ScreenPos;
            (<HTMLElement>this.base).style.visibility = 'visible';
            (<HTMLElement>this.base).style.left = (screenPos.x - 16) +'px';
            (<HTMLElement>this.base).style.top = (screenPos.y - 16)+'px';
            (<HTMLElement>this.base).style.opacity = numberVisible ? '1': '0.2';
            this._numberContainerElement.style.zIndex = numberVisible ? '1': '0';
        }
        else {            
            (<HTMLElement>this.base).style.visibility = 'hidden';
        }
    }

    private onTextChanged(e): void {
        this.setState({ text: e.target.value });
        if(this.props.onTextChanged !== undefined) {
            this.props.onTextChanged(e.target.value);
        }
    }

    private onNumberClicked(): void {
        if(this.props.onClicked !== undefined) {
            this.props.onClicked(this.props.index);
        }
    }

    get Name(): string {
        return `Annotation ${this.props.index + 1}`;
    }

    get ShouldShow(): boolean {
        let devicePos = this.DevicePos;    
        return devicePos.x >= -0.90 && devicePos.x <= 0.90 &&
        devicePos.y >= -0.90 && devicePos.y <= 0.90;
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
    onClicked: (index: number) => void;
    onTextChanged: (text: string) => void;
}

export interface IAnnotationItemComponentState {
    text: string;
}