import { Status } from "./Status";
import { StlInfo } from "./StlInfo";

export interface ProjectFile {
    id: string;
    name: string;
    status: Status;
    readme: string;
    stlInfoList: Array<StlInfo>;
}
