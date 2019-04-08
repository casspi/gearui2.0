import * as Button from "./Button";
import * as React from 'react';
import * as Icon from './Icon';

export var props = {
    // 按钮或链接，link、icon、button，默认为link
    type: GearType.Enum<'link' | 'icon' | 'button'>(),
    // 动作类型，可以自己扩展，可覆盖默认的
    actionType: GearType.String,
    ...Button.props
}

export interface state extends Button.state {
    type?: string | any;
    actionType?: string;
}

export default class ClickAction<P extends typeof props, S extends state> extends Button.default<P, S> {

   

    getIconState() {
        let state = G.G$.extend({},this.state, {
            visible: this.props.visible,
            type: this.state.icon,
            style:{
                cursor:'pointer'
            }
        },true);
        return state;
    }
    getProps(){
        let state:any = G.G$.extend({}, this.state,{
            actionType: this.props.actionType,
        });
        return state;
    }
    render() {
        let state = this.getProps()
        let type = this.props.type;
        if(type && type == "link") {
            return <a style={state.style ? state.style : {}} onClick={state.onClick.bind(this)}>{this.state.text}</a>; 
        }else if(type && type == "icon") {
            let state: any = this.getIconState();
            return <Icon.default  {...state}></Icon.default>;
        }else{
            return super.render();
        }
    }

    protected clickEvent(e?: any) {
        if(this.doJudgementEvent("click",e)==false){
            return;
        }

        let actionType = this.state.actionType;
        if(!actionType) {
            G.messager.error("错误提示","未设置动作类型");
            return;
        }
        let process = G.components["clickaction"][actionType];
        if(process){
            process.call(this,this.props);
        }else{
            G.messager.error("错误提示","未定义的动作“"+actionType+"”");
        }
    }

}