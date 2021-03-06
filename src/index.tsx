import G from './Gear';
import * as Tags from './components';
import { WindowUtil } from './utils';
import { Message } from './components/pack';
import { Dialog,Notification } from './components/pack';
import * as utils from './utils';
WindowUtil.extendPrototype();
const SockJs = require('sockjs-client');
G.G$.extend(G.G$.fn,{
    //初始化一个元素
    doRender: function(callback?: Function) {
        if(callback){
            callback(this);
        }
    }
});
let GearWeb:any = function(selector: string|object|Function) {
  return G.$.call(GearWeb, selector);
};
let GN = G.G$.extend(true, G, G.G$);
GearWeb = G.G$.extend(true, GearWeb, GN);
window.G = GearWeb;
window.G.SockJs = SockJs;
// window.G.registerCustomComponents();
window.G.messager = Message.default;
window.G.dialog = Dialog.default;
window.G.notification = Notification.default;
window.G.utils = utils;
window.G.tag = Tags.tags;
window.G.components = Tags.components;

//兼容老版的写法--------------------
window.G.http = utils.Http;
window.G.util = utils.Http;
window.G.post = utils.Http.post;
window.G.put = utils.Http.put;
window.G.get = utils.Http.get;

window.G.head = utils.Http.head;
window.G.delete = utils.Http.delete;
window.G.options = utils.Http.options;
window.G.ajax = utils.Http.ajax;
// window["$"] = window.G;
window.onload = function() {
    window.G.render({
        el: this.document.body,
        mounted: ()=>{
            window.G.parsed = true;
            //渲染结束后执行排队中的function
            window.G.doWaitFuns();
        }
    });
}