import * as vscode from "vscode";

import { vscodeProgress } from "../commandEngine/BaseCommand";
import { CommandResult } from "../commandEngine/CommandResult";
import { BaseCliCommand } from "./BaseCliCommand";
import { StlWebView } from "../StlWebView";

export class OpenSTLCommand extends BaseCliCommand {
    constructor(private _uri: vscode.Uri) {
        super();
    }

    public async vscCommand(progress: vscodeProgress): Promise<CommandResult> {
        let result = new CommandResult();
        new StlWebView(this._uri, this._projectFilePath!);
        return result;
    }

    public get Name(): string {
        return "Open STL";
    }
}
