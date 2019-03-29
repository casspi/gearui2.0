import * as HtmlTag from '../HtmlTag';
import * as React from 'react';
export var props = {
    ...HtmlTag.props,
};
export interface state extends HtmlTag.state {
    props: any;
};
export default class Layout<P extends typeof props, S extends state> extends HtmlTag.default<P, S> {

    getInitialState() : state {
        return {
            props: this.props.__ast__.attrsMap
        };
    }

    // render() {
    //     let childrens = this.getChildren();
    //     return <AntdLayout {...this.state}>{...childrens}</AntdLayout>;
    // }

    // private getChildren(children?: any, key?: string) {
    //     key = key || "";
    //     children = children || this.props.children || [];
    //     if(!(children instanceof Array)) {
    //         children = [children];
    //     }
    //     let childrenNew: any[] = [];
    //     if(children instanceof Array) {
    //         children.map((child: any, index) => {
    //             if(child && child.props) {
    //                 if(ObjectUtil.isExtends(child.type, "Center")) {
    //                     let props = {
    //                         className:child.props.className,
    //                         style:child.props.style
    //                     }
    //                     childrenNew.push(<AntdContent key={"Center_" + index} {...props}>{this.getChildren(child.props.children, "Center_" + index)}</AntdContent>);
    //                 }
    //                 if(ObjectUtil.isExtends(child.type, "Layout")) {
    //                     let props = {
    //                         className:child.props.className,
    //                         style:child.props.style,
    //                         hasSider:child.props.hasSider
    //                     }
    //                     childrenNew.push(<AntdLayout key={"Layout_" + index} {...props}>{this.getChildren(child.props.children, "Layout_" + index)}</AntdLayout>);
    //                 }
    //                 if(ObjectUtil.isExtends(child.type, "Footer")) {
    //                     let props = {
    //                         className:child.props.className,
    //                         style:child.props.style
    //                     }
    //                     childrenNew.push(<AntdFooter key={"Footer_" + index} {...props}>{this.getChildren(child.props.children, "Footer_" + index)}</AntdFooter>);
    //                 }
    //                 if(ObjectUtil.isExtends(child.type, "Header")) {
    //                     console.log(child.props)
    //                     let props = {
    //                         className:child.props.className,
    //                         style:child.props.style
    //                     }
    //                     childrenNew.push(<AntdHeader key={"Header_" + index} {...props}>{this.getChildren(child.props.children, "Header_" + index)}</AntdHeader>);
    //                 }
    //                 if(ObjectUtil.isExtends(child.type, "Sider")) {
    //                     let props = {
    //                         className:child.props.className,
    //                         style:child.props.style,
    //                         theme:child.props.theme,
    //                         breakpoint:child.props.breakpoint,
    //                     }
    //                     childrenNew.push(<AntdSider key={"Sider_" + index} {...props}>{this.getChildren(child.props.children, "Sider_" + index)}</AntdSider>);
    //                 }
    //             }else {
    //                 childrenNew.push(child);
    //             }
    //         });
    //     }
    //     return childrenNew;
    // }
    render(): any {
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
        return React.createElement("div", props, this.state.children);
    }

    afterRender() {
        this.initlizate();
        this.layout();
    }

