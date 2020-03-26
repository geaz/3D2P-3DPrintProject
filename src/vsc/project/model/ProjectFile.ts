import * as fs from 'fs';
import * as path from 'path';

import { FileList } from "../fileList/FileList";
import { StlInfo } from './StlInfo';
import { GalleryInfo } from './GalleryInfo';

export class ProjectFile {
    public name: string = "";
    public provider: string = "";
    public stls: FileList<StlInfo> = 
        new FileList<StlInfo>(".stl", (name, relPath) => new StlInfo(this._projectPath, name, relPath));
    public gallery: FileList<GalleryInfo> = 
        new FileList<GalleryInfo>(".jpg|.jpeg|.png", (name, relPath) => new GalleryInfo(this._projectPath, name, relPath));
        
    constructor(private _projectPath: string, private _projectFilePath: string) {
        if(!fs.existsSync(_projectFilePath)) {
            throw "Project file does not exist!";
        }
        this.Reload();
    }

    public Reload(): void {
        this.stls.clearList();
        this.gallery.clearList();

        let projectJson = require(this._projectFilePath);
        for(var property in projectJson) {
            switch (property) {
                case 'stls':
                    projectJson[property].forEach((element: any) => {
                        this.stls.items.push(<StlInfo>StlInfo.fromObject(this._projectPath, element));
                    });
                    break;
                case 'gallery':
                    break;
                default:
                    let propertyDescriptor = Object.getOwnPropertyDescriptor(this, property);
                    if(propertyDescriptor !== undefined) {
                        propertyDescriptor.value = projectJson[property];
                        Object.defineProperty(this, property, propertyDescriptor);
                    }
                    break;
            }
        }
        this.stls.updateListFromDisk(path.dirname(this._projectFilePath));
    }

    public Save(): void {
        let jsonObject: any = {};
        Object.getOwnPropertyNames(this)
            .filter(p => !p.startsWith('_'))
            .forEach(property => {
                switch(property) {
                    case 'stls':
                        jsonObject['stls'] = this.stls.items.map(i => i.toObject());
                        break;
                    case 'gallery':
                        jsonObject['gallery'] = this.gallery.items.map(i => i.toObject());
                        break;
                    default:
                        jsonObject[property] = Object.getOwnPropertyDescriptor(this, property)?.value;
                        break;
                }
            });
        fs.writeFileSync(this._projectFilePath, JSON.stringify(jsonObject, null, 4), 'utf8');
    }
}