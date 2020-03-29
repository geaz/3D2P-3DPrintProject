import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { ProjectFile } from './model/ProjectFile';
import { FileList } from './fileList/FileList';
import { StlInfo } from './model/StlInfo';

export const PROJECTFILE_NAME = "3D2P.json";

export class Project {
    private _projectPath?: string;
    private _projectFile?: ProjectFile;
    
    public Load(projectPath: string): void {
        if(!fs.existsSync(path.join(projectPath, PROJECTFILE_NAME))) {
            throw "No project file found in the given path!";
        }

        this._projectPath = projectPath;
        this._projectFile = new ProjectFile(projectPath, path.join(projectPath, PROJECTFILE_NAME));

        // To save updates of the file list
		this.Save();
    }

    public Save(): void {
        if(this._projectFile === undefined) throw "No project loaded!";
        this._projectFile.Save();
    }

    public Close(): void {
        this._projectPath = undefined;
        this._projectFile = undefined;
    }

    public get projectPath(): string {
        if(this._projectPath === undefined) throw "No project loaded!";
        return this._projectPath;
    }

    public get stls(): FileList<StlInfo> {
        if(this._projectFile === undefined) throw "No project loaded!";
        return this._projectFile.stls;
    }
}