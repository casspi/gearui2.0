import * as React from 'react';
import { Input } from 'antd';
import * as Icon from '../basic/Icon';
import * as Tag from '../Tag'
export var props = {
    ...Tag.props,
    icon: GearType.String,
    prompt: GearType.String,
    format: GearType.String,
    value: GearType.String,
    isvisible: GearType.Any
};

export interface state extends Tag.state {
    icon?: string;
    prompt?: string;
    format?: string;
    value?: string;
    isvisible?:any;
}
export default class Label<P extends typeof props, S extends state> extends Tag.default<P, S> {
    constructor(props:any){
        super(props);
    }
    getInitialState(): state {
        return {
            value: this.props.value || this.props.children,
            format: this.props.format,
            prompt: this.props.prompt,
            icon: this.props.icon,
            isvisible:this.props.isvisible,
        };
    }

    getProps() {
        let props: any = G.G$.extend({}, this.state);
        delete props.children;
        return props;
    }

    render() {
       
        let value: any = this.state.value;
        if("richtext" == this.state.format){
            if(value){
                // react不支持br，为防止其它地方有问题，这里替换成p
                var array = (value+"").split("\n");
                value = ""
                for(var i=0;i<array.length;i++){
                    value+= "<p>"+array[i]+"</p>";
                }
                value = value.replace(/\s/g,"&nbsp;");
            }
        }
        let props:any = this.getProps();
        delete props.value;
        if(this.state.icon){
            var iconProps: any = {
                key:"icon",
                type: this.state.icon,
            };
            return <span {...props}><Icon.default {...iconProps}/><span key="text" dangerouslySetInnerHTML={{__html:value}}></span></span>;
        }else
            return <span key="text" {...props} dangerouslySetInnerHTML={{__html:value}}></span>;
    }
 
    getValue() {
        return this.state.value;
    }
    
    getText() {
        return this.state.value;
    }
    
    setValue(value: string,callback?:Function) {
        this.setState({
            value
        },()=>{
            if(callback){
                callback()
            }
        });
    }
}