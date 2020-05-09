import * as Jquery from 'jquery';
import JqueryTag from './components/JqueryTag';
import { Events, Parser } from './core';
import { GearUtil, StringUtil ,UUID} from './utils';
import Tag from './components/Tag';
import Render from './core/Render';
export default class G {

    static SockJs:any = null;
    static G$:JQueryStatic = Jquery;
    //是否渲染完成
    static parsed: boolean = false;
    //待执行的function
    static waitFuns: Array<Function> = [];

    static events: GearArray<string> = Events["keys"];

    static cannotSetStateEvents: GearArray<string> = Events["cannotSetState"];

    static components = {};

    static tag = {};

    static userComponents = {};

    //所有的虚拟dom节点都存放在这个div中，这个div只在内存中存在
    // static voidParent = document.createElement("div");

    static cacheHtml:string = "";

    static cacheAst: ASTElement;
    //使用唯一id存储ast对象
    static cacheAstMap: {[idx: string]: ASTElement} = {};
    //正在渲染的操作
    static updating: Promise<boolean>[] = [];
    //渲染
    static render(renderOptions: RenderOptions) {
        //渲染指定节点下的控件
        //el: 指定节点
        // console.log(renderOptions)
        let el = renderOptions.el;
        let parser = new Parser();
        let astMsg  = parser.parse(el);
        astMsg.parent = renderOptions['parent'] || astMsg.parent;
        let render = new Render();
        if(this.cacheHtml && this.cacheHtml != "") {
            if(renderOptions['parentAst']) {
                let cacheHtmlElement = this.G$(this.cacheHtml);
                let cacheElement = cacheHtmlElement.find("["+Constants.HTML_PARSER_DOM_INDEX+"='"+renderOptions['parentAst'].id+"']");
                cacheElement.append(astMsg.cacheHtml);
                this.cacheHtml = cacheHtmlElement.prop("outerHTML");

            }else {
                this.cacheHtml = "<span>" + this.cacheHtml + astMsg.cacheHtml + "</span>";
            }

        }else {
            this.cacheHtml = astMsg.cacheHtml;
        }
        if(this.cacheAst) {
            if(renderOptions['parentAst']) {
                astMsg.ast.parent = renderOptions['parentAst'];
                renderOptions['parentAst'].children = renderOptions['parentAst'].children || [];
                renderOptions['parentAst'].children.push(astMsg.ast);
            }else {
                this.cacheAst = <any>{
                    type: 1,
                    tag: "span",
                    id: UUID.get(),
                    children: [this.cacheAst, astMsg.ast],
                    tagClass: "span",
                    html:function():JQuery<HTMLElement>|undefined {
                        let id = this.id;
                        if(id) {
                            let cacheHtml = G.G$(G.cacheHtml).find("["+Constants.HTML_PARSER_DOM_INDEX+"='"+id+"']");
                            if(cacheHtml && cacheHtml.length > 0) {
                                return cacheHtml;
                            }
                        }
                        return undefined;
                    }
                }
            }
        }else{
            this.cacheAst = astMsg.ast;
        }
        // console.log(astMsg.ast)
        render.render(astMsg.ast, astMsg.parent, renderOptions.mounted);
    }

    //注册自定义组件
    static registerComponents(fun: Function) {
        let clazz = GearUtil.createClass(Tag, fun);
        if(clazz != null) {
            this.userComponents[clazz.name] = clazz.clazz;
        }
    }

    //添加正在更新的操作
    static addUpdating(id: Promise<boolean>): Array<Promise<boolean>> {
        this.updating.push(id);
        return this.updating;
    }

    //删除正在更新的操作
    static removeUpdating(id: Promise<boolean>): Array<Promise<boolean>> {
        let index = this.updating.indexOf(id);
        if(index > -1) {
            this.updating.splice(index, 1);
        }
        return this.updating;
    }

