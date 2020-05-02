import { h, Component, VNode } from "preact";
import { css } from "emotion";
import htm from "htm";
const html = htm.bind(h);

import { IStlInfo } from "../model/IStlInfo";
import { IFileInfo } from "../model/IFileInfo";
import { IProjectFile } from "../model/IProjectFile";
import { FileListComponent } from "../components/FileListComponent";
import { SidebarPaneComponent } from "../components/SidebarPaneComponent";
import { StlViewerComponent } from "../components/stlViewer/StlViewerComponent";
import { StlViewerContext } from "../components/stlViewer/threejs/StlViewerContext";
import { AnnotationsComponent } from "../components/stlViewer/AnnotationsComponent";
import { IConfigDescription, ConfigType, ConfigComponent } from "../components/ConfigComponent";

interface StlExplorerComponentProps {
    projectFile: IProjectFile;
    projectFolderUrl: string;
}

interface StlExplorerComponentState {
    showAnnotations: boolean;
    stlViewerContext: StlViewerContext;
    selectedStl: IStlInfo;
}

export class StlExplorerComponent extends Component<StlExplorerComponentProps, StlExplorerComponentState> {
    private _config: any;
    private _configDescription = new Array<IConfigDescription>();
    private _fileList = new Array<IFileInfo>();
    private _stlViewerComponent?: StlViewerComponent;

    componentWillMount() {
        this.setFileList();
        this.setState({
            showAnnotations: true,
            selectedStl: this.props.projectFile.stlInfoList[0],
        });

        this._config = {
            showAnnotations: true,
            resetCamera: () => {
                this._stlViewerComponent!.resetCamera();
            },
        };
        this._configDescription.push(<IConfigDescription>{ property: "showAnnotations", type: ConfigType.CheckBox });
        this._configDescription.push(<IConfigDescription>{ property: "resetCamera", type: ConfigType.Button });
    }

    public render(): VNode<any> | VNode<any>[] {
        let annotationsComponent = undefined;
        if (this.state.stlViewerContext !== undefined && this.state.selectedStl.annotationList !== undefined) {
            annotationsComponent = html`<${AnnotationsComponent}
                isEditable=${false}
                showAnnotations=${this.state.showAnnotations}
                annotationList=${this.state.selectedStl.annotationList}
                stlViewerContext=${this.state.stlViewerContext}
            />`;
        }

        return html`<div className="stl-explorer ${this.css()}">
            <${SidebarPaneComponent}
                sidebarComponent=${html`<${FileListComponent}
                    selectedFile=${this.state.selectedStl.name}
                    fileList=${this._fileList}
                    downloadAllUrl="${this.props.projectFolderUrl}/stls.zip"
                    onFileSelected=${(name: string) => this.onFileSelected(name)}
                />`}
                contentComponent=${html`<div class="stl-wrapper">
                    ${annotationsComponent}
                    <${ConfigComponent}
                        config=${this._config}
                        containerId="stl-config-component"
                        configDescription=${this._configDescription}
                        onChange=${this.onConfigChanged.bind(this)}
                    />
                    <div id="stl-config-component"></div>
                    <${StlViewerComponent}
                        ref=${(sc: StlViewerComponent) => (this._stlViewerComponent = sc)}
                        color="${parseInt(this.state.selectedStl.color.substring(1), 16)}"
                        stlFileUrl="${this.props.projectFolderUrl}/stl/${this.state.selectedStl.name}"
                        onViewerInitiated=${this.onViewerInitiated.bind(this)}
                    />
                </div>`}
            />
        </div>`;
    }

    private setFileList(): void {
        this._fileList = this.props.projectFile.stlInfoList.map((s: IStlInfo) => {
            let fileInfo = <IFileInfo>{};
            fileInfo.name = s.name;

            if (s.annotationList !== undefined && s.annotationList.length > 0) {
                if (s.annotationList.length > 1) {
                    fileInfo.description = `${s.annotationList.length} Annotations`;
                } else {
                    fileInfo.description = `${s.annotationList.length} Annotation`;
                }
            }
            return fileInfo;
        });
    }

    private onFileSelected(name: string): void {
        this.setState({
            selectedStl: this.props.projectFile.stlInfoList.filter((s: any) => s.name === name)[0],
        });
    }

    private onConfigChanged(property: string, value: any): void {
        if (property === "showAnnotations") {
            this.setState({ showAnnotations: value });
        }
    }

    private onViewerInitiated(stlViewerContext: StlViewerContext): void {
        this.setState({ stlViewerContext: stlViewerContext });
    }

    private css(): string {
        return css`
            height: 100%;

            .stl-wrapper {
                height: 100%;
                position: relative;
            }

            #stl-config-component {
                right: 15px;
                position: absolute;
            }
        `;
    }
}
