import * as FormTag from "./FormTag";
import * as React from 'react';
import { Input as AntdInput, Icon as AntdIcon, Button as AntdButton } from "antd";
import { InputProps } from "antd/lib/input";
import { UUID } from "../../utils";
export var props = {
    ...FormTag.props,
    prompt:GearType.String,
    icon: GearType.String,
    buttonText: GearType.String,
    buttonIcon: GearType.String,
};
export interface state extends FormTag.state {
    
};
export default class Text<P extends typeof props & InputProps, S extends (state & InputProps)> extends FormTag.default<P, S> {

    constructor(props: P, context: {}) {
        super(props, context);
    }

    //获取前置标签
    getAddonBefore() {
        if (typeof this.props.addonBefore == "string") {
            return this.props.addonBefore;
        } else {
            let addonBefore: any = this.props.addonBefore;
            if(addonBefore) {
                addonBefore = G.$(addonBefore);
                //需要从document文档中把节点删掉
                if (addonBefore.remove) {
                    addonBefore.remove();
                }
            }
            return addonBefore;
        }
    }

    //获取后置标签
    getAddonAfter() {
        if (typeof this.props.addonAfter == "string") {
            return this.props.addonAfter;
        } else {
            let addonAfter:any = this.props.addonAfter;
            if(addonAfter) {
                addonAfter = G.$(addonAfter);
                //需要从document文档中把节点删掉
                if (addonAfter.remove) {
                    addonAfter.remove();
                }
            }
            return addonAfter;
        }
    }

    //获取前置图标
    getPrefix() {
        if (typeof this.props.prefix == "string") {
            return this.props.prefix;
        } else {
            let prefix: any = this.props.prefix;
            if(prefix) {
                prefix = G.$(prefix);
                if (prefix.remove) {
                    prefix.remove();
                }
            }
            return prefix;
        }
    }

    //根据传入的参数动态创建控件
    createControl(options?:any){
        let controls = [];
        if(options && options instanceof Array){
            
            for(let i=0;i<options.length;i++){
                let ele = options[i];
                let ctype = ele["ctype"];
                delete ele["ctype"];
                let text = ele["text"];
                delete ele["text"];
                ele["key"] = UUID.get();
                let children = ele["children"];
                if(children){
                    children = this.createControl(children);
                }
                if(ctype=="icon"){
                    controls.push(<AntdIcon {...ele}></AntdIcon>);
                }else if(ctype=="button"){
                    controls.push(<AntdButton {...ele}>{text}</AntdButton>);
                }
            }
        }
        return controls;
    }  

    //获取后置图标
    getSuffix(options?:Array<any>) {
        let controls = [];
        // 如果定义了按钮文本或图标，则添加一个按钮
        if(options){
            if(options instanceof Array == false)
                options = [options];
            let ctls = this.createControl(options);
            if(ctls){
                for(var i=0;i<ctls.length;i++){
                    controls.push(ctls[i]);
                }
            }
        }
        
        if(this.props.icon){
            // let classStr = ""
            // if(this.props.icon.indexOf('icon-')>-1){
            //     classStr = "anticon-image"+" "+this.props.icon;
            // }
            // 包装一个span用于响应鼠标效果和事件
            let spanProps = {
                key: UUID.get(),
                type: this.props.icon,
                className: "icon",
                // className: "icon"+classStr,
                style: {cursor:"pointer"},
                onClick: (e: any) => {
                    //控件基础改变事件
                    this.focus(e);
                    //执行自定义注册的事件
                    this.doEvent("clickIcon", e);
                }
            };
            controls.push(<AntdIcon {...spanProps}/>);
        }       
        // 如果定义了按钮文本或图标，则添加一个按钮
        if(this.props.buttonText || this.props.buttonIcon){
            let button;
            let size: any  = null;
            if(this.props.size && this.props.size=="large")
                size = "large";
            if(this.props.size && this.props.size=="small")
                size = "small";  
            let clickButtonEvent = (e: any) => {
                //控件基础改变事件
                this.focus(e);
                //执行自定义注册的事件
                this.doEvent("clickButton", e);
            };
            if(this.props.buttonText && this.props.buttonIcon){
                button = <AntdButton key={UUID.get()} size={size} className="button" style={{cursor:"pointer"}} icon={this.props.buttonIcon} onClick={clickButtonEvent}>{this.props.buttonText}</AntdButton>
            }else if(this.props.buttonText){
                button = <AntdButton key={UUID.get()} size={size} className="button" style={{cursor:"pointer"}} onClick={clickButtonEvent}>{this.props.buttonText}</AntdButton>
            }else if(this.props.buttonIcon){
                button = <AntdButton key={UUID.get()} size={size} className="button" style={{cursor:"pointer"}} icon={this.props.buttonIcon} onClick={clickButtonEvent}/>
            }
            controls.push(button);
        }  
        return controls;
    }

