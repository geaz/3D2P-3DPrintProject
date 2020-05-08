import * as vscode from 'vscode';

import { CommandEngine } from './commandEngine/CommandEngine';
import { AddStlCommand } from './commands/AddStlCommand';
import { SetStlInfoCommand } from './commands/SetStlInfoCommand';
import { InitProjectCommand } from './commands/InitProjectCommand';
import { PackProjectCommand } from './commands/PackProjectCommand';
import { SetProjectDataCommand } from './commands/SetProjectDataCommand';
import { Open3MFCommand } from './commands/Open3MFCommand';
import { OpenSTLCommand } from './commands/OpenSTLCommand';
import { StlInfo } from '3d2p.react.app';

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
        async(fsPath: string) => { return commandEngine.start(new AddStlCommand(fsPath)); });

    let setStlDataCommand = vscode.commands.registerCommand(
        '3d2p.cmd.setStlInfo', 
        async(stlInfo: StlInfo) => { return commandEngine.start(new SetStlInfoCommand(stlInfo)); });
    
    let packProjectCommand = vscode.commands.registerCommand(
        '3d2p.cmd.packProject', 
        async() => { return commandEngine.start(new PackProjectCommand()); });

    let open3mfCommand = vscode.commands.registerCommand(
        '3d2p.cmd.open3mf',
        async(uri: vscode.Uri) => { return commandEngine.start(new Open3MFCommand(uri.fsPath)); });

    let openStlCommand = vscode.commands.registerCommand(
        '3d2p.cmd.openStl',
        async(uri: vscode.Uri) => { return commandEngine.start(new OpenSTLCommand(uri)); });

    context.subscriptions.push(initProjectCommand);
    context.subscriptions.push(setProjectDataCommand);
    context.subscriptions.push(addStlCommand);
    context.subscriptions.push(setStlDataCommand);
    context.subscriptions.push(packProjectCommand);
    context.subscriptions.push(open3mfCommand);
    context.subscriptions.push(openStlCommand);
}