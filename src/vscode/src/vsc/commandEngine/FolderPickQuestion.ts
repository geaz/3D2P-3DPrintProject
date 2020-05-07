import * as vscode from 'vscode';
import { BaseQuestion } from './BaseQuestion';

/**
 * Folder Picker Question Type.
 * This question type shows a vscode input prompt.
 * If the user leaves it empty, if shows a folder picker prompt.
 */
export class FolderPickQuestion extends BaseQuestion {
    constructor(
        public question: string,
        public answerRequired: boolean = true,
        shouldShowDelegate?: () => boolean
    ) {
        super(answerRequired, shouldShowDelegate);
    }

    public async show(): Promise<void> {
        this._answer = await vscode.window
            .showInputBox({
                prompt: this.question,
                placeHolder: 'Enter Path or leave this prompt empty to open a folder selection.'
            });
        if (this._answer === undefined || this._answer === '') {
            let selectedFolder = await vscode.window.showOpenDialog({ canSelectFiles: false, canSelectFolders: true });
            if (selectedFolder !== undefined) {
                this._answer = (<vscode.Uri[]>selectedFolder)[0].fsPath;
            }
        }
    }
}