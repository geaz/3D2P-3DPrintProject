import * as vscode from 'vscode';

import { GitExtension } from '../../git';
import { Project } from '../../3d2p/Project';
import { ProjectUploader } from '../ProjectUploader';
import { BaseQuestionnaire } from '../promptEngine/BaseQuestionnaire';
import { PromptResult } from '../promptEngine/PromptResult';

export class UploadProjectQuestionnaire extends BaseQuestionnaire {
    private _projectUploader: ProjectUploader = new ProjectUploader();

    constructor(private _project: Project) { super(); }

    public async checkPrerequisite(): Promise<PromptResult> { 
        let remoteExists = await this._projectUploader.remoteExists(this._project.projectFile.repositoryUrl, this._project.projectFile.rawRepositoryUrl);
        if(!remoteExists) {
            return new PromptResult(
                '3D2P.json file does not exists in repository. Make sure you pushed all your changes. \
                If you want to delete the project from the 3D2P homepage instead, use the delete command.', true);
        }
        
        let gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git')?.exports;
        if(gitExtension === undefined) {
            return new PromptResult('Git Extension was not found in VS Code!', true);
        }
        else {
            let git = gitExtension.getAPI(1);
            let repo = git.getRepository(vscode.Uri.file(this._project.projectPath));
            if(repo === null) {
                return new PromptResult('No repository found in current workspace!', true);
            }
            else if(repo.state.workingTreeChanges.filter(c => c.uri.fsPath.includes('3D2P.json')).length > 0)
            {
                return new PromptResult('Please push your 3D2P.json file!', true);
            }
        }
        return new PromptResult();
    }

    public async vscCommand(): Promise<PromptResult> {
        let shortId = await this._projectUploader.uploadProject(this._project.projectFile.repositoryUrl, this._project.projectFile.rawRepositoryUrl);                      
        return new PromptResult(`Uploaded successfully: https://3d2p.net/projects/${shortId}`);
    }

    public get Name(): string {
        return "Upload Project";
    }
}