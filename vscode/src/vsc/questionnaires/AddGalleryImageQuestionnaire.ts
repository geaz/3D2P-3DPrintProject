import * as vscode from 'vscode';

import { PickQuestion } from '../promptEngine/PickQuestion';
import { Project } from '../../3d2p/Project';
import { GalleryInfo } from '../../3d2p/model/GalleryInfo';
import { GalleryTreeDataProvider } from '../extensions/treeViews/GalleryTreeDataProvider';
import { BaseQuestionnaire } from '../promptEngine/BaseQuestionnaire';
import { PromptResult } from '../promptEngine/PromptResult';

/**
 * This questionnaire will ask the user for the image to add to the current 3D2P project
 * and adds it to the project file.
 */
export class AddGalleryImageQuestionnaire extends BaseQuestionnaire {
    public image: PickQuestion;

    constructor(
        private _project: Project,
        private _galleryTreeDataProvider: GalleryTreeDataProvider
    ) {
        super();
        
        // Only add images to the picker which are not already in the project file.
        let imageList = new Array<GalleryInfo>();
        this._project.images.items.forEach(image => {
            if (this._project.gallery.filter(g => g.relativePath === image.relativePath).length === 0) {
                imageList.push(image);
            }
        });
        this.image = new PickQuestion('Select image to add.', imageList.map(i => i.relativePath));
    }

    public async vscCommand(): Promise<PromptResult> {
        this._galleryTreeDataProvider.addGalleryItem(this.image.answer!);
        return new PromptResult();
    }

    public get Name(): string {
        return "Add Gallery Image";
    }
}