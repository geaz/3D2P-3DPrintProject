import { h, Component } from "preact";
import { css } from "emotion";
import htm from "htm";
const html = htm.bind(h);

interface SplittedPaneComponentProps {
    leftPaneComponent: Component;
    rightPaneComponent: Component;
}

export class SplittedPaneComponent extends Component<SplittedPaneComponentProps> {
    private _leftPaneSize: number = 250;

    public render() {
        return html`<div className=${this.css()}>
            <div id="left-pane">${this.props.leftPaneComponent}</div>
            <div id="splitter"></div>
            <div id="right-pane">${this.props.rightPaneComponent}</div>
        </div>`;
    }

    private css(): string {
        return css`
            height: 100%;
            display: flex;
            position: relative;
            align-items: stretch;

            #left-pane {
                width: ${this._leftPaneSize}px;
            }

            #right-pane {
                flex: 1;
            }

            #splitter {
                top: 0;
                left: ${this._leftPaneSize}px;
                width: 2px;
                z-index: 1;
                height: 100%;
                position: absolute;
                cursor: e-resize;
                background: rgba(0, 0, 0, 0.1);
            }
        `;
    }
}
