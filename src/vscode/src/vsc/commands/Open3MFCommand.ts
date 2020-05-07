import { vscodeProgress } from '../commandEngine/BaseCommand';
import { CommandResult } from '../commandEngine/CommandResult';
import { BaseCliCommand } from './BaseCliCommand';

export class Open3MFCommand extends BaseCliCommand {
    constructor(private _filepath: string) {
        super();
    }

    public async vscCommand(progress: vscodeProgress): Promise<CommandResult> {
        let result = new CommandResult();
        progress.report({ message: 'Opening 3MF ...' })
        if(!result.isFaulted) {
            result.isFaulted = !(await this._cli.open3mf(this._filepath));
            result.message = result.isFaulted 
                ? `Couldn't open 3MF! Please see 3D2P output for details.` 
                : '';
        }
        return result;
    }

    public get Name(): string {
        return "Open 3MF";
    }
}