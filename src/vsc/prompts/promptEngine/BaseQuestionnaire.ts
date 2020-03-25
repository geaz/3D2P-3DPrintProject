export abstract class IQuestionnaire { }

export abstract class BaseQuestionnaire extends IQuestionnaire {
    public abstract checkPrerequisite(): Promise<boolean>;
    public abstract async vscCommand(): Promise<any>;
}