import * as vscode from 'vscode';
import * as path from 'path';

import { StlInfo } from '3d2p.react.components';

export class StlWebView {
    private readonly _panel: vscode.WebviewPanel;
    
    constructor(stlUri: vscode.Uri, stlInfo: StlInfo | undefined) {
        this._panel = vscode.window.createWebviewPanel(
            '3d2pStlWebView',
            `3D2P - ${path.basename(stlUri.fsPath)}`,
            vscode.ViewColumn.One,
            { enableScripts: true, retainContextWhenHidden: true }
        );

        const webViewApp = this._panel.webview.asWebviewUri(
            vscode.Uri.file(path.join(__filename, '..', '..', 'StlViewerApp.js')));
        const stlWebviewUri = this._panel.webview.asWebviewUri(stlUri);

        this._panel.webview.html = `<!DOCTYPE html>
            <html lang="en" style="height:100%">
            <head>
                <title>STL Viewer</title>
            </head>            
            <body style="padding:0;margin:0;height:100%;display:flex;">
                <div id="stl-viewer-app"></div>
                <script src="${webViewApp}"></script>
            </body>
            </html>`;

        this._panel.webview.postMessage({ 
            command: 'loadStl', 
            data: {
                stlUrl: stlWebviewUri.toString(),
                stlInfo: stlInfo
            } 
        });

        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'updateStlColor':
                    stlInfo!.color = message.color;
                    break;
                case 'updateStlStatus':
                    stlInfo!.status = message.status;
                    break;
                case 'updateStlAnnotationList':
                    stlInfo!.annotationList = message.annotationList;
                    break;
            }
        });
    }
}