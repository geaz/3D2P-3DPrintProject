import { useEffect, useCallback, useState } from "react";
import * as dat from "dat.gui";

export interface DatConfig {
    configDescription: Array<ConfigDescription>;
    configObject: object;
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

export function useDatConfig(
    datConfig: DatConfig,
    changeCb: (property: string, value: any) => void
) {
    const [gui, setGui] = useState<dat.GUI>();
    const configContainerRef = useCallback(node => {
        if (node !== null) {
            let newGui = new dat.GUI({ hideable: false, autoPlace: false });
            node.appendChild(newGui.domElement);
            setGui(newGui);
        }
    }, []);

    useEffect(() => {
        if(gui === undefined) return;

        datConfig.configDescription.forEach((element) => {
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
            controller.onChange((value) => changeCb(element.property, value));
        });
    }, [gui]);

    return configContainerRef;
};