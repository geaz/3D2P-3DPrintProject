import { FileListItem } from "../fileList/FileListItem";

export class GalleryInfo extends FileListItem {
    public visible: boolean = false;
    
    constructor(basePath: string, name: string, relativePath: string) {
        super(basePath, name, relativePath);
    }
}