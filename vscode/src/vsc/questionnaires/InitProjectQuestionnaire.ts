import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { InputQuestion } from '../promptEngine/InputQuestion';
import { BaseQuestionnaire } from '../promptEngine/BaseQuestionnaire';
import { PickQuestion } from '../promptEngine/PickQuestion';
import { GitExtension } from '../../git';

export class InitProjectQuestionnaire extends BaseQuestionnaire {
    
    public projectName = new InputQuestion('Enter a name for the new project. This will also be the folder name.');
    public provider = new PickQuestion('Pick your git provider.', ['Github', 'Bitbucket', 'Custom']);
    public rawBasePath = new InputQuestion('Please enter the base path to access the raw files.', 'Example', this.provider, (provider) => provider === 'Custom');

    private _rootFolder: string = "";
    private _projectFilePath: string = "";

    public async checkPrerequisite(): Promise<boolean> { 
        return new Promise((resolve, reject) => {
            let valid = true;
            if(vscode.workspace.workspaceFolders === undefined) {
                vscode.window.showErrorMessage('Please open an existing folder to initialize a 3D2P project.');
                valid = false;
            }
            else {
                this._rootFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
                this._projectFilePath = path.join(this._rootFolder, "3D2P.json");
            }           

            if(valid && fs.existsSync(this._projectFilePath)) {
                vscode.window.showErrorMessage(`3D2P project file already exists! Delete it and try again, if you want to recreate it.`);
                valid = false;
            }            
            resolve(valid);
        });
    }

    public async vscCommand(): Promise<void> {
        vscode.window.withProgress(
            { title: 'Initializing Print Project', location: vscode.ProgressLocation.Notification, cancellable: false }, 
            (progress, token) => {
                return new Promise(async (resolve, reject) => {
                    try{
                        let gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git')?.exports;
                        if(gitExtension === undefined) {
                            throw `Git Extension was not found in VS Code!`;
                        }
                        else {
                            let git = gitExtension.getAPI(1);
                            let repo = git.getRepository(vscode.Uri.file(path.dirname(this._projectFilePath)));
                            let repoUrl = repo!.state.remotes[0].fetchUrl;
                            
                            let rawUrl = this.rawBasePath.answer;
                            switch(this.provider.answer)
                            {
                                case 'Github':
                                    rawUrl = repoUrl!.replace('.git', '/master/');
                                    rawUrl = rawUrl.replace('https://github.com', 'https://raw.githubusercontent.com');
                                    break;
                                case 'Bitbucket':
                                    rawUrl = repoUrl!.replace('.git', '/raw/master/');
                                    break;
                            }

                            if(rawUrl === undefined || rawUrl === '') {
                                throw `Raw repository url empty!`;
                            }

                            fs.writeFileSync(this._projectFilePath, `{ 
                                "name": "${this.projectName.answer}",
                                "repositoryUrl": "${repoUrl}",
                                "rawRepositoryUrl": "${rawUrl}",
                                "stls": [],
                                "gallery": []
                            }`, 'utf8');                     
                            resolve();
                        }
                    }
                    catch(ex) {
                        vscode.window.showErrorMessage(`Could not create project! (Stack: ${ex})`);
                        reject(ex);
                    }
                });
        });
    }
}