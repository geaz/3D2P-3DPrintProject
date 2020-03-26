import * as fs from 'fs';
import * as path from 'path';

import { FileListItem } from './FileListItem';

export class FileList<T extends FileListItem> {
    private _items: Array<T> = new Array<T>();

    constructor(private _fileExtensions: string, private _typeFactory: (name: string, relativePath: string) => T) { }

    public updateListFromDisk(searchDirectory: string): void {
        let foundFiles = this.getFilesRecursive(searchDirectory, this._fileExtensions);
        foundFiles.forEach(foundFile => {
            let relativeFilePath = path.relative(searchDirectory, foundFile);
            let foundFilesInList = this._items.filter(info => info.relativePath === relativeFilePath);
            if(foundFilesInList.length === 0) {
                let infoItem = this._typeFactory(
                    path.basename(relativeFilePath, path.extname(relativeFilePath)), 
                    relativeFilePath);                
                this._items.push(infoItem);
            }
        });
        this._items.forEach((item, index) => {
            if(!fs.existsSync(item.getAbsolutePath())) {
                this._items.splice(index, 1);
            }
        });
    }

    public getItemByRelativePath(relativePath: string): T {
        return this._items.filter(i => i.relativePath === relativePath)?.[0];
    }

    private getFilesRecursive(directoryPath: string, extensions: string): Array<string> {
        let foundFiles = new Array<string>();        
        let regex = new RegExp(`([a-zA-Z0-9\\s_\\\\.\\-\\(\\):])+(${extensions})$`, 'i');
        
        // Get all Files
        foundFiles = foundFiles.concat(fs
                .readdirSync(directoryPath, { withFileTypes: true })
                .filter(f => f.isFile() && f.name.match(regex) !== null)
                .map(f => path.resolve(directoryPath, f.name)));

        // And add all Files from subdirectories
        foundFiles = foundFiles.concat(fs
            .readdirSync(directoryPath, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .flatMap(d => this.getFilesRecursive(path.resolve(directoryPath, d.name), extensions)));

        return foundFiles;
    }

    public toJSON(): string {
        return JSON.stringify(this._items.map(i => JSON.stringify(i)));
    }

    get items() {
        return this._items;
    }
}