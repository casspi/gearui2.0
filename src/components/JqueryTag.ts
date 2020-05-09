import * as React from 'react';
import { Events, Parser } from '../core';
import { ObjectUtil, GearUtil, UUID } from '../utils';
import * as ReactDOM from 'react-dom';
const lowerFirst = require('lodash/lowerFirst');
export var props = {
    __ast__: GearType.AstElement,
    ...Events
}
export interface state {
    ref?(ele: any): void,
    onClick?(e: any): void,  
    onDoubleClick?(e: any): void, 
    onKeyUp?(e: any): void,  
    onKeyDown?(e: any): void, 
    onKeyPress?(e: any): void,                                          
    onMouseMove?(e: any): void,
    onMouseOver?(e: any): void,
    onMouseDown?(e: any): void,
    onMouseUp?(e: any): void,
    onMouseOut?(e: any): void, 
    children?: React.ReactNode 
}
export default class JqueryTag<P extends typeof props, S extends state> extends React.Component<P, S> {
    realDom: Element;
    ref: any;
    //所有的事件
    events:{} = {};

    ast: ASTElement;

    _promise: Promise<any>;

    length: 1;

    constructor(props?: P, context?: any) {
        super(props || <any>{}, context);
        this.ast = this.props.__ast__;
        if(this.ast) {
            this.ast.vmdom = this;
        }
        //绑定所有的props里面注册的事件
        this.bindAllEvents();
        this.addOnEventsMethod();
    }

    protected getConcatInitialState() {}

    protected addOnEventsMethod() {
        for(let key in Events) {
            if(!this[key]) {
                this[key] = (fun: Function)=>{
                    if(fun instanceof Function) {
                        let keyLower = key.substring(2, key.length);
                        keyLower = lowerFirst(keyLower);
                        this.bind(keyLower, fun);
                    }
                }
            }
        }
    }

    protected bindAllEvents() {
        let props = this.props;
        for(let key in props) {
            let event = props[key];
            if(event instanceof Function) {
                if(key.startsWith("on")) {
                    let keyLower = key.substring(2, key.length);
                    keyLower = lowerFirst(keyLower);
                    this.bind(keyLower, event);
                }else {
                    let keyLower = lowerFirst(key);
                    this.bind(keyLower, event);
                } 
            }else {
                if(event instanceof Array) {
                    event.forEach(element => {
                        if(key.startsWith("on")) {
                            let keyLower = key.substring(2, key.length);
                            keyLower = lowerFirst(keyLower);
                            this.bind(keyLower, element);
                        }else {
                            let keyLower = lowerFirst(key);
                            this.bind(keyLower, element);
                        } 
                    });
                }
            }
        }
    }

    //重写setState
    setState<K extends any>(
        state: any,
        callback?: () => void
    ) {
        // super.setState(state, function(){
        //     if(callback) {
        //         callback.call(this);
        //     }
        // });
        let promise = new Promise<boolean>((resolve, reject)=>{
            let _this = this;
            super.setState(state, function(){
                if(callback) {
                    callback.call(_this);
                }
                resolve(true);
                G.removeUpdating(promise);
            });
        });
        G.addUpdating(promise);
        promise.then(function() {
            G.removeUpdating(promise);
        }, function() {
            G.removeUpdating(promise);
        });
    }

    protected resolve(fun?: Function): void{
        if(fun instanceof Function) {
            fun(this);
        }
    };

