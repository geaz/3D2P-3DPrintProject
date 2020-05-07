import * as vscode from 'vscode';

import { CommandEngine } from './commandEngine/CommandEngine';
import { AddStlCommand } from './commands/AddStlCommand';
import { InitProjectCommand } from './commands/InitProjectCommand';
import { PackProjectCommand } from './commands/PackProjectCommand';
import { SetProjectDataCommand } from './commands/SetProjectDataCommand';
import { Open3MFCommand } from './commands/Open3MFCommand';
import { StlWebView } from './StlWebView';

export function add3D2PCommands(
    context: vscode.ExtensionContext) 
{
    let commandEngine = new CommandEngine();
    
    let initProjectCommand = vscode.commands.registerCommand(
        '3d2p.cmd.initProject', 
        async() => { return commandEngine.start(new InitProjectCommand()); });

    let setProjectDataCommand = vscode.commands.registerCommand(
        '3d2p.cmd.setProjectData', 
        async() => { return commandEngine.start(new SetProjectDataCommand()); });
    
    let addStlCommand = vscode.commands.registerCommand(
        '3d2p.cmd.addStl', 
        async() => { return commandEngine.start(new AddStlCommand()); });
    
    let packProjectCommand = vscode.commands.registerCommand(
        '3d2p.cmd.packProject', 
        async() => { return commandEngine.start(new PackProjectCommand()); });

    let open3mfCommand = vscode.commands.registerCommand(
        '3d2p.cmd.open3mf',
        async(uri: vscode.Uri) => { return commandEngine.start(new Open3MFCommand(uri.fsPath)); });

    let openStlCommand = vscode.commands.registerCommand(
        '3d2p.cmd.openStl',
        async(uri: vscode.Uri) => { return new StlWebView(uri, undefined); });

  /*  let openStlWebviewCommand = vscode.commands.registerCommand(
        '3d2p.cmd.openStlWebview', async(uri: vscode.Uri) => {
            let workspaceRootPath = vscode.workspace.workspaceFolders![0].uri.fsPath
            let relativePath = path.relative(workspaceRootPath, uri.fsPath);

            let stlInfo = projectFile.stlInfoList.filter(s => s.name)
            .getItemByRelativePath();
            return new StlWebView(project, stlInfo); 
        });*/

    context.subscriptions.push(initProjectCommand);
    context.subscriptions.push(setProjectDataCommand);
    context.subscriptions.push(addStlCommand);
    context.subscriptions.push(packProjectCommand);
    context.subscriptions.push(open3mfCommand);
    context.subscriptions.push(openStlCommand);
}