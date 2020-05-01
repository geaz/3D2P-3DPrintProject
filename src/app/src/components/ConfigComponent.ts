import { h, Component } from "preact";
import htm from "htm";
const html = htm.bind(h);

import * as dat from "dat.gui";

export interface IConfigDescription {
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

interface IConfigComponentProps {
    config: object;
    configDescription: Array<IConfigDescription>;
    containerId: string;
    onChange: (property: string, value: any) => void;
}

export class ConfigComponent extends Component<IConfigComponentProps> {
    public componentDidMount() {
        let gui: dat.GUI | undefined = undefined;
        if (this.props.containerId !== undefined) {
            gui = new dat.GUI({ hideable: false, autoPlace: false });
            document.getElementById(this.props.containerId)?.appendChild(gui.domElement);
        } else {
            gui = new dat.GUI({ hideable: false });
        }

        let changeDelegate = (property: string, value: any) => {
            if (this.props.onChange !== undefined) {
                this.props.onChange(property, value);
            }
        };

        this.props.configDescription.forEach((element) => {
            let controller: dat.GUIController | undefined = undefined;
            switch (element.type) {
                case ConfigType.Color:
                    controller = gui!.addColor(this.props.config, element.property);
                    break;
                case ConfigType.Picker:
                    controller = gui!.add(this.props.config, element.property, element.options);
                    break;
                default:
                    controller = gui!.add(this.props.config, element.property);
                    break;
            }
            controller.listen();
            controller.onChange((value) => changeDelegate(element.property, value));
        });
    }

    public render() {
        return html``;
    }
}
