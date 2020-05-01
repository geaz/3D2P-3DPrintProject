import { Intersection } from 'three';
import { StlViewerContext } from './StlViewerContext';
export declare class RaycasterEventListener {
    private _stlViewerContext;
    private _objectName;
    private _onIntersection;
    private _rendererDom;
    private _mouseHandler;
    constructor(_stlViewerContext: StlViewerContext, _objectName: string, _onIntersection: (mouseX: number, mouseY: number, intersection: Intersection) => void);
    dispose(): void;
    private handleDblClick;
}
