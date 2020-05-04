import * as React from "react";
import { FC, useState, useEffect } from "react";

import { Intersection } from "three";
import { AnnotationItemComponent } from "./AnnotationItemComponent";
import { StlAnnotation } from "../model/StlAnnotation";
import { StlViewerContext } from "../stlViewer/StlViewerContext";
import { RaycasterEventListener } from "../stlViewer/RaycasterEventListener";

interface AnnotationsComponentProps {
    isEditable: boolean;
    showAnnotations: boolean;
    stlViewerContext: StlViewerContext;
    annotationList: Array<StlAnnotation>;
    onAnnotationListChanged: (annotationList: Array<StlAnnotation>) => void;
}

export const AnnotationsComponent: FC<AnnotationsComponentProps> = (props: AnnotationsComponentProps) => {
    let [annotationList, setAnnotationList] = useState(props.annotationList);
    let [activeAnnotation, setActiveAnnotation] = useState(-1);

    useEffect(() => {
        let raycastListener: RaycasterEventListener | undefined = undefined;

        const onIntersection = (x: number, y: number, intersection: Intersection): void => {
            if (props.showAnnotations && props.isEditable) {
                let newAnnotationList = annotationList;
                let id = newAnnotationList.length === 0
                    ? 0
                    : Math.max.apply(Math, newAnnotationList.map(function (o) { return o.id; })) + 1;
    
                let newAnnotation = {} as StlAnnotation;
                newAnnotation.id = id;
                newAnnotation.x = intersection.point.x;
                newAnnotation.y = intersection.point.y;
                newAnnotation.z = intersection.point.z;
    
                newAnnotationList.push(newAnnotation);
                setAnnotationList(newAnnotationList);
                setActiveAnnotation(newAnnotationList.length - 1);
            }
        };

        const initRaycaster = () => {
            if (raycastListener !== undefined) {
                raycastListener.dispose();
            }
            raycastListener = new RaycasterEventListener(
                props.stlViewerContext,
                StlViewerContext.STLMESH_NAME,
                onIntersection
            );
        };

        props.stlViewerContext.addStlLoadedListener(initRaycaster);
        return () => props.stlViewerContext.removeStlLoadedListener(initRaycaster);
    }, [props.stlViewerContext]);

    const handleAnnotationClicked = (index: number): void => {
        if (activeAnnotation === index) setActiveAnnotation(-1);
        else setActiveAnnotation(index);
    };

    const handleAnnotationSaved = (annotation: StlAnnotation): void => {
        let savedAnnotation = annotationList.filter((a) => a.id == annotation.id);
        if (savedAnnotation.length === 1) {
            savedAnnotation[0].text = annotation.text;
            if (props.onAnnotationListChanged !== undefined) {
                props.onAnnotationListChanged(annotationList);
            }
        }
    };

    const handleAnnotationDeleted = (annotation: StlAnnotation): void => {
        let newAnnotationList = annotationList;
        newAnnotationList.forEach((item, index) => {
            if (item.id === annotation.id) {
                newAnnotationList.splice(index, 1);
                return;
            }
        });
        if (props.onAnnotationListChanged !== undefined) {
            props.onAnnotationListChanged(newAnnotationList);
        }
        setAnnotationList(newAnnotationList);
        setActiveAnnotation(-1);
    };

    let annotationItemList = undefined;
    if (props.showAnnotations) {
        annotationItemList = annotationList?.map((annotation, index) => {
            return <AnnotationItemComponent
                isEditable={props.isEditable}
                annotation={annotation}
                stlViewerContext={props.stlViewerContext}
                index={index}
                active={activeAnnotation === index}
                onClicked={ handleAnnotationClicked }
                onAnnotationSaved={ handleAnnotationSaved }
                onAnnotationDeleted={ handleAnnotationDeleted }
            />;
        });
    }
    return <>{annotationItemList}</>;
};
