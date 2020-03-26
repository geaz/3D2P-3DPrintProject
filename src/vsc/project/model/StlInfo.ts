import { FileListItem } from "../fileList/FileListItem";

export const DEFAULT_STL_COLOR: number = 0xF58026;

export class StlInfo extends FileListItem {
    public color: number = DEFAULT_STL_COLOR;
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