    // 初始化
    private initlizate(){
        let _real = G.G$(this.realDom);
        let realDom = this.realDom;      
        if(!_real.hasClass("gearui-layout")) 
            _real.addClass("gearui-layout");
        realDom["style"].boxSizing = 'border-box';
        realDom["style"].overflow = 'hidden';
        var i = 0;
        var children = realDom.children;
        while (i < children.length) {
            var child = children[i++];
            var split;
            if(child.getAttribute("split") && child.getAttribute("split")=="true"){
                split = true;
            }else{
                split = false;
            }
            var border;
            if(child.getAttribute("border") && child.getAttribute("border")=="true"){
                border = true;
            }else{
                border = false;
            }            
            var data = {
                "region":child.getAttribute("region"),
                "title":child.getAttribute("title"),
                "split":split,
                "border":border,
                "overflow":child.getAttribute("overflow"),
                "height":child.getAttribute("height"),
                "min-height":child.getAttribute("min-height"),
                "max-height":child.getAttribute("max-height"),
                "width":child.getAttribute("width"),
                "min-width":child.getAttribute("min-width"),
                "max-width":child.getAttribute("max-width")
            }
            child.removeAttribute("region");
            child.removeAttribute("title");
            child.removeAttribute("border");
            child.removeAttribute("overflow");
            child.removeAttribute("split");
            child.removeAttribute("width");
            child.removeAttribute("min-width");
            child.removeAttribute("max-width");
            child.removeAttribute("height");
            child.removeAttribute("min-height");
            child.removeAttribute("max-height");
            var region = data["region"];
            if (!region) {
                continue;
            }
            child["_data"] = data;
            G.G$(child).data("options",data);
            var jchild = G.G$(child);
            var simpleBody = false;
            if(jchild.children().length==1 && jchild.children().attr("ctype")=="layout"){
                simpleBody = true;
            }
            if (/center/i.test(region)) {
                this.initRegion(jchild,data,simpleBody);
                continue;
            }
            if (/north/i.test(region)) {
                this.initRegion(jchild,data,simpleBody);
                continue;
            }
            if (/south/i.test(region)) {
                this.initRegion(jchild,data,simpleBody);
                continue;
            }
            if (/east/i.test(region)) {
                this.initRegion(jchild,data,simpleBody);
                continue;
            }
            if (/west/i.test(region)) {
                this.initRegion(jchild,data,simpleBody);
            }
        }
        // 注册onresize事件
        // 全部改成相对定位了，所以不需要再注册resize事件了
        // G.G$(window).resize(this.layout.bind(this));        
    }

    // 布局
    layout() {
        let _this = this;
        let _real = G.G$(this.realDom);
        let realDom = this.realDom;    
        var width = realDom.clientWidth;
        var height = realDom.clientHeight;                
        var widthRest = width, heightRest = height, top = 0, left = 0, right = 0, bottom = 0,temp, temp2;

        var west = this.getValidRegionDom("west");
        var east = this.getValidRegionDom("east");
        var north = this.getValidRegionDom("north");
        var south = this.getValidRegionDom("south");
        var center = this.getValidRegionDom("center");
        function setWestAndEast() {
            if (west) {
                temp = west["_data"]["width"] || (G.G$(west).data("base-width") + 5);
                if (temp) {
                    temp = _this.calculateLength(temp, width,
                            west["_data"]['min-width'],
                            west["_data"]['max-width']);
                    left = temp;
                    temp2 = parseInt(west["_data"].left) || 0;
                    if (temp2) {
                        widthRest -= temp2;
                        left += temp2;
                    }
                    widthRest -= temp;
                    _this.setBounds(west, {
                        top : top,
                        left : temp2,
                        width : temp,
                        bottom : bottom
                        //height : heightRest
                    });
                }
            }
            if (east) {
                temp = east["_data"]["width"] || (G.G$(east).data("base-width") + 5);
                if (temp) {
                    temp = _this.calculateLength(temp, width,
                            east["_data"]['min-width'],
                            east["_data"]['max-width']);
                    right = temp;
                    temp2 = parseInt(east["_data"].right) || 0;
                    if (temp2) {
                        widthRest -= temp2;
                    }
                    widthRest -= temp;
                    _this.setBounds(east, {
                        top : top,
                        right : temp2,
                        width : temp,
                        bottom : bottom
                        //height : heightRest
                    });
                }
            }
        }
        function setNorthAndSouth() {
            if (north) {
                //console.log(north._data.height+"\t"+north.clientHeight+"\t"+$(north).data("base-height"));
                temp = north["_data"]["height"] || (G.G$(north).data("base-height") + 5);
                if (temp) {
                    temp = _this.calculateLength(temp, height,
                            north["_data"]['min-height'],
                            north["_data"]['max-height']);
                    heightRest -= temp;
                    top = temp;
                    _this.setBounds(north, {
                        top : 0,
                        left : left,
                        right : 0,
                        //width : widthRest,
                        height : temp
                    });
                }
            }
            if (south) {
                temp = south["_data"]["height"] || (G.G$(south).data("base-height") + 5);
                if (temp) {
                    temp = _this.calculateLength(temp, height,
                            south["_data"]['min-height'],
                            south["_data"]['max-height']);
                    heightRest -= temp;
                    bottom = temp;
                    _this.setBounds(south, {
                        bottom : 0,
                        left : left,
                        right : 0,
                        height : temp,
                        //width : widthRest
                    });
                }
            }
        }
        setNorthAndSouth();
        setWestAndEast();
        if (center) {
            _this.setBounds(center, {
                top : top,
                left : left,
                right : right,
                bottom : bottom
                //width : widthRest,
                //height : heightRest
            });
        }
        _real.find(".layout-panel-north,.layout-panel-west,.layout-panel-east,.layout-panel-center,.layout-panel-south").each(function(){
            
            // Parser.parse(this);
        });
    }