    // //注册组件
    // static registerCustomComponents() {
    //     let requireComponent = require['context']('./components', true , /[A-Z]\w+\.(tsx)$/);
    //     requireComponent.keys().forEach((fileName: string) => {
    //         if(fileName.endsWith('index.ts')) {
    //             return;
    //         }
    //         console.log("注册："+ (fileName));
    //         let fileNameArr = fileName.split('/');
    //         let fileNameReal = "./" + fileNameArr[fileNameArr.length - 1];
    //         let time11 = new Date().getTime();
    //         const componentConfig = requireComponent(fileName);
    //         let time121 = new Date().getTime();
    //         console.log("注册单个时间1："+ (time121 - time11));
    //         let componentName:string = fileNameReal.replace(/^\.\/(.*)\.\w+$/, '$1');
    //         if(componentConfig.useName){
    //             componentName = componentConfig.useName
    //         }
            
    //         let componentNameReal = componentName;
    //         componentName = componentName.toLowerCase();
            
    //         // componentName = componentName.toLowerCase();
    //         //componentName = 'g-' + componentName.toLowerCase();
    //         let component = componentConfig.default || componentConfig;
    //         if(component) {
                
    //             //创建一个包含所有的组件方法的类
    //             component.props = componentConfig.props;
    //             component.state = componentConfig.state;
    //             this.components[componentName] = component;
    //             this.tag[componentNameReal] = component;
    //             this.tag[componentName] = component;
    //             if(componentName == "form") {
    //                 this.components["gform"] = componentConfig.Form;
    //             }
    //         }
    //         let time12 = new Date().getTime();
    //         console.log("注册单个时间6："+ (time12 - time121));
    //     });
    //     let time111 = new Date().getTime();
    //     console.log("注册总时间："+ (time111 - time1));
    // }

    static addMothedToTag(key: string, clazz: any) {
        let _this = this;
        //修改对象中的方法，需要先执行对象的promise之后再执行对应的操作。
        clazz[key] = function(...args: any[]) {
            if(this._promise) {
                let promise = _this.then(this._promise, key, ...args);
                return _this.getPromiseObject.call(_this, ...args, promise);
            }
        };
    }

    static addMothedToTagProto(key: string, clazz: any) {
        let _this = this;
        //修改对象中的方法，需要先执行对象的promise之后再执行对应的操作。
        clazz.prototype[key] = function(...args: any[]) {
            if(this._promise) {
                let promise = _this.then(this._promise, key, ...args);

                return {
                    _promise: promise,
                    _then: function(promise: Promise<any>, fun: Function) {
                        promise.then((ele: any) => {
                            if(ele instanceof Promise) {
                                this._then(ele);
                            }else {
                                fun(ele);
                            }
                        });
                    },
                    resolve: function(fun: Function) {
                        this._then(this._promise, fun);
                    }
                };
                // return _this.getPromiseObject.call(_this, ...args, promise);
            }
        };
        for(let key in Events) {
            if(!clazz.prototype[key]) {
                clazz.prototype[key] = function(...args: any[]) {
                    if(this._promise) {
                        let promise = _this.then(this._promise, key, ...args);
                        return {
                            _promise: promise,
                            _then: function(promise: Promise<any>, fun: Function) {
                                promise.then((ele: any) => {
                                    if(ele instanceof Promise) {
                                        this._then(ele);
                                    }else {
                                        fun(ele);
                                    }
                                });
                            },
                            resolve: function(fun: Function) {
                                this._then(this._promise, fun);
                            }
                        };
                        // return _this.getPromiseObject.call(_this, ...args, promise);
                    }
                };
            }
        }
    }

    static then(promise: Promise<any>, key: string, ...args: any[]): any {
        return promise.then((ele: any) => {
            if(ele instanceof Promise) {
                return this.then(ele, key, ...args);
            }else {
                if(ele) {
                    if(ele.finded && ele.result) {
                        return ele.result[key].call(ele.result, ...args);
                    }else if(ele[key]){
                        return ele[key].call(ele, ...args);
                    }
                }
            }
        });
    }

