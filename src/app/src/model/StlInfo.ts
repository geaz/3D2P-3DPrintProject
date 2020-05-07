import { Status } from "./Status";
import { StlAnnotation } from "./StlAnnotation";

export interface StlInfo {
    name: string;
    color: string;
    status: Status;
    relativePath: string;
    annotationList: Array<StlAnnotation>;
}
