/* 用于处理标签页 */
/* 对设置了样式gearui-tabs的标签页进行初始化、设置和操作 */
/* 通过使用G(".gearui-tabs").tabs()来初始化布局 */
import * as ReactDOM from 'react-dom';
import Parser from '../../core/Parser';
import {ObjectUtil,GearUtil,UUID} from '../../utils';
import * as Tag from '../Tag';
// import * as JqueryTag from '../JqueryTag';
import * as VoidTag from '../VoidTag';

export default class Tabs<P,S> extends Tag.default<P,S> {   

    render() { 
        return null;
    }
    afterRender(){
        this.initlizate();
        this.resizeTab();
    }
    private initlizate() {
        this.doRender()
        console.log(this.ref)
        let _this = this;
        let _real = G.G$(this.realDom);    
        if(!_real.data("initialized")){
            // 添加样式
            _real.addClass("gearui-tabs");
            // 定义content区块，将当前区块内容放在其中
            var content = G.G$("<div class='tab-content'></div>");
            content.append(_real.children());
            // 添加tab-header
            var header = G.G$("<ul class='tab-header'></ul>");
            _real.append(header);
            _real.append(content);
            
            // 设置的默认选中
            var defaultSelectedTab:any = null;
            // 根据content中的内容，在header中添加tab的标题栏
            content.children().each(function(index){
                var jdom = G.G$(this);
                // 隐藏它
                // jdom.hide();
                // 获取id，如果没有id则自动生成一个
                var id = jdom.attr("id");
                if(!id){
                    id = UUID.get();
                    jdom.attr("id",id);
                }
                jdom.addClass("tab-panel");
                // console.log("width:"+jdom.css("width"));
                // console.log("height:"+jdom.css("height"));
                // if(!jdom.css("width") || jdom.css("width")==""){
                    
                //     jdom.css("width","100%");
                // }
                // if(!jdom.css("height") || jdom.css("height")==""){
                //     jdom.css("height","100%");
                // }
                //jdom.css("width","100%");
                //jdom.css("height","100%");
                // console.log(jdom);

                // 从div上获取默认的设置，标题、是否可以关闭、是否默认选中
                var title = this.getAttribute("title") || ("未设置 " + index);
                var closable = ObjectUtil.isTrue(this.getAttribute("closable") || "false");
                var selected = ObjectUtil.isTrue(this.getAttribute("selected") || "false");
                var url = this.getAttribute("url");
                var loadType = this.getAttribute("loadType");
                //var width = this.getAttribute("width") || this.style.width || "100%";
                //var height = this.getAttribute("height") || this.style.height;
                // 移除这些属性
                this.removeAttribute("title");
                this.removeAttribute("closable");
                this.removeAttribute("selected");
                this.removeAttribute("url");
                this.removeAttribute("loadType");
                //this.removeAttribute("width");
                //this.removeAttribute("height");
                // 添加标签页
                var tabHeader = _this.addTabHeader({
                    id : id,
                    title : title,
                    closable : closable,
                    selected : selected
                });
                // 初始化content
                _this.loadContent(jdom,{
                    url : url,
                    loadType : loadType
                });

                if(selected==true && !defaultSelectedTab){
                    defaultSelectedTab = tabHeader;
                }
            });
            // 设置默认选中
            this.setDefaultSelectedTab(defaultSelectedTab);
            // 标识标签页已经初始化完成
            _real.data("initialized",true);
            // 对内容进行渲染
            let parser = new Parser();
            parser.parse(content[0]);
            // 注册onresize事件
            //G.G$(window).resize(this.resizeTab.bind(this));
        }
    }

