import * as Tag from '../Tag';
import  Dialog from './Dialog';
import  {props as DialogProps,state as DialogState} from './Dialog';
import * as React from 'react';
import {Message} from '../pack';
import  G from '../../Gear';

export var props = {
    ...Tag.props,
    ueTitle: GearType.String,
    ueWidth: GearType.Number,
    viewId: GearType.String,
    textId: GearType.String,
    htmlId: GearType.String,
    length:GearType.Any
}
export interface state extends Tag.state {
    // ueTitle: string,
    // ueWidth: number,
    // viewId: string,
    // textId: string,
    // htmlId: string
}
export default class Ueditor<P extends typeof props,S extends state> extends Tag.default<P,S> {
    
    dialog: Dialog<typeof DialogProps,DialogState>;
    ue: any;
    getProps() {
        let state = this.state;
        return G.G$.extend({},state,{
            onClick:() => {
                if(this.dialog) {
                    this.dialog.open();
                }else {
                    let but = G.$("<input ctype='button' value='test'/>").prependTo(document.body);
                    but.doRender();
                    let __this = this;
                    let windowCon = G.$("<div ctype='window' title='"+this.props.ueTitle+"' ontext='保存' canceltext='取消' width='"+this.props.ueWidth+"'></div>").prependTo(document.body);
                    (function(__this) {
                        windowCon.doRender(function() {
                            __this.dialog = G.$(this);
                            __this.dialog.find(".ant-modal-body").html("<script id='"+__this.props.id+"_editor' type='text/plain'></script>");
                            __this.dialog.onOpen(() => {
                                __this.doEvent("open");
                            });
                            __this.dialog.open();
                            let UEDITOR_CONFIG = window["UEDITOR_CONFIG"]||{};
                            let config = {};
                            for(let key in UEDITOR_CONFIG) {
                                let lowerKey = key.toLowerCase();
                                if(__this.props[lowerKey] != null) {
                                    config[key] = __this.props[lowerKey];
                                }else {
                                    config[key] = UEDITOR_CONFIG[key];
                                }
                            }
                            __this.ue = window["UE"].getEditor(__this.props.id + "_editor",config);
                            (function(__this,) {
                                __this.ue.ready( function( ueditor:any ) {
                                    var value = __this.props.value?__this.props.value:'<p></p>';
                                    __this.ue.setContent(value); 
                                })
                            })(__this);
                            __this.dialog.onConfirm(() => {
                                Ueditor.save(__this);
                                __this._save();
                                __this.doEvent("save");
                            });
                            __this.dialog.onCancel(() => {
                                __this.doEvent("close");
                            });
                        });
                    })(__this);
                }
            }
        });
    }

    getInitialState() {
        let state = this.state;
        return G.G$.extend({},state,{
            readOnly: true,
            autosize: true
        });
    }


    render() {
        // return <script id={this.props.id} type="text/plain"></script>;
        let props = this.getProps();
        console.log(props)
        return <div ref={props.ref} className={props.className} style={{border: "1px solid","minHeight": "100px",padding: "15px",cursor:"text"}} onClick={props.onClick.bind(this)}></div>;
    }
    //当关闭窗口时出发
    onClose(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("close",fun);
        }
    }

    protected _save() {
        let html = this.ue.getContent();
        this.html(html);
    }
    
    onSave(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("save",fun);
        }
    }
    onOpen(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("open",fun);
        }
    }
    getText() {
        let textId = this.props.textId || this.props.id + "_text";
        let ele = G.$("#" + textId);
        return ele.val() || ele.text();
    }
    setText(val:any) {
        let textId = this.props.textId || this.props.id + "_text";
        let ele = G.$("#" + textId);
        ele.text(val);
        ele.val(val);
        this.ue.setContent(val);
    }
    getHtml() {
        var htmlId = this.props.htmlId || this.props.id + "_html";
        let ele = G.$("#" + htmlId);
        return ele.val() || ele.text();
    }
    setHtml(val:any) {
        var htmlId = this.props.htmlId || this.props.id + "_html";
        let ele = G.$("#" + htmlId);
        ele.text(val);
        ele.val(val);
        this.ue.setContent(val);
    }

    static save(ueditor:Ueditor<typeof props,state>) {
		var ue = ueditor.ue;
		var contentHtml = ue.getContent();
		var contentText = ue.getContentTxt();
		var viewId = ueditor.props.viewId || ueditor.props.id + "_view";
		var textId = ueditor.props.textId || ueditor.props.id + "_text";
		var htmlId = ueditor.props.htmlId || ueditor.props.id + "_html";
		var length = ueditor.props.length || 9999;
		if(contentText.length > length) {
			Message.alert("操作失败", "输入内容太长，请保持在:" + length + "个字符以内。","error");
			return false;
        }
        
        if(!G.$("#" + htmlId)[0]) {
            G.G$("<textarea id='"+htmlId+"' style='display:none;' name='"+htmlId+"'></textarea>").insertAfter(ueditor.realDom);
        }
        if(!G.$("#" + textId)[0]) {
            G.G$("<textarea id='"+textId+"' style='display:none;' name='"+textId+"'></textarea>").insertAfter(ueditor.realDom);
        }
		
		G.$("#" + htmlId).val(contentHtml);
		G.$("#" + htmlId).text(contentHtml);
		G.$("#" + textId).val(contentText);
		G.$("#" + textId).text(contentText);
		ueditor.dialog.close();
    }
}