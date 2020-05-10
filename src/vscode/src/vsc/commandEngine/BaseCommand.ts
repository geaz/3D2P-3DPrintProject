import * as vscode from "vscode";
import { CommandResult } from "./CommandResult";

export type vscodeProgress = vscode.Progress<{
    message?: string | undefined;
    increment?: number | undefined;
}>;

/**
 * Every questionnaire executed by the command engine has to implement this interface.
 */
export abstract class BaseCommand {
    /**
     * This method gets executed after the user entered all prompted values, if any defined.
     *
     * @returns A promise which resolves/rejects to an array with error messages, if any.
     */
    public abstract vscCommand(progress: vscodeProgress): Promise<CommandResult>;

    /**
     * This method gets executed before showing any prompts.
     * Here it is possible to check for any prerequisites prior to
     * executing the command.
     *
     * @returns A promise which resolves/rejects to an array with error messages, if any.
     */
    public async checkPrerequisite(): Promise<CommandResult> {
        return new CommandResult();
    }

    /**
     * @returns The name of the command.
     */
    public abstract get Name(): string;
}
