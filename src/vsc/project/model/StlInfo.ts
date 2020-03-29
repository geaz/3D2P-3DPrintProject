import { FileListItem } from "../fileList/FileListItem";

export const DEFAULT_STL_COLOR: number = 0xF58026;

export class StlInfo extends FileListItem {
    public color: number = DEFAULT_STL_COLOR;
    public status: StlStatus = StlStatus.WIP;
    public annotationList: Array<IStlAnnotation> = new Array<IStlAnnotation>();

    constructor(basePath: string, name: string, relativePath: string) {
        super(basePath, name, relativePath);
    }

    public static fromObject(basePath: string, object: any): FileListItem {
        let stlInfo = new StlInfo(basePath, object['name'], object['relativePath']);
        stlInfo.color = object['color'];
        stlInfo.status = object['status'];
        stlInfo.annotationList = object['annotationList'];

        return stlInfo;
    }
 }

export enum StlStatus {
    WIP = "WIP",
    Done = "Done",
}

export interface IStlAnnotation {
    id: number;
    x: number;
    y: number;
    z: number;
    text: string;
}