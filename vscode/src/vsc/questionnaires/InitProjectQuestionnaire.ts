import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { InputQuestion } from '../promptEngine/InputQuestion';
import { PickQuestion } from '../promptEngine/PickQuestion';
import { GitExtension } from '../../git';
import { BaseQuestionnaire } from '../promptEngine/BaseQuestionnaire';
import { PromptResult } from '../promptEngine/PromptResult';

/**
 * This questionnaire will ask the user for the initial setup values of a project
 * and creates a 3D2P.json files, based on these values.
 */
export class InitProjectQuestionnaire extends BaseQuestionnaire {

    public projectName = new InputQuestion('Enter a name for the new project. This will also be the folder name.');
    public provider = new PickQuestion('Pick your git provider.', ['Github', 'Bitbucket', 'Custom']);
    public rawBasePath = new InputQuestion(
        'Please enter the base path to access the raw files.', '',
        this.provider, (provider) => provider === 'Custom');

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
        let repoUrl = repo!.state.remotes[0].fetchUrl;
        if (repoUrl === undefined) {         
            return new PromptResult('Repository remote URL is not set!', true);
        } 

        let rawUrl = this.getRawUrl(repoUrl);
        if (rawUrl === undefined || rawUrl === '') {
            return new PromptResult('Could not set raw repository URL!', true);
        }

        fs.writeFileSync(this._projectFilePath, `{ 
            "name": "${this.projectName.answer}",
            "repositoryUrl": "${repoUrl}",
            "rawRepositoryUrl": "${rawUrl}",
            "status": "WIP",
            "stls": [],
            "gallery": []
        }`, 'utf8');
        return new PromptResult();
    }

    private getRawUrl(repoUrl: string): string | undefined {
        let rawUrl = this.rawBasePath.answer;
        switch (this.provider.answer) {
            case 'Github':
                rawUrl = repoUrl.replace('.git', '/master/');
                rawUrl = rawUrl.replace('https://github.com', 'https://raw.githubusercontent.com');
                break;
            case 'Bitbucket':
                rawUrl = repoUrl!.replace('.git', '/raw/master/');
                break;
        }
        return rawUrl;
    }

    public get Name(): string {
        return "Initialize Project";
    }
}