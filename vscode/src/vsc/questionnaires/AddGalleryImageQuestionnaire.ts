import * as vscode from 'vscode';

import { BaseQuestionnaire } from '../promptEngine/BaseQuestionnaire';
import { PickQuestion } from '../promptEngine/PickQuestion';
import { Project } from '../../3d2p/Project';
import { GalleryInfo } from '../../3d2p/model/GalleryInfo';
import { GalleryTreeDataProvider } from '../extensions/treeViews/GalleryTreeDataProvider';

export class AddGalleryImageQuestionnaire extends BaseQuestionnaire {
    
    public image: PickQuestion;

    constructor(private _project: Project, private _galleryTreeDataProvider: GalleryTreeDataProvider) {
        super();
        
        let imageList = new Array<GalleryInfo>();
        this._project.images.items.forEach(image => {
            if(this._project.gallery.filter(g => g.relativePath === image.relativePath).length === 0) {
                imageList.push(image);
            }
        });
        this.image = new PickQuestion('Select image to add.', imageList.map(i => i.relativePath));
    }

    public async checkPrerequisite(): Promise<boolean> { return true; }

    public async vscCommand(): Promise<void> {
        vscode.window.withProgress(
            { title: 'Adding image to gallery', location: vscode.ProgressLocation.Notification, cancellable: false }, 
            (progress, token) => {
                return new Promise(async (resolve, reject) => {
                    try{
                        this._galleryTreeDataProvider.addGalleryItem(<string>this.image.answer);
                        resolve();
                    }
                    catch(ex) {
                        vscode.window.showErrorMessage(`Could not add image! (Stack: ${ex})`);
                        reject(ex);
                    }
                });
        });
    }
}