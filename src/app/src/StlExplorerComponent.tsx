import * as React from "react";
import { FC, useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";

import { ProjectFile } from "./model/ProjectFile";
import { StlInfo } from "./model/StlInfo";
import { StlViewerContext } from "./stlViewer/StlViewerContext";

import { useWindowResize } from "./effects/EventEffects";
import { ConfigDescription, ConfigType, useDatConfig, DatConfig } from "./effects/DatConfigEffect";

import { FileListComponent, FileInfo } from "./components/FileListComponent";
import { AnnotationsComponent } from "./components/AnnotationsComponent";
import { SplittedSidebarComponent } from "./components/SplittedSidebarComponent";
import { CollapsingSidebarComponent } from "./components/CollapsingSidebarComponent";

interface StlExplorerComponentProps {
    minSizeForSplitter: number;
    projectFile: ProjectFile;
    projectFolderUrl: string;
}

export const StlExplorerComponent: FC<StlExplorerComponentProps> = (props: StlExplorerComponentProps) => {
    const [selectedStl, setSelectedStl] = useState<StlInfo>();
    const [showAnnotations, setShowAnnotations] = useState(true);
    const [useSplitterSidebar, setUseSplitterSidebar] = useState(true);
    const [fileList, setFileList] = useState(new Array<FileInfo>());

    const componentRef = useRef<HTMLDivElement>(null);
    const stlViewerRef = useRef<StlViewerContext>();
    const stlDivRef = useCallback(node => {
        if(node !== null) stlViewerRef.current = new StlViewerContext(node);
        else stlViewerRef.current = undefined;
    }, []);

    const datConfig = {} as DatConfig;
    datConfig.configObject = {
        showAnnotations: true,
        resetCamera: () => {
            stlViewerRef.current?.resetCamera();
        },
    };
    datConfig.configDescription = [];
    datConfig.configDescription.push({ property: "showAnnotations", type: ConfigType.CheckBox } as ConfigDescription);
    datConfig.configDescription.push({ property: "resetCamera", type: ConfigType.Button } as ConfigDescription);
    const configContainerRef = useDatConfig(datConfig, (property: string, value: any) => {
        if (property === "showAnnotations") setShowAnnotations(value);
    });
    
    const handleWindowResize = () => {
        console.log(stlViewerRef.current);
        stlViewerRef.current?.resizeRenderer();
        let boundingBox = componentRef.current?.getBoundingClientRect();
        console.log(boundingBox !== undefined && boundingBox.width >= props.minSizeForSplitter);
        console.log(boundingBox?.width);
        setUseSplitterSidebar(boundingBox !== undefined && boundingBox.width >= props.minSizeForSplitter);
    }    
    useEffect(handleWindowResize, []);
    useWindowResize(handleWindowResize);

    useEffect(() => { 
        if(selectedStl !== undefined) 
        stlViewerRef.current?.loadStl(`${props.projectFolderUrl}/stl/${selectedStl.name}`, parseInt(selectedStl.color.substring(1), 16)) 
    }, [selectedStl]);

    useEffect(() => {
        let newFileList = props.projectFile.stlInfoList.map((s: StlInfo) => {
            let fileInfo = {} as FileInfo;
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
        setFileList(newFileList);
    }, [props.projectFile])

    let annotationsComponent = undefined;
    if (stlViewerRef.current !== undefined && selectedStl?.annotationList !== undefined) {
        annotationsComponent = <AnnotationsComponent
            isEditable={false}
            onAnnotationListChanged={ () => { }}
            showAnnotations={showAnnotations}
            annotationList={selectedStl?.annotationList}
            stlViewerContext={stlViewerRef.current}
        />;
    }
    
    let sidebarComponent = <FileListComponent
        selectedFile={selectedStl?.name}
        fileList={fileList}
        downloadAllUrl={props.projectFolderUrl}
        onFileSelected={(name: string) => setSelectedStl(props.projectFile.stlInfoList.filter((s: any) => s.name === name)[0]) }
    />;

    let contentComponent = <div className="stl-wrapper">
        {annotationsComponent}
        <div className="stl-config" ref={ configContainerRef }></div>
        <div id="stl-viewer" ref={ stlDivRef }></div>
    </div>;

    let paneComponent = undefined;
    if(useSplitterSidebar) {
        paneComponent = <SplittedSidebarComponent
            sidebarComponent={ sidebarComponent }
            contentComponent={ contentComponent }
        />;
    }
    else {
        paneComponent = <CollapsingSidebarComponent
            sidebarComponent={ sidebarComponent }
            contentComponent={ contentComponent }
        />;
    }

    return <div className="stl-explorer" ref={ componentRef }>{ paneComponent }</div>;
};

/*
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
*/