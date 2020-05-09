import * as React from 'react';
import UUID from './uuid';
import Parser from '../core/Parser';
import { Events } from '../core';
export default class GearUtil {

    /**
     * 通过指定类型创建一个节点
     * @param type 
     * @param props 
     */
    static newInstanceByType(argtype: any, props?: any,parent?: JqueryTag) {
        let type = 'g-'+argtype
        let typeElement:Element = document.createElement(type);
        for(let key in props) {
            typeElement.setAttribute(key, props[key]);
        }
        let parser = new Parser();
        let astMsg: ParseResult = parser.parse(typeElement, false);
        let html = G.G$(astMsg.cacheHtml).html();
        let cacheHtmlElement = G.G$(G.cacheHtml);
        let ast = astMsg.ast.children[0];
        if(parent && parent.ast) {
            let cacheElement = cacheHtmlElement.find("["+Constants.HTML_PARSER_DOM_INDEX+"='"+parent.ast.id+"']");
            cacheElement.append(html);
            G.cacheHtml = cacheHtmlElement.prop("outerHTML");
            ast.parent = parent.ast;
        }
        let _children = props.children;
        props["__children__"] = _children;
        delete props.children;
        let reactEle = GearUtil.newReactInstance(ast, props);
        return reactEle;
        // if(props) {
        //     if(!props["key"]) {
        //         if(props["id"]) {
        //             props["key"] = props["id"];
        //         }else {
        //             props["key"] = UUID.get();
        //         }
        //     }
        //     let _children = props.children;
        //     props["__children__"] = _children;
        //     delete props.children;
        // }
        // if(typeof type == "string") {
        //     if(type.startsWith("g")) {
        //         if(type.startsWith("g-")) {
        //             type = G.components[type.substring(2, type.length)];
        //         }else {
        //             type = G.components[type.substring(1, type.length)];
        //         }
        //     }else {
        //         type = G.components[type];
        //     }
        // }
        // return React.createElement(type, props, []);
    }

    /**
     * 根据ast树创建一个react对象
     * @param ast ast树
     */
    static newReactInstance(ast: ASTElement,paramProps?: any) {
        // let attrs = ast.attrsMap;
        let type = ast.type;
        //节点
        if(type == 1) {
            let children = ast.children;
            let reactChildren: any;
            // let clazz = GearUtil.getClass(ast);
            // let props = null;
            // let time2 = new Date().getTime();
            // console.log("创建1：" + (time2 - time1));
            // if(clazz) {
            //     //控件
            //     //如果是虚拟控件，需要在G对象中记录下来，方便在外部使用G(exp)方式查找
            //     if(ObjectUtil.isExtends(clazz, "Layout")||ObjectUtil.isExtends(clazz, "Tabs")) {
            //         //html节点
            //         props = ast.attrsMap;
            //         clazz = clazz || G.components["htmltag"];
            //         // let nprops = GearUtil.formatDomProperties(props, true);
            //         props = {
            //             class: "div",
            //             props: {},
            //             // key: ast.id + "_" + ast.tag,
            //             __ast__: ast
            //         };
            //     }else {
            //         // let voidEle = null;
            //         // if(ObjectUtil.isExtends(clazz, "VoidTag")) {
            //         //     voidEle = G.voidParent.appendChild(GearUtil.createVoidDomElement(tag, attrs));
            //         // }
            //         props = {};
            //         // props = GearUtil.attrsToProps(attrs, clazz.props, ast);
            //         //props["voidElement"] = voidEle;
            //         props["__ast__"] = ast;
            //         let time3 = new Date().getTime();
            //         console.log("创建12：" + (time3 - time2));
            //     }
                
            // }else {
                // let htmltag = G.components["htmltag"];
                // clazz = tag;
                // props = ast.attrsMap;
                // props = GearUtil.formatDomProperties(props, htmltag.props, true);
                //html节点
                // props = ast.attrsMap;
                // let nprops = GearUtil.formatDomProperties(props, true);
                let props = ast.attrsMap;
                // console.log(ast);
                // let time3 = new Date().getTime();
                // console.log("创建22：" + (time3 - time2));
            // }
            
            if(children && children.length > 0) {
                reactChildren = [];
                children.forEach((astInner)=>{
                    if(astInner.tag || (ast.tag != "table" && ast.tag != "thead" && ast.tag != "tr"  && ast.tag != "tbody" && ast.tag != "br")) {
                        reactChildren.push(GearUtil.newReactInstance(astInner));
                    }
                });
                if(ast.attrsMap.ctype == 'text' || ast.tag == "g-text"){
                    reactChildren = null
                }
            }
            
            // if(!props["key"]) {
            //     if(props["id"]) {
            //         props["key"] = props["id"];
            //     }else {
            //         if(ast.id) {
            //             props["key"] = ast.id;
            //         }else {
            //             props["key"] = UUID.get();
            //         }
            //     }
            // }
            if(paramProps) {
                props = G.G$.extend(props, paramProps);
            }
            props["key"] = ast.id;
            
            let clazz = (typeof ast.tagClass == "string") ? G.components["htmltag"] : ast.tagClass;
            let ele = React.createElement(clazz, props, reactChildren);
            return ele;
        }else if(type == 2){
            //表达式 -- 暂未处理
            return ast.text;
        }else {
            //文本
            return ast.text;
        }
    }

