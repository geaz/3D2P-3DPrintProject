import * as React from "react";
import { FC } from "react";
import styled from "styled-components";

interface SplittedSidebarComponentProps {
    sidebarSize: number;
    sidebarComponent: JSX.Element;
    contentComponent: JSX.Element;
}

export const SplittedSidebarComponent: FC<SplittedSidebarComponentProps> = (props: SplittedSidebarComponentProps) => {
    return <StyledSplittedSidebarComponent sidebarSize={ props.sidebarSize }>
        <div className="sidebar">
            {props.sidebarComponent}
        </div>
        <div className="content">
            {props.contentComponent}
        </div>
    </StyledSplittedSidebarComponent>;
};

const StyledSplittedSidebarComponent = styled.div<{ sidebarSize: number }>`
    height: 100%;
    display: flex;
    position: relative;
    align-items: stretch;

    .sidebar {
        width: ${ p => p.sidebarSize}px;
        border-right: 1px solid rgba(0, 0, 0, 0.1);
    }

    .content {
        flex: 1;
    }
`;