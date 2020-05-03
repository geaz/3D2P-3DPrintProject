import { h, Component, render, VNode } from "preact";
import { css } from "emotion";
import htm from "htm";
const html = htm.bind(h);

import { DropComponent } from "./components/DropComponent";
import MarkdownComponent from "./components/MarkdownComponent";
import { StlExplorerComponent } from "./compositions/StlExplorerComponent";
import { IProjectFile } from "./model/IProjectFile";

interface PrintProjectsAppState {
    projectFolderUrl: string;
    projectFile: IProjectFile | undefined;
    dropCallback: (fileDataUrl: string) => Promise<any>;
}

class PrintProjectsApp extends Component<{}, PrintProjectsAppState> {
    state: Readonly<PrintProjectsAppState> = {
        dropCallback: (<any>window).printProjects?.dropCallback,
        projectFolderUrl: (<any>window).printProjects?.projectFolderUrl,
        projectFile: undefined,
    };

    componentWillMount() {
        if (this.state.projectFolderUrl !== undefined) 
            this.loadProject(this.state.projectFolderUrl);
    }

    public render(): VNode<any> | VNode<any>[] {
        let contentHtml = this.renderStlExplorer();
        if (this.state.projectFile !== undefined && this.state.projectFile.readme !== null) {
            contentHtml = html`
                <div id="title">
                    <h1>${this.state.projectFile.name}</h1>
                    ${this.state.projectFile.id && html`<small>ID: ${this.state.projectFile.id}</small>`}
                </div>
                <div id="stl-box">
                    <div id="info-bar" class="status-${this.state.projectFile.status}">
                        ${this.state.projectFile.readme && html`<button>Readme</button>`}
                        <button>STLs</button>
                    </div>
                    ${contentHtml}
                    <div id="info-footer"></div>
                </div>
                ${this.state.projectFile.readme &&
                html` <article id="readme">
                    <${MarkdownComponent} markdownUrl=${this.state.projectFolderUrl + "/README.md"} />
                </article>`}
            `;
        }

        return html`<div className=${this.css()}>
            <${DropComponent}
                content=${this.state.projectFile && contentHtml}
                visibleDrop=${this.state.projectFile === undefined}
                onDrop=${this.handleDrop.bind(this)}
            />
        </div>`;
    }

    private async loadProject(projectFolderUrl: string): Promise<void> {
        let response = await fetch(projectFolderUrl + "/3D2P.json");
        let json = await response.json();
        let projectFile = <IProjectFile>json;

        this.setState({
            projectFolderUrl: projectFolderUrl,
            projectFile: projectFile,
        });
    }

    private async handleDrop(fileDataUrl: string): Promise<void> {
        this.setState({ projectFolderUrl: undefined, projectFile: undefined });
        this.loadProject((await this.state.dropCallback(fileDataUrl)).projectFolderUrl);
    }

    private renderStlExplorer(): VNode<any> | VNode<any>[] {
        return html`<${StlExplorerComponent}
            projectFile=${this.state.projectFile}
            projectFolderUrl=${this.state.projectFolderUrl}
        />`;
    }

    private css(): string {
        return css`
            height: 100%;
            
            #title {
                text-align: center;
                margin-bottom: 25px;

                h1 {
                    margin: 0;
                }
            }

            #stl-box {
                background: white;
                margin: 0 0 25px 0;
                box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);
                border-radius: 0 0 5px 5px;

                #info-bar {
                    padding: 15px;
                    border-bottom: rgba(0, 0, 0, 0.1);

                    button {
                        border: none;
                        outline: none;
                        background: none;
                        font-weight: bold;
                        color: rgba(0, 0, 0, 0.8);
                    }
                }

                .status-2 {
                    border-top: 2px solid #008000;
                }

                .status-1 {
                    border-top: 2px solid #e2d300;
                }

                .status-0 {
                    border-top: 2px solid #ff0000;
                }
            }

            #readme img {
                display: block;
                max-width: 100%;
                margin: auto;
            }
        `;
    }
}

render(html`<${PrintProjectsApp} />`, document.getElementById("print-projects-app")!);
