import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { PROJECTFILE_NAME, Project } from './vsc/project/Project';
import { FileWatcher } from './vsc/FileWatcher';
import { GalleryTreeDataProvider } from './vsc/treeViews/GalleryTreeDataProvider';
import { StlTreeDataProvider } from './vsc/treeViews/StlTreeDataProvider';
import { PromptEngine } from './vsc/prompts/promptEngine/promptEngine';
import { InitProjectQuestionnaire } from './vsc/prompts/InitProjectQuestionnaire';
import { StlWebView } from './vsc/webViews/StlWebView';
import { AddGalleryImageQuestionnaire } from './vsc/prompts/AddGalleryImageQuestionnaire';

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

	Everything related to getting pathes from the workspace should be handled here. This way this resposibility
	is not shared across multiple components! For example NO access to vscode.workspace.workspaceFolders
	should be done outside of this file! Every component should be sure, that a 3D2P project is loaded, if it is accessed.
*/
export function activate(context: vscode.ExtensionContext) {
	let fileWatcher = new FileWatcher();
	let project = initProject(fileWatcher);

	activationCheck(project, fileWatcher);
	add3D2PTreeViews(project, fileWatcher);
	add3D2PCommands(project, context);	
}

function initProject(fileWatcher: FileWatcher): Project {
	let project = new Project();
	fileWatcher.ProjectFileWatcher.onDidCreate((projectFile: vscode.Uri) => project.Load(path.dirname(projectFile.fsPath)));
	fileWatcher.ProjectFileWatcher.onDidDelete(() => project.Close());
	
	return project;
}

function activationCheck(project: Project, fileWatcher: FileWatcher) {
	if(vscode.workspace.workspaceFolders !== undefined) {
		let workspaceRootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
		fileWatcher.ProjectFileWatcher.onDidCreate(() => vscode.commands.executeCommand('setContext', '3d2p.context.activated', true));
		fileWatcher.ProjectFileWatcher.onDidDelete(() => vscode.commands.executeCommand('setContext', '3d2p.context.activated', false));

		if(fs.existsSync(path.join(workspaceRootPath, PROJECTFILE_NAME))) {
			project.Load(workspaceRootPath);
			vscode.commands.executeCommand('setContext', '3d2p.context.activated', true);
		}		
	}
}

function add3D2PTreeViews(project: Project, fileWatcher: FileWatcher) {
	vscode.window.registerTreeDataProvider(StlTreeDataProvider.TREEVIEW_ID, new StlTreeDataProvider(project, fileWatcher));
	vscode.window.registerTreeDataProvider(GalleryTreeDataProvider.TREEVIEW_ID, new GalleryTreeDataProvider(project, fileWatcher));
}

function add3D2PCommands(project: Project, context: vscode.ExtensionContext) {
	let promptEngine = new PromptEngine();
    
    let initProjectCommand = vscode.commands.registerCommand(
        '3d2p.cmd.initProject', 
		async() => { return promptEngine.start(new InitProjectQuestionnaire()); });
		
	let addGalleryImageCommand = vscode.commands.registerCommand(
		'3d2p.cmd.addGalleryImage', 
		async() => { return promptEngine.start(new AddGalleryImageQuestionnaire(project)); });

    let openStlWebviewCommand = vscode.commands.registerCommand(
        '3d2p.cmd.openStlWebview', 
        async(filePath: string) => {
			let stlInfo = project.stls.getItemByRelativePath(path.relative(project.projectPath, filePath));
			return new StlWebView(project, stlInfo); 
		});

    context.subscriptions.push(initProjectCommand);
    context.subscriptions.push(openStlWebviewCommand);
}