    static formatDomProperties(props: any, htmlTag?: boolean) {
        let propsNew = {};
        // let _props = G.G$.extend({}, propsTemplete);
        // for(let key in _props) {
        //     if(_props[key] == "" || G.G$.isEmptyObject(_props[key]) || GearUtil.isGearType(_props[key])) {
        //         _props[key] = null;
        //     }
        // }
        for(let name in props) {
            let value = props[name];
            let standardName = window.getPossibleStandardName(name);
            // let type:string = name == 'style' ? "CssProperties" : (Events[standardName] ? "function" : "string");
            if(name == "style") {
                value = GearJson.fromStyle(value).toJson();
            }
            if(Events[standardName]) {
                value = (function(value) {
                    return function(...args: any[]){
                        try{
                            return eval(value);
                        }catch(err){
                            console.error(err);
                        }
                    }
                })(value);
            }
            propsNew[standardName] = value;
            // props[name] = GearUtil.parseAttributeValue(name,value,type);
        }
        // for(let name in props) {
        //     let value = props[name];
        //     let type:string = name == 'style' ? "CssProperties" : GearUtil.getAttributeValueType(value);
        //     if(type == undefined || value == undefined) {
        //         continue;
        //     }
            
        // }
        return propsNew;
    }

    // //创建一个虚拟dom节点
    // static createVoidDomElement(tagName: string, attrs: any):Element {
    //     let ele = document.createElement(tagName);
    //     if(attrs) {
    //         for(let key in attrs) {
    //             ele.setAttribute(key, attrs[key]);
    //         }
    //     }
    //     return ele;
    // }

    /**
     * 获取clazz
     * @param ast 
     */
    static getClass(ast: ASTElement) {
        let attrs = ast.attrsMap;
        let clazz = null;
        if(attrs != null) {
            let ctype = attrs["ctype"];
            if(ctype) {
                clazz = G.components[ctype];
            }
        }
        if(clazz == null) {
            let tag = ast.tag;
            if(tag) {
                if(tag.startsWith("g")) {
                    if(tag.startsWith("g-")) {
                        clazz = G.components[tag.substring(2, tag.length)];
                    }else {
                        clazz = G.components[tag.substring(1, tag.length)];
                    }
                }else if(tag == "input") {
                    let type = attrs["type"];
                    clazz = G.components[type];
                    if(clazz == null) {
                        clazz = G.components["text"];
                    }
                }
            }
        }
        return clazz;
    }

