import { useEffect, useCallback, useState } from "react";
import * as dat from "dat.gui";

export interface DatConfig {
    configDescription: Array<ConfigDescription>;
    configObject: object;
    onConfigChange: (property: string, value: any) => void;
}

export interface ConfigDescription {
    property: string;
    type: ConfigType;
    options: Array<string>;
}

export enum ConfigType {
    Input,
    CheckBox,
    Color,
    Button,
    Picker,
}

export function useDatConfig() {
    const [gui, setGui] = useState<dat.GUI>();
    const [datConfig, setDatConfig] = useState<DatConfig>();

    const configContainerRef = useCallback(node => {
        if (node !== null) {
            node.innerHTML = "";

            let newGui = new dat.GUI({ hideable: false, autoPlace: false });
            node.appendChild(newGui.domElement);
            setGui(newGui);
        }
    }, [datConfig]);

    useEffect(() => {
        if(gui === undefined) return;

        datConfig?.configDescription.forEach((element) => {
            let controller: dat.GUIController | undefined = undefined;
            switch (element.type) {
                case ConfigType.Color:
                    controller = gui.addColor(datConfig.configObject, element.property);
                    break;
                case ConfigType.Picker:
                    controller = gui.add(datConfig.configObject, element.property, element.options);
                    break;
                default:
                    controller = gui.add(datConfig.configObject, element.property);
                    break;
            }
            controller.listen();
            controller.onChange((value) => datConfig.onConfigChange(element.property, value));
        });
    }, [gui]);

    return [configContainerRef, setDatConfig];
};