    //改变事件
    protected _change(e: any) {
        let oldValue = this.getValue();
        let value = e.target.value;
        this.setValue(value,() => {
            let args = [value,oldValue];
            //执行自定义注册的事件
            this.doEvent("change", ...args);
        });
    }

    getInitialState():state & InputProps {
        return {
            value:this.props.value,
            placeholder: this.props.placeholder || this.props.prompt,
            size: this.props.size,
            addonBefore: this.getAddonBefore(),
            addonAfter: this.getAddonAfter(),
            prefix: this.getPrefix(),
            suffix: this.getSuffix(),
            onPressEnter: (e) => {
                //执行自定义注册的事件
                this.doEvent("pressEnter", e);
            },
            onChange: (e) => {
                //控件基础改变事件
                this._change(e);
            },
            onFocus: (e) => {
                //执行自定义注册的事件
                this.doEvent("focus", e);
            },
            onBlur: (e) => {
                //执行自定义注册的事件
                this.doEvent("blur", e);
            },
            type: "text",
        };
    }

    protected getProps() {
        return G.G$.extend({},super.getProps(),this.state,{
            name:this.props.name || this.props.id
        });
    }

    afterRender() {
        super.afterRender()
        let style = this.state.style;
        if(style != null && G.G$.isEmptyObject(style) == false) {
            this.css(style);
        }

        //由于该id和name会渲染到真实input上，此处把组件也绑定到input上方便查找
        G.G$("#"+this.state.id).data("vmdom", this);
    }

    afterUpdate() {
        let style = this.state.style;
        if(style != null && G.G$.isEmptyObject(style) == false) {
            this.css(style);
        }
    }

    makeJsx() {
        let props:any = this.getProps();
        delete props.invalidType;
        delete props.labelText;
        delete props.validation;
        delete props.validateTempId;
        if(this.form){
            delete props.value;
        }
        return <AntdInput {...props}  >
        </AntdInput>
    }
    
    blur(fun: Function){
        if (fun && G.G$.isFunction(fun)) {
            this.bind("blur", fun);
        }else{
            this.ref.input.blur();
        }
    }

    //获取焦点事件
    focus(fun: Function) { 
        if (fun && G.G$.isFunction(fun)) {
            this.bind("focus", fun);
        }else{
            // if(this.ast){//通过其他方式渲染没有ast时
            //     this.find("input").focus();
            // }else{
            //     G.G$(this.realDom).find('input').focus()
            // }
            this.ref.input.focus();
        }        
    }
    //鼠标点击事件
    click(fun: Function) {
        if (fun && G.G$.isFunction(fun)) {
            this.bind("click", fun);
        }else{
            // this.find("input").click();
            this.ref.input.click();

        }         
    }
    onChange(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("change",fun);
        }else{
            G.G$(this.ref.input).change()
        }     
    }
    getText() {
        return this.getValue();
    }
    setIcons(options: any) {
        if(options && options instanceof Array){
            for(let i = 0;i<options.length;i++){
                let ele = options[i];
                let icon = ele["icon"];
                delete ele["icon"];
                ele["ctype"] = "icon";
                ele["type"] = icon;
                ele["style"] = {cursor:"pointer"};
            }
            this.setState({
                suffix: this.getSuffix(options)
            });
        }
    }
    
    clear(){
        this.setValue(null)
    }

    reset(){
        if(this.form) {
            this.form.reset(this.state.id);
        }else{
            this.triggerChange(this.props.value || "");
            this.setState({
                value: this.props.value || "",
            });
        }
    }

}