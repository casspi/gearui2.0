import * as Tag from "./Tag";
import * as React from 'react';
export var props = {
    props: GearType.Any,
    ...Tag.props,
};
export interface state extends Tag.state {
    props: any;
};
//普通的html节点
export default class HtmlTag<P extends typeof props, S extends (state)> extends Tag.default<P, S> {

    getInitialState():state {
        return {
            props: this.props.__ast__.attrsMap
        };
    }

    render(){
        let props = G.G$.extend({
            ref: (ele: any)=>{
                this.ref = ele;
                if(ele instanceof Node) {
                }
            },
            key: this.ast.id + "_" + this.ast.tag,
        }, this.state.props);
        delete props.focus;
        delete props.control;
        delete props.__ast__;
        // for(let key in props){
        //     if(props[key] instanceof Function){
        //         let fun = props[key];
        //         props[key] = ()=>{
        //             return fun.call(this.ref);
        //         }
        //     }
        // }
        return React.createElement(this.props.__ast__.tag, props, this.state.children);
        // return null;
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