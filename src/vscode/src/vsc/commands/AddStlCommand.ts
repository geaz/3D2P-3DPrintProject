import { vscodeProgress } from '../commandEngine/BaseCommand';
import { CommandResult } from '../commandEngine/CommandResult';
import { FilePickQuestion } from '../commandEngine/FilePickQuestion';
import { PickQuestion } from '../commandEngine/PickQuestion';
import { BaseCliCommand } from './BaseCliCommand';

export class AddStlCommand extends BaseCliCommand {    
    public stlFilePath: FilePickQuestion = new FilePickQuestion("Select STL", { 'STL': ['stl' ] }, true, (() => this._stlFilePath === undefined).bind(this));
    public status: PickQuestion = new PickQuestion("Pick current STL status", ["Done", "WIP"]);

    constructor(private _stlFilePath?: string) {
        super();
    }

    public async vscCommand(progress: vscodeProgress): Promise<CommandResult> {
        let result = new CommandResult();
        progress.report({ message: 'Adding STL ...' });

        let stlFilePath = this._stlFilePath !== undefined
            ? this._stlFilePath
            : this.stlFilePath.answer!;

        result.isFaulted = !(await this._cli.addStl(this._projectFilePath!, stlFilePath, this.status.answer!));
        result.message = result.isFaulted 
            ? `Couldn't add STL! Please see 3D2P output for details.` 
            : 'STL successfully added.';
        return result;
    }

    public get Name(): string {
        return "Add STL";
    }
}