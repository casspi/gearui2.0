import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Parser from '../../core/Parser';
import {ObjectUtil,GearUtil,UUID} from '../../utils';
import * as Tag from '../Tag';
import {Tabs as AntdTabs} from 'antd';
const AntdTab = AntdTabs.TabPane;
// import * as JqueryTag from '../JqueryTag';
import * as VoidTag from '../VoidTag';
const props={
    ...Tag.props,
    closable:GearType.Boolean,
}
export interface state extends Tag.state{
   children?:any,
   closable:boolean
}
export default class Tab<P extends typeof props,S extends state> extends Tag.default<P,S> {  
    // getInitialState(){
    //     console.log(this.props)
    //     return G.G$.extend({},this.state,{
    //         children:this.props.children,
    //         tab:this.props.title,
    //         closable:this.props.closable==true?true:false,

    //     })
    // }
    // getProps(){
    //     let state:any = this.state;
    //     return G.G$.extend({},state,{

    //     })
    // }
    // getChildren(){
    //     // let children:any = this.state.children;
    //     // if(!(children instanceof Array)) {
    //     //     children = [children];
    //     // }
    //     // children = children.filter((o:any)=>o.key);
    //     // console.log(children)
    //     // let tabs: any[] = [];
    //     // children.map((child:any)=>{
    //     //     tabs.push()
    //     // })
    //     // return tabs;
    // }
    render(){
        return null;
    }
}
