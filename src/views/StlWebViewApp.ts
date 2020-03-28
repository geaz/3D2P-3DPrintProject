import { h, Component, render } from 'preact';
import htm from 'htm';

import * as THREE from 'three';

import { DEFAULT_STL_COLOR, IStlAnnotation } from '../vsc/project/model/StlInfo';
import { StlViewerComponent } from './components/stlViewer/StlViewerComponent';
import { AnnotationsComponent } from './components/stlViewer/AnnotationsComponent';
import { ConfigComponent, IConfigDescription, ConfigType } from './components/ConfigComponent';
import { StlViewerContext } from './components/stlViewer/threejs/StlViewerContext';

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
        //Only render the annotations component, if the STL got loaded
        let annotationsComponent = undefined;
        if(this.state.stlViewerContext !== undefined) {
            annotationsComponent = html
                `<${AnnotationsComponent} 
                    showAnnotations=${this.state.showAnnotations}
                    stlViewerContext=${this.state.stlViewerContext} />`;
        }

        return html
            `${annotationsComponent}
            <${ConfigComponent} 
                config=${this._config} 
                configDescription=${this._configDescription}
                onChange=${this.onConfigChanged.bind(this)} />
            <${StlViewerComponent} ref=${sc => this._stlViewerComponent = sc}
                color=${this.state.color} 
                stlFilePath="${this.state.stlFilePath}"
                onViewerInitiated=${this.onViewerInitiated.bind(this)} />`;
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

    private onViewerInitiated(stlViewerContext: StlViewerContext): void {
        this.setState({ stlViewerContext: stlViewerContext });
    };
}

interface AppState {
    color: number;
    stlFilePath: string;
    showAnnotations: boolean;
    annotations: Array<IStlAnnotation>;
    stlViewerContext: StlViewerContext;
}

render(html`<${App}/>`, document.getElementById('app'));