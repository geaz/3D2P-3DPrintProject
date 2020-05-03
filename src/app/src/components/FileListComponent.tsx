import * as React from "react";
import { FC } from "react";
import styled from "styled-components";

import { IFileInfo } from "../model/IFileInfo";

interface FileListComponentProps {
    selectedFile: string;
    fileList: Array<IFileInfo>;
    downloadAllUrl: string;
    onFileSelected: (name: string) => void;
}

export const FileListComponent: FC<FileListComponentProps> = (props: FileListComponentProps) => {
    let fileList = props.fileList.map(
        (f) =>
            <FileButton
                className={props.selectedFile === f.name ? "active" : ""}
                value={f.name}
                onClick={() => {
                    props.onFileSelected(f.name);
                }}
            >
                {f.name} {f.description !== undefined && <><br/><small>{f.description}</small></>}
            </FileButton>
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

const FileButton = styled.button`
    border: 0;
    width: 100%;
    display: block;
    cursor: pointer;
    text-align: left;
    background: none;
    padding: 10px 10px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);

    &:hover {
        color: #f58026;
        background: #eaeaea;
    }

    small {
        font-size: 0.7rem;
        font-weight: ${p => p.active ? "bold" : "normal" }
    }
`;

/*
export class FileListComponent extends Component<FileListComponentProps> {
    public render(): VNode<any> | VNode<any>[] {
        let fileList = this.props.fileList.map(
            (f) =>
                html`<button
                    class=${this.props.selectedFile === f.name ? "active" : ""}
                    value=${f.name}
                    onclick=${() => {
                        this.onFileSelected(f.name);
                    }}
                >
                    ${f.name} ${f.description !== undefined ? html`<br /><small>${f.description}</small>` : ""}
                </button>`
        );
        return html`<div className="file-list-component ${this.css()}">
            <div class="file-list">
                ${fileList}
            </div>
            <div class="file-infobar">
                <small>${this.props.fileList.length} File(s)</small>
                ${this.props.downloadAllUrl &&
                html`<a href=${this.props.downloadAllUrl} title="Save all"
                    ><i class="fa fa-floppy-o" aria-hidden="true"></i>
                </a>`}
            </div>
        </div>`;
    }

    private onFileSelected(name: string): void {
        if (this.props.onFileSelected !== undefined) {
            this.props.onFileSelected(name);
        }
    }

    private css(): string {
        return css`
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            background: #f7f7f7;
            display:flex;
            flex-direction:column;

            button {
                border: 0;
                width: 100%;
                display: block;
                cursor: pointer;
                text-align: left;
                background: none;
                padding: 10px 10px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);

                &:hover {
                    color: #f58026;
                    background: #eaeaea;
                }

                small {
                    font-size: 0.7rem;
                }
            }

            .active {
                color: #f58026;
                font-weight: bold;

                small {
                    font-weight: 400;
                }
            }
        `;
    }
}
*/