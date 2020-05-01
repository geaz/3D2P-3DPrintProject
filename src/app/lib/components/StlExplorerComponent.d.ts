import { Component } from 'preact';
import { IProjectFile } from '../model/IProjectFile';
import { StlViewerContext } from '../stlViewer/threejs/StlViewerContext';
import { IStlInfo } from '../model/IStlInfo';
interface StlExplorerComponentProps {
    projectFile: IProjectFile;
    projectFolderUrl: string;
}
interface StlExplorerComponentState {
    showAnnotations: boolean;
    stlViewerContext: StlViewerContext;
    selectedStl: IStlInfo;
}
export declare class StlExplorerComponent extends Component<StlExplorerComponentProps, StlExplorerComponentState> {
    private _config;
    private _configDescription;
    private _fileList;
    private _stlViewerComponent?;
    componentWillMount(): void;
    render(): import("preact").VNode<any> | import("preact").VNode<any>[];
    private setFileList;
    private onFileSelected;
    private onConfigChanged;
    private onViewerInitiated;
    private css;
}
export {};
