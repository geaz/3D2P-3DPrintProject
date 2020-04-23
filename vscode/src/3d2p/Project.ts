import * as fs from 'fs';
import * as path from 'path';

import { StlInfo } from './StlInfo';
import { ProjectFile } from './ProjectFile';
import { FileList } from './fileList/FileList';
import { FileListItem } from './fileList/FileListItem';

export const PROJECTFILE_NAME = "3D2P.json";

export class Project {
    private _projectPath?: string;
    private _projectFile?: ProjectFile;
    private _imageList?: FileList<FileListItem>;
    
    public Load(projectPath: string): void {
        if(!fs.existsSync(path.join(projectPath, PROJECTFILE_NAME))) {
            throw "No project file found in the given path!";
        }

        this._projectPath = projectPath;
        this._projectFile = new ProjectFile(projectPath, path.join(projectPath, PROJECTFILE_NAME));
        this._imageList = new FileList<FileListItem>(".jpg|.jpeg|.png", (name, relPath) => new FileListItem(projectPath, name, relPath));

        this.stls.updateListFromDisk(this._projectPath);
        this.images.updateListFromDisk(this._projectPath);
        // To save updates of the file list
		this.Save();
    }

    public Save(): void {
        if(this._projectFile === undefined) throw "No project loaded!";
        this._projectFile.Save();
    }

    public Close(): void {
        this._projectPath = undefined;
        this._projectFile = undefined;
        this._imageList = undefined;
    }

    public get projectFile(): ProjectFile {
        if(this._projectFile === undefined) throw "No project loaded!";
        return this._projectFile;
    }

    public get projectPath(): string {
        if(this._projectPath === undefined) throw "No project loaded!";
        return this._projectPath;
    }

    public get stls(): FileList<StlInfo> {
        if(this._projectFile === undefined) throw "No project loaded!";
        return this._projectFile.stls;
    }

    public get images(): FileList<FileListItem> {
        if(this._projectFile === undefined) throw "No project loaded!";
        return this._imageList!;
    }
}