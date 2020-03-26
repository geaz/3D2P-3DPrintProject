import * as path from 'path';

export abstract class FileListItem {
    constructor(private _basePath: string, public name: string, public relativePath: string) { }

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