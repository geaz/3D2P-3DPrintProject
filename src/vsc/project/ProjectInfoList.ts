import * as fs from 'fs';
import * as path from 'path';

export interface IInfoListItem {
    name: string;
    relativePath: string;
}

export class ProjectInfoList<T extends IInfoListItem> {
    private _items: Array<T> = new Array<T>();

    constructor(private _fileExtensions: string) { }

    public updateListFromDisk(searchDirectory: string): void {
        let foundFiles = this.getFilesRecursive(searchDirectory, this._fileExtensions);
        foundFiles.forEach(foundFile => {
            let relativeFilePath = path.relative(searchDirectory, foundFile);
            let foundFilesInList = this._items.filter(info => info.relativePath === relativeFilePath);
            if(foundFilesInList.length === 0) {
                let infoItem = <T>{};
                infoItem.name = path.basename(relativeFilePath, path.extname(relativeFilePath));
                infoItem.relativePath = relativeFilePath;
                
                this._items.push(infoItem);
            }
        });
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