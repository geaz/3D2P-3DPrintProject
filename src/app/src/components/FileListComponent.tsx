import * as React from "react";
import { FC } from "react";
import styled from "styled-components";

interface FileListComponentProps {
    selectedFile: string | undefined;
    fileList: Array<FileInfo>;
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
        {fileList}
    </StyledFileListComponent>;
};

const StyledFileListComponent = styled.div`
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    background: ${p => p.theme.background };
`;

const StyledFileButton = styled.button<{ active: boolean }>`
    border: 0;
    width: 100%;
    display: block;
    cursor: pointer;
    text-align: left;
    background: none;
    padding: 10px 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);

    color: ${p => p.active ? p.theme.mainColor : p.theme.textColor };
    font-weight: ${p => p.active ? "bold" : "normal" };

    &:hover {
        color: ${p => p.theme.mainColor };
        background: #eaeaea;
    }

    small {
        font-size: 0.7rem;
        font-weight: ${p => p.active ? "bold" : "normal" };
    }
`;