import { message as AntdMessage, Modal as AntdModal } from 'antd';
import { ObjectUtil} from '../../utils';
import * as Spin from './Spin';
import * as Label from '../data/Label';
import * as React from 'react';
export default class Messager {

    static spin: Spin.default<any, any>;

    static progress(type?: string) {
        if(type == "close") {
            if(this.spin) {
                this.spin.close();
            }
        }else {
            if(this.spin) {
                this.spin.open();
            }else {
                G.render({
                    el: "<g-spin spinning='true'></g-spin>",
                    mounted: (ele: any) => {
                        this.spin = ele[0];
                    },
                });
            }
        }
    }

    // 显示一个消息提示框
    static alert(title:string,message:string,topOrFun:any,...args: any[]){
        let type;
        let fun: Function;
        let delay;
        let nTop;
        if (ObjectUtil.isFunction(topOrFun)){//为了支持老的写法，有些第三个参数为top 有些为callback
            fun = topOrFun;
        }else{
            nTop = topOrFun
        }
        if(args){
            for(let i=0;i<args.length;i++){
                if(ObjectUtil.isInteger(args[i]))
                    delay = parseInt(args[i]);
                else if(ObjectUtil.isFunction(args[i]))
                    fun = args[i];
                else if(ObjectUtil.isString(args[i]))
                    type = args[i];
            }
        }    
        let labelProps:any = {
            value:message
        }
        let param = {
            title: title || "操作提示",
            content: <Label.default {...labelProps}></Label.default>,
            okText: "确定",
            style: G.G$.extend({},{top:nTop}),
            // centered: true,
            onOk:function() {
                if(fun)
                    fun.call(this);
            },
            zIndex:999999999
        };
        let modal: any;
        if(type && type=="success")
            modal = AntdModal.success(param);
        else if(type && type=="error")
            modal = AntdModal.error(param);
        else if(type && type=="warning")
            modal = AntdModal.warning(param);
        else
            modal = AntdModal.info(param);
        if(delay)
            setTimeout(() => modal.destroy(), delay);
    }

    static info(title:string,message:string,top:number,...args: any[]){
        this.alert(title,message,top,"info",...args);
    }

    static warning(title:string,message:string,top:number,...args: any[]){
        this.alert(title,message,top,"warning",...args);
    }

    static success(title:string,message:string,top:number,...args: any[]){
        this.alert(title,message,top,"success",...args);
    }

    static error(title:string,message:string,top:number,...args: any[]){
        this.alert(title,message,top,"error",...args);
    }    
    
    // 有模式的消息提示框
    static modal = {

        alert : Messager.alert,
        info : Messager.info,
        warning : Messager.warning,
        success : Messager.success,
        error : Messager.error
    }

    // 简单的消息提示
    static simple = {
        alert : function(content:string,duration?:number,onClose?:Function){
            AntdMessage.info(content, duration);
        },
        info : function(content:string,duration?:number,onClose?:Function){
            AntdMessage.info(content, duration);
        },
        warning : function(content:string,duration?:number,onClose?:Function){
            AntdMessage.warning(content, duration);
        },
        error : function(content:string,duration?:number,onClose?:Function){
            AntdMessage.error(content, duration);
        },
        success : function(content:string,duration?:number,onClose?:Function){
            AntdMessage.success(content, duration);
        },
        loading : function(content:string,duration?:number,onClose?:Function){
            AntdMessage.loading(content, duration);
        }
    }

    // 显示一个确认消息框
    static confirm(args:any,message?:string,...otherArgs:any){
        if(typeof args == 'object'){
            let param = {
                // 按钮类型 primary、danger
               title: args.title || "操作确认",
               content: args.message||"你确定要进行该操作吗？",
               className:args.className,
               width: args.width || (args.style && args.style.width)?args.style.width:null,
               style: G.G$.extend({},{top:args.top},args.style),
               okText: args.okText||"确定",
               cancelText: args.cancelText || "取消",
               iconType: args.iconType ||"question-circle",
               okType: args.type||"primary",
               maskClosable: args.maskClosable || false,
               okButtonProps: args.okButtonProps,
               centered: args.centered === false? false:true,
               onOk:function(){
                   if(args.callback)
                   args.callback.call(this,true);
               },
               onCancel:function(){
                   if(args.callback)
                   args.callback.call(this,false);         
               },
               zIndex:args.zIndex || 9999
           };
           let modal = AntdModal.confirm(param);
           if(args.delay)
               setTimeout(() => modal.destroy(), args.delay);  
        }else{
            // 按钮类型 primary、danger
            let type;
            let fun:any;
            let delay;
            if(otherArgs){
                for(let i=0;i<otherArgs.length;i++){
                    if(ObjectUtil.isInteger(otherArgs[i]))
                        delay = parseInt(otherArgs[i]);
                    else if(ObjectUtil.isFunction(otherArgs[i]))
                        fun = otherArgs[i];
                    else if(ObjectUtil.isString(otherArgs[i]))
                        type = otherArgs[i];
                }
            }
            let param = {
                title: args||"操作确认",
                content: message||"你确定要进行该操作吗？",
                okText:"确定",
                cancelText:"取消",
                iconType:"question-circle",
                okType:type||"primary",
                onOk:function(){
                    if(fun)
                        fun.call(this,true);
                },
                onCancel:function(){
                    if(fun)
                        fun.call(this,false);         
                },
                zIndex:9999
            };
            let modal = AntdModal.confirm(param);
            if(delay)
                setTimeout(() => modal.destroy(), delay);       
                
        }
              
    }

}