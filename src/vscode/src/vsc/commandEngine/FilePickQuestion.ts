import * as vscode from 'vscode';
import { BaseQuestion } from './BaseQuestion';

/**
 * File Picker Question Type.
 * This question type shows a vscode input prompt.
 * If the user leaves it empty, if shows a file picker prompt.
 */
export class FilePickQuestion extends BaseQuestion {
    constructor(
        public question: string,
        public filters?: { [name: string]: string[] },
        public answerRequired: boolean = true,
        shouldShowDelegate?: () => boolean
    ) {
        super(answerRequired, shouldShowDelegate);
    }

    public async show(): Promise<void> {
        this._answer = await vscode.window
            .showInputBox({
                prompt: this.question,
                placeHolder: 'Enter file path or leave this prompt empty to open a file picker.'
            });
        if (this._answer === undefined || this._answer === '') {
            let selectedFile = await vscode.window.showOpenDialog({ 
                canSelectMany: false, 
                canSelectFiles: true, 
                canSelectFolders: false, 
                filters: this.filters 
            });
            if (selectedFile !== undefined) {
                this._answer = (<vscode.Uri[]>selectedFile)[0].fsPath;
            }
        }
    }
}