import G from './Gear';
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
window.G.registerCustomComponents();
window.G.messager = Message;
window.G.dialog = Dialog;
window.G.utils = utils;
//兼容老版的写法--------------------
window.G.http = utils.Http;
window.G.util = utils.Http;
window["$"] = window.G;


window.onload = function() {
    let time =new Date();
    let startTime = time.getTime();
    console.log('start:'+startTime)
    window.G.render({
        el: this.document.body,
        mounted: ()=>{
            let time1 =new Date();
            let rendrOver = time1.getTime()
            console.log('rendrOver:'+rendrOver)
            console.log('expend:'+(rendrOver-startTime)/1000)
            window.G.parsed = true;
            //渲染结束后执行排队中的function
            window.G.doWaitFuns();
            let time2 =new Date();
            let doWaitFunsOver = time2.getTime()
            console.log('doWaitFunsOver:'+doWaitFunsOver)
            console.log('expend:'+(doWaitFunsOver-rendrOver)/1000)
            console.log('count:'+(doWaitFunsOver-startTime)/1000)

        }
    });
}