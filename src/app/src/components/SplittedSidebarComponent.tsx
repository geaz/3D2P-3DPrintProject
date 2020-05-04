import * as React from "react";
import { FC, useState } from "react";
import styled from "styled-components";

interface SplittedSidebarComponentProps {
    sidebarComponent: JSX.Element;
    contentComponent: JSX.Element;
}

export const SplittedSidebarComponent: FC<SplittedSidebarComponentProps> = (props: SplittedSidebarComponentProps) => {
    const [sidebarSize, setSidebarSize] = useState(250);
    const [showSplitterOverlay, setShowSplitterOverlay] = useState(false);

    const handleSplitterMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        let sidebarSize = e.clientX;
        if (sidebarSize <= 250) sidebarSize = 250;
        else if (sidebarSize >= window.innerWidth / 2) sidebarSize = window.innerWidth / 2;

        setSidebarSize(sidebarSize);
    }

    return <StyledSplittedSidebarComponent sidebarSize={ sidebarSize }>
        <div className="sidebar">
            {props.sidebarComponent}
        </div>
        <StyledSplitter 
            splitterX={ sidebarSize } 
            onMouseDown={ () => setShowSplitterOverlay(true) }/>
        <StyledOverlay
            visible={ showSplitterOverlay }
            className="splitter-overlay"
            onMouseMove={ handleSplitterMouseMove }
            onMouseUp={ () => setShowSplitterOverlay(false) }
        />
        <StyledContent visible={ !showSplitterOverlay }>
            {props.contentComponent}
        </StyledContent>
    </StyledSplittedSidebarComponent>;
};

const StyledSplittedSidebarComponent = styled.div<{ sidebarSize: number }>`
    height: 100%;
    display: flex;
    position: relative;
    align-items: stretch;

    .sidebar {
        width: ${ p => p.sidebarSize}px;
    }
`;

const StyledSplitter = styled.div<{ splitterX: number }>`
    top: 0;
    left: ${ p => p.splitterX}px;
    width: 2px;
    z-index: 1;
    height: 100%;
    position: absolute;
    cursor: e-resize;
    background: rgba(0, 0, 0, 0.1);
    border-right: 4px solid rgba(0, 0, 0, 0.1);
`;

const StyledOverlay = styled.div<{ visible: boolean }>`
    width: 100%;
    height: 100%;
    z-index: 999;
    background: rgba(255, 255, 255, 0.5);
    position: absolute;
    display: ${p => p.visible ? "block" : "none" };
`;

const StyledContent = styled.div<{ visible: boolean }>`
    flex: 1;
    display: ${p => p.visible ? "block" : "none" };
`;