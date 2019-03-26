import * as Tag from "../Tag";
import * as React from 'react';
import { ObjectUtil, UUID, } from '../../utils';
export var props = {
    ...Tag.props,
    size: GearType.Number,
    onRender: GearType.VoidT<void>()
}
export interface state extends Tag.state {
    size: number,
}
export default class Repeat<P extends  typeof props, S extends state> extends Tag.default<P, S> {

  

    getInitialState() {
        let state = this.state;
        return G.G$.extend({},state,{
            size: this.props.size
        });
    }

    getProps() {
        let state = this.state;
        return G.G$.extend({},state,{
            size: this.state.size
        });
    }
    render() {
        let reactChildren:any = [];
        for(let i = 0;i < this.state.size; i++) {
            reactChildren.push(this.getChildrens(i));
        }
        return reactChildren;
    }
    private getChildrens(index:any) {
        let reactChildren: any[] = [];
        let children: any[] = this.props.children;
        if(!(children instanceof Array)) {
            children = [children];
        }
        children = children.filter(item =>item.$$typeof);
        
        if(children instanceof Array) {
            children.map((child: any, i)=>{
                let item = child;
                if(item){
                    let props: any = {
                        ...item.props,
                        key: UUID.get()
                    };
                    let callbackV:any = this.doEvent('render',item,index)!=null?this.doEvent('render',item,index):{}
                    props = G.G$.extend({},props,callbackV[0]);
                    // console.log(React.cloneElement(item, props,item.props.children))
                    reactChildren.push(React.cloneElement(item, props,item.props.children));
                }
            });
        }
        if(reactChildren.length > 1) {
            return <span key={this.props.id + "_span_" + index}>{reactChildren}</span>;
        }else {
            return reactChildren[0];
        }
    }

    setSize(size: number,callback?:Function) {
        this.setState({
            size
        },()=>{
            if(callback) {
                callback.call(this);
            }
        });
    }

    onRender(fun:Function) {
        console.log(fun)
        if (fun && G.G$.isFunction(fun)) {
            this.bind("render", fun);
        }
    }

}