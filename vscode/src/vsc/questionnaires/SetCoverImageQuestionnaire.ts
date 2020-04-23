import * as vscode from 'vscode';

import { Project } from '../../3d2p/Project';
import { PickQuestion } from '../promptEngine/PickQuestion';
import { PromptResult } from '../promptEngine/PromptResult';
import { BaseQuestionnaire } from '../promptEngine/BaseQuestionnaire';
import { FileListItem } from '../../3d2p/fileList/FileListItem';

/**
 * This questionnaire will ask the user for a cover image.
 */
export class SetCoverImageQuestionnaire extends BaseQuestionnaire {
    public image: PickQuestion;

    constructor(private _project: Project) {
        super();
        this.image = new PickQuestion('Select image to add.', this._project.images.items.map(i => i.relativePath));
    }

    public async vscCommand(): Promise<PromptResult> {
        this._project.projectFile.coverImage = this.image.answer!;
        this._project.Save();
        return new PromptResult();
    }

    public get Name(): string {
        return "Set cover image";
    }
}