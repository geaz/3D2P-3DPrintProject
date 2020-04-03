import * as vscode from 'vscode';

import { Project } from '../../../3d2p/Project';
import { FileWatcher } from '../../FileWatcher';
import { StlTreeItem } from './treeItems/StlTreeItem';

export class StlTreeDataProvider implements vscode.TreeDataProvider<StlTreeItem> {
    private _didChangeTreeDataEvent: vscode.EventEmitter<StlTreeItem | undefined> = new vscode.EventEmitter<StlTreeItem | undefined>();
    public readonly onDidChangeTreeData: vscode.Event<StlTreeItem | undefined> = this._didChangeTreeDataEvent.event;

    constructor(private _project: Project, private _fileWatcher: FileWatcher) {
        this.initEvents();
	    vscode.window.registerTreeDataProvider("3d2p.view.stl", this);
    }    

    getTreeItem(element: StlTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: StlTreeItem): vscode.ProviderResult<any[]> {
        let stlFiles = this._project.stls;
        let treeItems = new Array<StlTreeItem>();
        stlFiles.items.forEach(stlFile => treeItems.push(new StlTreeItem(stlFile)));
        return Promise.resolve(treeItems);
    }

    private initEvents(): void {
        this._fileWatcher.ProjectFileWatcher.onDidChange(() => this._didChangeTreeDataEvent.fire());
    }
}