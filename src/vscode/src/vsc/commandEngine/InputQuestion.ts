import * as vscode from "vscode";
import { BaseQuestion } from "./BaseQuestion";

/**
 * Text Input Question Type.
 * This question type shows a vscode input prompt.
 */
export class InputQuestion extends BaseQuestion {
    constructor(
        public question: string,
        public placeHolder?: string,
        public answerRequired: boolean = true,
        shouldShowDelegate?: () => boolean
    ) {
        super(answerRequired, shouldShowDelegate);
    }

    public async show(): Promise<void> {
        this._answer = await vscode.window.showInputBox({ prompt: this.question, placeHolder: this.placeHolder });
    }
}
