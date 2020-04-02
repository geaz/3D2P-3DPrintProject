import { FileListItem } from "../fileList/FileListItem";

export class GalleryInfo extends FileListItem {
    public order: number = 0;
    
    constructor(basePath: string, name: string, relativePath: string) {
        super(basePath, name, relativePath);
    }

    public static sort(a: GalleryInfo, b: GalleryInfo): number {
        return a.order - b.order;
    }

    public static fromObject(basePath: string, object: any): FileListItem {
        let galleryInfo = new GalleryInfo(basePath, object['name'], object['relativePath']);
        galleryInfo.order = object['order'];

        return galleryInfo;
    }
}