import * as vscode from 'vscode';
import * as path from 'path';

import { Project } from '../../3d2p/Project';
import { ProjectUploader } from '../ProjectUploader';
import { BaseQuestionnaire } from '../promptEngine/BaseQuestionnaire';
import { GitExtension } from '../../git';

export class UploadProjectQuestionnaire extends BaseQuestionnaire {
    private _projectUploader: ProjectUploader = new ProjectUploader();

    constructor(private _project: Project) {
        super();
    }

    public async checkPrerequisite(): Promise<boolean> { 
        return new Promise(async (resolve, reject) => {
            let valid = true;            
            let remoteExists = await this._projectUploader.remoteExists(this._project.projectFile.repositoryUrl, this._project.projectFile.rawRepositoryUrl);
            if(!remoteExists) {
                vscode.window.showErrorMessage(`3D2P.json file does not exists in repository. Make sure you pushed all your changes.
                    If you want to delete the project from the 3D2P homepage isntead, use the 'delete project' command.`);
                valid = false;
            }

            let gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git')?.exports;
            if(gitExtension === undefined) {
                vscode.window.showErrorMessage(`Git Extension was not found in VS Code!`);
                valid = false;
            }
            else {
                let git = gitExtension.getAPI(1);
                let repo = git.getRepository(vscode.Uri.file(this._project.projectPath));
                if(repo!.state.workingTreeChanges.filter(c => c.uri.fsPath.includes('3D2P.json')).length > 0)
                {
                    vscode.window.showErrorMessage(`Please push your 3D2P.json file!`);
                    valid = false;
                }
            }
            resolve(valid);           
        });
    }

    public async vscCommand(): Promise<void> {
        vscode.window.withProgress(
            { title: 'Uploading Project', location: vscode.ProgressLocation.Notification, cancellable: false }, 
            (progress, token) => {
                return new Promise(async (resolve, reject) => {
                    try{
                        let shortId = await this._projectUploader.uploadProject(this._project.projectFile.repositoryUrl, this._project.projectFile.rawRepositoryUrl);                      
                        vscode.window.showInformationMessage(shortId);
                        resolve();
                    }
                    catch(ex) {
                        vscode.window.showErrorMessage(`Could not upload project! (Stack: ${ex})`);
                        reject(ex);
                    }
                });
        });
    }
}