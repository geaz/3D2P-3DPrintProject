import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { Project } from '../project/Project';
import { FileWatcher } from '../FileWatcher';
import { IStlInfo } from '../project/ProjectFile';

export class StlTreeDataProvider implements vscode.TreeDataProvider<StlTreeItem> {

    private _didChangeTreeDataEvent: vscode.EventEmitter<StlTreeItem | undefined> = new vscode.EventEmitter<StlTreeItem | undefined>();
    
    public static TREEVIEW_ID: string = "3d2p.view.stl";
    public readonly onDidChangeTreeData: vscode.Event<StlTreeItem | undefined> = this._didChangeTreeDataEvent.event;

    constructor(private _project: Project, private _fileWatcher: FileWatcher) {
        this.initEvents();
    }    

    getTreeItem(element: StlTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: StlTreeItem): vscode.ProviderResult<any[]> {
        let stlFiles = this._project.stls;
        //this.updateProjectFile(stlFiles);

        let treeItems = new Array<StlTreeItem>();
        stlFiles.items.forEach(stlFile => treeItems.push(new StlTreeItem(this._project.projectPath, stlFile)));

        return Promise.resolve(treeItems);
    }

    private initEvents(): void {
        this._fileWatcher.ProjectFileWatcher.onDidChange(() => this._didChangeTreeDataEvent.fire());
        this._fileWatcher.StlFileWatcher.onDidCreate(() => this._didChangeTreeDataEvent.fire());
        this._fileWatcher.StlFileWatcher.onDidDelete(() => this._didChangeTreeDataEvent.fire());
        this._fileWatcher.StlFileWatcher.onDidChange(() => this._didChangeTreeDataEvent.fire());
    }

   /* private updateProjectFile(stlFiles: Array<string>): void {
        stlFiles.forEach(stlFile => {
            let stlInfo = this._projectFile.getStlInfo(stlFile);
            if(stlInfo === undefined) {
                this._projectFile.addStlInfo(stlFile);
            }
        });
        this._projectFile.Save();
    }*/
}

class StlTreeItem extends vscode.TreeItem {
    private readonly _toolTip: string;
    private readonly _description: string;

    public readonly command?: vscode.Command;

    constructor(projectPath: string, stlInfo: IStlInfo) {
        super(stlInfo.name, vscode.TreeItemCollapsibleState.None);
        console.dir(stlInfo);

        let absoluteFilePath = path.resolve(projectPath, stlInfo.relativePath)
        let fileSizeInBytes = fs.statSync(absoluteFilePath).size;
        let fileSizeInMegabytes = fileSizeInBytes / 1000000.0;

        this._toolTip = absoluteFilePath;
        this._description = `${fileSizeInMegabytes.toFixed(2)} MB`;
        this.command = {
            command: '3d2p.cmd.openStlWebview',
            title: 'Open STL',
            arguments: [absoluteFilePath]
        };
    }
  
    get tooltip(): string {
        return this._toolTip;
    }
  
    get description(): string {
        return this._description;
    }
  
    iconPath = {
        light: path.join(__filename, '..', '..', '..', '..', 'resources', 'images', 'icons', 'light', 'wip.png'),
        dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'images', 'icons', 'dark', 'wip.png'),
    };
}