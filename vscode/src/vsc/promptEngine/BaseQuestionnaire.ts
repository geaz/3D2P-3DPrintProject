import { PromptResult } from "./PromptResult";

/**
 * Every questionnaire executed by the prompt engine has to implement this interface.
 */
export abstract class BaseQuestionnaire {
    /**
     * This method gets executed after the user entered all prompted values.
     * 
     * @returns A promise which resolves/rejects to an array with error messages, if any.
     */
    public abstract vscCommand(): Promise<PromptResult>;

    /**
     * This method gets executed before showing any prompts.
     * Here it is possible to check for any prerequisites prior to 
     * executing the questionnaire.
     * 
     * @returns A promise which resolves/rejects to an array with error messages, if any.
     */
    public async checkPrerequisite(): Promise<PromptResult> { return new PromptResult(); }

    /**
     * @returns The name of the questionnaire.
     */
    public abstract get Name(): string;
}