    static go(gen: IterableIterator<any>, value?: any): any {
        let item = gen.next();
        
        if(item.done) {
            if(item.value) {
                return item.value;
            }else {
                return value;
            }
        }
        if(item.value instanceof Promise){
            return item.value.then((e) => {
                let ele = this.go(gen);
                return Promise.resolve(ele);
            });
        }else {
            return this.go(gen, item.value);
        }
    }

    static getPromiseObject(selector: string|Element, promise: Promise<any>) {
        let fnNames:string[] = [];
        let elements: any[] = [];
        let eles = G.G$(this.cacheHtml).find(selector);
        if(eles.length == 0) {
            eles = G.G$(document.body).find(selector);
        }
        for(let i = 0; i < eles.length; i ++) {
            let ele = eles[i];
            let astId = this.G$(ele).attr(Constants.HTML_PARSER_DOM_INDEX);
            let clazz = null;
            if(astId) {
                let ast = this.cacheAstMap[astId];
                if(ast) {
                    clazz = GearUtil.getClass(ast);
                }
                if(ast.tag == "form" || ast.tag == "g-form" || ast.tag == "gform") {
                    clazz = this.components["gform"];
                }
            }
            if(!clazz) {
                clazz = GearUtil.getClassFromTag(ele);
            }
            if(clazz) {
                let newClass = GearUtil.createClass(clazz);
                if(newClass) {
                    for(let key in newClass.clazz) {
                        this.addMothedToTag(key, newClass.clazz);
                        fnNames.push(key);
                    }
                    for(let key in newClass.clazz.prototype) {
                        this.addMothedToTagProto(key, newClass.clazz);
                        fnNames.push(key);
                    }
                    let obj = new newClass.clazz();
                    obj._promise = promise;
                    elements.push(obj);
                }
            }
        }
        let newElements = this.G$(elements);
        if(elements.length > 1) {
            //筛选器获取了多个元素的时候，将各自执行各自的方法
            this.G$.each(fnNames,(i,name)=>{
                let fn:any = (...args:any[])=>{
                    let res = [];
                    for(let j = 0; j < elements.length;j ++) {
                        let ele = elements[j];
                        if(ele[name] != null && this.G$.isFunction(ele[name])) {
                            let re = ele[name].call(ele,...args);
                            res.push(re);
                        }
                    }
                    return res;
                };
                if(name.indexOf(Constants.EXPAND_NAME) != -1) {
                    name = name.replace(Constants.EXPAND_NAME, '');
                }
                newElements[name] = fn;
            });
            newElements.eq = (index:number)=>{
                return elements[index];
            };
            return newElements;
        }else {
            if(elements.length > 0) {
                return elements[0];
            }
            return this.G$([]);
        }
    }

    static $(selector?:string|Element|Function|null, html?: JqueryTag<any, any>, react?: boolean) {
        let ele = this._$(selector, html, react);
        //如果是正确刷新，并且select是一个字符串筛选器，如果是其他对象的筛选器代表对象已经在文档中存在，就直接查找并返回。
        if((ele.finded == false) && this.isUpdating() && (typeof selector == "string" || selector instanceof Element)) {
            let $result = this.async$(selector, html, react);
            let f = this.go($result);
            //返回一个全能对象，执行任何方法的时候都先执行promise的then
            return this.getPromiseObject(selector, f);
        }
        return ele.result;
    }

    //查找页面中的元素
    static* async$(selector?:string|Element|Function|null, html?: JqueryTag<any, any>, react?: boolean) {
        //如果有update正在进行，将等待
        for(let i=0; i<this.updating.length; i++) {
            let p = this.updating[i];
            yield p;
        }
        yield this._$(selector, html, react);
    }

