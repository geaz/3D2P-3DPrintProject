import * as vscode from 'vscode';

import { BaseQuestionnaire } from './promptEngine/BaseQuestionnaire';
import { PickQuestion } from './promptEngine/PickQuestion';
import { Project } from '../project/Project';
import { GalleryInfo } from '../project/model/GalleryInfo';

export class AddGalleryImageQuestionnaire extends BaseQuestionnaire {
    
    public image: PickQuestion;

    constructor(private _project: Project) {
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
                        let galleryInfo = this._project.images.getItemByRelativePath(<string>this.image.answer);
                        this._project.gallery.push(galleryInfo);
                        this._project.Save();                       
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