    // 第一次layout()时，根据需要对区块内容进行初始化，添加一些必要的布局
    private initRegion(jdom: any,options: any,simple?: any){
        if(!jdom.data("initialized")){
            jdom.data("base-width",jdom[0].clientWidth);
            jdom.data("base-height",jdom[0].clientHeight);
            jdom.css("overflow",'hidden');
            // 先将当前dom中的内容移到其它位置
            
            var temp = G.G$("<div style='display:none'></div>");
            G.G$(document.body).append(temp);
            if(jdom.children().length<=0){
                temp.append(jdom.text());   
                jdom.empty();  
            }else{
                temp.append(jdom.children());     
            }
            var region = options.region;
            var title = options.title;
            var overflow = options.overflow;
            var border = options.border;
            
            var hideScrollClassName = "";
            if(overflow=="hidden"){
                hideScrollClassName = " hideScroll";
            }
            
            var borderClassName = "";
            if(border==false || border=="false"){
                borderClassName = " noborder";
            }
            var bodyClassName;
            var html = 			"<div class=\"layout-panel layout-border hideScroll\">";

            var noTitleClassName = "";
            var titleStyle = "";
            if(!title){
                noTitleClassName = " notitle";
                titleStyle = " style=\"display:none\"";
            }
            var buttonClassName;
            if(region=="north"){
                buttonClassName = " panel-button-up";
            }else if(region=="west"){
                buttonClassName = " panel-button-left";
            }else if(region=="east"){
                buttonClassName = " panel-button-right";
            }else if(region=="south"){
                buttonClassName = " panel-button-down";
            }else if(region=="center"){
                buttonClassName = " hidden";
            }
            var compactClassName = "";
            if(simple && simple==true && (border==false || border=="false")){
                compactClassName = " compact";
            }
            html = html + 	"	<div class=\"layout-panel-title hideScroll"+borderClassName+"\""+titleStyle+">" +
                            "		<div class=\"title-content hideScroll\">"+(title || "")+"</div><div class=\"panel-control\"><a href=\"javascript:;\" class=\""+buttonClassName+"\"></a></div>" +
                            "	</div>";
            bodyClassName = "layout-panel-body hideScroll" + noTitleClassName + borderClassName + compactClassName;

            html = html +		"	<div class=\""+bodyClassName+"\">" +
                                "		<div class=\"body-content"+hideScrollClassName+"\"></div>" +
                                "	</div>" +
                                "</div>";  							
            jdom.append(html);
            jdom.find(".layout-panel-title a").click(function(event: any){
                this.getRegion(region).toggle();
            }.bind(this));
            jdom.find(".body-content").append(temp.children().length==0?temp.text():temp.children());          
            jdom.addClass("layout-panel-"+region);
            temp.remove();
            jdom.data("initialized",true);
            // 默认是展开的
            jdom.data("_toggle","expanded");
        }
    }  

