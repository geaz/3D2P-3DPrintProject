import { h, Component } from 'preact';
import htm from 'htm';
const html = htm.bind(h);

export class TestComponent extends Component {    
    public render() {
        return html`<p>${true && html`<small>haha</small>`}TestComponent</p>`;
    }
}