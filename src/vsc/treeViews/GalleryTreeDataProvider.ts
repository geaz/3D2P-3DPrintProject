import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class GalleryTreeDataProvider implements vscode.TreeDataProvider<GalleryTreeItem> {
    public static TREEVIEW_ID: string = "3d2p.view.gallery";
    public onDidChangeTreeData?: vscode.Event<any> | undefined;

    getTreeItem(element: any): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: any): vscode.ProviderResult<any[]> {
        return Promise.resolve([ new GalleryTreeItem("testlabel", "test", vscode.TreeItemCollapsibleState.None) ]);
    }
}

class GalleryTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string, 
        private version: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState) {
      super(label, collapsibleState);
    }
  
    get tooltip(): string {
        return "test99";
    }
  
    get description(): string {
        console.log(path.join(__filename, '..', '..', '..', '..', 'resources', 'images', 'icons', 'light', 'eye-32.png'));
        return "Test";
    }
  
    iconPath = {
        light: path.join(__filename, '..', '..', '..', '..', 'resources', 'images', 'icons', 'light', 'hide.png'),
        dark: path.join(__filename, '..', '..', '..', '..', 'resources', 'images', 'icons', 'dark', 'hide.png'),
    };
}