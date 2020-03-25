import * as vscode from 'vscode';

import { BaseQuestion } from './BaseQuestion';

export class InputQuestion extends BaseQuestion {
    constructor(public question: string, public placeHolder?: string, dependendQuestion?: BaseQuestion, shouldShowDelegate?: (value: string) => boolean) { 
        super(dependendQuestion, shouldShowDelegate);
    }

    public async show(): Promise<void> {
        this._answer = await vscode.window.showInputBox({ prompt: this.question, placeHolder: this.placeHolder });
    }
}