    // 是否数字
    private isNumber(n: any) {
        return n instanceof Number || (typeof n == "number");
    }
    // 调整区块大小
    private setBounds(element: any, bounds: any) {
        element.style.position = 'absolute';
        element.style.boxSizing = 'border-box';
        for ( var name in bounds) {
            var v = bounds[name];
            if (this.isNumber(v)) {
                v = parseInt(v) + 'px';
            }
            element.style[name] = v;
        }
        G.G$(element).trigger('size.change');
    }
    // 将宽度或高度的设置转换为象素值
    private toNumber(sNumber: any, sum: any) {
        if (sNumber[sNumber.length - 1] === '%') {
            return sum * parseInt(sNumber) / 100;
        }
        return parseInt(sNumber);
    } 
    // 根据设置计算为区块分配的高度或宽度
    // sNumber：在options中设置的宽度或高度，如果未设置则取实际宽度或高度，实际取值可能不准确，除center区块外，其它区块建议设置固定值
    // sum：.layout区域的总高度或宽度
    // min：在options中设置的最小高度或宽度
    // max：在options中设置的最大高度或宽度
    private calculateLength(sNumber: any, sum: any, min: any, max: any) {
        var n = this.toNumber(sNumber, sum);
        if (min) {
            min = this.toNumber(min, sum);
            if (n < min) {
                return min;
            }
        }
        if (max) {
            max = this.toNumber(max, sum);
            if (n > max) {
                return max;
            }
        }
        return n;
    }

    // 得到分区的Dom对象
    getRegionDom(name: any){
        let _real = G.G$(this.realDom);
        let jregion = _real.children(".layout-panel-"+name);
        if(jregion.length==0)
            return null;
        else
            return jregion[0];  
    }

    // 得到有效分区的JQuery对象
    getValidRegionDom(name: any){
        let _real = G.G$(this.realDom);
        let jregion = _real.children(".layout-panel-"+name);
        // modify by hechao 2018.6.14
        // 目前发现在标签页情况下，当前未显示的页面layout未正常初始化，导致页面布局混乱
        // 检查后发现is(":hidden")的判断过于大，所以这里还是改为css-display来判断
        //if(jregion.length==0 || jregion.is(":hidden"))
        if(jregion.length==0 || jregion.css("display")=="none")
            return null;
        else
            return jregion[0];  
    }    
    
    toggle(name: any) {
        let reg = this.getRegion(name);
        if(reg){
            reg.toggle();
        }
    }
    // 展开
    expand(name: any) {
        let reg = this.getRegion(name);
        if(reg){
            reg.expand();
        }
    }    
    // 折叠
    collapse(name: any) {
        let reg = this.getRegion(name);
        if(reg){
            reg.collapse();
        }
    }  
    // 显示
    showRegion(name: any) {
        let reg = this.getRegion(name);
        if(reg){
            reg.show();
        }
    }    
    // 隐藏
    hideRegion(name: any) {
        let reg = this.getRegion(name);
        if(reg){
            reg.hide();
        }
    }  
    // 设置标题
    setTitle(name: any,title: any){
        let reg = this.getRegion(name);
        if(reg){
            reg.setTitle(title);
        }        
    }
    // 移除标题
    removeTitle(name: any){
        let reg = this.getRegion(name);
        if(reg){
            reg.removeTitle();
        }        
    }  
    // 是滞有标题
    hasTitle(name: any){
        let reg = this.getRegion(name);
        if(reg){
            return reg.hasTitle();
        }   
        return null;     
    } 

    // 是否隐藏的
    isHidden(name: any){
        let reg = this.getRegion(name);
        if(reg){
            return reg.isHidden();
        } 
        return null;
    }  
    // 是否显示的
    isVisible(name: any){
        let reg = this.getRegion(name);
        if(reg){
            return reg.isVisible();
        } 
        return null;
    }
    // 是否展开的
    isExpanded(name: any){
        let reg = this.getRegion(name);
        if(reg){
            return reg.isExpanded();
        } 
        return null;
    }
    // 是否收缩的
    isCollapsed(name: any){
        let reg = this.getRegion(name);
        if(reg){
            return reg.isCollapsed();
        } 
        return null;
    }
    // 移除
    remove(name: any){
        let reg = this.getRegion(name);
        if(reg){
            return reg.remove();
        }         
    }
    
    // 返回region对象，用于操作分区
    getRegion(name: any) {
        let __this = this;
        let dom = this.getRegionDom(name);
        if(dom)
            return new Region(this,name,dom);
        else
            return null;      
    }

    getWest(){
        return this.getWestOrEast("west");
    }
    getEast(){
        return this.getWestOrEast("east");
    }    

    getNorth(){
        return this.getNorthOrSouth("north");
    }

    getSouth(){
        return this.getNorthOrSouth("south");
    }        

