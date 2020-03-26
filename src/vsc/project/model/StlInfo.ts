import { FileListItem } from "../fileList/FileListItem";

export class StlInfo extends FileListItem {
    public color: number = 0xffffff;
    public status: StlStatus = StlStatus.WIP;
    public notes: string = "";

    constructor(basePath: string, name: string, relativePath: string) {
        super(basePath, name, relativePath);
    }

    public static fromObject(basePath: string, object: any): FileListItem {
        let stlInfo = new StlInfo(basePath, object['name'], object['relativePath']);
        stlInfo.color = object['color'];
        stlInfo.status = object['status'];
        stlInfo.notes = object['notes'];

        return stlInfo;
    }
}

export enum StlStatus {
    WIP = "WIP",
    Done = "Done",
}