import * as vscode from 'vscode';
import { BaseQuestion } from './BaseQuestion';

/**
 * Text Input Question Type.
 * This question type shows a vscode input prompt. 
 */
export class InputQuestion extends BaseQuestion {
    constructor(
        public question: string,
        public placeHolder?: string,
        dependendQuestion?: BaseQuestion,
        shouldShowDelegate?: (value: string) => boolean
    ) {
        super(dependendQuestion, shouldShowDelegate);
    }

    public async show(): Promise<void> {
        this._answer = await vscode.window.showInputBox({ prompt: this.question, placeHolder: this.placeHolder });
    }
}