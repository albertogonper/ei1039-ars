import * as React from 'react';
import Component = React.Component;

export interface HelloProps {
    compiler: string;
    framework: string;
}

export class Hello extends Component<HelloProps, undefined> {
    render() {
        return <h1>Hello from {this.props.compiler} and {this.props.framework}!</h1>;
    }
}