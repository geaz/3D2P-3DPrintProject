/**
 * This is the base class for every question type used in the command engine.
 */
export abstract class BaseQuestion {
    /**
     * Returns the average of two numbers.
     *
     * @param shouldShowDelegate
     * The delegate should return true, if the question should be shown in the prompt. False otherwise.
     *
     * @constructor
     */
    constructor(public answerRequired: boolean = true, protected shouldShowDelegate?: () => boolean) {}

    /**
     * This method gets executed, if the question should be shown during the command execution.
     */
    public abstract async show(): Promise<void>;

    /**
     * Gets called by the command engine to check, if the current question should be shown.
     *
     * @returns True, if the question should be visible. False, otherwise.
     */
    public shouldShow(): boolean {
        return this.shouldShowDelegate !== undefined ? this.shouldShowDelegate() : true;
    }

    /**
     * Get the answer for this question.
     */
    protected _answer?: string = undefined;
    get answer(): string | undefined {
        return this._answer;
    }
}