    /**
     * 获取clazz
     * @param ast 
     */
    static getClassFromTag(ele: Element) {
        let attrs = ele.attributes;
        let clazz = null;
        if(attrs != null) {
            let ctype = attrs["ctype"];
            if(ctype) {
                clazz = G.components[ctype.value];
            }
        }
        if(clazz == null) {
            let tag = ele.tagName;
            if(tag) {
                if(tag.startsWith("g")) {
                    if(tag.startsWith("g-")) {
                        clazz = G.components[tag.substring(2, tag.length)];
                    }else {
                        clazz = G.components[tag.substring(1, tag.length)];
                    }
                }
                // else if(tag == "input") {
                //     let type = attrs["type"];
                //     clazz = G.components[type.value];
                //     if(clazz == null) {
                //         clazz = G.components["text"];
                //     }
                // }
                else {
                    clazz = G.components["htmltag"];
                }
            }
        }
        return clazz;
    }

    /**
     * 创建一个类型
     * @param fun 
     * @param parent 
     */
    static createClass(parent: any, fun?: Function):{name: any, clazz: any}|null {
        let clazz = GearUtil.Class(fun);
        if(clazz && clazz.prototype && clazz.prototype.name) {
            clazz = clazz.implements(parent);
            let name = clazz.prototype.name;
            return {
                name: name,
                clazz: clazz
            };
        }
        return null;
    }

    static Class(fun?: Function) {
        if(fun === undefined) {
            fun = function(){};
        }
        var P:any = fun;
        var fn = P.fn || function(){};
        P.constructor = fn;
        fn.prototype = P;
        //类的继承
        fn.implements = function(F: any) {
            if(F && G.G$.isFunction(F)) {
                // var _F: any = function() {};
                // if(typeof this.prototype == "function") {
                //     _F.prototype = F.prototype;
                // }else {
                //     _F.prototype = this.prototype;
                // }
                // _F.prototype.constructor = F;
                // this.prototype = new _F();
                // this.prototype.constructor = this;
                var _F: any = function() {};
                _F.prototype = F.prototype;
                this.prototype = new _F();
                this.prototype.constructor = this;
            }
            return this;
        };
        return fn;
    }

    //转义类型名称
    static parseStyleType(styleType: string) {
        if(styleType && styleType.length > 0) {
            styleType = styleType.replace(/-\w{1}/g,function(word) {
                return word.substring(1).toLocaleUpperCase();
            });
        }
        return styleType;
    }

    //获取props的类型
    private static getTypeFromPropsTemplete(propsTemplete: any, keyParam: string, value: string) {
        for(let key in propsTemplete) {
            if(key.toLowerCase() == keyParam.toLowerCase()) {
                let type = propsTemplete[key];
                if(type && type.indexOf(Constants.TYPE.Any) != -1) {
                    return GearUtil.getAttributeValueType(value);
                }
                return type ? type.substring(3, type.length) : null;
            }
        }
        return GearUtil.getAttributeValueType(value);
    } 

    /**
     * 是否是代表类型的字符串
     * @param valueInPropsTemplete 
     */
    private static isGearType(valueInPropsTemplete: any) {
        for(let key in GearType) {
            if(GearType[key] instanceof Function) {
                if(typeof valueInPropsTemplete == "string" && valueInPropsTemplete.indexOf(GearType[key]()) != -1) {
                    return true;
                }
            }else if(GearType[key].indexOf(valueInPropsTemplete) != -1) {
                return true;
            }
        }
        return false;
    }
    
