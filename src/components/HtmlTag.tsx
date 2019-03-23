import * as Tag from "./Tag";
import * as React from 'react';
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
                    //WindowUtil.domEventHandler(ele);
                }
            },
            key: this.ast.id + "_" + this.ast.tag,
        }, this.state.props);
        delete props.focus;
        delete props.control;
        return React.createElement(this.state.class, props, this.state.children);
    }

    is(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.is.call(jdom,...args);
    }

    show(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.show.call(jdom,...args);
    }

    hide(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.hide.call(jdom,...args);
    }

}