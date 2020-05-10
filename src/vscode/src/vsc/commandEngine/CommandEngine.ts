import * as vscode from "vscode";
import { BaseQuestion } from "./BaseQuestion";
import { BaseCommand, vscodeProgress } from "./BaseCommand";
import { CommandResult } from "./CommandResult";

/**
 * This class is responsible to lead through the different questions of a given command.
 */
export class CommandEngine {
    public async start(command: BaseCommand): Promise<void> {        
        let result = await this.executeAsProgress(`${command.Name}: Checking...`, () => command.checkPrerequisite());
        if (result) {
            let valid = true;
            let propertyNameList = Object.getOwnPropertyNames(command);
            for (let index = 0; index < propertyNameList.length; index++) {
                let possibleQuestion = (<PropertyDescriptor>Object.getOwnPropertyDescriptor(command, propertyNameList[index])).value;
                if (possibleQuestion instanceof BaseQuestion && possibleQuestion.shouldShow()) {
                    await possibleQuestion.show();
                    if ((possibleQuestion.answer === "" || possibleQuestion.answer === undefined) && possibleQuestion.answerRequired) {
                        vscode.window.showErrorMessage("Please try again and enter values for each prompt!");
                        valid = false;
                        break;
                    }
                }
            }

            if (valid) {
                await this.executeAsProgress(`${command.Name}`, command.vscCommand.bind(command));
            } else {
                vscode.window.showErrorMessage("Please try again and enter values for each prompt!");
            }
        }
    }

    private async executeAsProgress(title: string, delegate: (progress: vscodeProgress) => Promise<CommandResult>): Promise<boolean> {
        return vscode.window.withProgress(
            { title: title, location: vscode.ProgressLocation.Window, cancellable: false },
            (progress, token) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        let result = await delegate(progress);
                        if (result.isFaulted) {
                            vscode.window.showErrorMessage(`Error during execution: ${result.message}`);
                            resolve(false);
                        } else if (result.notification !== undefined) {
                            vscode.window.showInformationMessage(result.notification);
                        } else if (result.message !== undefined) {
                            vscode.window.setStatusBarMessage(result.message);
                        }
                        resolve(true);
                    } catch (ex) {
                        vscode.window.showErrorMessage(`Unhandled error: ${ex}`);
                        reject();
                    }
                });
            }
        );
    }
}
