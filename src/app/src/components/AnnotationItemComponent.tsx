import * as React from "react";
import { FC, useState, useRef, useEffect } from "react";
import styled, { css } from "styled-components";

import * as marked from "marked";
import {
    WebGLRenderer,
    CanvasTexture,
    Sprite,
    SpriteMaterial,
    Raycaster,
    Camera,
    Vector2,
    Vector3,
    Group,
    Material,
    Geometry,
    BufferGeometry,
    Scene,
} from "three";
import { StlAnnotation } from "../model/StlAnnotation";
import { StlViewerContext } from "../stlViewer/StlViewerContext";

interface AnnotationItemComponentProps {
    index: number;
    active: boolean;
    isEditable: boolean;
    annotation: StlAnnotation;
    stlViewerContext: StlViewerContext;
    onClicked: (index: number) => void;
    onAnnotationSaved: (annotation: StlAnnotation) => void;
    onAnnotationDeleted: (annotation: StlAnnotation) => void;
}

export const AnnotationItemComponent: FC<AnnotationItemComponentProps> = (props: AnnotationItemComponentProps) => {
    const componentRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const numberContainerRef = useRef<HTMLDivElement>(null);
    const [isEditMode, setEditMode] = useState(false);

    // Adding Sprite for Depth Check
    // And update position / visibility on render call
    useEffect(() => {
        let sprite: Sprite | undefined = undefined;
    
        const getDevicePos = (): Vector3 => {
            if (sprite === undefined) {
                throw "Annotation Item not initialized! Waiting for STLContext ...";
            }
            let pos = sprite.position.clone();
            return pos.project(props.stlViewerContext.Camera);
        }
    
        const getScreenPos = (): Vector2 => {
            let boundingBox = props.stlViewerContext.Renderer.domElement.getBoundingClientRect();
            let width = boundingBox.width,
                height = boundingBox.height;
            let widthHalf = width / 2,
                heightHalf = height / 2;
    
            let devicePos = getDevicePos();
            return new Vector2(devicePos.x * widthHalf + widthHalf, -(devicePos.y * heightHalf) + heightHalf);
        }

        const shouldShow = (): boolean => {
            let devicePos = getDevicePos();
            return devicePos.x >= -0.9 && devicePos.x <= 0.9 && devicePos.y >= -0.9 && devicePos.y <= 0.9;
        }

        const updateDepthAndPosition = (
            _renderer: WebGLRenderer,
            _scene: Scene,
            camera: Camera,
            _geometry: Geometry | BufferGeometry,
            _material: Material,
            _group: Group
        ): void => {
            if (shouldShow() && props.stlViewerContext.StlMesh !== undefined) {
                let devicePos = getDevicePos();
                let raycaster = new Raycaster();
                raycaster.setFromCamera({ x: devicePos.x, y: devicePos.y }, camera);
        
                let numberVisible = true;
                let intersections = raycaster.intersectObjects([props.stlViewerContext.StlMesh, sprite!], true);
                if (intersections.length > 0) {
                    let obj1 = intersections[0];
                    let obj2 = intersections[1];
        
                    // Even, if the depth tested sprite is not the first intersected object,
                    // it could be the case, that the sprite and the stl have the same distance.
                    // In this case the number should be visible too.
                    if (obj1.object.name !== `Annotation ${props.index + 1}`) {
                        let distObj1 = raycaster.ray.origin.distanceTo(obj1.point).toFixed(4);
                        let distObj2 = raycaster.ray.origin.distanceTo(obj2.point).toFixed(4);
                        numberVisible = distObj1 === distObj2;
                    }
                }
        
                // Don't update the css by state updates of the component,
                // to minimze the performance impact
                let screenPos = getScreenPos();
                componentRef.current!.style.visibility = "visible";
                componentRef.current!.style.left = screenPos.x - 16 + "px";
                componentRef.current!.style.top = screenPos.y - 16 + "px";
                componentRef.current!.style.opacity = numberVisible ? "1" : "0.2";
                numberContainerRef.current!.style.zIndex = numberVisible ? "1" : "0";
            } else {
                componentRef.current!.style.visibility = "hidden";
            }
        };

        const initDepthSprite = () => {
            if (props.stlViewerContext.StlMesh !== undefined) {
                if (sprite !== undefined) {
                    props.stlViewerContext.Scene.remove(sprite);
                }
    
                let canvas = document.createElement("canvas");
                canvas.width = 64;
                canvas.height = 64;
    
                let ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
                if (ctx === null) {
                    throw "Couldnt get canvas context!";
                }
                ctx.fillRect(0, 0, 64, 64);
    
                let numberTexture = new CanvasTexture(canvas);
                let spriteMaterial = new SpriteMaterial({ map: numberTexture, opacity: 0 });
    
                sprite = new Sprite(spriteMaterial);
                sprite.name = `Annotation ${props.index + 1}`;
                sprite.onBeforeRender = updateDepthAndPosition;
                sprite.position.set(props.annotation.x, props.annotation.y, props.annotation.z);
    
                props.stlViewerContext.Scene.add(sprite);
            }
        };
        
        props.stlViewerContext.addStlLoadedListener(initDepthSprite);
        return () => props.stlViewerContext.removeStlLoadedListener(initDepthSprite);
    }, [props.index, props.stlViewerContext]);

    let annotationText =
        props.annotation.text === undefined || props.annotation.text === ""
            ? "<small>Marked</small>"
            : marked(props.annotation.text);

        let annotationBox = undefined;
        if (props.active) {
            annotationBox = <div className="annotation">
                {isEditMode && <>
                    <textarea 
                        placeholder="Annotation"
                        onInput={ (e: any) => (props.annotation.text = e.target.value) }
                        ref={ textAreaRef }
                    >
                        {props.annotation.text}
                    </textarea>
                    <div className="button-container">
                        <div className="button" onClick={ () => props.onAnnotationSaved(props.annotation) }>Save</div>
                        <div className="button" onClick={ () => props.onAnnotationDeleted(props.annotation) }>Delete</div>
                    </div></> 
                }
                ${!isEditMode &&
                <><div className="annotation-content" dangerouslySetInnerHTML={{ __html: annotationText }}></div>
                    { props.isEditable &&
                    <div className="button-container">
                        <div className="button" onClick={ () => setEditMode(true) }>Edit</div>
                        <div className="button" onClick={ () => props.onAnnotationDeleted(props.annotation) }>Delete</div>
                    </div>}
                </>}
            </div>;
        }

        return <StyledAnnotationItem ref={ componentRef } active={ props.active }>
            <div
                className="number-container"
                ref={ numberContainerRef }
                onClick={ () => props.onClicked(props.index) }
            >
                <div className="number">${props.index + 1}</div>
            </div>
            ${annotationBox}
        </StyledAnnotationItem>;
}

