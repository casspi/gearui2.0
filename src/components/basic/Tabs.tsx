/* 用于处理标签页 */
/* 对设置了样式gearui-tabs的标签页进行初始化、设置和操作 */
/* 通过使用G(".gearui-tabs").tabs()来初始化布局 */
import * as React from 'react';
import * as Tag from '../Tag';
import {Tabs as AntdTabs} from 'antd';
import {ObjectUtil,GearUtil,UUID} from '../../utils';
const props={
    ...Tag.props
}
export interface state extends Tag.state{
   children?:any
}
export default class Tabs<P extends typeof props,S extends state> extends Tag.default<P,S> {  
    getInitialState(){
        return G.G$.extend({},this.state,{
            children:this.props.children
        })
    }
    getProps(){

    }
    getTab(){
        let Tabs:any=[];
        let children:any = this.state.children;
        if(!(children instanceof Array)) {
            children = [children];
        }
        children = children.filter((o:any)=>o.key);
        console.log(children)
        if(children instanceof Array) {
            children.map((child: any, index)=>{
                let tab = child;
                if(tab && tab.type && ObjectUtil.isInstance(tab.type, "Tab")) {
                    Tabs.push(tab);
                }
            });
        }
        return Tabs;
        // let tabs: any[] = [];
        // children.map((child:any)=>{
        //     tabs.push(<AntdTab tab={child.props.props.title} key={child.key} closable={child.props.props.closable}>{child.props.children}</AntdTab>)
        // })
        // return tabs;
    }
    render(){
        let tabs = this.getTab()
        console.log(tabs[0]);
        return <AntdTabs  type="editable-card">
            {...tabs}
        </AntdTabs>
    }
}
