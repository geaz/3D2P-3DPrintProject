import { vscodeProgress } from '../commandEngine/BaseCommand';
import { CommandResult } from '../commandEngine/CommandResult';
import { FilePickQuestion } from '../commandEngine/FilePickQuestion';
import { PickQuestion } from '../commandEngine/PickQuestion';
import { BaseCliCommand } from './BaseCliCommand';

export class AddStlCommand extends BaseCliCommand {    
    public stlFilePath: FilePickQuestion = new FilePickQuestion("Select STL", { 'STL': ['stl' ] });
    public status: PickQuestion = new PickQuestion("Pick current STL status", ["Done", "WIP"]);

    public async vscCommand(progress: vscodeProgress): Promise<CommandResult> {
        let result = new CommandResult();
        progress.report({ message: 'Setting project values ...' })
        if(!result.isFaulted) {
            result.isFaulted = 
                !(await this._cli.addStl(
                    this._projectFilePath!, 
                    this.stlFilePath.answer!,
                    this.status.answer!));
            result.message = result.isFaulted 
                ? `Couldn't set project data! Please see 3D2P output for details.` 
                : 'Project values set.';
        }
        return result;
    }

    public get Name(): string {
        return "Set Project Data";
    }
}