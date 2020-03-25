import * as vscode from 'vscode';

import { BaseQuestion } from './BaseQuestion';
import { BaseQuestionnaire } from './BaseQuestionnaire';

export class PromptEngine {
    public async start(questionnaire: BaseQuestionnaire): Promise<any> {
        if (!(await questionnaire.checkPrerequisite())) return;

        let valid = true;
        let propertyNameList = Object.getOwnPropertyNames(questionnaire);
        for (let index = 0; index < propertyNameList.length; index++) {
            let possibleQuestion = (<PropertyDescriptor>Object.getOwnPropertyDescriptor(questionnaire, propertyNameList[index])).value;
            if (possibleQuestion instanceof BaseQuestion && possibleQuestion.shouldShow()) {
                await possibleQuestion.show();
                if (possibleQuestion.answer === undefined) {
                    vscode.window.showErrorMessage('Please try again and enter values for each prompt!');
                    valid = false;
                    break;
                }
            }
        }
        if (valid) {
            return await questionnaire.vscCommand();
        }
    }
}