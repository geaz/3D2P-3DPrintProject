import * as vscode from 'vscode';

import { Project } from '../../3d2p/Project';
import { ProjectUploader } from '../ProjectUploader';
import { BaseQuestionnaire } from '../promptEngine/BaseQuestionnaire';
import { PromptResult } from '../promptEngine/PromptResult';
import { PickQuestion } from '../promptEngine/PickQuestion';

export class DeleteProjectQuestionnaire extends BaseQuestionnaire {
    private _projectUploader: ProjectUploader = new ProjectUploader();
    public provider = new PickQuestion('Deleting project! Are you sure?', ['Yes', 'No']);

    constructor(private _project: Project) { super() }

    public async checkPrerequisite(): Promise<PromptResult> { 
        let result = new PromptResult();
        let remoteExists = await this._projectUploader.remoteExists(this._project.projectFile.repositoryUrl, this._project.projectFile.rawRepositoryUrl);
        if(remoteExists) {
            result.isFaulted = true;
            result.message = '3D2P.json file does still exist in repository. Delete the 3D2P.json from the repository.';
        }            
        return result;
    }

    public async vscCommand(): Promise<PromptResult> {
        if(this.provider.answer === 'No') return new PromptResult(); 

        let result = await this._projectUploader.deleteProject(this._project.projectFile.repositoryUrl, this._project.projectFile.rawRepositoryUrl);                      
        if(result) {
            return new PromptResult(`Deleted project successfully from 3D2P homepage.`);
        }
        else {
            return new PromptResult(`Error on deletion!`, true);
        }
    }

    public get Name(): string {
        return "Delete Project";
    }
}