    getCenter(){
        let __this = this;
        let region: any = this.getRegion("center");
        if(!region)
            return null;
        return {
            setTitle:(title: any) => {
                region.setTitle(title);
            },
            getTitle:() => {
                return region.getTitle();
            },
            removeTitle:() => {
                region.removeTitle();              
            },
            hasTitle:() => {
                return region.hasTitle();                 
            },
            getOptions:() => {
                return region.getOptions();
            },
            getOption:(name: any) => {
                return region.getOption(name);
            },                       
        };        
    }

    private getWestOrEast(name: any){
        let __this = this;
        let region: any = this.getRegion(name);
        if(!region)
            return null;
        return {
            setTitle:(title: any) => {
                region.setTitle(title);
            },
            getTitle:() => {
                return region.getTitle();
            },
            removeTitle:() => {
                region.removeTitle();              
            },
            hasTitle:() => {
                return region.hasTitle();                 
            },
            setWidth:(width: any) => {
                return region.setWidth(width); 
            },
            hide:() => {
                region.hide();                
            },
            show:() => {
                region.show();               
            },
            isHidden:() => {
                return region.isHidden();               
            },
            // 是否显示的
            isVisible:() => {
                return region.isVisible();              
            },
            // 是否展开的
            isExpanded:() => {
                return region.isExpanded();         
            },
            // 是否收缩的
            isCollapsed:() => {
                return region.isCollapsed();    
            },
            // 屏开
            expand:() => {
                region.expand();
            },
            // 收缩
            collapse:() => {
                region.collapse();
            },
            // 展开或收缩
            toggle:() => {
                region.toggle();
            },
            // 移除分块
            remove:() => {
                region.remove();
            },
            
            getOptions:() => {
                return region.getOptions();
            },
        
            getOption:(name: any) => {
                return region.getOption(name);
            },                       
        };
    }

    private getNorthOrSouth(name: any){
        let __this = this;
        let region: any = this.getRegion(name);
        if(region) {
            return {
                setTitle:(title: any) => {
                    region.setTitle(title);
                },
                getTitle:() => {
                    return region.getTitle();
                },
                removeTitle:() => {
                    region.removeTitle();              
                },
                hasTitle:() => {
                    return region.hasTitle();                 
                },
                setHeight:(height: any) => {
                    return region.setHeight(height); 
                },            
                hide:() => {
                    region.hide();                
                },
                show:() => {
                    region.show();               
                },
                isHidden:() => {
                    return region.isHidden();               
                },
                // 是否显示的
                isVisible:() => {
                    return region.isVisible();              
                },
                // 是否展开的
                isExpanded:() => {
                    return region.isExpanded();         
                },
                // 是否收缩的
                isCollapsed:() => {
                    return region.isCollapsed();    
                },
                // 屏开
                expand:() => {
                    region.expand();
                },
                // 收缩
                collapse:() => {
                    region.collapse();
                },
                // 展开或收缩
                toggle:() => {
                    region.toggle();
                },
                // 移除分块
                remove:() => {
                    region.remove();
                },
                
                getOptions:() => {
                    return region.getOptions();
                },
            
                getOption:(name: any) => {
                    return region.getOption(name);
                },                       
            };
        }
        return null;
    }    

}

class Region{
    // 区块名称
    private name: any;
    // 区块的dom对象
    private dom: any;
    // 区块的jquery对象
    private jdom: any;
    // layout对象
    private layout: any;

    constructor(layout: any,name: any,dom: any){
        this.layout = layout;
        this.name = name;
        this.dom = dom;
        this.jdom = G.G$(this.dom);
    }    

