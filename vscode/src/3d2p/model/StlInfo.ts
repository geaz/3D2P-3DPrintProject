import * as path from 'path';

import { IStlAnnotation } from '3d2p.preact.components';
import { FileListItem } from "../fileList/FileListItem";

export const DEFAULT_STL_COLOR: number = 0xF58026;

export class StlInfo extends FileListItem {
    public color: number = DEFAULT_STL_COLOR;
    public status: StlStatus = StlStatus.WIP;
    public annotationList: Array<IStlAnnotation> = new Array<IStlAnnotation>();

    constructor(basePath: string, name: string, relativePath: string) {
        super(basePath, path.basename(name, path.extname(name)), relativePath);
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