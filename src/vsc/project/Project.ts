import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { FileWatcher } from '../FileWatcher';
import { ProjectFile } from './model/ProjectFile';
import { FileList } from './fileList/FileList';
import { StlInfo } from './model/StlInfo';

export const PROJECTFILE_NAME = "3D2P.json";

export class Project {
    private _projectPath?: string;
    private _projectFile?: ProjectFile;

    constructor(private _fileWatcher: FileWatcher, ) {
        this._fileWatcher.ProjectFileWatcher.onDidCreate((projectFile: vscode.Uri) => this.Load(path.dirname(projectFile.fsPath)));
        this._fileWatcher.ProjectFileWatcher.onDidChange(() => this._projectFile!.Reload());
        this._fileWatcher.ProjectFileWatcher.onDidDelete(() => this.Close());
    }

    public Load(projectPath: string): void {
        if(!fs.existsSync(path.join(projectPath, PROJECTFILE_NAME))) {
            throw "No project file found in the given path!";
        }

        this._projectPath = projectPath;
        this._projectFile = new ProjectFile(projectPath, path.join(projectPath, PROJECTFILE_NAME));
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