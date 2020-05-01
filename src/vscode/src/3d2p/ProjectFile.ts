import * as fs from 'fs';

import { FileList } from "./fileList/FileList";
import { StlInfo } from './StlInfo';

export class ProjectFile {
    public name: string = '';
    public status: string = '';
    public thumbnail: string = '';
    public homepage: string = '';
    public stls: FileList<StlInfo> = 
        new FileList<StlInfo>(".stl", (name, relPath) => new StlInfo(this._projectPath, name, relPath));
        
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
                    default:
                        jsonObject[property] = Object.getOwnPropertyDescriptor(this, property)?.value;
                        break;
                }
            });
        fs.writeFileSync(this._projectFilePath, JSON.stringify(jsonObject), 'utf8');
    }

    private Load(): void {
        let projectJson = JSON.parse(fs.readFileSync(this._projectFilePath, 'utf8'));
        for(let property in projectJson) {
            switch (property) {
                case 'stls':
                    projectJson[property].forEach((element: any) => {
                        this.stls.items.push(<StlInfo>StlInfo.fromObject(this._projectPath, element));
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
    }
}