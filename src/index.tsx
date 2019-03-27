let time1 = new Date().getTime();
import G from './Gear';
import * as Tags from './components';
import { WindowUtil } from './utils';
import { Message } from './components/pack';
import { Dialog } from './components/pack';
import * as utils from './utils';

WindowUtil.extendPrototype();
const SockJs = require('sockjs-client');
let GearWeb:any = function(selector: string|object|Function) {
  return G.$.call(GearWeb, selector);
};
let GN = G.G$.extend(true, G, G.G$);
GearWeb = G.G$.extend(true, GearWeb, GN);
window.G = GearWeb;
window.G.SockJs = SockJs;
// window.G.registerCustomComponents();
window.G.messager = Message.default;
window.G.dialog = Dialog;
window.G.utils = utils;
window.G.tag = Tags.tags;
window.G.components = Tags.components;
let time111 = new Date().getTime();
console.log("加载前时间1："+ (time111 - time1));
//兼容老版的写法--------------------
window.G.http = utils.Http;
window.G.util = utils.Http;
window["$"] = window.G;
let time11 = new Date().getTime();
console.log("加载前时间2："+ (time11 - time1));

window.onload = function() {
    window.G.render({
        el: this.document.body,
        mounted: ()=>{
            let time2 = new Date().getTime();
            this.console.log("总时间");
            console.log(time2 - time1);
            console.log(time2 - time11);
            window.G.parsed = true;
            //渲染结束后执行排队中的function
            window.G.doWaitFuns();
        }
    });
}