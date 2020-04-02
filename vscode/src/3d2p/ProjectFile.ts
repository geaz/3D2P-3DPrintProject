import * as fs from 'fs';
import * as path from 'path';

import { FileList } from "./fileList/FileList";
import { StlInfo } from './model/StlInfo';
import { GalleryInfo } from './model/GalleryInfo';

export class ProjectFile {
    public name: string = "";
    public repositoryUrl: string = "";
    public rawRepositoryUrl: string = "";
    public stls: FileList<StlInfo> = 
        new FileList<StlInfo>(".stl", (name, relPath) => new StlInfo(this._projectPath, name, relPath));
    public gallery: Array<GalleryInfo> = new Array<GalleryInfo>();
        
    constructor(private _projectPath: string, private _projectFilePath: string) {
        if(!fs.existsSync(_projectFilePath)) {
            throw "Project file does not exist!";
        }
        this.Load();
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
                        jsonObject['gallery'] = this.gallery.map(i => i.toObject());
                        break;
                    default:
                        jsonObject[property] = Object.getOwnPropertyDescriptor(this, property)?.value;
                        break;
                }
            });
        fs.writeFileSync(this._projectFilePath, JSON.stringify(jsonObject, null, 4), 'utf8');
    }

    private Load(): void {
        let projectJson = require(this._projectFilePath);
        for(let property in projectJson) {
            switch (property) {
                case 'stls':
                    projectJson[property].forEach((element: any) => {
                        this.stls.items.push(<StlInfo>StlInfo.fromObject(this._projectPath, element));
                    });
                    break;
                case 'gallery':
                    projectJson[property].forEach((element: any) => {
                        this.gallery.push(<GalleryInfo>GalleryInfo.fromObject(this._projectPath, element));
                    });
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
}