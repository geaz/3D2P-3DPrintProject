import { h, Component } from "preact";
import htm from "htm";
const html = htm.bind(h);

import * as marked from "marked";

interface MarkdownComponentProps {
    markdownUrl: string;
}

interface MarkdownComponentState {
    loading: boolean;
    content: string;
}

export class MarkdownComponent extends Component<MarkdownComponentProps, MarkdownComponentState> {
    async componentWillMount() {
        this.setState({ loading: true });
        let response = await fetch(this.props.markdownUrl);
        let fileContent = await response.text();
        this.setState({ loading: false, content: marked(fileContent) });
    }

    public render() {
        return html`<div>
            ${this.state.loading && html`<i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>`}
            ${!this.state.loading &&
            html`<div class="markdown" dangerouslySetInnerHTML=${{ __html: this.state.content }}></div>`}
        </div>`;
    }
}