    //属性转换成对应的props
    static attrsToProps(attrs: any, propsTemplete: any,ast: ASTElement):any {
        let props = G.G$.extend({}, propsTemplete);
        for(let key in props) {
            if(props[key] == "" || G.G$.isEmptyObject(props[key]) || GearUtil.isGearType(props[key])) {
                props[key] = null;
            }
        }
        for(let name in attrs) {
            let value = attrs[name];
            let type:string = GearUtil.getTypeFromPropsTemplete(propsTemplete, name, value);
            if(type == undefined || value == undefined) {
                continue;
            }
            for(let key in propsTemplete) {
                if(key.toLowerCase() == name.toLowerCase()) {
                    name = key;
                }
            }
            props[name] = GearUtil.parseAttributeValue(name,value,type);
        }
        // 这里当name属性未设置时默认赋原始id的值
        if(!props["name"]) {
            if(props["id"]) {
                props["name"] = props["id"];
            }else {
                props["id"] = UUID.get();
                props["name"] = props["id"];
            }
        }

        if(!props["value"]){
            if(ast.children && ast.children.length == 1 && ast.children[0].type == 3) {
                props["value"] = ast.children[0].text;
            }
        }

        // disabled属性在浏览器中，设置为true时，该属性值为“disabled”
        if(props["disabled"] && (props["disabled"]==true || props["disabled"]=="disabled" || props["disabled"]=="true")){
            props["disabled"] = true;
        }else if(props["disabled"].indexof('{(')>-1 && props["disabled"].indexof(')}')>-1){//disabled支持动态表达式
           
        }else{
            props["disabled"] = false;
        }
        if(!props["text"]) {
            if(ast.children && ast.children.length == 1 && ast.children[0].type == 3) {
                props["text"] = ast.children[0].text;
            }
        }
        return props;
    }

    // 解析属性值
    static parseAttributeValue(name:string,value:string, typeConstractor: any,htmlTag?: boolean){
        // 解析value中的表达式 G{xxx} ，对表达式中的函数或变量进行解析处理
        value = value.replace(/\G\{([^\}]+)\}/g,function(match,m1){
            // 获得表达式，如果表达式是以“();”结尾的，去除之
            var expression = m1.replace(/\([\.|$|\w]{0,}\);?$/,"");
            // 先检查window作用域中是否存在该函数或变量
            var v = window[expression];
            if(v){
                // 如果存在
                if(typeof v =="function"){
                    // 如果是个函数，则调用它（函数应返回一个字符串值，为防止函数返回其它值，这里对返回值作了判断）
                    var r = v.call(window);
                    if(r)
                        return r;
                    else
                        return "";
                }else{
                    // 其它类型直接返回（这里应只有字符串类型，否则也会被转为字符串类型）
                    return v;
                }
            }else{
                // 如果不存在，则使用eval来解析函数
                var fun = function(){
                    try{
                        return eval(expression);
                    }catch(err){
                        console.error(err);
                        return "";
                    }
                }
                var r = fun.call(window);
                if(r)
                    return r;
                else
                    return "";                    
            }
        });

