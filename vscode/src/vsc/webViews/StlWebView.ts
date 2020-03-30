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
            { enableScripts: true, retainContextWhenHidden: true }
        );

        const webViewApp = this._panel.webview.asWebviewUri(
            vscode.Uri.file(path.join(__filename, '..', '..', '..', 'apps', 'StlWebViewApp.js')));
        const stlFilePathViewUri = this._panel.webview.asWebviewUri(vscode.Uri.file(stlInfo.getAbsolutePath()));

        this._panel.webview.html = `<!DOCTYPE html>
            <html lang="en" style="height:100%">
            <head>
                <title>STL Viewer</title>
            </head>
            
            <body style="padding:0;margin:0;height:100%;display:flex;">
                <div id="stl-viewer-app" style="flex-grow: 1;display: flex;"></div>
                <script src="${webViewApp}"></script>
            </body>
            </html>`;

        this._panel.webview.postMessage({ command: 'filechange', data: stlFilePathViewUri.toString() });
        this._panel.webview.postMessage({ 
            command: 'setStlInfo', 
            data: { color: stlInfo.color, status: stlInfo.status, annotationList: stlInfo.annotationList } });

        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'updateStlColor':
                    stlInfo.color = message.color;
                    project.Save();
                    break;
                case 'updateStlStatus':
                    stlInfo.status = message.status;
                    project.Save();
                    break;
                case 'updateStlAnnotationList':
                    stlInfo.annotationList = message.annotationList;
                    project.Save();
                    break;
            }
        });
    }
}