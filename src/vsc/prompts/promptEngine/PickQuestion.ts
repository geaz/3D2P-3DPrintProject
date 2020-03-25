import * as vscode from 'vscode';

import { BaseQuestion } from './BaseQuestion';

export class PickQuestion extends BaseQuestion {
    constructor(public question: string, public options: Array<string>, dependendQuestion?: BaseQuestion, shouldShowDelegate?: (value: string) => boolean) { 
        super(dependendQuestion, shouldShowDelegate);
    }

    public async show(): Promise<void> {
        this._answer = await vscode.window.showQuickPick(this.options, { placeHolder: this.question, canPickMany: false });
    }
}