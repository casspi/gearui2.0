import config from './Config';
// import TokenUtil from './Token';
import { UUID, Http } from '.';
// TokenUtil.secret = config.config().prefix;
// TokenUtil.timeStep = 24 * 60 * 60;
export default class WindowUtil {

    static events= {};

    static onresize(fun?: Function) {
        let resizeEvents = this.events["resize"]||[];
        resizeEvents.push(fun);
        this.events["resize"] = resizeEvents;
    }

    //注册window事件
    static init() {
        if(window.addEventListener) {
            document.addEventListener('DOMMouseScroll',this.mouseScroll.bind(this),false);
        }else {
            window.onmousewheel = document["onmousewheel"] = this.mouseScroll.bind(this);
        }
        window.onresize = this.resize.bind(this);
        window.onscroll = document.onscroll = this.scroll.bind(this);
    }

    private static mouseScroll(e:Event):any {
        let scrollEvents = this.events["mouseScroll"]||[];
        if(scrollEvents.length > 0) {
            for(let i = 0; i < scrollEvents.length; i++) {
                let event = scrollEvents[i];
                if(event instanceof Function) {
                    let re = event(e);
                    if(re == false) {
                        return false;
                    }
                }
            }
        }
    }

    private static scroll(e:Event):any {
        let scrollEvents = this.events["scroll"]||[];
        if(scrollEvents.length > 0) {
            for(let i = 0; i < scrollEvents.length; i++) {
                let event = scrollEvents[i];
                if(event instanceof Function) {
                    let re = event(e);
                    if(re == false) {
                        return false;
                    }
                }
            }
        }
    }

    private static resize(e:Event):any {
        let resizeEvents = this.events["resize"]||[];
        if(resizeEvents.length > 0) {
            for(let i = 0; i < resizeEvents.length; i++) {
                let event = resizeEvents[i];
                if(event instanceof Function) {
                    let re = event(e);
                    if(re == false) {
                        return false;
                    }
                }
            }
        }
    }

    /*
        * 事件注册
        * @param Element     ele 
        * @param String      eventType
        * @param Function    fn
        * @param Boolean     isRepeat
        * @param Boolean     isCaptureCatch
        * @return undefined
    */
    static loginEvent(ele: any, eventType: any, fn: any, isRepeat: any, isCaptureCatch: any) {
        if (ele == undefined || eventType === undefined || fn === undefined) {
            throw new Error('传入的参数错误！');
        }

        if (typeof ele !== 'object') {
            throw new TypeError('不是对象！');
        }

        if (typeof eventType !== 'string') {
            throw new TypeError('事件类型错误！');
        }

        if (typeof fn !== 'function') {
            throw new TypeError('fn 不是函数！');
        }

        if (isCaptureCatch === undefined || typeof isCaptureCatch !== 'boolean') {
            isCaptureCatch = false;
        }

        if (isRepeat === undefined || typeof isRepeat !== 'boolean') {
            isRepeat = true;
        }

        if (ele.eventList === undefined) {
            ele.eventList = {};
        }

        let typeN = "";
        if (document["mozFullScreen"] !== undefined) {
            typeN = "DOMMouseScroll";
        }

        if (isRepeat === false) {
            for (var key in ele.eventList) {
                if (key === eventType || key == typeN) {
                    return '该事件已经绑定过！';
                }
            }
        }

        // 添加事件监听
        if (ele.addEventListener) {
            if (document["mozFullScreen"] !== undefined) {
                eventType = "DOMMouseScroll";
            }
            ele.addEventListener(eventType, fn, isCaptureCatch);
            
        } else if (ele.attachEvent) {
            ele.attachEvent('on' + eventType, fn);
        } else {
            return false;
        }

        ele.eventList[eventType] = true;
        return;
    }

    static getUserIdFromSession() {
        if(window.localStorage) {
            return window.localStorage.getItem(`${config.config().prefix}userId`);
        }else {
            return Http.getCookie(`${config.config().prefix}userId`);
        }
        
    }

    static setUserIdFromSession(userId: string) {
        if(window.localStorage) {
            window.localStorage.setItem(`${config.config().prefix}userId`, userId);
        }else {
            Http.setCookie(`${config.config().prefix}userId`, userId);
        }
    }

    static getSessionId() {
        if(window.localStorage) {
            return window.localStorage.getItem(`${config.config().prefix}sessionId`);
        }else {
            return Http.getCookie(`${config.config().prefix}sessionId`);
        }
        
    }

    static setSessionId() {
        let sessionId = UUID.uuid(24,88);
        if(window.localStorage) {
            window.localStorage.setItem(`${config.config().prefix}sessionId`, sessionId);
        }else {
            Http.setCookie(`${config.config().prefix}sessionId`, sessionId);
        }
    }