    //查找页面中的元素
    static _$(selector?:string|Element|Function|null, html?: JqueryTag<any, any>, react?: boolean): {finded: boolean, result: any} {
        if(typeof selector == "string" || selector instanceof Element) {
            //如果是节点字符串(<a></a>),并且是要求返回react对象的，返回react对象
            if(typeof selector == "string" && react == true) {
                let isHtml = StringUtil.isHtmlString(selector);
                if(isHtml){
                    let parser = new Parser();
                    return {
                        finded: true,
                        result: parser.parseToReactInstance(selector)
                    };
                }
            }
            //html且react为false
            if(typeof selector == "string") {
                if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {
                    return {
                        finded: true,
                        result: this.G$(selector)
                    };
                }
            }
            let finded = false;
            let doms:JQuery<HTMLElement>|undefined = undefined;
            let vmdoms = this.findVmDomFromCacheAst(selector, (html instanceof JqueryTag) ? html : undefined);
            // console.log(vmdoms)
            if(vmdoms.length > 0) {
                if(vmdoms[0] == -1) {
                    doms = html ? G.G$(html.realDom).find(selector) : this.G$(selector);
                    if(doms.length == 0) {
                        return {
                            finded: true,
                            result: this.G$([])
                        };
                    }
                }
                for(let i = 0; i < vmdoms.length; i++) {
                    let vmdom = vmdoms[i];
                    if(!doms) {
                        if(vmdom && vmdom != -1){
                            doms = this.G$(document.body).find(vmdom.realDom);
                        }
                    }else {
                        if(vmdom && vmdom != -1){
                            doms = doms.add(vmdom.realDom);
                        }
                    }
                }
            }
            // console.log(doms)
            if(!doms) {
                if(html) {
                    if(html instanceof JqueryTag) {
                        doms = this.G$(html.realDom).find(selector);
                    }else {
                        doms = this.G$(html).find(selector);
                    }
                }else {
                    doms = this.G$(selector);
                }
            }
            // if(doms.length == 0){
            //     doms = this.G$(this.voidParent).find(selector);
            //     finded = false;
            // }
            let fnNames = [];
            let eles:any = [];
            
            if(doms.length > 0) {
                for(let i = 0; i < doms.length;i++) {
                    let dom = this.G$(doms[i]);
                    try{
                        let gObj = dom.data("vmdom"); 
                        // console.log(gObj.__proto__.constructor.name)
                        // if(!(gObj instanceof HtmlTag.default)) {//不是原生标签、&& gObj.__proto__.constructor.name != 'Hidden'隐藏字段
                        if(gObj) {    
                        //记录自定义方法名称
                            for(let key in gObj) {
                                if(this.G$.isFunction(gObj[key])) {
                                    fnNames.push(key);
                                }
                            }
                            for(let key in dom) {
                                if(gObj[key] === undefined && this.G$.isFunction(dom[key])) {
                                    ((gObj,key)=>{
                                        gObj[key] = (...args: any[]) => {
                                            let jdom = this.G$(gObj.realDom);
                                            return jdom[key].call(jdom,...args);
                                        };
                                    })(gObj,key);
                                }
                            }
                            if(eles.indexOf(gObj) == -1) {
                                eles.push(gObj);
                            }
                            
                        }else if(dom.length == 1) {
                            let jele = new JqueryTag();
                            jele.realDom = dom[0];
                            var constructor = dom.constructor;
                            this.G$.extend(dom,jele);
                            dom.constructor = constructor;
                            eles.push(dom);
                        }
                    }catch (e){
                        if(react == true) {
                            let parser = new Parser();
                            eles.push(parser.parseToReactInstance(dom[0].outerHTML));
                        }else {
                            if(dom.length == 1) {
                                let jele = new JqueryTag();
                                jele.realDom = dom[0];
                                var constructor = dom.constructor;
                                this.G$.extend(dom,jele);
                                dom.constructor = constructor;
                            }
                            eles.push(dom);
                        }
                    }
                }
                // eles['length'] = doms.length;
                finded = true;
            }
            // console.log(eles)
            if(eles.length > 1) {
                let domArrays = [];
                for(let i = 0; i < eles.length; i++) {
                    // if(doms.eq(i).attr("ctype") == null) {
                    //     domArrays.push(doms[i]);
                    // }
                    domArrays.push(eles[i]);
                }
                doms = this.G$(domArrays);
                //筛选器获取了多个元素的时候，将各自执行各自的方法
                this.G$.each(fnNames,(i,name)=>{
                    let fn:any = (...args:any[])=>{
                        let res = [];
                        for(let j = 0; j < eles.length;j ++) {
                            let ele = eles[j];
                            if(ele[name] != null && this.G$.isFunction(ele[name])) {
                                if(name == "not"){//not涉及到
                                    let re = ele[name].call(ele,...args);
                                    if(re.length>0){
                                        res.push(re);
                                    }
                                }else{
                                    let re = ele[name].call(ele,...args);
                                    res.push(re);
                                }
                            }
                        }
                        return res;
                    };
                    if(name.indexOf(Constants.EXPAND_NAME) != -1) {
                        name = name.replace(Constants.EXPAND_NAME, '');
                    }
                    if(doms) {
                        doms[name] = fn;
                    }
                });
                doms.eq = (index:number)=>{
                    return eles[index];
                };
                
                // doms.length = eles.length;
                // doms[0] = eles
                // console.log(doms)
                return {
                    finded,
                    result: doms
                };
            }else {
                if(eles.length > 0) {
                    if(eles[0] instanceof Tag){//兼容老版返回结果
                        eles[0][0] = eles[0];
                    }
                    eles[0].length=1;
                    return {
                        finded,
                        result: eles[0]
                    };
                }else {
                    if(react) {
                        return {
                            finded,
                            result: vmdoms
                        };
                    }
                    return {
                        finded,
                        result: this.G$([])
                    };
                }
            }
        }else if(typeof selector == "function") {
            if(this.parsed === true) {
                selector();
            }else {
                this.waitFuns.push(selector);
            }
        }else {
            return {
                finded: true,
                result: this.G$(<any>selector)
            };
        }
        return {
            finded: false,
            result: this.G$([])
        };
    }

