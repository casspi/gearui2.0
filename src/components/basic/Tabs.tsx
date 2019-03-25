/* 用于处理标签页 */
/* 对设置了样式gearui-tabs的标签页进行初始化、设置和操作 */
/* 通过使用G(".gearui-tabs").tabs()来初始化布局 */
import * as React from 'react';
import * as Tag from '../Tag';
import {Tabs as AntdTabs} from 'antd';
import {ObjectUtil,GearUtil,UUID} from '../../utils';
const AntdTab = AntdTabs.TabPane;
const props={
    ...Tag.props,
    activeKey:GearType.String
}
export interface state extends Tag.state{
   children?:any[],
   activeKey?:string
}
export default class Tabs<P extends typeof props,S extends state> extends Tag.default<P,S> {  
    getInitialState(){
        return G.G$.extend({},this.state,{
            children:this.props.children,
            activeKey:null
        })
    }
    getProps(){
        return G.G$.extend({},this.state,{
            activeKey:this.state.activeKey
        })
    }
    getTab(){
        let tabs:any=[];
        let children:any = this.state.children;
        if(!(children instanceof Array)) {
            children = [children];
        }
        children = children.filter((o:any)=>o.type && o.type.name=='Tab');
        children.map((child:any,index:number)=>{
            tabs.push(this.renderTab(child,index))
        })
        return tabs;
    }
    initSelect(){//初始化默认选中项
        let children:any = this.state.children;
        let activeKey:any;
        if(!(children instanceof Array)) {
            children = [children];
        }
        children = children.filter((o:any)=>o.type&&o.type.name=='Tab');
        for(let i=0;i<children.length;i++){
            console.log(children[i].props.selected)
            if(children[i].props.selected==true){
                activeKey = children[i].key;
            }
        }
        console.log(activeKey)
        return this.setState({
            activeKey:activeKey
        })
            
    }
    selectTab(){

    }
    renderTab(child:any,index:number){
        let props = child.props;
        let tabProps={
            tab: props.title,
            closable: props.closable==true?true:false,
            key:child.key,
            onClick:()=>{
                this.select(child.key)
            }
        }
        var loadType = props.loadType || "iframe";
        console.log(tabProps.key)
        if(props.url){
            if(loadType=="iframe"){
                return <AntdTab  {...tabProps}>{<iframe src={props.url} frameBorder={0} style={{width:"100%",height:"100%"}}></iframe>}</AntdTab>;
            }else{
                // // 使用ajax-load
                // content.load(url);
                return <AntdTab {...tabProps}>{props.children}</AntdTab>;
            }
        }else{
            return <AntdTab {...tabProps}>{props.children}</AntdTab>;
        }
    }
    render(){
        let tabs = this.getTab();
        let props:any = this.getProps();
        delete props.children
        // console.log(tabs)
        return <AntdTabs {...props} type="editable-card">
            {tabs}
        </AntdTabs>
    }
    afterRender(){
        this.initSelect()
    }
    /* 选中指定ID或序号的Tab */
    select(key:any){
        console.log(key)
        this.setState({
            activeKey:key
        })
    }
}

// 标签页
class Tab1 {
    // 当前Tab所属的Tabs对象
    private tabs:any;
    // 当前Tabs的JQuery对象
    private jTabsDom:any;
    // 当前Tab的JQuery对象
    private jTabDom:any;
    // 当前Tab的唯一Key
    private key;
    // 当前Tab内容的JQuery对象
    private content;

    constructor(tabs:any,jdom:any){
        this.tabs = tabs;
        this.jTabsDom = G.G$(tabs.realDom);
        this.jTabDom = jdom;
        this.key = jdom.attr("tab-key");
        this.content = this.jTabsDom.find(".tab-content").find("#"+this.key);
    }

    /* 得到id */
    getId() {
        return this.key;
    }
    /* 得到标题 */
    getTitle() {
        return this.jTabDom.find(".title-content").text();
    }
    /* 设置标题 */
    setTitle(title:any) {
        this.jTabDom.find(".title-content").html(title);
    }
    /* 选中 */
    select() {
        this.tabs.select(this.key);
    }
    /* 移除 */
    remove() {
        //this.jTabDom.remove();
        //this.content.remove();
        //this.tabs.setDefaultSelectedTab(); 
        // 调整尺寸
        //this.tabs.resizeTab();    
        // modify by hechao 2018-06-20 将删除操作的实现转至tabs中，这里调用  
        this.tabs.removeTab(this.key);                   
    }
    /* 得到正文的JQuery对象 */
    getContent() {
        return this.content;
    }
    getHeader() {
        return this.jTabDom;
    } 
    /* 当前是否被选中 */
    isSelected() {
        return this.jTabDom.hasClass("selected");
    }
}