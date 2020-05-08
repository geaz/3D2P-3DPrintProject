import { vscodeProgress } from '../commandEngine/BaseCommand';
import { CommandResult } from '../commandEngine/CommandResult';
import { BaseCliCommand } from './BaseCliCommand';
import { StlInfo } from '3d2p.react.app';

enum Status {
    Unknown,
    WIP,
    Done,
}

export class SetStlInfoCommand extends BaseCliCommand {    
    constructor(private _stlInfo: StlInfo) {
        super();
    }

    public async vscCommand(progress: vscodeProgress): Promise<CommandResult> {
        let result = new CommandResult();
        progress.report({ message: 'Setting STL Info ...' });

        result.isFaulted = !(await this._cli.setStlInfo(
            this._projectFilePath!, 
            this._stlInfo.name, 
            Status[this._stlInfo.status], 
            this._stlInfo.color));
        result.message = result.isFaulted 
            ? `Couldn't set STL Info! Please see 3D2P output for details.` 
            : 'STL Info set successfully.';
        return result;
    }

    public get Name(): string {
        return "Set STL Info";
    }
}