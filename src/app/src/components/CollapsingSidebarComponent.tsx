import * as React from "react";
import { FC, useState } from "react";
import styled from "styled-components";

interface CollapsingSidebarComponentProps {
    sidebarComponent: JSX.Element;
    contentComponent: JSX.Element;
}

export const CollapsingSidebarComponent: FC<CollapsingSidebarComponentProps> = (props: CollapsingSidebarComponentProps) => {
    const [isCollapsed, setCollapsed] = useState(true);

    return <StyledCollapsingSidebarComponent collapsed={ isCollapsed }>
        <div className="sidebar">
            {props.sidebarComponent}
        </div>
        <div className="sidebar-button" onMouseDown={ () => setCollapsed(!isCollapsed) }>
            { isCollapsed && <i className="fa fa-chevron-right" aria-hidden="true"></i> }
            { !isCollapsed && <i className="fa fa-chevron-left" aria-hidden="true"></i> }
        </div>
        <div className="content">{props.contentComponent}</div>
    </StyledCollapsingSidebarComponent>;
};

const StyledCollapsingSidebarComponent = styled.div<{ collapsed: boolean }>`
    height: 100%;
    display: flex;
    position: relative;
    align-items: stretch;

    .sidebar {
        flex:1;
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        display: ${ p => p.collapsed ? "none" : "block" };
    }

    .content {
        flex: 1;
        display: ${ p => p.collapsed ? "block" : "none" };
    }    

    .sidebar-button {
        display: flex;
        padding: 15px;
        font-size: 1.5rem;
        background: white;
        align-items: center;
        border-right: 1px solid rgba(0, 0, 0, 0.1);

        &:hover {
            color: ${p => p.theme.mainColor };
            cursor: pointer;
        }
    }
`;