import * as Tag from '../Tag';
// const SketchPicker = require('react-color');
import * as React from 'react';
import { SketchPicker } from 'react-color';
import { ColorUtil } from '../../utils';
export var props = {
    ...Tag.props,
    disablealpha: GearType.Boolean,
    value: GearType.String,
}
export interface state extends Tag.state {
    disablealpha?: boolean;
    value?: string;
}
export default class ColorPicker<P extends typeof props, S extends state> extends Tag.default<P, S> {
    onChange(fun:Function) {
        alert('change')
        if(fun && G.G$.isFunction(fun)) {
            this.bind("change",fun);
        }
    }

    // protected _change(color,event) {
    // }
    getInitialState(): state {
        let state = this.state;
        return G.G$.extend({},state,{
            disablealpha: this.props.disablealpha,
            value: this.props.value
        });
    }

    getProps() {
        let state = this.state;
        return G.G$.extend({},state,{
            color: ColorUtil.getValidColor(this.getValue()),
            disableAlpha: this.state.disablealpha != false,
            onChange: (color: any,event: any)=>{
                this.doEvent("change",color,event);
                // this._change(color,event);
            }
        });
    }

    render() {
        let props = this.getProps();
        return <SketchPicker {...props}/>;
    }

    setValue(val: string) {
        this.setState({ value: val });
    }

    getValue() {
        return this.props.value;
    }
}