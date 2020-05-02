import { h, Component, VNode } from "preact";
import { css } from "emotion";
import htm from "htm";
const html = htm.bind(h);

interface DropComponentProps {
    visibleDrop: boolean;
    content: string;
    onDrop: (fileDataUrl: string) => Promise<void>;
}

interface DropComponentState {
    dragging: boolean;
    loading: boolean;
}

export class DropComponent extends Component<DropComponentProps, DropComponentState> {
    // To prevent the drop overlay from flickering
    // We count the dragenter events for every triggering
    // child. We could use 'pointer-events:none', but this would
    // prevent the ability to select text and any other child interaction in the 'content'.
    private eventCounter: number = 0;

    private _dragEnterHandler: (e: Event) => void = this.handleDragEnter.bind(this);
    private _dragLeaveHandler: (e: Event) => void = this.handleDragLeave.bind(this);
    private _dragOverHandler: (e: Event) => void = this.handleDragOver.bind(this);
    private _dropHandler: (e: Event) => void = (e) => this.handleDrop(<DragEvent>e);

    componentDidMount() {
        let componentDom = this.base;
        componentDom?.addEventListener("dragenter", this._dragEnterHandler);
        componentDom?.addEventListener("dragleave", this._dragLeaveHandler);
        componentDom?.addEventListener("dragover", this._dragOverHandler);
        componentDom?.addEventListener("drop", this._dropHandler);
    }

    componentWillUnmount() {
        let componentDom = this.base;
        componentDom?.removeEventListener("dragenter", this._dragEnterHandler);
        componentDom?.removeEventListener("dragleave", this._dragLeaveHandler);
        componentDom?.removeEventListener("dragover", this._dragOverHandler);
        componentDom?.removeEventListener("drop", this._dropHandler);
    }

    public render(): VNode<any> | VNode<any>[] {
        return html`<div className=${this.css()}>
            ${(this.state.dragging || this.props.visibleDrop) &&
            html`<div id="droparea-overlay">
                <img src="/images/logo.svg" title="Logo" id="logo" />
                ${this.state.loading && html`<i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>`}
                ${!this.state.loading && html`<p>Drop 3MF here</p>`}
            </div>`}
            ${this.props.content}
        </div>`;
    }

    private handleDragEnter(e: Event): void {
        e.preventDefault();
        this.eventCounter++;
        this.setState({ dragging: true });
    }

    private handleDragLeave(e: Event): void {
        e.preventDefault();
        this.eventCounter--;
        if (this.eventCounter === 0) this.setState({ dragging: false });
    }

    private handleDragOver(e: Event): void {
        e.preventDefault();
    }

    private async handleDrop(e: DragEvent): Promise<void> {
        e.preventDefault();
        if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
            this.setState({ loading: true });

            var file = e.dataTransfer.files[0];
            if (file.name.toUpperCase().endsWith(".3MF")) {
                let fileDataUrl: string = await new Promise((resolve, reject) => {
                    let reader = new FileReader();
                    reader.onerror = reject;
                    reader.onload = () => {
                        resolve(<string>reader.result);
                    };
                    reader.readAsDataURL(file);
                });
                await this.props.onDrop(fileDataUrl);
            }
        }
        this.eventCounter = 0;
        this.setState({ loading: false, dragging: false });
    }

    private css(): string {
        return css`
            height:100%;

            #droparea-overlay {
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
            }

            #logo {
                width: 150px;
                margin-bottom: 25px;
            }
        `;
    }
}
