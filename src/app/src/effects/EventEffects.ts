import { useEffect, RefObject, Dispatch, SetStateAction, useRef } from "react";

export function useWindowResize(resizeCb: () => void) {
    useEffect(() => {
        let windowResizeHandler = (e: Event) => { resizeCb(); };

        window.addEventListener("resize", windowResizeHandler);
        return () => window.removeEventListener("resize", windowResizeHandler);
    }, []);
};

export function useFileDragDrop(
    domElement: RefObject<HTMLDivElement>,
    setDragging: Dispatch<SetStateAction<boolean>>,
    dropCallback: (file: File) => void
) {
    const eventCounter = useRef(0);

    useEffect(() => {
        let dragEnterHandler = (e: Event) => {
            e.preventDefault();
            eventCounter.current++;
            setDragging(true);
        };

        domElement.current?.addEventListener("dragenter", dragEnterHandler);
        return () => domElement.current?.removeEventListener("dragenter", dragEnterHandler);
    });

    useEffect(() => {
        let handleDragLeave = (e: Event) => {
            e.preventDefault();
            eventCounter.current--;            
            if (eventCounter.current === 0) setDragging(false);
        };

        domElement.current?.addEventListener("dragleave", handleDragLeave);
        return () => domElement.current?.removeEventListener("dragleave", handleDragLeave);
    });

    useEffect(() => {
        let handleOver = (e: Event) => {
            e.preventDefault();
        };

        domElement.current?.addEventListener("dragover", handleOver);
        return () => domElement.current?.removeEventListener("dragover", handleOver);
    });

    useEffect(() => {
        let handleDrop = (e: DragEvent) => {
            e.preventDefault();
            if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
                dropCallback(e.dataTransfer.files[0]);
            }
            eventCounter.current = 0;
            setDragging(false);
        };

        domElement.current?.addEventListener("drop", handleDrop);
        return () => domElement.current?.removeEventListener("drop", handleDrop);
    });
}