        if(G.events.contains(name.toLowerCase())){
            let values = value.split(";");
            let funs = [];
            for(let i = 0; i < values.length; i++) {
                let valueInner = values[i];
                if(typeConstractor == "script" || typeConstractor == "function") {
                    valueInner = valueInner.replace(/^javascript:/,"");
                    funs.push(function(...args: any[]){
                        try{
                            return eval(valueInner);
                        }catch(err){
                            console.error(err);
                        }
                    })
                }else {
                    let methodName = valueInner.replace(/\([\.|$|\w]{0,}\);?/,"");
                    if(G.cannotSetStateEvents.contains(name)) {
                        GearUtil.removeSetStateFromCannotSetStateFunction(methodName, name);
                    }
                    let script = methodName + ".bind(this)(...arguments)";
                    // 如果该属性名称在常用事件名称列表中，这里按照事件的规则处理
                    funs.push(function(...args: any[]){
                        try{
                            return eval(script);
                        }catch(err){
                            console.error(err);
                        }
                    });
                }
            }
            if(funs.length == 1) {
                return funs[0];
            }
            return funs;
        }else{
            let type = typeConstractor;
            //回调函数
            try {
                if(type == 'function'){
                    if(htmlTag == true) {
                        return value;
                    }
                    let values = value.split(";");
                    let funs = [];
                    for(let i = 0; i < values.length; i++) {
                        let valueInner = values[i];
                        let methodName = valueInner.replace(/\([\.|$|\w]{0,}\);?/,"");
                        methodName = methodName.replace(/^javascript:/,"")//防止老版中，如：link属性也会有javascript:fun()写法
                        if(window[methodName] && window[methodName] instanceof Function) {
                            funs.push(window[methodName]);
                        }
                    }
                    if(funs.length == 1) {
                        return funs[0];
                    }
                    return funs;
                }else if(type == "script") {
                    if(htmlTag == true) {
                        return value;
                    }
                    let script = value.replace(/^javascript:/,"");
                    return function(...args: any[]){
                        try{
                            return eval(script);
                        }catch(err){
                            console.error(err);
                        }
                    }
                }else if(type == 'boolean') {
                    if(htmlTag == true) {
                        return value;
                    }
                    if(value == "true") {
                        return true;
                    }else {
                        return false;
                    }
                }else if(type == 'number' && value.indexOf('\\.') != -1) {
                    if(htmlTag == true) {
                        return value;
                    }
                    return parseFloat(value);
                }else if(type == 'number' && value.indexOf('\\.') == -1) {
                    if(htmlTag == true) {
                        return value;
                    }
                    return parseInt(value);
                }else if(type == 'object' || type == "array") {
                    if(htmlTag == true) {
                        return value;
                    }
                    return eval("(" + value + ")");
                }else if(type == 'CssProperties') {
                    return GearJson.fromStyle(value).toJson();
                }else {
                    return value;
                } 
            } catch (error) {
                return value;
            }
            
        }
    }

    private static removeSetStateFromCannotSetStateFunction(methodName: string, eventName: string) {
        let method = window[methodName];
        if(method instanceof Function) {
            let methodStr:string = method.toString();
            let setStateReg = /[;|\n]{1,}[\t| ]{0,}[$|\w]{1,}\.setState[\t| |\n]{0,}\([ |\t|\n]{0,}/;
            let s = methodStr.match(setStateReg);
            if(s) {
                throw eventName + " = " + methodName + " cannot invoke setState";
            }
        }
    }

    static getAttributeValueType(value:string) {
        value = value.trim();
        let type = "string";
        let valueTypeArr = value.split("::");
        if(valueTypeArr.length > 1) {
            type = valueTypeArr[1];
        }else {
            if(value == "true" || value == "false") {
                type = "boolean";
            }else {
                let methodReg = /[$|\w]{1,}\([\.|$|\w]{0,}\);?/;
                let match = value.match(methodReg);
                if(match && window[match[0].replace(/\([\.|$|\w]{0,}\);?/,"")]) {
                    type = "function";
                }else if(G.events.contains(name) && /^javascript:.+/.test(value)){
                    // 如果以javascript开头，则认为是脚本
                    type = "script";
                }else {
                    if(/^\{[\s\S]+\}$/.test(value) || /^\[[\s\S]+\]$/.test(value)) {
                        try {
                            type = typeof eval("(" + value + ")");
                        }catch(e) {
                            type = "string";
                        }
                    }else {
                        type = "string";
                    }
                }
            }
        }
        return type;
    }

    // 按规则将其转换为控件实际可接受的属性
    static toProps(options: any){
        let props = {};
        if(options){
            for(let key in options){
                let value = options[key];
                if("class"==key.toLowerCase()){
                    props["className"] = value;
                }else if("invalidmessage"==key.toLowerCase()){
                    props["invalidMessage"] = value;
                }else if("events"==key.toLowerCase()){
                    props["events"] = value;
                }else{
                    props[key.toLowerCase()] = value;
                }
            }
        }
        if(!props["id"]){
            props["id"] = UUID.get();
        }
        return props;
    }

}