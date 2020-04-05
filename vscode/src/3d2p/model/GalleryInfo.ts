import { FileListItem } from "../fileList/FileListItem";

export class GalleryInfo extends FileListItem {    
    constructor(basePath: string, name: string, relativePath: string) {
        super(basePath, name, relativePath);
    }

    public static fromObject(basePath: string, object: any): FileListItem {
        let galleryInfo = new GalleryInfo(basePath, object['name'], object['relativePath']);
        return galleryInfo;
    }
}