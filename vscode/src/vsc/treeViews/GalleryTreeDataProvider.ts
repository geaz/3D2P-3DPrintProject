import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { Project } from '../project/Project';
import { FileWatcher } from '../FileWatcher';
import { GalleryInfo } from '../project/model/GalleryInfo';

export class GalleryTreeDataProvider implements vscode.TreeDataProvider<GalleryTreeItem> {
    private _didChangeTreeDataEvent: vscode.EventEmitter<GalleryTreeItem | undefined> = new vscode.EventEmitter<GalleryTreeItem | undefined>();
    
    public static TREEVIEW_ID: string = "3d2p.view.gallery";
    public readonly onDidChangeTreeData: vscode.Event<GalleryTreeItem | undefined> = this._didChangeTreeDataEvent.event;

    constructor(private _project: Project, private _fileWatcher: FileWatcher) {
        this.initEvents();
    }    

    public getTreeItem(element: GalleryTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    public getChildren(element?: GalleryTreeItem): vscode.ProviderResult<any[]> {
        let galleryList = this._project.gallery;
        let treeItems = new Array<GalleryTreeItem>();
        galleryList.forEach(galleryFile => treeItems.push(new GalleryTreeItem(galleryFile)));
        return Promise.resolve(treeItems);
    }

    private initEvents(): void {
        this._fileWatcher.ProjectFileWatcher.onDidChange(() => this._didChangeTreeDataEvent.fire());
        this._fileWatcher.StlFileWatcher.onDidCreate(() => this._didChangeTreeDataEvent.fire());
        this._fileWatcher.StlFileWatcher.onDidDelete(() => this._didChangeTreeDataEvent.fire());
        this._fileWatcher.StlFileWatcher.onDidChange(() => this._didChangeTreeDataEvent.fire());
    }
}

class GalleryTreeItem extends vscode.TreeItem {
    private readonly _toolTip: string;
    private readonly _description: string;

    public readonly command?: vscode.Command;

    constructor(galleryInfo: GalleryInfo) {
        super(galleryInfo.name, vscode.TreeItemCollapsibleState.None);

        let absoluteFilePath = galleryInfo.getAbsolutePath();
        let fileSizeInBytes = fs.statSync(absoluteFilePath).size;
        let fileSizeInMegabytes = fileSizeInBytes / 1000000.0;

        this._toolTip = absoluteFilePath;
        this._description = `${fileSizeInMegabytes.toFixed(2)} MB`;
        this.command = {
            command: 'vscode.open',
            title: 'Open Image',
            arguments: [vscode.Uri.file(absoluteFilePath)]
        };

        if(galleryInfo.relativePath.endsWith('.png')) {
            this.iconPath = {
                light: path.join(__filename, '..', '..', '..', '..', 'resources', 'images', 'icons', 'light', 'png.png'),
                dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'images', 'icons', 'dark', 'png.png'),
            };
        }
        else {
            this.iconPath = {
                light: path.join(__filename, '..', '..', '..', '..', 'resources', 'images', 'icons', 'light', 'jpg.png'),
                dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'images', 'icons', 'dark', 'jpg.png'),
            };
        }
    }
  
    get tooltip(): string {
        return this._toolTip;
    }
  
    get description(): string {
        return this._description;
    }
}