import * as React from "react";
import { useState, FC, useEffect } from "react";
import styled from "styled-components";

import { AnnotationsComponent } from "./AnnotationsComponent";
import { StlAnnotation } from "../model/StlAnnotation";
import { DatConfig, useDatConfig, ConfigType, ConfigDescription } from "../effects/DatConfigEffect";
import { useStlViewerContext } from "../effects/StlViewerContextEffect";

interface StlViewerComponentProps {
    stlUrl: string | undefined;
    stlHexColor: number | undefined;
    stlAnnotations: Array<StlAnnotation> | undefined;
}

export const StlViewerComponent: FC<StlViewerComponentProps> = (props: StlViewerComponentProps) => {
    const [showAnnotations, setShowAnnotations] = useState(true);
    const [stlDivRef, stlViewerRef, setStlUrl, setStlHexColor] = useStlViewerContext() as any;
    
    useEffect(() => { setStlUrl(props.stlUrl); }, [props.stlUrl]);
    useEffect(() => { setStlHexColor(props.stlHexColor); }, [props.stlHexColor]);

    const datConfig = {} as DatConfig;
    datConfig.configObject = {
        showAnnotations: true,
        resetCamera: () => {
            stlViewerRef.current?.resetCamera();
        },
    };
    datConfig.configDescription = [];
    datConfig.configDescription.push({ property: "showAnnotations", type: ConfigType.CheckBox } as ConfigDescription);
    datConfig.configDescription.push({ property: "resetCamera", type: ConfigType.Button } as ConfigDescription);
    const configContainerRef = useDatConfig(datConfig, (property: string, value: any) => {
        if (property === "showAnnotations") setShowAnnotations(value);
    });

    let annotationsComponent = undefined;
    if (stlViewerRef.current !== undefined && props.stlAnnotations !== undefined) {
        annotationsComponent = <AnnotationsComponent
            isEditable={false}
            onAnnotationListChanged={ () => { }}
            showAnnotations={showAnnotations}
            annotationList={props.stlAnnotations}
            stlViewerContext={stlViewerRef.current}
        />;
    }

    return <StyledStlWrapper>
        {annotationsComponent}
        <StyledConfig ref={ configContainerRef } />
        <StyledStlViewer ref={ stlDivRef } />
    </StyledStlWrapper>;
};

const StyledStlWrapper = styled.div`
    flex: 1;
    height: 100%;
    position: relative;
`;

const StyledStlViewer = styled.div`
    width: 100%;
    height: 100%;
    background: radial-gradient(#FFFFFF, rgb(80, 80, 80));
`;

const StyledConfig = styled.div`
    right: 15px;
    position: absolute;
`;