    static isUpdating() {
        return this.updating.length > 0;
    }

    /**
     * 执行排队的function
     */
    static doWaitFuns() {
        this.waitFuns.forEach(fun => {
            fun.call(this);
        });
    }

    public static findVmDomFromCacheAst(selector: string|Element, cacheHtml?: JqueryTag<any, any>) {
        let vmdoms: any[] = [];
        if(typeof selector == "string") {
            let jEleFromCache = G.G$(cacheHtml ? cacheHtml.ast.html() : this.cacheHtml).find(selector);
            if(jEleFromCache.length > 0 && this.cacheAst) {
                jEleFromCache.each((i, ele)=>{
                    let index = this.G$(ele).attr(Constants.HTML_PARSER_DOM_INDEX);
                    if(index) {
                        let ast = this.cacheAstMap[index];
                        // let indexs: string[] = index.split(",");
                        // let ast = this.cacheAst;
                        // for(let i = 1; i < indexs.length; i++) {
                        //     let idx = indexs[i] ? parseInt(indexs[i]) : -1;
                        //     if(ast) {
                        //         ast = ast.children[idx];
                        //     }else {
                        //         break;
                        //     }
                        // }
                        if(ast && ast != this.cacheAst) {
                            vmdoms.push(ast.vmdom);
                        }
                    }
                });
                return vmdoms;
            }
        }else {
            let vmdom = this.G$(selector).data("vmdom");
            if(vmdom) {
                vmdoms.push(vmdom); 
                return vmdoms;
            }
        }
        return [-1];
    }
    
}