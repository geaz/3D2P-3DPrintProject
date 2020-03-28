import { h, Component } from 'preact';
import htm from 'htm';

import * as dat from 'dat.gui';

const html = htm.bind(h);

export class ConfigComponent extends Component<IConfigComponentProps> {
    public componentDidMount() {
        let gui = new dat.GUI({hideable: false});
        let changeDelegate = (property: string, value: any) => {
            if(this.props.onChange !== undefined) {
                this.props.onChange(property, value);
            }
        };

        this.props.configDescription.forEach(element => {
            if(element.type === ConfigType.Color) {
                let controller = gui.addColor(this.props.config, element.property);
                controller.listen();
                controller.onChange((value) => changeDelegate(element.property, value));                  
            }
            else if(element.type === ConfigType.Picker) {
                let controller = gui.add(this.props.config, element.property, element.options);
                controller.listen();
                controller.onChange((value) => changeDelegate(element.property, value));      
            }
            else {
                let controller = gui.add(this.props.config, element.property);
                controller.listen();
                controller.onChange((value) => changeDelegate(element.property, value));      
            }
        });
    }
    
    public render() {
        return html``;
    }
}

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
    Picker
}

interface IConfigComponentProps {
    config: object;
    configDescription: Array<IConfigDescription>;
    onChange: (property: string, value: any) => void;
}