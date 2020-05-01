import { Status } from "./Status";
import { IStlInfo } from "./IStlInfo";

export interface IProjectFile {
    id: string;
    name: string;
    status: Status;
    readme: string;
    stlInfoList: Array<IStlInfo>;
}
