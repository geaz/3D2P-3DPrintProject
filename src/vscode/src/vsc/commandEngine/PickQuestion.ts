import * as vscode from 'vscode';
import { BaseQuestion } from './BaseQuestion';

/**
 * List Picker Question Type.
 * This question type shows a vscode picker list prompt. 
 */
export class PickQuestion extends BaseQuestion {
    constructor(
        public question: string,
        public options: Array<string>,
        public answerRequired: boolean = true,
        shouldShowDelegate?: () => boolean
    ) {
        super(answerRequired, shouldShowDelegate);
    }

    public async show(): Promise<void> {
        this._answer = await vscode.window.showQuickPick(this.options, { placeHolder: this.question, canPickMany: false });
    }
}