    static getIeVersion() {
        if(navigator) {
            var browser=navigator.appName;
            var b_version=navigator.appVersion;
            if(browser && b_version) {
                var version=b_version.split(";"); 
                if(version && version[1]) {
                    var trim_Version=version[1].replace(/[ ]/g,"");
                    if(browser=="Microsoft Internet Explorer") {
                        if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE6.0") {
                            return 6;
                        }
                        else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE7.0") {
                            return 7;
                        }
                        else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE8.0") {
                            return 8;
                        }
                        else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE9.0") {
                            return 9;
                        } else {
                            return 10;
                        }
                    }
                }
            }
        }
        return -1;
    }

    static extendPrototype() {
        //扩展js原生方法
        if (typeof String.prototype["startsWith"] != 'function' || typeof String.prototype["startsWith"] == null) {  
            String.prototype["startsWith"] = function (prefix: any){  
               try {
                    var reg = new RegExp("^" + prefix);
                    return reg.test(this.toString());
                } catch (e) {
                    console.error("字符" + prefix + "可能需要转义");
                }
                return false;
            };  
        }
        //扩展js原生方法
        if (typeof String.prototype["endsWith"] != 'function' || typeof String.prototype["startsWith"] == null) {  
            String.prototype["endsWith"] = function (prefix: any){  
                try {
                    var reg = new RegExp(prefix + "$");
                    return reg.test(this.toString());
                } catch (e) {
                    console.error("字符" + prefix + "可能需要转义");
                }
                return false;
            };  
        }
        //扩展js原生方法
        if (typeof Array.prototype["toStringBySeparator"] != 'function') { 
            Array.prototype["toStringBySeparator"] = function (separator: any){  
                var re = "";
                for (var i = 0; i < this.length; i++) {
                    if(re.length > 0) {
                        re += separator;
                    }
                    re += this[i];
                }
                return re;
            };  
        }
        //为数组增加contain方法，用于判断数组中是否存在传入值
        if(typeof Array.prototype["contains"] != "function") {
            Array.prototype["contains"] = function (val: any){
                var i = this.length;  
                while (i--) {
                    if (this[i] === val) {  
                        return true;  
                    }  
                }  
                return false;                 
            }
        }

        //为数组增加indexOf方法，用于判断数组中传入值的位置，返回-1则表示未的攻到
        if (!Array["indexOf"]){
            if(typeof Array.prototype["indexOf"] != "function" || typeof Array.prototype["indexOf"] == null) {
                Array.prototype["indexOf"] = function (val){
                    for (var i = 0; i < this.length; i++) {  
                        if (this[i] == val) {  
                            return i;  
                        }  
                    }  
                    return -1;                 
                }
            }    
        }    

        if(typeof Date.prototype["format"] != "function") {
            Date.prototype["format"] = function(fmt: any) { 
                var o = { 
                   "M+" : this.getMonth()+1,                 //月份 
                   "d+" : this.getDate(),                    //日 
                   "h+" : this.getHours(),                   //小时 
                   "m+" : this.getMinutes(),                 //分 
                   "s+" : this.getSeconds(),                 //秒 
                   "q+" : Math.floor((this.getMonth()+3)/3), //季度 
                   "S"  : this.getMilliseconds()             //毫秒 
               }; 
               if(/(y+)/.test(fmt)) {
                       fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
               }
                for(var k in o) {
                   if(new RegExp("("+ k +")").test(fmt)){
                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
                    }
                }
               return fmt; 
           } 
        }

        // (function() {
        //     if (typeof Object.prototype["__uniqueId"] == "undefined" ) {
        //         var id = 0;
        //         Object.prototype["__uniqueId"] = function() {
        //             if ( typeof this.__uniqueid == "undefined" ) {
        //                 this.__uniqueid = ++id;
        //             }
        //             return this.__uniqueid;
        //         };
        //     }
        // })();
    }

    static domEventHandler(dom: Node) {
        //dom节点变化的监听
        // MutationObserver
        //Event.
        (function(dom) {
            // var MutationObserver:{
            //     prototype: MutationObserver;
            //     new(callback: MutationCallback): MutationObserver;
            // } = window["MutationObserver"] || window["WebKitMutationObserver"] || window["MozMutationObserver"];
            // var observer = new MutationObserver(function (mutations, instance) {
            //     let targets: Array<Node> = [];
            //     let changes: {[index: string]: {added: Node[]}} = {};
            //     let handleTargets:Node[] = [];
            //     mutations.forEach(function (mutation) {
            //         let target = mutation.target;
            //         let targetIndex = targets.indexOf(target);
                    
            //         let change:{added: Node[]} = targetIndex == -1 ? {added: []} : (changes[targetIndex+""] || {added: []});
            //         change.added = change.added || [];
            //         let added = mutation.addedNodes;
            //         if(added != null && added.length > 0) {
            //             added.forEach((node: any)=>{
            //                 let gele = G.$(node);
            //                 if(!gele || !(gele.ast)) {
            //                     change.added.push(node);
            //                 }
            //                 handleTargets.push(node);
            //             });
            //         }
            //         let removed = mutation.removedNodes;
            //         if(removed != null && removed.length > 0) {
            //             removed.forEach((node: any)=>{
            //                 handleTargets.push(node);
            //             });
            //         }
            //         if(change.added.length > 0 || (mutation.removedNodes && mutation.removedNodes.length > 0)) {
            //             if(targetIndex == -1) {
            //                 targets.push(target);
            //                 targetIndex = targets.indexOf(target);
            //             }
            //             changes[targetIndex+""] = change;
            //         }
            //     });
            //     targets.forEach(function(target, index) {
            //         let gele = G.$(target);
            //         let haveRemoved = false;
            //         let haveAdded = false;
            //         if(gele && gele.ast != null) {
            //             let asts = gele.ast.children;
            //             //先去除已经删除的元素
            //             if(asts && asts instanceof Array) {
            //                 for(let i = 0; i < asts.length; i++) {
            //                     let ast = asts[i];
            //                     if(ast.vmdom && ast.vmdom.realDom) {
            //                         if(G.G$(target).find(ast.vmdom.realDom).length == 0) {
            //                             asts.splice(i ,1);
            //                             i--;
            //                             let cacheHtmlElement = G.G$(G.cacheHtml);
            //                             let cacheElement = cacheHtmlElement.find("["+Constants.HTML_PARSER_DOM_INDEX+"='"+ast.id+"']");
            //                             cacheElement.remove();
            //                             G.cacheHtml = cacheHtmlElement.prop("outerHTML");
            //                             haveRemoved = true;
            //                         }
            //                     }
            //                 }
            //             }
            //             let added = changes[index+""].added;
            //             let children = G.G$(target).children();
            //             children.each(function(index, ele) {
            //                 if(added.indexOf(ele) != -1) {
            //                     let prev = G.G$(ele).prev();
            //                     let cacheHtmlElement = G.G$(G.cacheHtml);
            //                     if(prev[0]) {
            //                         let prevEle = G.$(prev[0]);
            //                         if(prevEle && prevEle.ast) {
            //                             let cacheElement = cacheHtmlElement.find("["+Constants.HTML_PARSER_DOM_INDEX+"='"+prevEle.ast.id+"']");
            //                             cacheElement.after(ele);
            //                             G.cacheHtml = cacheHtmlElement.prop("outerHTML");
            //                         }
            //                     }else {
            //                         cacheHtmlElement.prepend(ele);
            //                     }
            //                     haveAdded = true;
            //                 }
            //             });
            //             if(haveAdded || haveRemoved) {
            //                 gele.doRender();
            //             }
            //         }
            //     });
            //     for(let i=0; i < handleTargets.length; i++) {
            //         let ele = handleTargets[i];
            //         let index = G.domEventTargets.indexOf(ele);
            //         G.domEventTargets.splice(index, 1);
            //     }
            // });
            // observer.observe(dom, {
            //     childList: true,
            //     attributes: false,
            //     subtree: false
            // });
            G.G$(dom).on("DOMNodeInserted", function(e) {
                let added = G.$(e.target);
                if((!added || !(added.ast)) && dom == e.currentTarget) {
                    let target = e.currentTarget;
                    let gele = G.$(target);
                    let next = G.G$(e.target).next();
                    // let cacheHtmlElement = G.G$(G.cacheHtml);
                    if(next[0]) {
                        let nextEle = G.$(next[0]);
                        if(nextEle && nextEle.ast) {
                            nextEle.before(e.target);
                            //let cacheElement = cacheHtmlElement.find("["+Constants.HTML_PARSER_DOM_INDEX+"='"+prevEle.ast.id+"']");
                            //cacheElement.after(e.target);
                        }
                    }else {
                        gele.append(e.target);
                    }
                    //G.cacheHtml = cacheHtmlElement.prop("outerHTML");
                    //gele.doRender();
                }
            });

            G.G$(dom).on("DOMNodeRemoved", function(e) {
                let removed = G.$(e.target);
                let cacheHtmlElement = G.G$(G.cacheHtml);
                if(removed && removed.ast && dom == e.currentTarget) {
                    let cacheElement = cacheHtmlElement.find("["+Constants.HTML_PARSER_DOM_INDEX+"='"+removed.ast.id+"']");
                    if(cacheElement[0]) {
                        removed.remove();
                    }
                }
            })
        })(dom)
        
    }
}