import * as React from "react";
import { FC, useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { StlInfo } from "../model/StlInfo";
import { Status } from "../model/Status";
import { ProjectFile } from "../model/ProjectFile";

import { useWindowResize } from "../effects/EventEffects";
import { FileListComponent, FileInfo } from "./FileListComponent";
import { SplittedSidebarComponent } from "./SplittedSidebarComponent";
import { CollapsingSidebarComponent } from "./CollapsingSidebarComponent";
import { StlViewerComponent } from "./StlViewerComponent";

interface StlExplorerComponentProps {
    minSizeForSplitter: number;
    projectFile: ProjectFile;
    projectFolderUrl: string;
}

export const StlExplorerComponent: FC<StlExplorerComponentProps> = (props: StlExplorerComponentProps) => {
    const componentRef = useRef<HTMLDivElement>(null);

    const [selectedStl, setSelectedStl] = useState<StlInfo>();
    const [useSplitterSidebar, setUseSplitterSidebar] = useState(true);
    const [fileList, setFileList] = useState(new Array<FileInfo>());

    const checkSidebarType = () => {
        let boundingBox = componentRef.current?.getBoundingClientRect();
        setUseSplitterSidebar(boundingBox !== undefined && boundingBox.width >= props.minSizeForSplitter);
    }    
    useEffect(checkSidebarType, []);
    useWindowResize(checkSidebarType);

    useEffect(() => {
        let newFileList = props.projectFile.stlInfoList.map((s: StlInfo) => {
            let fileInfo = {} as FileInfo;
            fileInfo.name = s.name;

            if (s.status !== Status.Unknown) fileInfo.description = Status[s.status];
            if (s.annotationList !== undefined && s.annotationList.length > 0) {
                if (s.annotationList.length > 1) {
                    fileInfo.description = ` (${s.annotationList.length} Annotations)`;
                } else {
                    fileInfo.description = ` (${s.annotationList.length} Annotation)`;
                }
            }
            return fileInfo;
        });
        setFileList(newFileList);
        setSelectedStl(props.projectFile.stlInfoList[0])
    }, [props.projectFile])
    
    let sidebarComponent = <FileListComponent
        fileList={fileList}
        selectedFile={selectedStl?.name}
        onFileSelected={(name: string) => setSelectedStl(props.projectFile.stlInfoList.filter((s: any) => s.name === name)[0]) }
    />;
    let contentComponent = <StlViewerComponent 
        isEditable={ false }
        additionalConfig={ undefined }
        onAnnotationListChanged={ undefined }
        stlAnnotations={selectedStl?.annotationList}
        stlHexColor={ selectedStl !== undefined ? parseInt(selectedStl.color.substring(1), 16) : undefined }
        stlUrl={ selectedStl !== undefined ? `${props.projectFolderUrl}/stl/${selectedStl.name}` : undefined }
    />;

    let paneComponent = undefined;
    if(useSplitterSidebar) {
        paneComponent = <SplittedSidebarComponent
            sidebarSize={ 250 }
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

    return <StyledStlExplorer ref={ componentRef }>{ paneComponent }</StyledStlExplorer>;
};

const StyledStlExplorer = styled.div`
    height: 100%;
`;