    /* 调整尺寸 */
    private resizeTab() {
        let _real = G.G$(this.realDom);
        var header = _real.find(".tab-header");
        var content = _real.find(".tab-content");
        content.css("top",header.height()+1);
    }
    /* 添加一个标签页 */
    private addTabHeader(param:any) {
        let _this = this;
        let _real = G.G$(this.realDom);
        var id = param.id || UUID.get();
        var title = param.title;
        var closable = param.closable;
        var selected = param.selected;
        var header = _real.find(".tab-header");
                // 根据div上的属性定义，生成tab页的title
        var html =  "<li tab-key='" + id + "'>" + 
                        "<span>" + 
                            "<a class='title-content' href='javascript:;'>" + title + "</a>" + 
                            (closable==true?"<a class='anticon anticon-default anticon-close close-btn'></a>":"") + 
                        "</span>" + 
                    "</li>";
        var tabHeader = G.G$(html);
        header.append(tabHeader);
        // 为tab注册点击事件
        tabHeader.click(function(event:any){
            var key = this.attr("tab-key");
            // modify by hechao 2018-06-20 改为调用select方法来选中
            //this.parent().find("li").removeClass("selected");
            //this.addClass("selected");
            //this.parent().next(".tab-content").children().hide();
            //this.parent().next(".tab-content").find("#"+key).show();      
            _this.select(key);      
        }.bind(tabHeader));
        if(closable==true){
            // 为close-btn注册点击事件
            tabHeader.find(".close-btn").click(function(event:any){
                var key = this.attr("tab-key");
                // modify by hechao 2018-06-20 改为调用remove方法来删除
                //this.parent().next(".tab-content").find("#"+key).remove();
                //this.remove();
                //_this.resizeTab();
                // 设置默认选中
                //_this.setDefaultSelectedTab(); 
                _this.removeTab(key);
            }.bind(tabHeader));
        }
        return tabHeader;
    }

    /* 设置默认选中的标签页 */
    private setDefaultSelectedTab(defaultSelectedTab?:any) {
        let _real = G.G$(this.realDom);
        var header = _real.find(".tab-header");
        var content = _real.find(".tab-content");
        if(defaultSelectedTab){
            header.find("li").removeClass("selected");
            content.children().hide();                
            // 如果有设置默认选中的标签ID
            defaultSelectedTab.addClass("selected");
        } else {
            // 如果当前没有设置并且没有默认选中的标签页
            if(header.find("li.selected").length==0){
                content.children().hide();
                defaultSelectedTab = header.find("li:first");
                if(defaultSelectedTab.length>0) {
                    defaultSelectedId = header.find("li:first").attr("id");
                    header.find("li:first").addClass("selected");
                } else {
                    defaultSelectedTab = null;
                }
            }
        }
        if(defaultSelectedTab){
            var defaultSelectedId = defaultSelectedTab.attr("tab-key");
            content.find("#"+defaultSelectedId).show();
        }
    }
            
    /* 装载内容 */
    private loadContent(content:any,param:any){
        var url = param.url;
        var loadType = param.loadType || "iframe";
        if(url){
            if(loadType=="iframe"){
                content.empty();
                content.append("<iframe src='"+url+"' frameBorder='0' style='width:100%;height:100%;'></iframe>");
            }else{
                // 使用ajax-load
                content.load(url);
            }
        }else if(param.content){
            content.html(param.content);
        }
    }
    
    /* 获得指定id或序号的Tab */
    getTab(id:any) {
        let _real = G.G$(this.realDom);
        var jdom;
        if(typeof id == "number")
            jdom = _real.find(".tab-header").find("li:eq("+id+")");
        else
            jdom = _real.find(".tab-header").find("li[tab-key='" + id + "']");

        if(jdom.length>0)
            return new Tab(this,jdom);
        else
            return null;
    }
  
