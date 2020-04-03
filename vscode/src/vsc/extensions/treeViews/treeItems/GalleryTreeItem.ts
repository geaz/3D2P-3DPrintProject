import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

import { GalleryInfo } from '../../../../3d2p/model/GalleryInfo';

export class GalleryTreeItem extends vscode.TreeItem {
    private readonly _relativePath: string;
    private readonly _toolTip: string;
    private readonly _description: string;

    public readonly command?: vscode.Command;

    constructor(public galleryInfo: GalleryInfo) {
        super(galleryInfo.name, vscode.TreeItemCollapsibleState.None);

        let absoluteFilePath = galleryInfo.getAbsolutePath();
        let fileSizeInBytes = fs.statSync(absoluteFilePath).size;
        let fileSizeInMegabytes = fileSizeInBytes / 1000000.0;

        this._relativePath = galleryInfo.relativePath;
        this._toolTip = absoluteFilePath;
        this._description = `${fileSizeInMegabytes.toFixed(2)} MB`;
        this.command = {
            command: 'vscode.open',
            title: 'Open Image',
            arguments: [vscode.Uri.file(absoluteFilePath)]
        };

        if(galleryInfo.relativePath.endsWith('.png')) {
            this.iconPath = {
                light: path.join(__filename, '..', '..', '..', '..', '..', '..', 'resources', 'images', 'icons', 'light', 'png.png'),
                dark: path.join(__filename, '..', '..', '..', '..', '..', '..', 'resources', 'images', 'icons', 'dark', 'png.png'),
            };
        }
        else {
            this.iconPath = {
                light: path.join(__filename, '..', '..', '..', '..', '..', '..', 'resources', 'images', 'icons', 'light', 'jpg.png'),
                dark: path.join(__filename, '..', '..', '..', '..', '..', '..', 'resources', 'images', 'icons', 'dark', 'jpg.png'),
            };
        }
    }

    get relativePath() : string {
        return this._relativePath;
    }
  
    get tooltip(): string {
        return this._toolTip;
    }
  
    get description(): string {
        return this._description;
    }
}