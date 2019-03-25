/* 用于处理标签页 */
/* 对设置了样式gearui-tabs的标签页进行初始化、设置和操作 */
/* 通过使用G(".gearui-tabs").tabs()来初始化布局 */
import * as React from 'react';
import { Http} from '../../utils';
import * as HtmlTag from '../HtmlTag';
export var props = {
    ...HtmlTag.props,
};
export interface state extends HtmlTag.state {
    class: string;
    props: any;
    selected: string;
    tabs: Array<Tab>;
};
export default class Tabs<P extends typeof props,S extends state> extends HtmlTag.default<P, S> {

    constructor(props?: P, context?: any) {
        super(props, context);
    }

    getInitialState(): state {
        let tabs = this._getTabs();
        let tabsNew = [];
        for(let i=tabs.length - 1; i>=0; i--) {
            let tab = tabs[i];
            tabsNew.push(tab);
        }
        return {
            class: this.props.class,
            props: this.props.props,
            selected: "",
            tabs: tabsNew
        };
    }

    
    render(): any { 
        let props = G.G$.extend({
            ref: (ele: any)=>{
                this.ref = ele;
                if(ele instanceof Node) {
                    //WindowUtil.domEventHandler(ele);
                }
            },
            key: this.ast.id + "_" + this.ast.tag,
        }, this.state.props);
        if(props.className) {
            props.className += " gearui-tabs";
        }else {
            props.className = "gearui-tabs";
        }
        delete props.focus;
        delete props.control;
        let headersNew = [];
        let contentsNew = [];
        let tabs = this.state.tabs;
        for(let i=0; i<tabs.length; i++) {
            let tab = tabs[i];
            headersNew.push(tab._getHeader().header);
            contentsNew.push(tab._getContent());
        }
        return <div {...props}>
            <ul className='tab-header'>{headersNew}</ul>
            <div className='tab-content'>{contentsNew}</div>
        </div>;
    }

    private _getTabs(): Tab[] {
        let children: any = this.props.children;
        if(!(children instanceof Array)) {
            children = [children];
        }
        let tabs = [];
        let haveSelected = false;
        for(let i=children.length - 1; i>=0; i--) {
            let child = children[i];
            if(child && child.props && child.props.props) {
                let props = child.props.props;
                console.log(props);
                let id = props.id || this.ast.id + "tabs" + i;
                let title = props.title || ("未设置 " + i);
                let closable = props.closable != false;
                let selected = props.selected;
                selected = (selected == true || (i == 0 && haveSelected != true));
                let loadType = props.loadType || "iframe";
                let className = props.className;
                let style = props.style;
                let url = props.url;
                if(className) {
                    className += " tab-panel";
                }else {
                    className = "tab-panel";
                }
                let display = "none";
                if(selected == true) {
                    display = "block";
                }
                if(style) {
                    style["display"] = display;
                }else {
                    style = {
                        display
                    }; 
                }
                let tab = new Tab(this, id, selected, title, closable, i, className, style, url, loadType, props, child.props.children);
                if(selected == true) {
                    haveSelected = true;
                }
                // let content = this.getContent(props, i, haveSelected);
                // tab.content = content;
                tabs.push(tab);
            }
            
        }
        return tabs;
    }

    // private getContent(props: any, index: number, haveSelected: boolean) {
    //     let id = props.id || this.id + "tabs" + index;
    //     let className = props.className;
    //     let selected = props.selected;
    //     let style = props.style;
    //     let url = props.url;
    //     let loadType = props.loadType || "iframe";
    //     if(className) {
    //         className += " tab-panel";
    //     }else {
    //         className += "tab-panel";
    //     }
    //     let display = "none";
    //     if(selected == true || (index == 0 && haveSelected != true) || (this.state.selected == id)) {
    //         display = "block";
    //     }
    //     if(style) {
    //         style["display"] = display;
    //     }else {
    //        style = {
    //             display
    //        }; 
    //     }
    //     let propsNew = G.G$.extend({
    //         id,
    //         className,
    //         style
    //     }, props);
    //     delete propsNew.title;
    //     delete propsNew.closable;
    //     delete propsNew.selected;
    //     delete propsNew.url;
    //     delete propsNew.loadType;
    //     let children = [props.children];
    //     if(url){
    //         if(loadType == "iframe"){
    //         children = [<iframe src={url} frameBorder='0' style={{
    //                     width:'100%',
    //                     height:'100%'
    //                 }
    //             }></iframe>];
    //         }else{
    //             // 使用ajax-load
    //             let fn = async ()=> {
    //                 let result = await Http.ajax("get", url);
    //                 if(result.success) {
    //                     let data = result.data;
    //                     let r = G.$(data, undefined, true);
    //                     children = [r.result];
    //                 }
    //             };
    //             fn();
    //         }
    //     }else if(props.content){
    //         let r = G.$(props.content, undefined, true);
    //         children = [r.result];
    //     }

