import * as vscode from 'vscode';
import * as path from 'path';

import { StlStatus, StlInfo } from '../../../3d2p/StlInfo';

export class StlTreeItem extends vscode.TreeItem {
    private readonly _toolTip: string;
    private readonly _description: string;

    public readonly command?: vscode.Command;

    constructor(stlInfo: StlInfo) {
        super(stlInfo.name, vscode.TreeItemCollapsibleState.None);

        let absoluteFilePath = stlInfo.getAbsolutePath();
        
        this._toolTip = absoluteFilePath;
        this._description = stlInfo.annotationList.length > 0 ? `${stlInfo.annotationList.length} Annotations` : '';
        this.command = {
            command: '3d2p.cmd.openStlWebview',
            title: 'Open STL',
            arguments: [vscode.Uri.file(absoluteFilePath)]
        };
        if(stlInfo.status === StlStatus.WIP) {
            this.iconPath = {
                light: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'images', 'icons', 'light', 'wip.png'),
                dark: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'images', 'icons', 'dark', 'wip.png'),
            };
        }
        else {
            this.iconPath = {
                light: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'images', 'icons', 'light', 'done.png'),
                dark: path.join(__filename, '..', '..', '..', '..', '..', 'resources', 'images', 'icons', 'dark', 'done.png'),
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