    onAfterRender(fun: Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("afterrender",fun);
        }
    }

    onAfterUpdate(fun: Function){
        if(fun && G.G$.isFunction(fun)) {
            this.bind("afterupdate",fun);
        }
    }
    //是否更新
    shouldUpdate(nextProps: P, nextState: S): boolean {
        return true;
    }

    add(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.add.call(jdom,...args);
    }
    addBack(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.addBack.call(jdom,...args);
    }
    addClass(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.addClass.call(jdom,...args);
    }
    after(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.after.call(jdom,...args);
    }
    ajaxComplete(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.ajaxComplete.call(jdom,...args);
    }
    ajaxError(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.ajaxError.call(jdom,...args);
    }
    ajaxSend(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.ajaxSend.call(jdom,...args);
    }
    ajaxStart(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.ajaxStart.call(jdom,...args);
    }
    ajaxStop(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.ajaxStop.call(jdom,...args);
    }
    ajaxSuccess(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.ajaxSuccess.call(jdom,...args);
    }
    animate(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.animate.call(jdom,...args);
    }

    append(...args:any[]){
        //通过append添加的元素要实现动态渲染，并且将内容append到元素中
        // if(React.isValidElement(this)) {
            let render = true;
            if(args.length > 1 && typeof args[args.length - 1] == "boolean") {
                render = args[args.length - 1];
            }
            if(render) {
                let parser = new Parser();
                let astMsg: ParseResult  = parser.parse.call(parser, ...args, true);
                let html = G.G$(astMsg.cacheHtml).html();
                if(html && html.match(/<style.*?>([\s\S]+?)<\/style>/img)){
                    let matchRes = html.match(/<style.*?>([\s\S]+?)<\/style>/img);
                    if(matchRes && matchRes.length>0){
                        for(let i=0;i<matchRes.length;i++){
                            var style = document.createElement("style");
                            style.type = "text/css";
                            try{
                            　　style.appendChild(document.createTextNode(matchRes[i].replace(/<style[^>]*>/g,"").replace(/<\/style>/g,"")));
        
                            }catch(ex){
                            　　style.styleSheet.cssText = matchRes[i].replace(/<style[^>]*>/g,"").replace(/<\/style>/g,"");//针对IE
        
                            }
                            var head = document.getElementsByTagName("head")[0];
                            head.appendChild(style);
                        }
                    }
                }
                let cacheHtmlElement = G.G$(G.cacheHtml);
                let cacheElement = cacheHtmlElement.find("["+Constants.HTML_PARSER_DOM_INDEX+"='"+this.data('vmdom').ast.id+"']");
                // console.log(html)
                cacheElement.append(html);
                
                //插入脚本
                let jsReg = new RegExp(/<script.*?>([\s\S]+?)<\/script>/img);
                // console.log(jsReg)
                let scriptCode = '';
                html.replace(jsReg,function(str:any,js:any){
                    scriptCode=str;
                    return scriptCode
                })
                scriptCode = scriptCode.replace(/<script.*?>/,"").replace('</script>',"")

                G.cacheHtml = cacheHtmlElement.prop("outerHTML");
                let asts = astMsg.ast.children;
                let children: any = this.data('vmdom').tempChildren || this.data('vmdom').state.children;
                if(!(children instanceof Array)) {
                    children = [children];
                }
                asts.forEach((ast: ASTElement)=>{
                    ast.parent = this.data('vmdom').ast;
                    let reactEle = GearUtil.newReactInstance(ast);
                    console.log(reactEle)
                    children.push(reactEle);
                });
                this.data('vmdom').tempChildren = children;
                this.data('vmdom').setState({
                    children
                },() => {
                    this.data('vmdom').tempChildren = null;
                    eval(scriptCode);
                });
            }else {
                let jdom = G.G$(this.realDom);
                return jdom.append.call(jdom,...args);
            }
        // }
        return this.data('vmdom');
    }
    appendTo(...args:any[]){
        // if(React.isValidElement(this)) {
        //     let cacheHtmlElement = G.G$(G.cacheHtml);
        //     let cacheElement = cacheHtmlElement.find("["+Constants.HTML_PARSER_DOM_INDEX+"='"+this.ast.id+"']");
        //     //cacheElement.append(html);
        // }else {

        // }
        let jdom = G.G$(this.realDom);
        return jdom.appendTo.call(jdom,...args);
    }
    attr(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.attr.call(jdom,...args);
    }
    before(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.before.call(jdom,...args);
    }
    //绑定事件
    bind(eventName:string,...events: Array<any>) {
        if(eventName && events.length > 0) {
            let eventArr:Array<Function> = this.events[eventName]||[];
            eventArr = eventArr.concat(events);
            this.events[eventName] = eventArr;
        }
        return this;
    }
    blur(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.blur.call(jdom,...args);
    }
    change(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.change.call(jdom,...args);
    }
    children_g_(...args:any[]):JQuery<HTMLElement>{
        let jdom = G.G$(this.realDom);
        return jdom.children.call(jdom,...args);
    }
    clearQueue(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.clearQueue.call(jdom,...args);
    }
    click(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.click.call(jdom,...args);
    }
    clone(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.clone.call(jdom,...args);
    }
    closest(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.closest.call(jdom,...args);
    }
    contents(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.contents.call(jdom,...args);
    }
    contextmenu(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.contextmenu.call(jdom,...args);
    }
    css(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.css.call(jdom,...args);
    }
    data(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.data.call(jdom,...args);
    }
    dblclick(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.dblclick.call(jdom,...args);
    }
    delay_g_(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.delay.call(jdom,...args);
    }
    delegate(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.delegate.call(jdom,...args);
    }
    dequeue(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.dequeue.call(jdom,...args);
    }
    detach(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.detach.call(jdom,...args);
    }
    
    // each(...args:any[]){
    //     let jdom = G.G$(this.realDom);
    //     return jdom.each.call(jdom,...args);
    // }

    empty(...args:any[]){
        //--------
        let cacheHtmlElement = G.G$(G.cacheHtml);
        let cacheElement = cacheHtmlElement.find("["+Constants.HTML_PARSER_DOM_INDEX+"='"+this.data('vmdom').ast.id+"']");
        cacheElement.empty()
        G.cacheHtml = cacheHtmlElement.prop("outerHTML");
        //含有表单时，清除验证规则
        if(this.ast){
            let fn = (vmdom:any)=>{
                if(vmdom && vmdom.form){
                    vmdom.setState({
                        rules: [],
                        // id: null
                    })
                }else if(vmdom && vmdom.ast.children.length>0){
                    for(let i = 0,len = vmdom.ast.children.length;i<len;i++){
                        fn(vmdom.ast.children[i].vmdom)
                    }    
                }else{
                    let jqArr =  G.G$(this.realDom).find('.ant-form-item-children>span').children();
                    for(let i=0;i<jqArr.length;i++){
                        let gdom:any = G.$(jqArr[i]);
                        if(gdom.length>0 && gdom.form){
                            gdom.setState({
                                rules: [],
                                // id: null
                            })
                        }
                    }
                }
            }
            fn(this.ast.vmdom);
        }else{
            let jqArr = G.G$(this).find('.ant-form-item-children>span').children();
            for(let i=0;i<jqArr.length;i++){
                let gdom:any = G.$(jqArr[i]);
                if(gdom.length>0 && gdom.form){
                    gdom.setState({
                        rules: [],
                        // id: null
                    })
                }
            }
        }
        let jdom = G.G$(this.realDom);
        return jdom.empty.call(jdom,...args);
    }

    end(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.end.call(jdom,...args);
    }
    eq(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.eq.call(jdom,...args);
    }
    extend(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.extend.call(jdom,...args);
    }
    fadeIn(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.fadeIn.call(jdom,...args);
    }
    fadeOut(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.fadeOut.call(jdom,...args);
    }
    fadeTo(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.fadeTo.call(jdom,...args);
    }
    fadeToggle(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.fadeToggle.call(jdom,...args);
    }
    filter(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.filter.call(jdom,...args);
    }
    find(...args:any[]):JQuery<HTMLElement>{
        let result = G.$(...args, this);
        return result;
    }
    finish(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.finish.call(jdom,...args);
    }
    first(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.first.call(jdom,...args);
    }
    focus(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.focus.call(jdom,...args);
    }
    focusin(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.focusin.call(jdom,...args);
    }
    focusout(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.focusout.call(jdom,...args);
    }
    get(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.get.call(jdom,...args);
    }
    has(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.has.call(jdom,...args);
    }
    hasClass(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.hasClass.call(jdom,...args);
    }
    height_g_(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.height.call(jdom,...args);
    }
    hide(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.hide.call(jdom,...args);
    }
    hover(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.hover.call(jdom,...args);
    }
    html(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.html.call(jdom,...args);
    }
    index(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.index.call(jdom,...args);
    }
    innerHeight(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.innerHeight.call(jdom,...args);
    }
    innerWidth(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.innerWidth.call(jdom,...args);
    }
    insertAfter(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.insertAfter.call(jdom,...args);
    }
    insertBefore(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.insertBefore.call(jdom,...args);
    }
    is(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.is.call(jdom,...args);
    }
    keydown(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.keydown.call(jdom,...args);
    }
    keypress(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.keypress.call(jdom,...args);
    }
    keyup(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.keyup.call(jdom,...args);
    }
    last(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.last.call(jdom,...args);
    }
    load(...args:any[]){
        let jdom = G.G$(this.realDom);
        let hasFun = false;
        //增加渲染方法
        for(let i = 0; i < args.length; i++) {
            if(typeof args[i] === "function") {
                hasFun = true;
                let fun = args[i];
                ((fun)=>{
                    args[i] = ()=>{
                        fun();
                        this.doRender();
                    };
                })(fun);
            }
        }
        if(hasFun == false) {
            args.push(()=>{
                this.doRender();
            });
        }
        return jdom.load.call(jdom,...args);
    }
    map(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.map.call(jdom,...args);
    }
    mousedown(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.mousedown.call(jdom,...args);
    }
    mouseenter(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.mouseenter.call(jdom,...args);
    }
    mouseleave(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.mouseleave.call(jdom,...args);
    }
    mousemove(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.mousemove.call(jdom,...args);
    }
    mouseout(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.mouseout.call(jdom,...args);
    }
    mouseover(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.mouseover.call(jdom,...args);
    }
    mouseup(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.mouseup.call(jdom,...args);
    }
    next(...args:any[]){
        let jdom = G.G$(this.realDom).next(...args);
        return G.$(jdom[0]);
    }
    nextAll(...args:any[]){
        let jdom = G.G$(this.realDom).nextAll(...args);
        let nexts: any[] = [];
        jdom.each((index, ele) => {
            nexts.push(G.$(ele));
        });
        return nexts;
    }
    nextUntil(...args:any[]){
        let jdom = G.G$(this.realDom).nextUntil(...args);
        let nexts: any[] = [];
        jdom.each((index, ele) => {
            nexts.push(G.$(ele));
        });
        return nexts;
    }
    not(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.not.call(jdom,...args);
    }
    off(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.off.call(jdom,...args);
    }
    offset(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.offset.call(jdom,...args);
    }
    offsetParent(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.offsetParent.call(jdom,...args);
    }
    on(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.on.call(jdom,...args);
    }
    one(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.one.call(jdom,...args);
    }
    outerHeight(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.outerHeight.call(jdom,...args);
    }
    outerWidth(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.outerWidth.call(jdom,...args);
    }
    parent(...args:any[]){
        let jdom = G.G$(this.realDom).parent(...args);
        // return jdom.parent.call(jdom,...args);
        return G.$(jdom[0]);
    }
    parents(...args:any[]){
        let jdom = G.G$(this.realDom).parents(...args);
        let parents: any[] = [];
        let fnNames: any[] = [];
        jdom.each((index, ele) => {
            let gObj = G.$(ele);
            for(let key in gObj) {
                if(G.G$.isFunction(gObj[key]) && fnNames.indexOf(key) == -1) {
                    fnNames.push(key);
                }
            }
            parents.push(gObj);
        });
        let parentsRe = G.G$(parents) as any;
        G.G$.each(fnNames,(i,name)=>{
            let fn:any = (...args:any[])=>{
                let res = [];
                for(let j = 0; j < parents.length;j ++) {
                    let ele = parents[j];
                    if(ele[name] != null && G.G$.isFunction(ele[name])) {
                        let re = ele[name].call(ele,...args);
                        res.push(re);
                    }
                }
                return res;
            };
            if(name.indexOf(Constants.EXPAND_NAME) != -1) {
                name = name.replace(Constants.EXPAND_NAME, '');
            }
            if(parentsRe) {
                parentsRe[name] = fn;
            }
        });
        parentsRe.eq = (index:number)=>{
            return parents[index];
        };
        parentsRe.length = parents.length;
        return parentsRe;
    }
    parentsUntil(...args:any[]){
        let jdom = G.G$(this.realDom).parentsUntil(...args);
        let parents: any[] = [];
        let fnNames: any[] = [];
        jdom.each((index, ele) => {
            let gObj = G.$(ele);
            for(let key in gObj) {
                if(G.G$.isFunction(gObj[key]) && fnNames.indexOf(key) == -1) {
                    fnNames.push(key);
                }
            }
            parents.push(gObj);
        });
        let parentsRe = G.G$(parents) as any;
        G.G$.each(fnNames,(i,name)=>{
            let fn:any = (...args:any[])=>{
                let res = [];
                for(let j = 0; j < parents.length;j ++) {
                    let ele = parents[j];
                    if(ele[name] != null && G.G$.isFunction(ele[name])) {
                        let re = ele[name].call(ele,...args);
                        res.push(re);
                    }
                }
                return res;
            };
            if(name.indexOf(Constants.EXPAND_NAME) != -1) {
                name = name.replace(Constants.EXPAND_NAME, '');
            }
            if(parentsRe) {
                parentsRe[name] = fn;
            }
        });
        parentsRe.eq = (index:number)=>{
            return parents[index];
        };
        parentsRe.length = parents.length;
        return parentsRe;
    }
    position(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.position.call(jdom,...args);
    }
    prepend(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.prepend.call(jdom,...args);
    }
    prependTo(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.prependTo.call(jdom,...args);
    }
    prev(...args:any[]){
        let jdom = G.G$(this.realDom).prev(...args);
        return G.$(jdom[0]);
    }
    prevAll(...args:any[]){
        let jdom = G.G$(this.realDom).prevAll(...args);
        let prevs: any[] = [];
        jdom.each((index, ele) => {
            prevs.push(G.$(ele));
        });
        return prevs;
    }
    prevUntil(...args:any[]){
        let jdom = G.G$(this.realDom).prevAll(...args);
        let prevs: any[] = [];
        jdom.each((index, ele) => {
            prevs.push(G.$(ele));
        });
        return prevs;
    }
    promise(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.promise.call(jdom,...args);
    }
    _g_prop(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.prop.call(jdom,...args);
    }
    pushStack(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.pushStack.call(jdom,...args);
    }
    queue(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.queue.call(jdom,...args);
    }
    ready(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.ready.call(jdom,...args);
    }
    remove(...args:any[]){
        if(this.ast) {
            let cacheHtmlElement = G.G$(G.cacheHtml);
            cacheHtmlElement.find("["+Constants.HTML_PARSER_DOM_INDEX+"='"+this.ast.id+"']").remove();
            G.cacheHtml = cacheHtmlElement.prop("outerHTML");
            delete G.cacheAstMap[this.ast.id];
            let fn = (vmdom:any)=>{
                if(vmdom && vmdom.form){
                    vmdom.setState({
                        rules:[],
                        // id:null
                    })
                }else if(vmdom && vmdom.ast.children.length>0){
                    for(let i = 0,len = vmdom.ast.children.length;i<len;i++){
                        fn(vmdom.ast.children[i].vmdom)
                    }    
                }
            }
            fn(this.ast.vmdom);
            let parent = this.ast.parent;
            if(parent) {
                let parentChildren = parent.children;
                if(parentChildren) {
                    let index = parentChildren.indexOf(this.ast);
                    if(index > -1) {
                        parentChildren.splice(index, 1);
                    }
                }
            }
        }else{//原生dom（未经过框架渲染） jq方法remove
            let jqArr = G.G$(this).find('.ant-form-item-children span').children();
            for(let i=0;i<jqArr.length;i++){
                let gdom:any = G.$(jqArr[i]);
                if(gdom.length>0 && gdom.form){
                    gdom.setState({
                        rules:[],
                        // id: null
                    })
                }
            }
        }
        let jdom = G.G$(this.realDom);
        return jdom.remove.call(jdom,...args);
    }
    removeAttr(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.removeAttr.call(jdom,...args);
    }
    removeClass(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.removeClass.call(jdom,...args);
    }
    removeData(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.removeData.call(jdom,...args);
    }
    removeProp(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.removeProp.call(jdom,...args);
    }
    replaceAll(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.replaceAll.call(jdom,...args);
    }
    replaceWith(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.replaceWith.call(jdom,...args);
    }
    _g_resize(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.resize.call(jdom,...args);
    }
    scroll(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.scroll.call(jdom,...args);
    }
    scrollLeft(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.scrollLeft.call(jdom,...args);
    }
    scrollTop(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.scrollTop.call(jdom,...args);
    }
    select(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.select.call(jdom,...args);
    }
    serialize(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.serialize.call(jdom,...args);
    }
    serializeArray(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.serializeArray.call(jdom,...args);
    }
    show(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.show.call(jdom,...args);
    }
    siblings(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.siblings.call(jdom,...args);
    }
    slice(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.slice.call(jdom,...args);
    }
    slideDown(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.slideDown.call(jdom,...args);
    }
    slideToggle(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.slideToggle.call(jdom,...args);
    }
    slideUp(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.slideUp.call(jdom,...args);
    }
    stop(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.stop.call(jdom,...args);
    }
    submit(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.submit.call(jdom,...args);
    }
    text_g_(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.text.call(jdom,...args);
    }
    toArray(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.toArray.call(jdom,...args);
    }
    toggle(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.toggle.call(jdom,...args);
    }
    toggleClass(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.toggleClass.call(jdom,...args);
    }
    trigger(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.trigger.call(jdom,...args);
    }
    triggerHandler(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.triggerHandler.call(jdom,...args);
    }
    //取消事件的绑定
    unbind(eventName: string,fun?: Function) {
        if(eventName) {
            if(fun) {
                let events = this.events[eventName];
                let index = -1;
                events.map((ele: Function,i: number) => {
                    if(ele == fun) {
                        index = i;
                        return;
                    }
                });
                if(index >=0 ) {
                    let garr = new GearArray(events);
                    garr.remove(index);
                    this.events[eventName] = garr.toArray();
                }
            }else {
                delete this.events[eventName];
            }
        }
        return this;
    }
    undelegate(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.undelegate.call(jdom,...args);
    }
    unwrap(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.unwrap.call(jdom,...args);
    }
    val(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.val.call(jdom,...args);
    }
    width_g_(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.width.call(jdom,...args);
    }
    wrap(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.wrap.call(jdom,...args);
    }
    wrapAll(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.wrapAll.call(jdom,...args);
    }
    wrapInner(...args:any[]){
        let jdom = G.G$(this.realDom);
        return jdom.wrapInner.call(jdom,...args);
    }

    onClick(fun: Function){
        if (fun && G.G$.isFunction(fun)) {
            this.bind("click",fun);
        }
    }

    onDblClick(fun: Function){
        if (fun && G.G$.isFunction(fun)) {
            this.bind("dblclick",fun);
        }
    }

    onKeyUp(fun: Function){
        if (fun && G.G$.isFunction(fun)) {
            this.bind("keyup",fun);
        }
    }  

    onKeyDown(fun: Function){
        if (fun && G.G$.isFunction(fun)) {
            this.bind("keydown",fun);
        }
    }   
    
    onKeyPress(fun: Function){
        if (fun && G.G$.isFunction(fun)) {
            this.bind("keypress",fun);
        }
    }    
    
    onMouseUp(fun: Function){
        if (fun && G.G$.isFunction(fun)) {
            this.bind("mouseup",fun);
        }
    } 
    
    onMouseDown(fun: Function){
        if (fun && G.G$.isFunction(fun)) {
            this.bind("mousedown",fun);
        }
    }     
  
    onMouseMove(fun: Function){
        if (fun && G.G$.isFunction(fun)) {
            this.bind("mousemove",fun);
        }
    }   
    
    onMouseOver(fun: Function){
        if (fun && G.G$.isFunction(fun)) {
            this.bind("mouseover",fun);
        }
    }  
    
    onMouseOut(fun: Function){
        if (fun && G.G$.isFunction(fun)) {
            this.bind("mouseout",fun);
        }
    }
    // 执行带判定逻辑的事件，如果其中有一个过程返回false就返回false
    doJudgementEvent(eventName:string,...param: any[]){
        let ret:any = this.doEvent(eventName,...param);
        if(ret==false)
            return false;
        if(ret!=null && ret instanceof Array){
            for(let i=0;i<ret.length;i++){
                if(ret[0]==false){
                    return false;
                }
            }
        }
        return true;
    }
    //执行事件
    doEvent(eventName: string,...param: any[]) {
        if(eventName) {
            let resultRe:any[] = [];
            let eventArr:Array<Function> = this.events[eventName]||[];
            eventArr.map((ele) => {
                if(ele != null && (typeof ele === "function")) {
                    let result = ele.call(this,...param);
                    if(result != null) {
                        resultRe.push(result);
                    }
                }
            });
            if(resultRe.length > 0) {
                return resultRe;
            }
        }
        return true;
    }

    haveEvent(eventName: string) {
        return this.events[eventName] && this.events[eventName].length > 0;
    }

    createControl(geartype:string,options:any,callback:Function) {
        let container = this.realDom;
        let props = GearUtil.toProps(options);
        let events:any = null;
        if(props["events"]){
            events = props["events"];
            delete props["events"];
        }
        let ele: any = GearUtil.newInstanceByType(geartype, options, this);
        // if(container.tagName.toLowerCase()=="form"){
        //     props["form"] = container;
        // }else{
        //     let form = this.parents("form:first");
        //     if(form[0]) {
        //         props["formEle"] = form[0];
        //     }
        // }
        if(ele) {
            ReactDOM.render(ele,container,function(){
                if(events){
                    for(let name in events){
                        let fun = events[name];
                        if(typeof fun == "function"){
                            if(this[name]){
                                // 注册事件
                                this[name].call(this,fun);
                            }
                        }
                    }
                }
                if(callback)
                    callback.call(this);
            });
        }
    }

    doRender(callback?:Function) { 
        if(this.ast) {
            // let children = G.G$(this.realDom).html();
            // children = children.replace(/&gt;/g,">").replace(/&lt;/g,"<");
            // G.G$(this.realDom).html(children);
            // G.render({
            //     el: this.realDom,
            //     mounted: ()=>{
            //         window.G.parsed = true;
            //         //渲染结束后执行排队中的function
            //         window.G.doWaitFuns();
            //         if(callback){
            //             callback()
            //         } 
            //     }
            // });
            // 
            //当前的ast对象存在，需要更新对应的节点的父节点。
            let html = this.ast.html();
            if(html && html.html()) {
                let parser = new Parser();
                let astMsg: ParseResult  = parser.parse(html.html());
                let asts = astMsg.ast.children;
                let children: any = [];
                asts.forEach((ast: ASTElement)=>{
                    let reactEle = GearUtil.newReactInstance(ast);
                    children.push(reactEle);
                });
                this.setState({
                    children
                },() => {
                    if(callback){
                        callback()
                    } 
                });
            }else{//支持jQuery append 后手动doRender渲染
                let children = G.G$(this.realDom).html();
                children = children.replace(/&gt;/g,">").replace(/&lt;/g,"<");
                G.G$(this.realDom).html(children);
                G.render({
                    el: this.realDom,
                    mounted: ()=>{
                        window.G.parsed = true;
                        //渲染结束后执行排队中的function
                        window.G.doWaitFuns();
                        if(callback){
                            callback()
                        } 
                    }
                });
            }
        }else {
            //如果ast对象不存在，则代表当前节点是新加入的节点，需要从父节点开始渲染
            let parent = this.realDom.parentElement;
            if(parent) {
                if(G.$(parent).length>0){
                    G.$(parent).doRender(callback);
                }else{
                    G.render({
                        el: this.realDom,
                        mounted: ()=>{
                            window.G.parsed = true;
                            //渲染结束后执行排队中的function
                            window.G.doWaitFuns();
                        }
                    });
                }
            }else {
                G.render({
                    el: document.body,
                    mounted: ()=>{
                        window.G.parsed = true;
                        //渲染结束后执行排队中的function
                        window.G.doWaitFuns();
                        if(callback){
                            callback()
                        } 
                    }
                });
            }
            
        }
    }

    protected addGetterAndSetterInState(state: any) {
        let className = this.constructor.name;
        let propsTemplete = G.tag[className] ? G.tag[className].props : null;
        if(propsTemplete) {
            for(let key in state) {
                let vInState = state[key];
                if(vInState instanceof Function && propsTemplete[key] && propsTemplete[key] != Constants.TYPE.Function) {
                    delete state[key];
                    Object.defineProperty(state, key, {
                        get: function() {
                            let v = vInState();
                            if(this["_" + key]) {
                                return this["_" + key];
                            }
                            if(propsTemplete[key].indexOf(Constants.TYPE.Number) != -1 && ObjectUtil.isNumber(v)) {
                                if(ObjectUtil.isNumber(v)) {
                                    if(ObjectUtil.isInteger(v)) {
                                        this["_" + key] = parseInt(v + "");
                                    }else {
                                        this["_" + key] = parseFloat(v + "");
                                    }
                                }
                                return this["_" + key];
                            }
                            if(propsTemplete[key].indexOf(Constants.TYPE.String) != -1 && typeof v == "string") {
                                this["_" + key] = v + "";
                                return this["_" + key];
                            }
                            if(propsTemplete[key].indexOf(Constants.TYPE.Array) != -1 && v instanceof Array) {
                                if(v instanceof Array){
                                    this["_" + key] = v;
                                }else {
                                    v = v + "";
                                    if(v.length>0)
                                        this["_" + key] = v.split(",");
                                    else
                                        this["_" + key] = [];
                                }
                                return this["_" + key]; 
                            }
                            this["_" + key] = v;
                            return this["_" + key];
                        },
                        set: function(v) {
                            this["_" + key] = v;
                        }
                    });
                }else if(typeof vInState == "string" && vInState.indexOf(",") != -1 && propsTemplete[key] && propsTemplete[key] != Constants.TYPE.String) {
                    Object.defineProperty(state, key, {
                        get: function() {
                            if(this["_" + key]) {
                                return this["_" + key];
                            }
                            if(propsTemplete[key].indexOf(Constants.TYPE.Array) != -1) {
                                this["_" + key] = vInState.split(",");
                            }else {
                                this["_" + key] = vInState;
                            }
                            return this["_" + key];
                        },
                        set: function(v) {
                            this["_" + key] = v;
                        }
                    });
                }
            }
        }
    }  
}