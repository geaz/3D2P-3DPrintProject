import { h, Component, render } from 'preact';
import htm from 'htm';

const html = htm.bind(h);
declare var acquireVsCodeApi;

import { StlViewerComponent } from './components/StlViewerComponent';
import { ConfigComponent, IConfigDescription, ConfigType } from './components/ConfigComponent';

interface AppState {
    stlFilePath: string;
    color: number;
}

class App extends Component<{}, AppState> {
    private _vscode = acquireVsCodeApi();
    private _config = { color: 0xF58026, status: "" };
    private _configDescription = new Array<IConfigDescription>();

    constructor() {
        super();
        this.setState({ color: this._config.color });
        this._configDescription.push(<IConfigDescription>{ property: 'color', type: ConfigType.Color });
        this._configDescription.push(<IConfigDescription>{ property: 'status', type: ConfigType.Picker, options: ["WIP", "Done"] });
    }

    componentWillMount() {
        window.addEventListener('message', this._updateStlFilePath);
    }
    
    componentWillUnmount() {
        window.removeEventListener('message', this._updateStlFilePath);
    }

    render() {
        return html
            `<${ConfigComponent} config=${this._config} configDescription=${this._configDescription} onChange=${this._onConfigChanged}/>
            <${StlViewerComponent} color=${this.state.color} stlFilePath="${this.state.stlFilePath}"/>`;
    }

    // Note: This is NOT a class method!
    // It is a private field holding a function for the event listener
    // (no reference to 'this' otherwise)
    private _updateStlFilePath = (event: any): void => {
        let message = event.data;
        switch (message.command) {
            case 'filechange':
                this.setState({ stlFilePath: message.data });
                break;
            case 'setStlInfo':
                this.setState({ color: message.data.color });
                this._config.color = message.data.color;
                this._config.status = message.data.status;
                break;
        }
    };

    private _onConfigChanged = (property: string, value: any): void => {
        if(property === 'color') {
            this.setState({ color: value });
        }

        this._vscode.postMessage({
            command: 'updateStlInfo',
            data: {
                color: this._config.color,
                status: this._config.status
            }
        })
    }
}

render(html`<${App}/>`, document.getElementById('app'));