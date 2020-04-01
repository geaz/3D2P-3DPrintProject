import { h, Component } from 'preact';
import { css } from 'emotion'
import htm from 'htm';

const html = htm.bind(h);

export class FileListComponent extends Component<FileListComponentProps> {    
    componentWillMount() {
    }

    public render() {
        let fileList = this.props.fileList.map(f =>
            html
            `<button class=${this.props.selectedFile === f.relativePath ? 'active' : '' }
                value=${f.relativePath}
                onclick=${() => { this.onFileSelected(f.relativePath); }}>
                    ${f.name}
                    ${f.description !== undefined ? html`<br/><small>${f.description}</small>` : ''}
            </button>`
        );
        return html
            `<div className="file-list-component ${this.css()}">
                ${fileList}
            </div>`;
    }

    private onFileSelected(relativePath: string): void {
        if(this.props.onFileSelected !== undefined) {
            this.props.onFileSelected(relativePath);
        }
    }

    private css(): string {
        return css
            `overflow-y: auto;
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
                border-bottom: 1px solid rgba(0,0, 0, 0.05);

                &:hover {
                    color: #F58026;
                    background: #eaeaea;
                }

                small {
                    font-size: 0.7rem;
                }
            }
            
            .active { 
                color: #F58026; 
                font-weight: bold;

                small {
                    font-weight: 400;
                }
            }`;
    }
}

interface FileListComponentProps {
    selectedFile: string;
    fileList: Array<{ name: string, relativePath: string, description: string }>;
    onFileSelected: (path: string) => void;
}