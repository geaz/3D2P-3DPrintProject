import { Component } from 'preact';
export declare class ConfigComponent extends Component<IConfigComponentProps> {
    componentDidMount(): void;
    render(): import("preact").VNode<any> | import("preact").VNode<any>[];
}
export interface IConfigDescription {
    property: string;
    type: ConfigType;
    options: Array<string>;
}
export declare enum ConfigType {
    Input = 0,
    CheckBox = 1,
    Color = 2,
    Button = 3,
    Picker = 4
}
interface IConfigComponentProps {
    config: object;
    configDescription: Array<IConfigDescription>;
    containerId: string;
    onChange: (property: string, value: any) => void;
}
export {};
