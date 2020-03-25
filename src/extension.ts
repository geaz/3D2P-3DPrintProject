import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { PROJECTFILE_NAME } from './vsc/ProjectFile';
import { FileWatcher } from './vsc/FileWatcher';
import { GalleryTreeDataProvider } from './vsc/treeViews/GalleryTreeDataProvider';
import { StlTreeDataProvider } from './vsc/treeViews/StlTreeDataProvider';
import { PromptEngine } from './vsc/prompts/promptEngine/promptEngine';
import { InitProjectQuestionnaire } from './vsc/prompts/InitProjectQuestionnaire';
import { StlWebView } from './vsc/webViews/StlWebView';

/*
	The extension gets only activated, if
		1. 3D2P project file exists in the opened workspace (source: package.json)
		2. the init command gets executed (source: package.json)
	
	If, VS Code activates the extension, because of the above two points, the activate
	method checks, if the extension should get activated completely (activate the view container).
	
	The extension gets completely activated, if
		1. the workspace already contains a 3D2P project file
		2. the filewatch gets triggered by the creation of a 3D2P project file
	
	The extension gets deactivated, if the filewatcher gets triggered by the deletion of a 3D2P project file.
*/
export function activate(context: vscode.ExtensionContext) {
	activationCheck();
	add3D2PTreeViews();
	add3D2PCommands(context);	
}

function activationCheck() {
	if(vscode.workspace.workspaceFolders !== undefined) {
		let workspaceRootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
		if(!fs.existsSync(path.join(workspaceRootPath, PROJECTFILE_NAME))) {
			let fileWatcher = new FileWatcher();
			fileWatcher.ProjectFileWatcher.onDidCreate(() => vscode.commands.executeCommand('setContext', '3d2p.context.activated', true));
			fileWatcher.ProjectFileWatcher.onDidDelete(() => vscode.commands.executeCommand('setContext', '3d2p.context.activated', false));
		}
		else {
			vscode.commands.executeCommand('setContext', '3d2p.context.activated', true);
		}		
	}
}

function add3D2PTreeViews() {
	vscode.window.registerTreeDataProvider(StlTreeDataProvider.TREEVIEW_ID, new StlTreeDataProvider());
	vscode.window.registerTreeDataProvider(GalleryTreeDataProvider.TREEVIEW_ID, new GalleryTreeDataProvider());
}

function add3D2PCommands(context: vscode.ExtensionContext) {
	let promptEngine = new PromptEngine();
    
    let initProjectCommand = vscode.commands.registerCommand(
        '3d2p.initProject', 
        async() => { return promptEngine.start(new InitProjectQuestionnaire()); });

    let openStlWebviewCommand = vscode.commands.registerCommand(
        '3d2p.openStlWebview', 
        async(filePath: string) => { return new StlWebView(filePath); });

    context.subscriptions.push(initProjectCommand);
    context.subscriptions.push(openStlWebviewCommand);
}
