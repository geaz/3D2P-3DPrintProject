import { vscodeProgress } from '../commandEngine/BaseCommand';
import { CommandResult } from '../commandEngine/CommandResult';
import { BaseCliCommand } from './BaseCliCommand';

export class PackProjectCommand extends BaseCliCommand {
    public async vscCommand(progress: vscodeProgress): Promise<CommandResult> {
        let result = new CommandResult();
        progress.report({ message: 'Creating 3MF ...' })
        if(!result.isFaulted) {
            result.isFaulted = 
                !(await this._cli.packProject(
                    this._projectFilePath!,
                    this._rootFolder!));
            result.message = result.isFaulted 
                ? `Couldn't create 3MF! Please see 3D2P output for details.` 
                : '3MF created.';
        }
        return result;
    }

    public get Name(): string {
        return "Create 3MF";
    }
}