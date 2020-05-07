'use strict';

import * as vscode from 'vscode';

import { add3D2PCommands } from './vsc/CommandReg';
import { createOutputChannel } from './vsc/OutputChannel';

export function activate(context: vscode.ExtensionContext) {
    createOutputChannel();
    add3D2PCommands(context);
}