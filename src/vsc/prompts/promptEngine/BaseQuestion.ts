export abstract class BaseQuestion {
    constructor(protected dependendQuestion?: BaseQuestion, protected shouldShowDelegate?: (value: string) => boolean) {}   

    public abstract async show(): Promise<void>;

    public shouldShow(): boolean {
        return this.dependendQuestion !== undefined && this.shouldShowDelegate !== undefined
            ? this.shouldShowDelegate(<string>this.dependendQuestion.answer)
            : true;
    }
    
    protected _answer: string | undefined = undefined;
    get answer(): string | undefined {
        return this._answer;
    }
}