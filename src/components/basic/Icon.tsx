import * as ReactDOM from 'react-dom';
import { Icon as AntdIcon } from 'antd';
import * as React from 'react';
import * as Tag from '../Tag';
import { GearType } from 'src/core/GearType';
export declare type IconTheme = 'filled' | 'outlined' | 'twoTone';
export var props = {
    ...Tag.props,
    icon: GearType.String,
    spin: GearType.Boolean,
    type: GearType.String,
}

export interface state extends Tag.state {
    icon: string;
    spin?: boolean;
    type: string;
}

export default class Icon<P extends typeof props, S extends state> extends Tag.default<P, S> {
    // 点击事件
    protected clickEvent(e: any){
        let ret = this.doEvent("click", e);
        if(ret!=null && ret instanceof Array){
            for(let i=0;i<ret.length;i++){
                if(ret[0]!=null && ret[0]==false){
                    return false;
                }
            }
        }
        return true;
    }     

    //初始化控件的状态，当修改这个状态的时候会自动触发渲染
    getInitialState(): state {
        let state = this.state;
        return G.G$.extend({},state,{
            type: this.props.type || this.props.icon,
            spin: this.props.spin,
            // onClick: this.clickEvent.bind(this),
            // type: this.props.type
        });
    }    
    getProps(){
        let state = this.state;
        return G.G$.extend({},state,{
            spin: this.state.spin,
            type: this.state.type,
            onClick: this.clickEvent.bind(this),
            // style:this.state.style
        });
    }
    render() {
        let state:state = this.getProps();
        let ref = state.ref;
        delete state.ref;
        return <span ref={ref} style={{"display":"inline-block"}}><AntdIcon {...state}></AntdIcon></span>;
    }

    protected findRealDom() {
        let span: any = ReactDOM.findDOMNode(this.ref);
        return G.G$(span).find("i")[0];
        // console.log(this.ref)
        // return this.ref
    }

    hide() {
        G.G$(this.ref).hide()
       
    }

    show() {
        G.G$(this.ref).show()
        // let style: any = this.state.style||{};
        // style.display = "none";
        // this.setState({
        //     style:style
        // });
    }

    // 触发点击效果
    click(fun: Function) {
        if (fun && G.G$.isFunction(fun)) {
            this.bind("click", fun);       
        }else {
            this.clickEvent.call(this);
        }
    }

}