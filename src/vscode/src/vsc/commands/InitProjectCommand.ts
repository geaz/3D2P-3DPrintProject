import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

import { PickQuestion } from "../commandEngine/PickQuestion";
import { vscodeProgress } from "../commandEngine/BaseCommand";
import { CommandResult } from "../commandEngine/CommandResult";
import { InputQuestion } from "../commandEngine/InputQuestion";
import { FilePickQuestion } from "../commandEngine/FilePickQuestion";
import { BaseCliCommand } from "./BaseCliCommand";

/**
 * This questionnaire will ask the user for the initial setup values of a project
 * and creates a 3D2P.json files, based on these values.
 */
export class InitProjectCommand extends BaseCliCommand {
    public overwrite = new PickQuestion(
        "Project file already exists. Overwrite?",
        ["No", "Yes"],
        true,
        (() => this._askOverwrite).bind(this)
    );
    public projectName = new InputQuestion("Enter project name", undefined, true, this.shouldCreateProject.bind(this));
    public status = new PickQuestion("Pick current project status", ["Done", "WIP"], true, this.shouldCreateProject.bind(this));
    public thumbnailFilePath = new FilePickQuestion(
        "Select thumbnail",
        { Image: ["png", "jpg", "jpeg"] },
        false,
        this.shouldCreateProject.bind(this)
    );
    public readmeFilePath = new FilePickQuestion(
        "Select Readme (Markdown)",
        { Markdown: ["md", "txt"] },
        false,
        this.shouldCreateProject.bind(this)
    );

    private _askOverwrite: boolean = false;

    public async vscCommand(progress: vscodeProgress): Promise<CommandResult> {
        let result = new CommandResult();
        if (this.shouldCreateProject()) {
            progress.report({ message: "Creating project file ..." });
            result.isFaulted = !(await this._cli.createProject(this._rootFolder!, true));
            result.message = result.isFaulted ? `Couldn't create project file! Please see 3D2P output for details.` : "";

            progress.report({ message: "Setting project values ..." });
            if (!result.isFaulted) {
                result.isFaulted = !(await this._cli.setProjectData(
                    this._projectFilePath!,
                    this.projectName.answer,
                    this.status.answer,
                    this.thumbnailFilePath.answer,
                    this.readmeFilePath.answer
                ));
                result.message = result.isFaulted
                    ? `Couldn't set project data! Please see 3D2P output for details.`
                    : "Project file created.";
            }
        } else {
            result.message = `Skipped project creation. (overwrite: false)`;
        }
        return result;
    }

    // override because of slightly different logic
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
            this._askOverwrite = fs.existsSync(this._projectFilePath);
        }
        return result;
    }

    private shouldCreateProject(): boolean {
        return this.overwrite.answer === undefined || this.overwrite.answer === "Yes";
    }

    public get Name(): string {
        return "Initialize Project";
    }
}
