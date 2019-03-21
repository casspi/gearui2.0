import { InputProps } from "antd/lib/input";
import * as React from 'react';
import * as Text from './Text';
import { Input as AntdInput, Icon as AntdIcon, Button as AntdButton } from "antd";
export var props = {
    ...Text.props,
    isStrict:GearType.Boolean
};

export interface state extends Text.state {
}

export default class IdNumber<P extends typeof props & InputProps, S extends state> extends Text.default<P, S>{
    //所有实现都是在父类中，这边只是提供一个jsx类型，校验器是在form中通过Validator增加的
    getProps() {
        return G.G$.extend({},super.getProps(),{
            isStrict:this.props.isStrict
        });
    }
    makeJsx() {
        let props:any = this.getProps();
        delete props.isStrict;
        delete props.invalidType;
        delete props.labelText;
        if(this.form){
            delete props.value
        }
        return <AntdInput {...props} ></AntdInput>;
    }
}