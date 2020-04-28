import * as url from 'url';
import { h, Component, render } from 'preact';
import { css } from 'emotion'
import htm from 'htm';

const html = htm.bind(h);

class App extends Component<{}, AppState> {
    
    componentWillMount() {
    }

    public render() {
        return html `<div className=${this.css()}>Test</div>`;
    }

    private css(): string {
        return css
            ``;
    }
}

interface AppState {

}

render(html`<${App}/>`, document.getElementById('app')!);