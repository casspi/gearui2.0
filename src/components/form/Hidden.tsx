import * as FormTag from "./FormTag";
import * as React from 'react';
import { InputProps } from "antd/lib/input";
export var props = {
    ...FormTag.props
};
export interface state extends FormTag.state {
    
};
export default class Hidden<P extends typeof props & InputProps, S extends (state & InputProps)> extends FormTag.default<P, S> {

    constructor(props: P, context: {}) {
        super(props, context);
    }

    getInitialState():state & InputProps {
        return {
            disabled: this.props.disabled,
            value: this.props.value || "",
            type: "hidden",
            onChange: (event)=>{
                this.setValue(event.target.value);
            }
        };
    }

    getProps() {
        let superProps = super.getProps();
        if(this.form) {
            delete superProps.value; 
        }
        return G.G$.extend({}, superProps, {
            disabled: this.state["disabled"],
        });
    }

    makeJsx() {
        let props = this.getProps();           
        return <input type={"hidden"} {...props}></input>;
    }

    //禁用
    disable() {
        this.setState({
            disabled: true
        });
    }

    //启用
    enable() {
        this.setState({
            disabled: false
        });
    }
}