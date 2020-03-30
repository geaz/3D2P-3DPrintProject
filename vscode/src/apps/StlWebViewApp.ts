import { h, Component, render } from 'preact';
import htm from 'htm';

import { DEFAULT_STL_COLOR } from '../vsc/project/model/StlInfo';
import { 
    StlViewerComponent, AnnotationsComponent, ConfigComponent, 
    IConfigDescription, ConfigType, StlViewerContext, IStlAnnotation
} from '3d2p.preact.components';

declare var acquireVsCodeApi: any;
const html = htm.bind(h);

class App extends Component<{}, AppState> {
    private _vscode = acquireVsCodeApi();
    private _windowListener = this.handleMessage.bind(this);
    private _configDescription = new Array<IConfigDescription>();

    private _config: any;
    private _stlViewerComponent?: StlViewerComponent;

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
        // Only render the annotations component, if the STL got loaded
        // and VSCode send us the annoationList via 'postMessage'
        let annotationsComponent = undefined;
        if(this.state.stlViewerContext !== undefined && this.state.annotationList !== undefined) {
            annotationsComponent = html
                `<${AnnotationsComponent} 
                    annotationList=${this.state.annotationList}
                    showAnnotations=${this.state.showAnnotations}
                    stlViewerContext=${this.state.stlViewerContext}
                    onAnnotationListChanged=${(list: Array<IStlAnnotation>) => this.onStlInfoChanged('annotationList', list)} />`;
        }

        return html
            `${annotationsComponent}
            <${ConfigComponent} 
                config=${this._config} 
                configDescription=${this._configDescription}
                onChange=${this.onStlInfoChanged.bind(this)} />
            <${StlViewerComponent} ref=${(sc: StlViewerComponent) => this._stlViewerComponent = sc}
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
                this.onStlInfoChanged('color', DEFAULT_STL_COLOR); },
            resetCamera: () => {
                this._stlViewerComponent!.resetCamera();
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
                this.setState({ color: message.data.color, annotationList: message.data.annotationList });
                this._config.color = message.data.color;
                this._config.status = message.data.status;
                break;
        }
    };

    private onStlInfoChanged(property: string, value: any): void {
        if(property === 'showAnnotations') {
            this.setState({ showAnnotations: value });
        }
        else if(property === 'color') {
            this.setState({ color: value });
            this._vscode.postMessage({ command: 'updateStlColor', color: value });
        }
        else if(property === 'status') {
            this._vscode.postMessage({ command: 'updateStlStatus', status: value });
        }
        else if(property === 'annotationList') {
            this.setState({ annotationList: value });
            this._vscode.postMessage({ command: 'updateStlAnnotationList', annotationList: value });
        }
    };

    private onViewerInitiated(stlViewerContext: StlViewerContext): void {
        this.setState({ stlViewerContext: stlViewerContext });
    };
}

interface AppState {
    color: number;
    stlFilePath: string;
    showAnnotations: boolean;
    annotationList: Array<IStlAnnotation>;
    stlViewerContext: StlViewerContext;
}

render(html`<${App}/>`, document.getElementById('stl-viewer-app')!);