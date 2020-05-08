import * as React from "react";
import { render } from "react-dom";
import { FC, useState, useEffect, useRef } from "react";
import styled, { ThemeProvider, css } from "styled-components";

import { Status } from "./model/Status";
import { ProjectFile } from "./model/ProjectFile";
import { StlExplorerComponent } from "./components/StlExplorerComponent";
import { useFileDragDrop } from "./effects/EventEffects";
import { MarkdownComponent } from "./components/MarkdownComponent";

export const PrintProjectsApp: FC = () => {
    const componentRef = useRef<HTMLDivElement>(null);
    
    const [projectFile, setProjectFile] = useState<ProjectFile | undefined>(undefined);
    const [projectFolderUrl, setProjectFolderUrl] = useState<string>();
    const [isDragging, setDragging] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isFullscreen, setFullscreen] = useState(false);

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
    useFileDragDrop(componentRef, setDragging, dragDropCb);
    useEffect(() => { setProject((window as any).printProjects?.projectFolderUrl); }, []);
    useEffect(() => { window.dispatchEvent(new Event('resize')); }, [isFullscreen]);

    let pageContent = undefined;
    if(projectFile !== undefined && projectFile.readme === null) {
        pageContent = <StlExplorerComponent 
            minSizeForSplitter={ 750 }
            projectFile={ projectFile }
            projectFolderUrl={ projectFolderUrl! } />;
    }
    else if (projectFile !== undefined && projectFile.readme !== null) {
        pageContent = <StyledProject>            
            <StyledStlBox isFullscreen={ isFullscreen }>
                <div id="box-bar">
                    <h2 id="title">{projectFile.name}</h2>
                    <button onClick={() => { setFullscreen(!isFullscreen); }}>
                        <i className="fa fa-arrows-alt" aria-hidden="true"></i>
                    </button>
                </div>
                <div id="box-content">
                    <StlExplorerComponent
                        minSizeForSplitter={ 1000 }
                        projectFile={ projectFile }
                        projectFolderUrl={ projectFolderUrl! } />
                </div>
                <div id="box-footer">
                    <small className="first">Status: {Status[projectFile.status]}</small>
                    <small>ID: {projectFile.id}</small>
                </div>
            </StyledStlBox>
            {projectFile.readme &&
            <article id="readme">
                <MarkdownComponent markdownUrl={ `${projectFolderUrl}/README.md` } />
            </article>}
        </StyledProject>;
    }

    return <ThemeProvider theme={AppTheme}>
        <StyledApp ref={componentRef} isFullscreen={ isFullscreen }>
            {(isDragging || isLoading || projectFile === undefined) &&
                <StyledDropOverlay>
                    <img src="/images/logo.svg" title="Logo" id="logo" />
                    {isLoading && <i className="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>}
                    {!isLoading && <p>Drop 3MF here</p>}
                </StyledDropOverlay>
            }
            {pageContent}
        </StyledApp>
    </ThemeProvider>;
}

const AppTheme = {
    textColor: "#404040",
    mainColor: "#f58026",
    background: "#f7f7f7",
    boxShadow: "0 0px 4px rgba(0, 0, 0, 0.1)"
};

const StyledApp = styled.div<{ isFullscreen: boolean }>`
    height:100%;
    color: ${p => p.theme.textColor };
    ${ p => p.isFullscreen && css`overflow:hidden;` }

    a { color: ${p => p.theme.textColor}; }
    a:hover { color: ${p => p.theme.mainColor}; }
`;

const StyledDropOverlay = styled.div`
    top: 0;
    left: 0;
    position: fixed;
    width: 100%;
    height: 100%;
    display: block;
    background: ${p => p.theme.background };
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
    margin: auto;
    max-width: 1024px;
    padding: 25px 50px 50px 50px;
    box-sizing: border-box;

    #readme img {
        display: block;
        max-width: 100%;
        margin: auto;
    }
`;

const StyledStlBox = styled.div<{ isFullscreen: boolean }>`
    display: flex;
    flex-direction: column;
    background: white;
    margin: 0 0 50px 0;
    box-shadow: ${p => p.theme.boxShadow };
    border-radius: 5px;

    ${p => p.isFullscreen
        ? css`
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            position: fixed;
        `
        : css`height: 500px;` }

    #box-bar {
        padding: 15px;
        display: flex;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            
        #title {
            flex: 1;
            margin: 0;
        }

        button {
            border: 1px solid rgba(0,0,0,0.1);
            border-radius: 5px;
            background: #f7f7f7;
            padding: 10px;
            width: 40px;
            cursor: pointer;
            box-shadow: ${p => p.theme.boxShadow };

            &:hover {
                color: ${p => p.theme.mainColor };
                border: 1px solid rgba(0,0,0,0.2);
            }
        }
    }

    #box-content {
        flex: 1;
    }

    #box-footer {
        display: flex;
        padding: 15px;
        border-top: 1px solid rgba(0, 0, 0, 0.1);

        .first {
            flex: 1;
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
`;

render(<PrintProjectsApp/>, document.getElementById("print-projects-app")!);