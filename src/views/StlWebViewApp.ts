import { h, Component, render } from 'preact';
import htm from 'htm';

import * as THREE from 'three';

import { DEFAULT_STL_COLOR, IStlAnnotation } from '../vsc/project/model/StlInfo';
import { StlViewerComponent } from './components/StlViewerComponent';
import { AnnotationsComponent } from './components/annotations/AnnotationsComponent';
import { ConfigComponent, IConfigDescription, ConfigType } from './components/ConfigComponent';

declare var acquireVsCodeApi;
const html = htm.bind(h);

class App extends Component<{}, AppState> {
    private _vscode = acquireVsCodeApi();
    private _windowListener = this.handleMessage.bind(this);
    private _configDescription = new Array<IConfigDescription>();

    private _config: any;
    private _stlViewerComponent: StlViewerComponent;

    constructor() {
        super();
        
        this.setupGuiConfig();
        this.setState({ color: this._config.color, showAnnotations: true });
    }

    public componentWillMount() {
        window.addEventListener('message', this._windowListener);
    }
    
    public componentWillUnmount() {
        window.removeEventListener('message', this._windowListener);
    }

    public render() {
        return html
            `<${ConfigComponent} 
                config=${this._config} configDescription=${this._configDescription}
                onChange=${this.onConfigChanged.bind(this)} />
            <${AnnotationsComponent} showAnnotations=${this.state.showAnnotations}
                stlMesh=${this.state.stlMesh} renderer=${this.state.renderer} 
                scene=${this.state.scene} camera=${this.state.camera} />
            <${StlViewerComponent} ref=${sc => this._stlViewerComponent = sc}
                color=${this.state.color} stlFilePath="${this.state.stlFilePath}"
                onSceneUpdated=${this.onSceneUpdated.bind(this)} />`;
    }

    private setupGuiConfig(): void {
        this._config = { 
            color: DEFAULT_STL_COLOR, 
            status: "",
            showAnnotations: true,
            resetColor: () => { 
                this.setState({ color: DEFAULT_STL_COLOR }); 
                this._config.color = DEFAULT_STL_COLOR;
                this.onConfigChanged('color', DEFAULT_STL_COLOR); },
            resetCamera: () => {
                this._stlViewerComponent.resetCamera();
            }
        };
        this._configDescription.push(<IConfigDescription>{ property: 'color', type: ConfigType.Color });
        this._configDescription.push(<IConfigDescription>{ property: 'status', type: ConfigType.Picker, options: ["WIP", "Done"] });
        this._configDescription.push(<IConfigDescription>{ property: 'showAnnotations', type: ConfigType.CheckBox });
        this._configDescription.push(<IConfigDescription>{ property: 'resetColor', type: ConfigType.Button });
        this._configDescription.push(<IConfigDescription>{ property: 'resetCamera', type: ConfigType.Button });
    }
    
    private handleMessage(event: any): void {
        let message = event.data;
        switch (message.command) {
            case 'filechange':
                this.setState({ stlFilePath: message.data });
                break;
            case 'setStlInfo':
                this.setState({ color: message.data.color, annotations: message.data.annotations });
                this._config.color = message.data.color;
                this._config.status = message.data.status;
                break;
        }
    };

    private onConfigChanged(property: string, value: any): void {
        if(property === 'color') {
            this.setState({ color: value });
        }
        if(property === 'showAnnotations') {
            this.setState({ showAnnotations: value });
        }

        this._vscode.postMessage({
            command: 'updateStlInfo',
            data: {
                color: this._config.color,
                status: this._config.status,
                annotations: this.state.annotations
            }
        })
    };

    private onSceneUpdated(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, stlMesh: THREE.Mesh): void {
        this.setState({ renderer: renderer, scene: scene, camera: camera, stlMesh: stlMesh });
    };
}

interface AppState {
    color: number;
    stlFilePath: string;
    showAnnotations: boolean;
    annotations: Array<IStlAnnotation>;
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera;
    stlMesh: THREE.Mesh;
}

render(html`<${App}/>`, document.getElementById('app'));