    /* 得到所有标签页 */
    getTabs() {
        let _this = this;
        let _real = G.G$(this.realDom);
        var tabs:any = [];
        _real.find(".tab-header > li").each(function(){
            var jdom = $(this);
            tabs.push(new Tab(this,jdom));
        });
        return tabs;
    }
    /* 得到当前选中的标签 */
    getSelectedTab(){
        let _this = this;
        let _real = G.G$(this.realDom);
        let jdom = _real.find(".tab-header > li.selected");
        if(jdom.length>0)
            return new Tab(this,jdom);
        else
            return null;
    }
    /* 设置Tab标题 */
    setTitle(id:any,title:any){
        var tab = this.getTab(id);
        if(tab){
            tab.setTitle(title);
        }
    }
    /* 选中指定ID或序号的Tab */
    select(id:any) {
        var tab = this.getTab(id);
        if(tab && tab.isSelected()==false){
            if(this.triggerHandler("beforeSelect",tab)!=false){
                this.triggerHandler("select",tab);
                this.setDefaultSelectedTab(tab.getHeader());
                this.triggerHandler("afterSelect",tab);
            }
        }
    }
    /* 添加一个Tab */
    addTab(param:any){
        let _real = G.G$(this.realDom);
        // 参数修正
        param.id = param.id || UUID.get();
        param.title = param.title || "未设置";
        // 添加标签头
        var tabHeader = this.addTabHeader(param);
        // 添加内容
        var tabContent = $("<div class='tab-panel'></div>");
        _real.find(".tab-content").append(tabContent);   
        tabContent.attr("id",param.id);
        // 如果未设置样式，则新定义一个，并且高宽未设置时默认为100%
        if(!param.style)
            param.style = {};
        for ( var name in param.style) {
            var value = param.style[name];
            tabContent.css(name,value);
        }
        // 装载正文内容
        this.loadContent(tabContent,param);
        // 如果新添加的设置为默认选中，则设置为选中
        if(param.selected == true)
            this.setDefaultSelectedTab(tabHeader); 
        else
            tabContent.hide();
        // 调整尺寸
        this.resizeTab();          
    }
    /* 删除一个Tab */
    removeTab(id:any) {
        var tab = this.getTab(id);
        if(tab){
            // modify by hechao 2018-06-20 将删除操作的实现转到tabs中
            //tab.remove();

            if(this.triggerHandler("beforeRemove",tab)!=false){
                this.triggerHandler("remove",tab);
                tab.getHeader().remove();
                tab.getContent().remove();
                this.setDefaultSelectedTab(); 
                // 调整尺寸
                this.resizeTab();
                this.triggerHandler("afterRemove",tab);
            }            
        }
    }  
    /* 在选中某标签页前触发的事件，如果事件返回false，则阻止选中 */
    onBeforeSelect(fun:any) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("beforeSelect",(event:any,args:any)=>{
                if(fun.call(this,...args)==false){
                    return false;
                }
            });
        }
    }     
    /* 当选中某标签页时触发的事件 */
    onSelect(fun:any) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("select",(event:any,args:any)=>{
                fun.call(this,...args);
            });
        }
    }
    /* 在选中某标签页后触发的事件 */
    onAfterSelect(fun:any) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("afterSelect",(event:any,args:any)=>{
                fun.call(this,...args);
            });
        }
    }     
    /* 在移除某标签页前触发的事件，如果事件返回false，则阻止移除 */
    onBeforeRemove(fun:any) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("beforeRemove",(event:any,args:any)=>{
                if(fun.call(this,...args)==false){
                    return false;
                }
            });
        }
    }    
    /* 当移除某标签页时触发的事件 */
    onRemove(fun:any) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("remove",(event:any,args:any)=>{
                fun.call(this,...args);
            });
        }
    }
    /* 在移除某标签页后触发的事件 */
    onAfterRemove(fun:any) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("afterRemove",(event:any,args:any)=>{
                fun.call(this,...args);
            });
        }
    }     
}

// 标签页
class Tab {
    // 当前Tab所属的Tabs对象
    private tabs:any;
    // 当前Tabs的JQuery对象
    private jTabsDom:any;
    // 当前Tab的JQuery对象
    private jTabDom:any;
    // 当前Tab的唯一Key
    private key:any;
    // 当前Tab内容的JQuery对象
    private content:any;

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