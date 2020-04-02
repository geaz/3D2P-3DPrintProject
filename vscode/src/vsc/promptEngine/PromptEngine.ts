import * as vscode from 'vscode';
import { BaseQuestion } from './BaseQuestion';
import { BaseQuestionnaire } from './BaseQuestionnaire';
import { PromptResult } from './PromptResult';

/**
 * This class is responsible to lead through the different questions of a given questionnaire.
 */
export class PromptEngine {
    public async start(questionnaire: BaseQuestionnaire): Promise<void> {
        let result = await this.executeAsProgress(`${questionnaire.Name}: Checking...`, () => questionnaire.checkPrerequisite());
        if(result) {
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
                await this.executeAsProgress(`${questionnaire.Name}: Executing...`, () => questionnaire.vscCommand());
            } 
            else {
                vscode.window.showErrorMessage('Please try again and enter values for each prompt!');
            }
        }
    }

    private async executeAsProgress(title: string, delegate: () => Promise<PromptResult>): Promise<boolean> {
        return vscode.window.withProgress(
            { title: title, location: vscode.ProgressLocation.Notification, cancellable: false },
            (progress, token) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let result = await delegate();  
                        if (result.isFaulted) {
                            vscode.window.showErrorMessage(`Error during execution: ${result.message}`);
                            resolve(false);
                        }
                        else if(result.message !== undefined) {
                            vscode.window.showInformationMessage(result.message);
                        }       
                        resolve(true);       
                    }
                    catch (ex) {                        
                        vscode.window.showErrorMessage(`Unhandled error: ${ex}`);
                        reject();
                    }
                });
            });
    }
}