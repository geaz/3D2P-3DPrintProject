import { h, Component, render } from 'preact';
import htm from 'htm';

import { StlViewerComponent } from './components/StlViewerComponent';

const html = htm.bind(h);

interface AppState {
    stlFilePath: string
}

class App extends Component<{}, AppState> {
    componentWillMount() {
        window.addEventListener('message', this._updateStlFilePath);
    }
    
    componentWillUnmount() {
        window.removeEventListener('message', this._updateStlFilePath);
    }

    render() {
        return html`<${StlViewerComponent} stlFilePath="${this.state.stlFilePath}"/>`;
    }

    // Note, that this is NOT a class method!
    // It is a private field holding a function for the event listener
    // (no reference to this otherwise)
    private _updateStlFilePath = (event: any): void => {
        let message = event.data;
        switch (message.command) {
            case 'filechange':
                this.setState({ stlFilePath: message.data });
                break;
        }
    };
}

render(html`<${App}/>`, document.getElementById('app'));