import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { InputQuestion } from '../promptEngine/InputQuestion';
import { GitExtension } from '../../git';
import { BaseQuestionnaire } from '../promptEngine/BaseQuestionnaire';
import { PromptResult } from '../promptEngine/PromptResult';

/**
 * This questionnaire will ask the user for the initial setup values of a project
 * and creates a 3D2P.json files, based on these values.
 */
export class InitProjectQuestionnaire extends BaseQuestionnaire {

    public projectName = new InputQuestion('Enter a name for the new project. This will also be the folder name.');

    private _rootFolder: string = '';
    private _projectFilePath: string = '';

    public async vscCommand(): Promise<PromptResult> {
        return this.createProjectFile();
    }

    public async checkPrerequisite(): Promise<PromptResult> {
        let result = new PromptResult();
        if (vscode.workspace.workspaceFolders === undefined) {
            result.isFaulted = true;
            result.message = 'Please open an existing folder to initialize a 3D2P project.';
        }
        else {
            this._rootFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
            this._projectFilePath = path.join(this._rootFolder, "3D2P.json");

            if (fs.existsSync(this._projectFilePath)) {
                result.isFaulted = true;
                result.message = '3D2P project file already exists! Delete it and try again, if you want to recreate it.';
            }
        }
        return result;
    }

    private createProjectFile(): PromptResult {
        let gitExtension = vscode.extensions.getExtension<GitExtension>('vscode.git')?.exports;
        if (gitExtension === undefined) {        
            return new PromptResult('Git Extension was not found in VS Code!', true);
        } 

        let git = gitExtension.getAPI(1);
        let repo = git.getRepository(vscode.Uri.file(path.dirname(this._projectFilePath)));
        if (repo === null) {         
            return new PromptResult('No repository found in current workspace!', true);
        } 

        let repoUrl = repo!.state.remotes[0].fetchUrl;
        if (repoUrl === undefined) {         
            return new PromptResult('Repository remote URL is not set!', true);
        } 

        fs.writeFileSync(this._projectFilePath, `{ 
            "name": "${this.projectName.answer}",
            "repositoryUrl": "${repoUrl}",
            "status": "WIP",
            "stls": [],
            "gallery": []
        }`, 'utf8');
        return new PromptResult();
    }

    public get Name(): string {
        return "Initialize Project";
    }
}