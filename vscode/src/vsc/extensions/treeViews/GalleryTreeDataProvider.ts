import * as vscode from 'vscode';

import { Project } from '../../../3d2p/Project';
import { FileWatcher } from '../../FileWatcher';
import { GalleryTreeItem } from './treeItems/GalleryTreeItem';

export class GalleryTreeDataProvider implements vscode.TreeDataProvider<GalleryTreeItem> {
    private _didChangeTreeDataEvent: vscode.EventEmitter<GalleryTreeItem | undefined> = new vscode.EventEmitter<GalleryTreeItem | undefined>();    
    public readonly onDidChangeTreeData: vscode.Event<GalleryTreeItem | undefined> = this._didChangeTreeDataEvent.event;

    constructor( private _project: Project, private _fileWatcher: FileWatcher) {
        this.initEvents();        
	    vscode.window.registerTreeDataProvider("3d2p.view.gallery", this);
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

    public addGalleryItem(relativePath: string): void {
        try{
            let galleryInfo = this._project.images.getItemByRelativePath(relativePath);
            this._project.gallery.push(galleryInfo);
            this._project.Save();    
        }
        catch(ex) {
            vscode.window.showErrorMessage(`Could not add image! (Stack: ${ex})`);
        }
    }

    public removeGalleryItem(relativePath: string): void {
        try{
            let galleryInfo = this._project.gallery.filter(g => g.relativePath === relativePath)[0];
            this._project.gallery.forEach((item, index) => {
                if(item.relativePath === galleryInfo.relativePath) {
                    this._project.gallery.splice(index, 1);
                    return;
                }
            });
            this._project.Save();    
        }
        catch(ex) {
            vscode.window.showErrorMessage(`Could not remove image! (Stack: ${ex})`);
        }
    }

    private initEvents(): void {
        this._fileWatcher.ProjectFileWatcher.onDidChange(() => this._didChangeTreeDataEvent.fire());
        this._fileWatcher.StlFileWatcher.onDidCreate(() => this._didChangeTreeDataEvent.fire());
        this._fileWatcher.StlFileWatcher.onDidDelete(() => this._didChangeTreeDataEvent.fire());
        this._fileWatcher.StlFileWatcher.onDidChange(() => this._didChangeTreeDataEvent.fire());
    }
}