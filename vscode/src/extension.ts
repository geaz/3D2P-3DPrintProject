import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { FileWatcher } from './vsc/FileWatcher';
import { PROJECTFILE_NAME, Project } from './3d2p/Project';
import { PromptEngine } from './vsc/promptEngine/PromptEngine';
import { StlWebView } from './vsc/extensions/webViews/StlWebView';
import { StlTreeDataProvider } from './vsc/extensions/treeViews/StlTreeDataProvider';
import { InitProjectQuestionnaire } from './vsc/questionnaires/InitProjectQuestionnaire';
import { UploadProjectQuestionnaire } from './vsc/questionnaires/UploadProjectQuestionnaire';
import { DeleteProjectQuestionnaire } from './vsc/questionnaires/DeleteProjectQuestionnaire';
import { SetCoverImageQuestionnaire } from './vsc/questionnaires/SetCoverImageQuestionnaire';

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
	Only exception: InitProjectQuestionnaire - Because it is the only command which works before! a project is loaded.
*/
export function activate(context: vscode.ExtensionContext) {
	let fileWatcher = new FileWatcher();	
	let project = initProject(fileWatcher);

	new StlTreeDataProvider(project, fileWatcher);

	activationCheck(project, fileWatcher);
	add3D2PCommands(project, context);	
}

function initProject(fileWatcher: FileWatcher): Project {
	let project = new Project();
	fileWatcher.StlFileWatcher.onDidCreate(() => { project.stls.updateListFromDisk(project.projectPath); project.Save(); });
	fileWatcher.StlFileWatcher.onDidDelete(() => { project.stls.updateListFromDisk(project.projectPath); project.Save(); });
	fileWatcher.ImageFileWatcher.onDidCreate(() => project.images.updateListFromDisk(project.projectPath));
	fileWatcher.ImageFileWatcher.onDidDelete(() => project.images.updateListFromDisk(project.projectPath));
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

function add3D2PCommands(
	project: Project, 
	context: vscode.ExtensionContext) {
		let promptEngine = new PromptEngine();
		
		let initProjectCommand = vscode.commands.registerCommand(
			'3d2p.cmd.initProject', 
			async() => { return promptEngine.start(new InitProjectQuestionnaire()); });

		let uploadProjectCommand = vscode.commands.registerCommand(
			'3d2p.cmd.uploadProject', 			
			async() => { return promptEngine.start(new UploadProjectQuestionnaire(project)); });

		let deleteProjectCommand = vscode.commands.registerCommand(
			'3d2p.cmd.deleteProject', 			
			async() => { return promptEngine.start(new DeleteProjectQuestionnaire()); });

		let setCoverImageCommand = vscode.commands.registerCommand(
			'3d2p.cmd.setCoverImage', 			
			async() => { return promptEngine.start(new SetCoverImageQuestionnaire(project)); });

		let openStlWebviewCommand = vscode.commands.registerCommand(
			'3d2p.cmd.openStlWebview', 
			async(uri: vscode.Uri) => {
				let stlInfo = project.stls.getItemByRelativePath(path.relative(project.projectPath, uri.fsPath));
				return new StlWebView(project, stlInfo); 
			});

		context.subscriptions.push(initProjectCommand);
		context.subscriptions.push(uploadProjectCommand);
		context.subscriptions.push(deleteProjectCommand);
		context.subscriptions.push(setCoverImageCommand);
		context.subscriptions.push(openStlWebviewCommand);
}
