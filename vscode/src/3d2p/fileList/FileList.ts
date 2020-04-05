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
            let tempFileItem = this._typeFactory(
                path.basename(relativeFilePath), 
                relativeFilePath); 
            if(!this.itemInList(tempFileItem)) {                        
                this._items.push(tempFileItem);
            }
        });
        this._items.forEach((item, index) => {
            if(!fs.existsSync(item.getAbsolutePath())) {
                this._items.splice(index, 1);
            }
        });
    }

    public itemInList(fileListItem: T): boolean {
        return this._items.filter(i => i.relativePath === fileListItem.relativePath).length > 0;
    }
    
    public getItemByRelativePath(relativeFilePath: string): T {
        let tempFileItem = this._typeFactory(
            path.basename(relativeFilePath), 
            relativeFilePath); 
        return this._items.filter(i => i.relativePath === tempFileItem.relativePath)?.[0];
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

    get items() {
        return this._items;
    }
}