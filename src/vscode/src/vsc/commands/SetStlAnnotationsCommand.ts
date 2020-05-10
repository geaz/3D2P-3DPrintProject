import { vscodeProgress } from "../commandEngine/BaseCommand";
import { CommandResult } from "../commandEngine/CommandResult";
import { BaseCliCommand } from "./BaseCliCommand";
import { StlAnnotation } from "3d2p-react-app";

export class SetStlAnnotationsCommand extends BaseCliCommand {
    constructor(private _stlName: string, private _stlAnnotations: Array<StlAnnotation>) {
        super();
    }

    public async vscCommand(progress: vscodeProgress): Promise<CommandResult> {
        let result = new CommandResult();
        progress.report({ message: "Setting STL Annotations ..." });

        result.isFaulted = !(await this._cli.setStlAnnotations(
            this._projectFilePath!,
            this._stlName,
            this._stlAnnotations
        ));
        result.message = result.isFaulted ? `Couldn't set STL Annotations! Please see 3D2P output for details.` : "STL Annotations set successfully.";
        return result;
    }

    public get Name(): string {
        return "Set STL Annotations";
    }
}
