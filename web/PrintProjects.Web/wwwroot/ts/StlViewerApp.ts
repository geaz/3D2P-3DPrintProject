import * as url from 'url';
import { h, Component, render } from 'preact';
import { css } from 'emotion'
import htm from 'htm';

import { StlViewerContext, StlViewerComponent, IConfigDescription,
        ConfigType, ConfigComponent, AnnotationsComponent } from '3d2p.preact.components';
import { FileListComponent } from './FileListComponent';

const html = htm.bind(h);

class App extends Component<{}, AppState> {
    private _projectFile!: any;
    private _projectShortId!: string;
    private _projectFolderUrl!: string;

    private _config: any;
    private _configDescription = new Array<IConfigDescription>();
    private _stlViewerComponent?: StlViewerComponent;
    
    componentWillMount() {
        this._projectFile = (<any>window).projectFile;
        this._projectShortId = (<any>window).shortId;
        this._projectFolderUrl = url.resolve('/ProjectFiles/', this._projectShortId! + '/');
        if(this._projectFile === undefined || this._projectShortId === undefined) {
            throw 'Component was not initilized correctly. Missing window variables!';
        }
        this.setStlDescriptions();
        this.setState({ 
            showAnnotations: true,
            selectedStl: this._projectFile.stls[0], 
            stlFileUrl: url.resolve(this._projectFolderUrl, this._projectFile.stls[0].relativePath)
        });
        
        this._config = { 
            showAnnotations: true,
            resetCamera: () => {
                this._stlViewerComponent!.resetCamera();
            }
        };
        this._configDescription.push(<IConfigDescription>{ property: 'showAnnotations', type: ConfigType.CheckBox });
        this._configDescription.push(<IConfigDescription>{ property: 'resetCamera', type: ConfigType.Button });
    }

    public render() {
        let annotationsComponent = undefined;
        if(this.state.stlViewerContext !== undefined && this.state.selectedStl.annotationList !== undefined) {
            annotationsComponent = html
                `<${AnnotationsComponent}
                    isEditable=${false}
                    showAnnotations=${this.state.showAnnotations}
                    annotationList=${this.state.selectedStl.annotationList}
                    stlViewerContext=${this.state.stlViewerContext}/>`;
        }

        return html
            `<div className=${this.css()}>
                <${FileListComponent}
                    selectedFile=${this.state.selectedStl.relativePath}
                    fileList=${this._projectFile.stls}
                    onFileSelected=${(relativePath: string) => this.onFileSelected(relativePath)}/>
                <div class="stl-wrapper">
                    ${annotationsComponent}
                    <${ConfigComponent} 
                        config=${this._config}
                        containerId="stl-config-component"
                        configDescription=${this._configDescription}
                        onChange=${this.onConfigChanged.bind(this)} />
                    <div id="stl-config-component"></div>
                    <${StlViewerComponent}
                        ref=${(sc: StlViewerComponent) => this._stlViewerComponent = sc}
                        color=${this.state.selectedStl.color} 
                        stlFilePath=${this.state.stlFileUrl}
                        onViewerInitiated=${this.onViewerInitiated.bind(this)} />
                </div>
            </div>`;
    }

    private setStlDescriptions(): void {
        this._projectFile.stls.map((s: any) => { 
            if(s.annotationList !== undefined && s.annotationList.length > 0) {
                if(s.annotationList.length > 1) {
                    s.description = `${s.annotationList.length} Annotations`;
                }
                else {
                    s.description = `${s.annotationList.length} Annotation`;
                }
            }
            return s;
        });
    }

    private onFileSelected(relativePath: string): void {
        this.setState({
            stlFileUrl: url.resolve(this._projectFolderUrl, relativePath),
            selectedStl: this._projectFile.stls.filter((s: any) => s.relativePath === relativePath)[0]
        });
    }    

    private onConfigChanged(property: string, value: any): void {
        if(property === 'showAnnotations') {
            this.setState({ showAnnotations: value });
        }
    }

    private onViewerInitiated(stlViewerContext: StlViewerContext): void {
        this.setState({ stlViewerContext: stlViewerContext });
    }

    private css(): string {
        return css
            `.stl-wrapper {
                position: relative;
            }
            
            #stl-config-component {
                position: absolute;
                right: 15px;
            }`;
    }
}

interface AppState {
    showAnnotations: boolean;
    stlViewerContext: StlViewerContext;
    stlFileUrl: string;
    selectedStl: any;
}

render(html`<${App}/>`, document.getElementById('stl-viewer-app')!);