import * as vscode from 'vscode';
import * as path from 'path';

import { Project } from '../project/Project';
import { StlInfo } from '../project/model/StlInfo';

export class StlWebView {
    private readonly _panel: vscode.WebviewPanel;
    
    constructor(project: Project, stlInfo: StlInfo) {
        this._panel = vscode.window.createWebviewPanel(
            '3d2pStlWebView',
            `3D2P - ${stlInfo.name}`,
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        const webViewApp = this._panel.webview.asWebviewUri(
            vscode.Uri.file(path.join(__filename, '..', '..', '..', 'views', 'StlWebViewApp.js')));
        const webViewAppCss = this._panel.webview.asWebviewUri(
            vscode.Uri.file(path.join(__filename, '..', '..', '..', '..', 'resources', 'css', 'stlWebViewApp.css')));
        const stlFilePathViewUri = this._panel.webview.asWebviewUri(vscode.Uri.file(stlInfo.getAbsolutePath()));

        this._panel.webview.html = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <title>STL Viewer</title>
                <link rel="stylesheet" type="text/css" href="${webViewAppCss}">
            </head>
            
            <body>
                <div id="app"></div>
                <script src="${webViewApp}"></script>
            </body>
            </html>`;

        this._panel.webview.postMessage({ command: 'filechange', data: stlFilePathViewUri.toString() });
        this._panel.webview.postMessage({ command: 'setStlInfo', data: { color: stlInfo.color, status: stlInfo.status } });

        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'updateStlInfo':
                    stlInfo.color = message.data.color;
                    stlInfo.status = message.data.status;
                    project.Save();
                    break;
            }
        });
    }
}