    //     let content = <div {...propsNew}>{children}</div>;
    //     return content;
    // }

    // private getHeader(props: any, index: number, haveSelected: boolean, tab: Tab): {header?: any, selected: boolean} {
    //     var id = props.id || this.id + "tabs" + index;
    //     var title = props.title || ("未设置 " + index);
    //     var closable = props.closable;
    //     let selected = props.selected;
    //     let header =  <li ref={e=>{
    //         if(e) {
    //             tab.jTabDom = G.G$(e);
    //         }
    //     }} onClick={()=>{
    //             this.select(id);
    //         }} className={(selected == true || (index == 0 && haveSelected != true) || (this.state.selected == id)) ? "selected" : undefined}>
    //         <span>
    //             <a className='title-content' href='javascript:void(0);'>{title}</a>
    //             {
    //                 closable == true ? <a onClick={()=>{
    //                     this.removeTab(id);
    //                 }} className='anticon anticon-default anticon-close close-btn'></a> : null
    //             }
    //         </span>
    //     </li>;
    //     tab.key = id;
    //     return {
    //         header,
    //         selected
    //     };
    // }

    afterRender() {
        // this.initlizate();
        this.resizeTab();
    }

    /* 调整尺寸 */
    private resizeTab() {
        let _real = G.G$(this.realDom);
        var header: any = _real.find(".tab-header");
        var content = _real.find(".tab-content");
        content.css("top",header.height()+1);
    }
    
    /* 获得指定id或序号的Tab */
    getTab(id: any) {
        let tabs = this.state.tabs;
        for(let i=0; i< tabs.length; i++) {
            if(tabs[i] && tabs[i].key == id) {
                return tabs[i];
            }
        }
        return null;
    }
  
    /* 得到所有标签页 */
    getTabs() {
        return this.state.tabs;
    }
    /* 得到当前选中的标签 */
    getSelectedTab(){
        let tabs = this.state.tabs;
        for(let i=0; i< tabs.length; i++) {
            if(tabs[i] && tabs[i].selected == true) {
                return tabs[i];
            }
        }
        return null;
    }
    /* 设置Tab标题 */
    setTitle(id: any,title: any){
        let tabs = this.getTabs();
        var tab = this.getTab(id);
        if(tab){
            tab.setTitle(title);
        }
        this.setState({
            tabs
        });
    }

