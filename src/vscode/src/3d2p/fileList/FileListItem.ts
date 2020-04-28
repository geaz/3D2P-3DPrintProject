import * as path from 'path';
import * as os from 'os';

export class FileListItem {
    constructor(private _basePath: string, public name: string, public relativePath: string) {
        // Replace the path delimiter on windows to 
        // keep the project json cross platform compatible
        if(os.platform() === 'win32') {
            this.relativePath = relativePath.replace('\\', '/');
        }
    }

    public getAbsolutePath() {
        return path.resolve(this._basePath, this.relativePath);
    }

    public toObject() {
        let object: any = {};
        Object.getOwnPropertyNames(this)
            .filter(p => !p.startsWith('_'))
            .forEach(property => {
                object[property] = Object.getOwnPropertyDescriptor(this, property)?.value;
            });
        return object;
    }
}