import * as React from "react";
import { FC } from "react";
import styled from "styled-components";

interface FileListComponentProps {
    selectedFile: string | undefined;
    fileList: Array<FileInfo>;
    downloadAllUrl: string;
    onFileSelected: (name: string) => void;
}

export interface FileInfo {
    name: string;
    description: string;
}

export const FileListComponent: FC<FileListComponentProps> = (props: FileListComponentProps) => {
    let fileList = props.fileList.map(
        (f) =>
            <StyledFileButton active={props.selectedFile === f.name} value={f.name}
                onClick={() => {
                    props.onFileSelected(f.name);
                }}
            >
                {f.name} {f.description !== undefined && <><br/><small>{f.description}</small></>}
            </StyledFileButton>
    );
    
    return <StyledFileListComponent>
        <div className="file-list">
            {fileList}
        </div>
        <div className="file-infobar">
            <small>{props.fileList.length} File(s)</small>
            {props.downloadAllUrl &&
            <a href={props.downloadAllUrl} title="Save all"
                ><i className="fa fa-floppy-o" aria-hidden="true"></i>
            </a>}
        </div>
    </StyledFileListComponent>;
};

const StyledFileListComponent = styled.div`
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background: #f7f7f7;
    display:flex;
    flex-direction:column;
`;

const StyledFileButton = styled.button<{ active: boolean }>`
    border: 0;
    width: 100%;
    display: block;
    cursor: pointer;
    text-align: left;
    background: none;
    padding: 10px 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.5);

    color: ${p => p.active ? "#f58026" : p.theme.textColor };
    font-weight: ${p => p.active ? "bold" : "normal" };

    &:hover {
        color: #f58026;
        background: #eaeaea;
    }

    small {
        font-size: 0.7rem;
        font-weight: ${p => p.active ? "bold" : "normal" };
    }
`;