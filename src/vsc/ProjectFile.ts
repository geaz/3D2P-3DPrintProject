import * as vscode from 'vscode';
import * as path from 'path';

export const PROJECTFILE_NAME = "3D2P.json";

export class ProjectFile {
    private static _projectFile?: IProjectFile = undefined;
    public static Load(): IProjectFile {
        if(this._projectFile === undefined && vscode.workspace.workspaceFolders !== undefined) {
            this._projectFile = <IProjectFile>require(path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, '3D2P.json'));
        }
        return <IProjectFile>this._projectFile;
    } 
}

export interface IProjectFile {
    name: string;
    provider: string;
    rawBasePath: string;
    stls: Array<IStlInfo>;
    gallery: Array<string>;
}

export interface IStlInfo {
    name: string;
    status: StlStatus;
    notes: string;
}

export enum StlStatus {
    WIP,
    Printed,
}