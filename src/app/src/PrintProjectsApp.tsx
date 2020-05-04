import * as React from "react";
import { render } from "react-dom";
import { FC, useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { ProjectFile } from "./model/ProjectFile";
import { StlExplorerComponent } from "./StlExplorerComponent";
import { useFileDragDrop } from "./effects/EventEffects";

const PrintProjectsApp: FC = () => {
    const componentRef = useRef<HTMLDivElement>(null);
    
    const [projectFile, setProjectFile] = useState<ProjectFile | undefined>(undefined);
    const [projectFolderUrl, setProjectFolderUrl] = useState<string>();
    const [isDragging, setDragging] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const setProject = async function(projectFolderUrl: string) {
        if(projectFolderUrl !== undefined) {
            setProjectFolderUrl(projectFolderUrl);
            let response = await fetch(projectFolderUrl + "/3D2P.json");
            let json = await response.json();
            setProjectFile(json as ProjectFile);
        }
    };
    
    const dragDropCb = async (file: File) => {
        setLoading(true);
        if (file.name.toUpperCase().endsWith(".3MF")) {
            let fileDataUrl: string = await new Promise((resolve, reject) => {
                let reader = new FileReader();
                reader.onerror = reject;
                reader.onload = () => {
                    resolve(reader.result as string);
                };
                reader.readAsDataURL(file);
            });
            let dropCallback = (window as any).printProjects?.dropCallback;
            if(dropCallback !== undefined) {
                setProject((await dropCallback(fileDataUrl)).projectFolderUrl);
            }
            else { console.warn("DropCallback was not set on window.printProjects.dropCallback! Can't handle file drops! "); }
        }
        setLoading(false);
    };

    useEffect(() => { setProject((window as any).printProjects?.projectFolderUrl); }, []);
    useFileDragDrop(componentRef, setDragging, dragDropCb);

    let pageContent = undefined;
    if(projectFile !== undefined && projectFile.readme === null) {
        pageContent = <StlExplorerComponent 
            minSizeForSplitter={ 850 }
            projectFile={ projectFile }
            projectFolderUrl={ projectFolderUrl! } />;
    }
    else if (projectFile !== undefined && projectFile.readme !== null) {
        pageContent = <StyledProject>
            <div id="title">
                <h1>{projectFile.name}</h1>
                {projectFile.id && <small>ID: {projectFile.id}</small>}
            </div>
            <div id="stl-box">
                <div id="info-bar" className="status-${this.state.projectFile.status}">
                    {projectFile.readme && <button>Readme</button>}
                    <button>STLs</button>
                </div>
                <StlExplorerComponent 
                    minSizeForSplitter={ 250 }
                    projectFile={ projectFile }
                    projectFolderUrl={ projectFolderUrl! } />
                <div id="info-footer"></div>
            </div>
            {projectFile.readme &&
            <article id="readme">
                
            </article>}
        </StyledProject>;
    }

    return <div ref={componentRef}>
        {(isDragging || projectFile === undefined) &&
            <StyledDropOverlay>
                <img src="/images/logo.svg" title="Logo" id="logo" />
                {isLoading && <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>}
                {!isLoading && <p>Drop 3MF here</p>}
            </StyledDropOverlay>
        }
        {pageContent}
    </div>;
}

const StyledDropOverlay = styled.div`
    top: 0;
    left: 0;
    position: fixed;
    width: 100%;
    height: 100%;
    display: block;
    background: #f7f7f7;
    display: flex;
    z-index: 999;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    #logo {
        width: 150px;
        margin-bottom: 25px;
    }
`;

const StyledProject = styled.div`
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

render(<PrintProjectsApp/>, document.getElementById("print-projects-app")!);

/*import { h, Component, render, VNode } from "preact";
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
*/