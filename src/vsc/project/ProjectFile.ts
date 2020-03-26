import * as fs from 'fs';
import * as path from 'path';

import { ProjectInfoList, IInfoListItem } from "./ProjectInfoList";

export class ProjectFile {
    public name: string = "";
    public provider: string = "";
    public stls: ProjectInfoList<IStlInfo> = new ProjectInfoList<IStlInfo>(".stl");
    public gallery: Array<IGalleryInfo> = new Array<IGalleryInfo>();
        
    private _projectFilePath: string;

    constructor(projectFilePath: string) {
        if(!fs.existsSync(projectFilePath)) {
            throw "Project file does not exist!";
        }
        this._projectFilePath = projectFilePath;
        this.Reload();
        this.Save();
    }

    public Reload(): void {
        let projectJson = require(this._projectFilePath);
        for(var property in projectJson) {
            switch (property) {
                case 'stls':
                    this.stls.items.push(projectJson[property]);
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
                        jsonObject['stls'] = this.stls.items;
                        break;
                    case 'gallery':
                        jsonObject['gallery'] = this.gallery;
                        break;
                    default:
                        jsonObject[property] = Object.getOwnPropertyDescriptor(this, property)?.value;
                        break;
                }
            });
        fs.writeFileSync(this._projectFilePath, JSON.stringify(jsonObject), 'utf8');
    }
}

export interface IStlInfo extends IInfoListItem {
    color: number;
    status: StlStatus;
    notes: string;
}

export enum StlStatus {
    WIP = "WIP",
    Done = "Done",
}

export interface IGalleryInfo extends IInfoListItem {
    visible: boolean;
}