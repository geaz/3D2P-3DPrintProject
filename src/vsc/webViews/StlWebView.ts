import * as vscode from 'vscode';
import * as path from 'path';

export class StlWebView {
    private readonly _panel: vscode.WebviewPanel;
    
    constructor(stlFilePath: string) {
        this._panel = vscode.window.createWebviewPanel(
            '3d2pStlWebView',
            `3D2P - ${path.basename(stlFilePath)}`,
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        const webViewApp = this._panel.webview.asWebviewUri(
            vscode.Uri.file(path.join(__filename, '..', '..', '..', 'views', 'StlWebViewApp.js')));
        const webViewAppCss = this._panel.webview.asWebviewUri(
            vscode.Uri.file(path.join(__filename, '..', '..', '..', '..', 'resources', 'css', 'stlWebViewApp.css')));
        const stlFilePathViewUri = this._panel.webview.asWebviewUri(vscode.Uri.file(stlFilePath));

        this._panel.webview.html =  `<!DOCTYPE html>
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
    }
}