    /* 选中指定ID或序号的Tab */
    select(id: any) {
        let tabs = this.getTabs();
        var tab = this.getTab(id);
        if(this.state.selected != id && tab){
            if(this.doEvent("beforeSelect", tab)) {
                this.doEvent("select", tab);
                for(let i= 0; i < tabs.length; i++) {
                    if(tabs[i].key == tab.key) {
                        tabs[i].selected = true;
                    }else {
                        tabs[i].selected = false;
                    }
                }
                this.setState({
                    tabs: tabs
                },() => {
                    this.doEvent("afterSelect", tab);
                });
            }
        }
    }
    /* 添加一个Tab */
    addTab(param: any){
        let tabs = this.state.tabs || [];
        // 参数修正
        let id = param.id || this.ast.id + "tabs" + tabs.length;
        let title = param.title || "未设置";
        let tab = new Tab(this, id, param.selected, title, param.closable, tabs.length, param.className, param.style, param.url, param.loadType, param, null);
        // 如果新添加的设置为默认选中，则设置为选中
        if(param.selected == true && tab) {
            for(let i= 0; i < tabs.length; i++) {
                tabs[i].selected = false;
            }
        }
        tabs.push(tab);
        this.setState({
            tabs
        });
        // 调整尺寸
        this.resizeTab();          
    }
    /* 删除一个Tab */
    removeTab(id: any) {
        let tabs = this.state.tabs || [];
        var tab = this.getTab(id);
        if(tab){
            let result = this.doEvent("beforeRemove",tab);
            if(result && result[0] != false){
                // modify by hechao 2018-06-20 将删除操作的实现转到tabs中
                //tab.remove();
                tabs.splice(tabs.indexOf(tab), 1);
                if(tab.selected == true) {
                    if(tabs[tabs.indexOf(tab) + 1]) {
                        tabs[tabs.indexOf(tab) + 1].selected = true;
                    }else {
                        tabs[0].selected = true;
                    }
                }
                this.doEvent("remove",tab);
                this.setState({
                    tabs
                },() => {
                    this.resizeTab();
                    this.doEvent("afterRemove",tab);
                
                });
            }
        }
    }  
}



// 标签页
class Tab {
    // 当前Tab所属的Tabs对象
    private tabs: Tabs<any,state>;
    // 当前Tab的JQuery对象
    jTabDom: any;
    // 当前Tab的唯一Key
    key: any;
    // header: any;
    // 当前Tab内容的JQuery对象
    // content: any;
    selected: boolean;
    title: string;
    closable: boolean;
    index: number;
    className: string;
    style: React.CSSProperties;
    url: string;
    loadType: string;
    props: any;
    content: any;
    children: any;

    constructor(tabs: any, key: string, selected: boolean, title: string, closable: boolean, 
        index: number, className: string, style: React.CSSProperties, url: string, loadType: string, props: any, children: any){
        this.tabs = tabs;
        this.key = key;
        this.selected = selected;
        this.title = title;
        this.closable = closable;
        this.index = index;
        this.className = className;
        this.style = style;
        this.loadType = loadType;
        this.props = props;
        this.children = children;
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
    setTitle(title: any) {
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
        return G.G$(this.content);
    }
    getHeader() {
        return this.jTabDom;
    } 
    /* 当前是否被选中 */
    isSelected() {
        return this.jTabDom.hasClass("selected");
    }

    _getHeader(): {header?: any, selected: boolean} {
        var id = this.key;
        var title = this.title || ("未设置 " + this.index);
        var closable = this.closable;
        let selected = this.selected;
        let header =  <li key={id} ref={e=>{
            if(e) {
                this.jTabDom = G.G$(e);
            }
        }} onClick={()=>{
                this.tabs.select(id);
            }} className={(this.selected == true) ? "selected" : undefined}>
            <span>
                <a className='title-content' href='javascript:void(0);'>{title}</a>
                {
                    closable == true ? <a onClick={()=>{
                        this.tabs.removeTab(id);
                    }} className='anticon anticon-default anticon-close close-btn'></a> : null
                }
            </span>
        </li>;
        return {
            header,
            selected
        };
    }

    _getContent() {
        let id = this.key;
        let className = this.className;
        let style = this.style;
        let url = this.url;
        
        let propsNew = G.G$.extend({
            id,
            className,
            style,
            key: id,
            ref: (e: any) => {
                this.content = e;
            }
        }, this.props);
        delete propsNew.title;
        delete propsNew.closable;
        delete propsNew.selected;
        delete propsNew.url;
        delete propsNew.loadType;
        let children = [];
        if(url){
            if(this.loadType == "iframe"){
            children = [<iframe src={url} frameBorder='0' style={{
                        width:'100%',
                        height:'100%'
                    }
                }></iframe>];
            }else{
                // 使用ajax-load
                let fn = async ()=> {
                    let result = await Http.ajax("get", url);
                    if(result.success) {
                        let data = result.data;
                        let r = G.$(data, undefined, true);
                        children = [r.result];
                    }
                };
                fn();
            }
        }else if(this.children){
            let r = this.children;
            children = [r];
        }

        let content = <div {...propsNew}>{children}</div>;
        return content;
    }
}