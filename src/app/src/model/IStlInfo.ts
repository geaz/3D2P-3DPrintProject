import { Status } from "./Status";
import { IStlAnnotation } from "./IStlAnnotation";

export interface IStlInfo {
    name: string,
    color: string,
    status: Status,
    annotationList: Array<IStlAnnotation>
}