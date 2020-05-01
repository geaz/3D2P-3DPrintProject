import { Component } from 'preact';
import { IFileInfo } from '../model/IFileInfo';
interface FileListComponentProps {
    selectedFile: string;
    fileList: Array<IFileInfo>;
    onFileSelected: (name: string) => void;
}
export declare class FileListComponent extends Component<FileListComponentProps> {
    render(): import("preact").VNode<any> | import("preact").VNode<any>[];
    private onFileSelected;
    private css;
}
export {};
