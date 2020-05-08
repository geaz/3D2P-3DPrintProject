import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

import { BaseCommand } from "../commandEngine/BaseCommand";
import { CommandResult } from "../commandEngine/CommandResult";
import { PrintProjectCli } from "../../PrintProjectCli";

export abstract class BaseCliCommand extends BaseCommand {
    protected _cli: PrintProjectCli = new PrintProjectCli();
    protected _rootFolder?: string;
    protected _projectFilePath?: string;

    public async checkPrerequisite(): Promise<CommandResult> {
        let result = new CommandResult();
        if (!(await this._cli.cliExists())) {
            result.isFaulted = true;
            result.message = "Please download and install the 3D2P cli to use the VS Code commands!";
        } else if (vscode.workspace.workspaceFolders === undefined) {
            result.isFaulted = true;
            result.message = "Please open an existing folder to initialize a 3D2P project.";
        } else {
            this._rootFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
            this._projectFilePath = path.join(this._rootFolder, "3D2P.json");
            if (!fs.existsSync(this._projectFilePath)) {
                result.isFaulted = true;
                result.message = "Please create a 3D2P project file first!";
            }
        }
        return result;
    }
}
