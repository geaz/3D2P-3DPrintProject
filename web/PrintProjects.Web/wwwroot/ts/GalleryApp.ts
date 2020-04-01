import * as url from 'url';
import { h, Component, render } from 'preact';
import { css } from 'emotion'
import htm from 'htm';

import { FileListComponent } from './FileListComponent';

const html = htm.bind(h);

class App extends Component<{}, AppState> {
    private _projectFile!: any;
    private _projectShortId!: string;
    private _projectFolderUrl!: string;
    
    componentWillMount() {        
        this._projectFile = (<any>window).projectFile;
        this._projectShortId = (<any>window).shortId;
        this._projectFolderUrl = url.resolve('/ProjectFiles/', this._projectShortId! + '/');

        if(this._projectFile === undefined 
            || this._projectShortId === undefined 
            || this._projectFolderUrl === undefined) {
            throw 'Component was not initilized correctly. Missing window variables!';
        }
        this.setState({ 
            galleryFileUrl: url.resolve(this._projectFolderUrl, this._projectFile.gallery[0].relativePath),
            selectedGalleryInfo: this._projectFile.gallery[0], 
        });
    }

    public render() {
        return html
            `<div className=${this.css()}>
                <${FileListComponent}
                    selectedFile=${this.state.selectedGalleryInfo.relativePath}
                    fileList=${this._projectFile.gallery}
                    onFileSelected=${(relativePath: string) => this.onFileSelected(relativePath)}/>
                <div class="gallery-image">
                    <img src="${this.state.galleryFileUrl}" title="${this.state.selectedGalleryInfo.name}"/>
                </div>
            </div>`;
    }

    private onFileSelected(relativePath: string): void {
        this.setState({
            galleryFileUrl: url.resolve(this._projectFolderUrl, relativePath),
            selectedGalleryInfo: this._projectFile.gallery.filter((s: any) => s.relativePath === relativePath)[0]
        });
    }    

    private css(): string {
        return css
            `.gallery-image {
                text-align: center;
                background: #f7f7f7;
                border-left: 1px solid rgba(0,0, 0, 0.05);
                
                img {
                    max-height: 100%;
                }
            }`;
    }
}

interface AppState {
    galleryFileUrl: string;
    selectedGalleryInfo: any;
}

render(html`<${App}/>`, document.getElementById('gallery-app')!);