    // 设置标题
    setTitle(title: any){
        this.jdom.find(".layout-panel-title:first > .title-content").html(title);
        this.jdom.find(".layout-panel-body").removeClass("notitle");
        if(this.isVisible() && this.isExpanded()){
            this.jdom.find(".layout-panel-title:first").show();
            this.jdom.find(".layout-panel-title:first > .title-content").show();
        }
    }
    // 得到标题
    getTitle(){
        return this.jdom.find(".layout-panel-title:first > .title-content").html();
    }
    // 移除标题
    removeTitle(){
        this.jdom.find(".layout-panel-title:first > .title-content").html("");
        this.jdom.find(".layout-panel-title:first").hide();
        this.jdom.find(".layout-panel-body:first").addClass("notitle");
    }
    // 是否有标题
    hasTitle(){
        let title = this.jdom.find(".layout-panel-title:first > .title-content").html();
        if(title && title.length>0)
            return true;
        else
            return false;
    }
    // 设置宽度
    setWidth(width: any){
        this.dom["_data"]["width"] = width;
        this.layout.layout();
    }
    setMinWidth(minWidth: any){
        this.dom["_data"]["min-width"] = minWidth;
        this.layout.layout();
    }
    setMaxWidth(maxWidth: any){
        this.dom["_data"]["max-width"] = maxWidth;
        this.layout.layout();
    }    
    // 设置高度
    setHeight(height: any){
        this.dom["_data"]["height"] = height;
        this.layout.layout();
    }
    setMinHeight(minHeight: any){
        this.dom["_data"]["min-height"] = minHeight;
        this.layout.layout();
    }
    setMaxHeight(maxHeight: any){
        this.dom["_data"]["max-height"] = maxHeight;
        this.layout.layout();
    }     
    // 隐藏
    hide(){
        if(this.isHidden()==true || this.name=="center")
            return;
        let centerDom = this.layout.getRegionDom("center");
        let jcenterDom = G.G$(centerDom);
        let options = {
            "center-top":jcenterDom.css("top"),
            "center-left":jcenterDom.css("left"),
            "center-right":jcenterDom.css("right"),
            "center-bottom":jcenterDom.css("bottom")
        }
        this.jdom.data("_sh_options",options);
        if(this.name=="west"){
            this.jdom.hide();
            jcenterDom.css("left",0);
        }else if(this.name=="east"){
            this.jdom.hide();
            jcenterDom.css("right",0);                        
        }else if(this.name=="north"){
            let westDom = this.layout.getRegionDom("west");
            let eastDom = this.layout.getRegionDom("east");
            this.jdom.hide();
            if(westDom)
                G.G$(westDom).css("top",0);
            if(eastDom)
                G.G$(eastDom).css("top",0);                        
            jcenterDom.css("top",0);                        
        }else if(this.name=="south"){
            let westDom = this.layout.getRegionDom("west");
            let eastDom = this.layout.getRegionDom("east");                        
            this.jdom.hide();
            if(westDom)
                G.G$(westDom).css("bottom",0);
            if(eastDom)
                G.G$(eastDom).css("bottom",0);                           
            jcenterDom.css("bottom",0);                        
        }        
    }
    // 显示
    show(){
        if(this.isVisible()==true || this.name=="center")
            return;
        this.jdom.show();
        let centerDom = this.layout.getRegionDom("center");
        let jcenterDom = G.G$(centerDom);
        let options = this.jdom.data("_sh_options");
        if(!options){
            // 如果为空说明其初始时就是隐藏的，因此这里先做一次布局
            this.layout.layout();
            options = {};
        }
        if(this.name=="west"){
            let left = options["center-left"] || this.getOption("width") || this.jdom.width();
            jcenterDom.css("left",left);
        }else if(this.name=="east"){
            let right = options["center-right"] || this.getOption("width") || this.jdom.width();
            jcenterDom.css("right",right);                        
        }else if(this.name=="north"){
            let westDom = this.layout.getRegionDom("west");
            let eastDom = this.layout.getRegionDom("east");
            let top = options["center-top"] || this.getOption("height") || this.jdom.height();
            if(westDom)
                G.G$(westDom).css("top",top);
            if(eastDom)
                G.G$(eastDom).css("top",top);                        
            jcenterDom.css("top",top);                        
        }else if(this.name=="south"){
            let westDom = this.layout.getRegionDom("west");
            let eastDom = this.layout.getRegionDom("east");                        
            let bottom = options["center-bottom"] || this.getOption("height") || this.jdom.height();
            if(westDom)
                G.G$(westDom).css("bottom",bottom);
            if(eastDom)
                G.G$(eastDom).css("bottom",bottom);                           
            jcenterDom.css("bottom",bottom);                        
        } 
    }
    // 是否隐藏的
    isHidden(){
        return this.jdom.is(":hidden");
    }  
    // 是否显示的
    isVisible(){
        return this.jdom.is(":visible");
    }
    // 是否展开的
    isExpanded(){
        if(this.jdom.data("_toggle")=="expanded")
            return true;
        else
            return false;
    }
    // 是否收缩的
    isCollapsed(){
        if(this.jdom.data("_toggle")=="collapsed")
            return true;
        else
            return false;
    }
    // 屏开
    expand(){
        if(this.isHidden()==true || this.isExpanded()==true || this.name=="center")
            return;
        let centerDom = this.layout.getRegionDom("center");
        let jcenterDom = G.G$(centerDom);
        let titleHeight = this.jdom.find(".layout-panel-title:first").height();
        let existTitle = this.hasTitle();                 
        let options = this.jdom.data("_toggle_options");
        this.jdom.data("_toggle","expanded");
        if(existTitle==true){
            this.jdom.find(".layout-panel-title:first").css("bottom","auto");
            this.jdom.find(".layout-panel-title:first").css("height",options["title-height"]); 
            this.jdom.find(".layout-panel-title:first > .title-content").show();
            this.jdom.find(".layout-panel-title:first").show();
        }        
        if(this.name=="west"){
            let lwidth = options["panel-width"];
            this.jdom.animate({width:lwidth},"slow");
            this.jdom.find(".layout-panel-body:first").show();
            jcenterDom.animate({left:lwidth},"slow");     
            this.jdom.find(".panel-control:first > a").removeClass("panel-button-right");
            this.jdom.find(".panel-control:first > a").addClass("panel-button-left");                   
        }else if(this.name=="east"){
            let rwidth = options["panel-width"];
            this.jdom.animate({width:rwidth},"slow");
            this.jdom.find(".layout-panel-body:first").show();
            jcenterDom.animate({right:rwidth},"slow");
            this.jdom.find(".panel-control:first > a").removeClass("panel-button-left");
            this.jdom.find(".panel-control:first > a").addClass("panel-button-right");                          
        }else if(this.name=="north"){
            let westDom = this.layout.getRegionDom("west");
            let eastDom = this.layout.getRegionDom("east");
            let nheight = options["panel-height"];
            this.jdom.animate({height:nheight},"slow");
            this.jdom.find(".layout-panel-body:first").show();
            if(westDom)
                G.G$(westDom).animate({top:nheight},"slow");
            if(eastDom)
                G.G$(eastDom).animate({top:nheight},"slow");                        
            jcenterDom.animate({top:nheight},"slow");      
            this.jdom.find(".panel-control:first > a").removeClass("panel-button-down");
            this.jdom.find(".panel-control:first > a").addClass("panel-button-up");               
        }else if(this.name=="south"){
            let westDom = this.layout.getRegionDom("west");
            let eastDom = this.layout.getRegionDom("east");
            let sheight = options["panel-height"];
            this.jdom.animate({height:sheight},"slow");
            this.jdom.find(".layout-panel-body:first").show();
            if(westDom)
                G.G$(westDom).animate({bottom:sheight},"slow");
            if(eastDom)
                G.G$(eastDom).animate({bottom:sheight},"slow");                        
            jcenterDom.animate({bottom:sheight},"slow");    
            this.jdom.find(".panel-control:first > a").removeClass("panel-button-up");
            this.jdom.find(".panel-control:first > a").addClass("panel-button-down");                 
        }
    }
    // 收缩
    collapse(){
        if(this.isHidden()==true || this.isCollapsed()==true || this.name=="center")
            return;
        let centerDom = this.layout.getRegionDom("center");
        let jcenterDom = G.G$(centerDom);
        let titleHeight = this.jdom.find(".layout-panel-title").height();
        let existTitle = this.hasTitle();
        let options = {
            "panel-width":this.jdom.width(),
            "panel-height":this.jdom.height(),
            "title-height":this.jdom.find(".layout-panel-title:first").css("height"),
            "body-bottom":this.jdom.find(".layout-panel-body:first").css("bottom"),
            "center-top":jcenterDom.css("top"),
            "center-left":jcenterDom.css("left"),
            "center-right":jcenterDom.css("right"),
            "center-bottom":jcenterDom.css("bottom"),
            "center-width":jcenterDom.css("width"),
            "center-height":jcenterDom.css("height")
        }
        this.jdom.data("_toggle_options",options);
        this.jdom.data("_toggle","collapsed");

        if(this.name=="west"){
            // 隐藏后剩余侧边的宽度，如果无标题，则侧边为零
            let lwidth;
            if(existTitle==true){
                lwidth = titleHeight;
                this.jdom.find(".layout-panel-title:first").css("height","auto");
                this.jdom.find(".layout-panel-title:first").animate({bottom:options["body-bottom"]},"slow"); 
                this.jdom.find(".layout-panel-title:first > .title-content").hide(); 
            }else
                lwidth = 0;
            this.jdom.animate({width:lwidth},"slow");
            this.jdom.find(".layout-panel-body:first").hide();
            jcenterDom.animate({left:lwidth},"slow");
            this.jdom.find(".panel-control:first > a").removeClass("panel-button-left");
            this.jdom.find(".panel-control:first > a").addClass("panel-button-right");  
        }else if(this.name=="east"){
            // 隐藏后剩余侧边的宽度，如果无标题，则侧边为零
            let rwidth;
            if(existTitle==true){
                rwidth = titleHeight;
                this.jdom.find(".layout-panel-title:first").css("height","auto");
                this.jdom.find(".layout-panel-title:first").animate({bottom:options["body-bottom"]},"slow"); 
                this.jdom.find(".layout-panel-title:first > .title-content").hide(); 
            }else
                rwidth = 0;
            this.jdom.animate({width:rwidth},"slow");
            this.jdom.find(".layout-panel-body:first").hide();
            jcenterDom.animate({right:rwidth},"slow");    
            this.jdom.find(".panel-control:first > a").removeClass("panel-button-right");
            this.jdom.find(".panel-control:first > a").addClass("panel-button-left");                      
        }else if(this.name=="north"){
            let westDom = this.layout.getRegionDom("west");
            let eastDom = this.layout.getRegionDom("east");
            // 隐藏后剩余侧边的高度，如果无标题，则为零
            let nheight;
            if(existTitle==true){
                nheight = titleHeight;
                this.jdom.find(".layout-panel-title:first").css("height","auto");
                this.jdom.find(".layout-panel-title:first").animate({bottom:options["body-bottom"]},"slow"); 
                this.jdom.find(".layout-panel-title:first > .title-content").hide(); 
            }else
                nheight = 0;
            this.jdom.animate({height:nheight},"slow");
            this.jdom.find(".layout-panel-body:first").hide();
            if(westDom)
                G.G$(westDom).animate({top:nheight},"slow");
            if(eastDom)
                G.G$(eastDom).animate({top:nheight},"slow");                        
            jcenterDom.animate({top:nheight},"slow");  
            this.jdom.find(".panel-control:first > a").removeClass("panel-button-up");
            this.jdom.find(".panel-control:first > a").addClass("panel-button-down");               
        }else if(this.name=="south"){
            let westDom = this.layout.getRegionDom("west");
            let eastDom = this.layout.getRegionDom("east");                        
            // 隐藏后剩余侧边的高度，如果无标题，则为零
            let sheight;
            if(existTitle){
                sheight = titleHeight;
                this.jdom.find(".layout-panel-title:first").css("height","auto");
                this.jdom.find(".layout-panel-title:first").animate({bottom:options["body-bottom"]},"slow"); 
                this.jdom.find(".layout-panel-title:first > .title-content").hide(); 
            }else
                sheight = 0;
            this.jdom.animate({height:sheight},"slow");
            this.jdom.find(".layout-panel-body:first").hide();
            if(westDom)
                G.G$(westDom).animate({bottom:sheight},"slow");
            if(eastDom)
                G.G$(eastDom).animate({bottom:sheight},"slow");                           
            jcenterDom.animate({bottom:sheight},"slow"); 
            this.jdom.find(".panel-control:first > a").removeClass("panel-button-down");
            this.jdom.find(".panel-control:first > a").addClass("panel-button-up");                       
        }
    }
    // 展开或收缩
    toggle(){
        if(this.isCollapsed()==true)
            this.expand();
        else
            this.collapse();
    }
    // 移除分块
    remove(){
        this.jdom.remove();
    }  
    
    getOptions(){
        return this.jdom.data("options");
    }

    getOption(name: any){
        return (this.jdom.data("options")||{})[name];
    }
}