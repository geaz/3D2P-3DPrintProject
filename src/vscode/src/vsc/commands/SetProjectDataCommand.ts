import { vscodeProgress } from "../commandEngine/BaseCommand";
import { CommandResult } from "../commandEngine/CommandResult";
import { InputQuestion } from "../commandEngine/InputQuestion";
import { FilePickQuestion } from "../commandEngine/FilePickQuestion";
import { PickQuestion } from "../commandEngine/PickQuestion";
import { BaseCliCommand } from "./BaseCliCommand";

export class SetProjectDataCommand extends BaseCliCommand {
    public projectName: InputQuestion = new InputQuestion("Enter project name (Skip, if don't want to change)", undefined, false);
    public status: PickQuestion = new PickQuestion("Pick current project status (Skip, if don't want to change)", ["Done", "WIP"], false);
    public thumbnailFilePath: FilePickQuestion = new FilePickQuestion(
        "Select thumbnail (Skip, if don't want to change)",
        { Image: ["png", "jpg", "jpeg"] },
        false
    );
    public readmeFilePath: FilePickQuestion = new FilePickQuestion(
        "Select Readme  (Skip, if don't want to change)",
        { Markdown: ["md", "txt"] },
        false
    );

    public async vscCommand(progress: vscodeProgress): Promise<CommandResult> {
        let result = new CommandResult();
        progress.report({ message: "Setting project values ..." });
        if (!result.isFaulted) {
            result.isFaulted = !(await this._cli.setProjectData(
                this._projectFilePath!,
                this.projectName.answer,
                this.status.answer,
                this.thumbnailFilePath.answer,
                this.readmeFilePath.answer
            ));
            result.message = result.isFaulted ? `Couldn't set project data! Please see 3D2P output for details.` : "Project values set.";
        }
        return result;
    }

    public get Name(): string {
        return "Set Project Data";
    }
}
