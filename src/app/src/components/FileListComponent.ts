import { h, Component } from "preact";
import { css } from "emotion";
import htm from "htm";
const html = htm.bind(h);

import { IFileInfo } from "../model/IFileInfo";

interface FileListComponentProps {
    selectedFile: string;
    fileList: Array<IFileInfo>;
    onFileSelected: (name: string) => void;
}

export class FileListComponent extends Component<FileListComponentProps> {
    public render() {
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
        return html`<div className="file-list-component ${this.css()}">${fileList}</div>`;
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
