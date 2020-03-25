import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class StlTreeDataProvider implements vscode.TreeDataProvider<StlTreeItem> {

    private _workspaceRootPath: string = "";
    private _projectFileWatcher: vscode.FileSystemWatcher | undefined = undefined;
    private _stlFileWatcher: vscode.FileSystemWatcher | undefined = undefined;
    private _didChangeTreeDataEvent: vscode.EventEmitter<StlTreeItem | undefined> = new vscode.EventEmitter<StlTreeItem | undefined>();
    
    public static TREEVIEW_ID: string = "3d2p.view.stl";
    public readonly onDidChangeTreeData: vscode.Event<StlTreeItem | undefined> = this._didChangeTreeDataEvent.event;

    constructor() {
        if(vscode.workspace.workspaceFolders !== undefined){
            this._workspaceRootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
            this.initEvents();
        }
    }    

    getTreeItem(element: StlTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: StlTreeItem): vscode.ProviderResult<any[]> {
        let stlFiles = this.getStlFiles(this._workspaceRootPath);

        let treeItems = new Array<StlTreeItem>();
        stlFiles.forEach(stlFile => treeItems.push(new StlTreeItem(stlFile)));

        return Promise.resolve(treeItems);
    }

    private initEvents(): void {
        this._projectFileWatcher?.dispose();
        this._projectFileWatcher = vscode.workspace.createFileSystemWatcher(path.join(this._workspaceRootPath, '3D2P.json'));
        this._projectFileWatcher.onDidChange(() => this._didChangeTreeDataEvent.fire());

        this._stlFileWatcher?.dispose();
        this._stlFileWatcher = vscode.workspace.createFileSystemWatcher("**/*.{stl,stl2}");
        this._stlFileWatcher.onDidChange(() => this._didChangeTreeDataEvent.fire());
        this._stlFileWatcher.onDidCreate(() => this._didChangeTreeDataEvent.fire());
        this._stlFileWatcher.onDidDelete(() => this._didChangeTreeDataEvent.fire());
    }

    private getStlFiles(directoryPath: string): Array<string> {
        let stlFiles = new Array<string>();        
        
        // Get all STL Files
        stlFiles = stlFiles.concat(fs
                .readdirSync(directoryPath, { withFileTypes: true })
                .filter(f => f.isFile() && f.name.endsWith(".stl"))
                .map(f => path.resolve(directoryPath, f.name)));

        // And add all STL Files from subdirectories
        stlFiles = stlFiles.concat(fs
            .readdirSync(directoryPath, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .flatMap(d => this.getStlFiles(path.resolve(directoryPath, d.name))));

        return stlFiles;
    }
}

class StlTreeItem extends vscode.TreeItem {
    private readonly _toolTip: string;
    private readonly _description: string;

    public readonly command?: vscode.Command;

    constructor(filePath: string) {
        super(path.basename(filePath, path.extname(filePath)), vscode.TreeItemCollapsibleState.None);

        let fileSizeInBytes = fs.statSync(filePath).size;
        let fileSizeInMegabytes = fileSizeInBytes / 1000000.0;

        this._toolTip = filePath;
        this._description = `${fileSizeInMegabytes.toFixed(2)} MB`;
        this.command = {
            command: '3d2p.openStlWebview',
            title: 'Open STL',
            arguments: [filePath]
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