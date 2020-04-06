import { ProjectUploader } from '../ProjectUploader';
import { BaseQuestionnaire } from '../promptEngine/BaseQuestionnaire';
import { PromptResult } from '../promptEngine/PromptResult';
import { PickQuestion } from '../promptEngine/PickQuestion';
import { InputQuestion } from '../promptEngine/InputQuestion';

export class DeleteProjectQuestionnaire extends BaseQuestionnaire {
    private _projectUploader: ProjectUploader = new ProjectUploader();

    public shortId = new InputQuestion('Enter ID of project to delete.');
    public shouldDelete = new PickQuestion('Deleting project! Are you sure?', ['Yes', 'No']);

    public async vscCommand(): Promise<PromptResult> {
        if(this.shouldDelete.answer === 'No') return new PromptResult('Deletion aborted by user.'); 

        let resultMessage = await this._projectUploader.deleteProject(this.shortId.answer!);                      
        if(resultMessage === undefined) {
            return new PromptResult(`Project deleted successfully from 3D2P homepage.`);
        }
        else {
            return new PromptResult(`${resultMessage}`, true);
        }
    }

    public get Name(): string {
        return "Delete Project";
    }
}