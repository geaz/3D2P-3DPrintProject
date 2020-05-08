import * as vscode from "vscode";

let _channel: vscode.OutputChannel;

export function createOutputChannel(): void {
    if (_channel === undefined) {
        _channel = vscode.window.createOutputChannel("3D2P");
    }
}

export function getOutputChannel(): vscode.OutputChannel {
    return _channel;
}
