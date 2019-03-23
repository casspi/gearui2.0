import * as Tag from "./Tag";
import * as React from 'react';
import { WindowUtil } from '../utils';
export var props = {
    class: GearType.String,
    props: GearType.Any,
    ...Tag.props,
};
export interface state extends Tag.state {
    class: string;
    props: any;
};
//普通的html节点
export default class HtmlTag<P extends typeof props, S extends (state)> extends Tag.default<P, S> {

    getInitialState():state {
        return {
            class: this.props.class,
            props: this.props.props
        };
    }

    render(){
        let props = G.G$.extend({
            ref: (ele: any)=>{
                this.ref = ele;
                if(ele instanceof Node) {
                    WindowUtil.domEventHandler(ele);
                }
            },
            key: this.ast.id + "_" + this.ast.tag,
        }, this.state.props);
        return React.createElement(this.state.class, props, this.state.children);
    }

}