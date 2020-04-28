import * as vscode from 'vscode';

export class FileWatcher {
    constructor() {
        this.ProjectFileWatcher = vscode.workspace.createFileSystemWatcher('**/3D2P.json');
        this.StlFileWatcher = vscode.workspace.createFileSystemWatcher('**/*.stl');
        this.ImageFileWatcher = vscode.workspace.createFileSystemWatcher('**/*.{jpg,jpeg,png}');
    }

    public ProjectFileWatcher: vscode.FileSystemWatcher;
    public StlFileWatcher: vscode.FileSystemWatcher;
    public ImageFileWatcher: vscode.FileSystemWatcher;
}