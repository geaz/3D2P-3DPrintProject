import { useCallback, useRef, useEffect, useState } from "react";
import { StlViewerContext } from "../stlViewer/StlViewerContext";
import { useWindowResize } from "./EventEffects";

export function useStlViewerContext() {
    const [stlUrl, setStlUrl] = useState<string | undefined>(undefined);
    const [stlHexColor, setStlHexColor] = useState<number | undefined>(undefined);

    const stlViewerRef = useRef<StlViewerContext>();
    const stlDivRef = useCallback(node => {
        if(node !== null) stlViewerRef.current = new StlViewerContext(node);
        else stlViewerRef.current = undefined;
    }, []);    
    
    useWindowResize(() => { stlViewerRef.current?.resizeRenderer(); });
    useEffect(() => { 
        if(stlViewerRef !== undefined && stlUrl !== undefined && stlHexColor !== undefined) 
            stlViewerRef.current?.loadStl(stlUrl, stlHexColor)
    }, [stlUrl]);
    useEffect(() => {
        if(stlViewerRef !== undefined && stlHexColor !== undefined)
            stlViewerRef.current?.setStlColor(stlHexColor);
    }, [stlHexColor])

    return [stlDivRef, stlViewerRef, setStlUrl, setStlHexColor];
};