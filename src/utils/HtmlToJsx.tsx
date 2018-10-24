import * as React from 'react';
import G from '../Gear';
// import {GearArray} from '../core';
import {GearUtil,UUID} from '../utils';
import Tag from '../components/Tag';
export default class HtmlToJsx {

    static htmlToJsx (html:string) {
        let dom = G.G$(html);

        return this.domToJsx(dom);
    }    

    //将dom元素转换成jsx元素
    static domToJsx (dom:JQuery<HTMLElement>,param?:any,callback?:Function) {
        if(dom[0]) {
            if(G.config.LOCAL_TAGNAME == true) {
                G.G$(dom[0]).find(TagNames).each((index, ele)=>{
                    let tagName = ele.tagName.toLowerCase();
                    if(/^g/.test(tagName)) {
                        tagName = tagName.substring(1);
                        G.G$(ele).attr("ctype", tagName);
                    }
                });
            }
            if(dom.attr("ctype")) {
                const tagClass = GearUtil.getClass(dom);
                if(tagClass) {
                    dom.attr("init","off");
                    if(callback && typeof callback == "function") {
                        let paramBack = callback.call(window, dom[0]);
                        if(paramBack && paramBack.length > 0) {
                            if(param) {
                                param = G.G$.extend({}, param, paramBack[0]);
                            }else {
                                param = paramBack[0];
                            }
                        }
                    }
                    return Tag.newInstance(dom,param);
                }
            }
            let props = GearUtil.attrsToProps(dom[0]);
            let tagName = dom[0].tagName;
            let eles = new GearArray<React.ReactNode|string>();
            if(dom.children().length > 0) {
                dom.children().each(function() {
                    eles.add(HtmlToJsx.domToJsx(G.G$(this),null,callback));
                });
            }else {
                let text = dom.text().trim();
                if(text && text.length > 0) {
                    eles.add(dom.text());
                }
            }

            props = GearUtil.parseBaseUiProps(props);
            if(param) {
                props = G.G$.extend(props,param);
            }
            props["key"] = UUID.get();
            if(dom.attr("id")) {
                props["id"] = dom.attr("id");
            }
            if(eles.length() > 0) {
                return React.createElement(tagName,props,eles.toArray());
            }else {
                return React.createElement(tagName,props);
            }
            
        }
        return null;
    }

}