const StyledAnnotationItem = styled.div<{ active: boolean }>`
    display: flex;
    position: absolute;
    font: 1rem sans-serif;
    align-items: flex-start;

    .number-container {
        z-index: 1;
        color: #eee;
        border-radius: 5px;
        border: 1px solid #eee;
        background: rgb(0, 0, 0, 0.8);

        ${p => p.active &&
        css`
            color: red;
        `}

        &:hover {
            color: red;
            cursor: pointer;
        }
    }

    .number {
        width: 32px;
        line-height: 32px;
        text-align: center;
        font-weight: bold;
        font-size: 1.2rem;
    }

    .annotation {
        z-index: 2;
        color: #eee;
        display: block;
        max-width: 200px;
        padding: 10px;
        margin-left: 15px;
        position: relative;
        background: rgb(17, 17, 17, 0.8);

        &::before {
            content: "";
            position: absolute;
            right: 100%;
            top: 12px;
            border-bottom: 5px solid transparent;
            border-right: 5px solid rgb(17, 17, 17, 0.8);
            border-top: 5px solid transparent;
            clear: both;
        }

        .annotation-content {
            display: block;

            p:first-child {
                margin-top: 0;
            }
            p:last-child {
                margin-bottom: 0px;
            }
            a {
                color: white;
                text-decoration: underline;

                &:hover {
                    color: #f58026;
                }
            }
        }

        .button-container {
            display: flex;
            margin-top: 15px;

            .button {
                color: #b2b2b2;
                padding-right: 15px;
                font-weight: bold;
                font-size: 0.7rem;

                &:hover {
                    cursor: pointer;
                    color: #f58026;
                }

                &:last-child {
                    padding-right: 0;
                }
            }
        }
    }

    textarea {
        border: 0;
        flex-grow: 1;
        color: #eee;
        width: 200px;
        height: 250px;
        resize: vertical;
        background: transparent;
        font-size: 1rem !important;
        font-family: monospace !important;

        &:focus {
            outline: none !important;
        }
    }
`;
