import { h, Component, render } from 'preact';
import { css } from 'emotion'
import htm from 'htm';

import { DropComponent } from './components/DropComponent';
import { MarkdownComponent } from './components/MarkdownComponent';
import { StlExplorerComponent } from './components/StlExplorerComponent';
import { IProjectFile } from './model/IProjectFile';

const html = htm.bind(h);

interface PrintProjectsAppState {
    dropCallback: (fileDataUrl: string) => Promise<any>,
    projectFolderUrl: string,
    projectFile: IProjectFile
}

class PrintProjectsApp extends Component<{}, PrintProjectsAppState> {
    
    // Loads the initial values from an js object 'printProject' on the 'window'
    componentWillMount() {
        this.setState({ 
            dropCallback: (<any>window).printProjects?.dropCallback
        });

        let projectFolderUrl = (<any>window).printProjects?.projectFolderUrl;
        if(projectFolderUrl !== undefined) this.loadProject(projectFolderUrl);
    }

    public render() {
        return html`
            <div className=${this.css()}>   
                <${DropComponent} 
                    content=${this.state.projectFile !== undefined && html`
                        <div id="title">
                            <h1>${this.state.projectFile.name}</h1>
                            ${this.state.projectFile.id && html`<small>ID: ${this.state.projectFile.id}</small>` }
                        </div>
                        <div id="stl-box">
                            <div id="info-bar" class="status-${this.state.projectFile.status}">
                                ${this.state.projectFile.readme && html`<button>Readme</button>`}
                                <button>STLs</button>
                            </div>
                            <${StlExplorerComponent}
                                projectFile=${this.state.projectFile}
                                projectFolderUrl=${this.state.projectFolderUrl}/>
                            <div id="info-footer"></div>
                        </div>
                        ${this.state.projectFile.readme && html`
                            <article id="readme"><${MarkdownComponent} markdownUrl=${this.state.projectFolderUrl + "/README.md"} /></article>`
                        }
                    `}
                    visibleDrop=${this.state.projectFile === undefined} 
                    onDrop=${this.handleDrop.bind(this)}/>
            </div>`;
    }

    private async loadProject(projectFolderUrl: string): Promise<void> {
        let response = await fetch(projectFolderUrl + "/3D2P.json");
        let json = await response.json();
        let projectFile = <IProjectFile>json;
        
        this.setState({ 
            projectFolderUrl: projectFolderUrl,
            projectFile: projectFile
        });
    }

    private async handleDrop(fileDataUrl: string): Promise<void> {
        this.setState({ projectFolderUrl: undefined, projectFile: undefined }); // Set projectpath to undefined to reset the dom
        this.loadProject((await this.state.dropCallback(fileDataUrl)).projectFolderUrl);
    }

    private css(): string {
        return css`
            height: 100%;
            margin-bottom: 50px;
            box-sizing: border-box;

            #title {
                text-align: center;
                margin: 25px 0;

                h1 {
                    margin: 0;
                }
            }

            #stl-box {
                max-width: 1024px;        
                background: white;        
                margin: 0 auto 25px auto;
                box-shadow: 0 0px 4px rgba(0,0,0,0.1);
                border-radius: 0 0 5px 5px;

                #info-bar {                
                    padding: 15px;
                    box-sizing: border-box;
                    border-bottom:rgba(0, 0, 0, 0.1);

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
                    border-top: 2px solid #FF0000;
                }
            }

            #readme {
                margin:auto;
                max-width: 1024px;
            }

            img { max-width: 100%; }
        `;
    }
}

render(html`<${PrintProjectsApp}/>`, document.getElementById('print-projects-app')!);