import * as React from "react";
import { render } from "react-dom";
import { FC, useRef, useEffect, useState } from "react";

import { Status } from "./model/Status";
import { StlInfo } from "./model/StlInfo";
import { StlAnnotation } from "./model/StlAnnotation";
import { StlViewerComponent } from "./components/StlViewerComponent";
import { DatConfig, ConfigType, ConfigDescription } from "./effects/DatConfigEffect";

declare var acquireVsCodeApi: any;

const StlViewerApp: FC = () => {
    const defaultColor = "#F58026";
    const defaultColorHex = 16089126;

    const vscode = useRef<any>();
    const [stlUrl, setStlUrl] = useState<string>();
    const [stlInfo, setStlInfo] = useState<StlInfo>();
    const [stlColor, setStlColor] = useState(defaultColorHex);
    const [datConfig, setDatConfig] = useState<DatConfig>();

    const saveStlInfoColor = (rgb: string) => {
        stlInfo!.color = rgb;
        setStlColor(parseInt(rgb.substring(1), 16));
        vscode.current?.postMessage({ command: "updateStlInfo", data: stlInfo });
    };

    const saveStlInfoAnnotations = (annotations: Array<StlAnnotation>) => {
        if(stlInfo !== undefined) {
            stlInfo.annotationList = annotations;
            vscode.current?.postMessage({ command: "updateStlAnnotations", data: annotations });
        }
    };
    
    useEffect(() => { vscode.current = acquireVsCodeApi(); }, []);

    useEffect(() => {
        const handleMessage = (event: any): void => {
            let message = event.data;
            switch (message.command) {
                case "setStlInfo":                 
                    setStlInfo(message.data);
                    break;
                case "loadStl":
                    setStlUrl(message.data);
                    break;
            }
        };
        window.addEventListener("message", handleMessage);
        return () => { window.removeEventListener("message", handleMessage); };
    }, []);

    useEffect(() => {
        let newDatConfig = {} as DatConfig;
        newDatConfig.configDescription= [];

        if(stlInfo === undefined) {
            newDatConfig.configObject = {
                addSTLToProject: () => { vscode.current?.postMessage({ command: "addSTL" }); }
            };
            newDatConfig.configDescription.push({ property: "addSTLToProject", type: ConfigType.Button } as ConfigDescription);
        } else {
            newDatConfig.configObject = {
                color: stlInfo.color, 
                status: Status[stlInfo.status],
                resetColor: function() { (this as any).color = defaultColor; saveStlInfoColor(defaultColor); }
            };
            newDatConfig.configDescription.push({ property: "color", type: ConfigType.Color } as ConfigDescription);
            newDatConfig.configDescription.push({ property: "status", type: ConfigType.Picker, options: ["WIP", "Done"] } as ConfigDescription);
            newDatConfig.configDescription.push({ property: "resetColor", type: ConfigType.Button } as ConfigDescription);
            newDatConfig.onConfigChange = (property: string, value: any): void => {
                if(property == "color") {
                    saveStlInfoColor(value);
                } else if(property == "status") {
                    stlInfo.status = (Status as any)[value];
                    vscode.current?.postMessage({ command: "updateStlInfo", data: stlInfo });
                } 
            };
            setStlColor(parseInt(stlInfo.color.substring(1), 16));
        }
        setDatConfig(newDatConfig);
    }, [stlInfo]);

    return <div style={{ flex: 1, display: "flex", background:"white" }}>
        { stlUrl === undefined && <div>Loading ...</div> }
        { stlUrl !== undefined && <StlViewerComponent 
            isEditable={ true }
            /* To force a rerender on STL added to Project */
            key={ stlUrl + stlInfo?.name }
            additionalConfig={ datConfig }
            onAnnotationListChanged={ (annos: Array<StlAnnotation>) => { saveStlInfoAnnotations(annos); }}
            stlAnnotations={stlInfo?.annotationList}
            stlHexColor={ stlColor }
            stlUrl={ stlUrl }
            />}
        </div>;
};

render(<StlViewerApp/>, document.getElementById("stl-viewer-app")!);