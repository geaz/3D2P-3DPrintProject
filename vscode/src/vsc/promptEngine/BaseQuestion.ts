/**
 * This is the base class for every question type use in the promp engine.
 */
export abstract class BaseQuestion {
    /**
     * Returns the average of two numbers.
     *
     * @param dependendQuestion - Specify any dependend question   * 
     * @param shouldShowDelegate
     * A function which will get the answer of the dependend question as a parameter.
     * The delegate should return true, if the question should be shown in the prompt. False otherwise.
     * 
     * @constructor
     */
    constructor(
        protected dependendQuestion?: BaseQuestion,
        protected shouldShowDelegate?: (value: string) => boolean) { }

    /**
     * This method gets executed, if the question should be shown during the questionnaire.
     */
    public abstract async show(): Promise<void>;

    /**
     * Gets called by the prompt engine to check, if the current should be shown.
     * 
     * @returns True, if the question should be visible. False, otherwise.
     */
    public shouldShow(): boolean {
        return this.dependendQuestion !== undefined && this.shouldShowDelegate !== undefined
            ? this.shouldShowDelegate(<string>this.dependendQuestion.answer)
            : true;
    }

    /**
     * Get the answer for this question.
     */
    protected _answer?: string = undefined;
    get answer(): string | undefined {
        return this._answer;
    }
}