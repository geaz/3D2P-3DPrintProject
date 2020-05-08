import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";

import { StlInfo, ProjectFile, StlAnnotation } from "3d2p.react.app";

export class StlWebView {
    private _stlInfo?: StlInfo;
    private _stlUpdateHandle: number = -1;
    private readonly _panel: vscode.WebviewPanel;

    constructor(private _stlUri: vscode.Uri, private _projectFilepath: string) {
        this._panel = vscode.window.createWebviewPanel("3d2pStlWebView", `3D2P - ${path.basename(_stlUri.fsPath)}`, vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
        });

        const webViewApp = this._panel.webview.asWebviewUri(vscode.Uri.file(path.join(__filename, "..", "..", "StlViewer.js")));
        const stlWebviewUri = this._panel.webview.asWebviewUri(_stlUri);

        this._panel.webview.html = `<!DOCTYPE html>
            <html lang="en" style="height:100%">
            <head>
                <title>STL Viewer</title>
            </head>            
            <body style="padding:0;margin:0;height:100%;display:flex;align-items:stretch;">
                <div id="stl-viewer-app" style="flex:1;display:flex;align-items:stretch;"></div>
                <script src="${webViewApp}"></script>
            </body>
            </html>`;

        this.setStlInfo();
        this._panel.webview.postMessage({
            command: "loadStl",
            data: stlWebviewUri.toString(),
        });

        this._panel.webview.onDidReceiveMessage(async (message) => {
            switch (message.command) {
                case "addSTL":
                    await vscode.commands.executeCommand("3d2p.cmd.addStl", _stlUri.fsPath);
                    this.setStlInfo();
                    break;
                case "updateStlInfo":
                    if (this._stlUpdateHandle !== -1) clearTimeout(this._stlUpdateHandle);
                    this._stlUpdateHandle = setTimeout(async () => {
                        await vscode.commands.executeCommand("3d2p.cmd.setStlInfo", message.data as StlInfo);
                    }, 100);
                    break;
                case "updateStlAnnotations":
                    await vscode.commands.executeCommand("3d2p.cmd.setStlAnnotations", 
                        this._stlInfo!.name,
                        message.data as Array<StlAnnotation>);
                    break;
            }
        });
    }

    private setStlInfo(): void {
        let projectFile = <ProjectFile>JSON.parse(fs.readFileSync(this._projectFilepath, "utf8"));
        this._stlInfo = projectFile.stlInfoList.filter((s) => s.name === path.basename(this._stlUri.fsPath))[0];
        this._panel.webview.postMessage({
            command: "setStlInfo",
            data: this._stlInfo,
        });
    }
}
