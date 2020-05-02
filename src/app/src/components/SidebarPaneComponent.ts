import { h, Component, VNode } from "preact";
import { css } from "emotion";
import htm from "htm";
const html = htm.bind(h);

interface SidebarPaneComponentProps {
    sidebarComponent: Component;
    contentComponent: Component;
}

interface SidebarPaneComponentState {
    showSplitterSidebar: boolean;
    sidebarSize: number;
    collapsedSidebar: boolean;
    enableSplitterOverlay: boolean;
}

export class SidebarPaneComponent extends Component<SidebarPaneComponentProps, SidebarPaneComponentState> {
    private _minSizeForSidebar: number = 850;
    private _resizeHandler: () => void = this.handleResize.bind(this);

    state: Readonly<SidebarPaneComponentState> = {
        showSplitterSidebar: false,
        sidebarSize: 250,
        collapsedSidebar: false,
        enableSplitterOverlay: false,
    };

    public componentDidMount() {
        window.addEventListener("resize", this._resizeHandler);
        this.handleResize();
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this._resizeHandler);
    }

    public render(): VNode<any> | VNode<any>[] {
        return html`<div className=${this.css()}>
            ${this.getSideBarHtml()} ${this.getSplitterHtml()} ${this.getContentHtml()}
        </div>`;
    }

    private getSideBarHtml(): VNode<any> | VNode<any>[] {
        let sideBarHtml = html`<div id="sidebar" class="splitter-sidebar">${this.props.sidebarComponent}</div>`;
        if (!this.state.showSplitterSidebar) {
            let sideBarbuttonHtml = html`<div id="sidebar-button" onMouseDown=${this.handleSidebarButton.bind(this)}>
                ${this.state.collapsedSidebar && html`<i class="fa fa-chevron-right" aria-hidden="true"></i>`}
                ${!this.state.collapsedSidebar && html`<i class="fa fa-chevron-left" aria-hidden="true"></i>`}
            </div>`;
            let collapsingSideBarClass = this.state.collapsedSidebar ? "hidden" : "visible";

            sideBarHtml = html`<div id="sidebar" class="collapsing-sidebar ${collapsingSideBarClass}">
                    ${this.props.sidebarComponent}
                </div>
                ${sideBarbuttonHtml}`;
        }
        return sideBarHtml;
    }

    private getSplitterHtml(): VNode<any> | VNode<any>[] {
        let splitterHtml = html``;
        if (this.state.showSplitterSidebar) {
            splitterHtml = html`<div id="splitter" onMouseDown=${this.handleSplitterMouseDown.bind(this)}></div>`;
        }
        if (this.state.enableSplitterOverlay) {
            splitterHtml = html`${splitterHtml}
                <div
                    id="splitter-overlay"
                    onMouseMove="${this.handleSplitterMouseMove.bind(this)}"
                    onMouseUp="${this.handleSplitterMouseUp.bind(this)}"
                />`;
        }
        return splitterHtml;
    }

    private getContentHtml(): VNode<any> | VNode<any>[] {
        let contentHtml = html``;
        if (!this.state.enableSplitterOverlay && (this.state.collapsedSidebar || this.state.showSplitterSidebar)) {
            contentHtml = html`<div id="content">${this.props.contentComponent}</div>`;
        }
        return contentHtml;
    }

    private handleResize(): void {
        let boundingBox = (<HTMLElement>this.base).getBoundingClientRect();
        if (boundingBox.width <= this._minSizeForSidebar) {
            this.setState({ showSplitterSidebar: false, collapsedSidebar: true });
        } else {
            this.setState({ showSplitterSidebar: true });
        }
    }

    private handleSidebarButton(): void {
        this.setState({ collapsedSidebar: !this.state.collapsedSidebar });
    }

    private handleSplitterMouseDown(): void {
        this.setState({ enableSplitterOverlay: true });
    }

    private handleSplitterMouseMove(e: MouseEvent): void {
        let sidebarSize = e.x;
        if (sidebarSize <= 250) sidebarSize = 250;
        else if (sidebarSize >= window.innerWidth / 2) sidebarSize = window.innerWidth / 2;

        this.setState({ sidebarSize: sidebarSize });
    }

    private handleSplitterMouseUp(): void {
        this.setState({ enableSplitterOverlay: false });
    }

    private css(): string {
        return css`
            height: 100%;
            display: flex;
            position: relative;
            align-items: stretch;

            #content {
                flex: 1;
            }

            #sidebar-button {
                display: flex;
                align-items: center;
                padding: 15px;
                font-size: 1.5rem;
                border-left: 1px solid rgba(0, 0, 0, 0.1);
                border-right: 1px solid rgba(0, 0, 0, 0.1);

                &:hover {
                    color: #f58026;
                    cursor: pointer;
                }
            }

            #splitter {
                top: 0;
                left: ${this.state.sidebarSize}px;
                width: 2px;
                z-index: 1;
                height: 100%;
                position: absolute;
                cursor: e-resize;
                background: rgba(0, 0, 0, 0.1);
                border-right: 4px solid rgba(0, 0, 0, 0.1);
            }

            #splitter-overlay {
                width: 100%;
                height: 100%;
                z-index: 999;
                background: rgba(255, 255, 255, 0.5);
                position: absolute;
            }

            .splitter-sidebar {
                width: ${this.state.sidebarSize}px;
            }

            .collapsing-sidebar {
                flex: 1;
            }

            .visible {
                display: block;
            }

            .hidden {
                display: none;
            }
        `;
    }
}
