import * as Tag from '../Tag';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Modal as AntdModal } from 'antd';
import { ObjectUtil, UUID } from '../../utils';
import VoidTag from '../VoidTag';
import Footer from '../layout/Footer';
import {Icon as AntdIcon} from 'antd';
export var props = {
    ...Tag.props,
    footer: GearType.Or<boolean, string>(GearType.Boolean, GearType.String),
    maximized: GearType.Boolean,
    confirmLoading: GearType.Boolean,
    closable: GearType.Boolean,
    mask: GearType.Boolean,
    confirmText: GearType.String,
    cancelText: GearType.String,
    maskClosable: GearType.Boolean,
    wrapClassName: GearType.String,
    maskTransitionName: GearType.String,
    transitionName: GearType.String,
    zIndex: GearType.Number,
    keyboard: GearType.Boolean,
    content: GearType.String,
    loadType: GearType.Enum<'async' | 'iframe'>(),
    url: GearType.Or(GearType.String, GearType.Function),
    //是否可以拖动
    dragable:GearType.Boolean,
    maxable:GearType.Boolean,
    maxIconClick:GearType.Function
}
export interface state extends Tag.state {
    footer?: boolean | string;
    maximized?: boolean;
    width?: number;
    height?: number;
    confirmLoading?: boolean;
    closable?: boolean;
    mask?: boolean;
    confirmText?: string;
    cancelText?: string;
    maskClosable?: boolean;
    wrapClassName?: string;
    maskTransitionName?: string;
    transitionName?: string;
    zIndex?: number;
    keyboard?: boolean;
    content?: string;
    destory?: boolean;
    loadType?: 'async' | 'iframe';
    url?: string | Function;
    dragable?:boolean,
    maxable?:boolean,//是否显示最大化按钮
    maxTitle?:string,//最大化提示语
    isMax?:boolean,//是否已经最大化
}

export default class Dialog<P extends typeof props, S extends state> extends Tag.default<P, S> {

    constructor(props: P, context?: any) {
        super(props, context);
        window._dialog = window._dialog || {};
        window._dialog[this.props.id] = this;
    }

    getProps() {
        let footer: any = this.props.footer===null?undefined:this.props.footer;
        if(footer==false || footer=="false"){
            footer = null;
        }
        // 是否默认最大化
        var className = this.state.className;
        if(className) {
            className = className + " ";
        }
        let width;
        if(this.state.maximized){
            className = className +" ant-modal-dialog ant-modal-dialog-max";
        }else{
            if(this.state.width){
                if(ObjectUtil.isInteger(this.props.width)) {
                    width = parseInt(this.props.width+"");
                }else {
                    width = this.props.width;
                }
            }else{
                width = 600;
            }       
            if(this.state.height){
                // 如果有设置高度，则使用固定大小的样式
                className = className +" ant-modal-dialog ant-modal-dialog-fixedsize";
            }else{
                className = className +" ant-modal-dialog";
            }
        }
        return G.G$.extend({},this.state,{
            className: className,
            /** 对话框是否可见*/
            visible: this.state.visible,
            /** 确定按钮 loading*/
            confirmLoading: this.state.confirmLoading,
            /** 标题*/
            title: this.state.title,
            /** 是否显示右上角的关闭按钮*/
            closable: this.state.closable,
            /** 窗口宽度 */
            width: width,
            /** 点击确定回调*/
            onOk: (e: React.MouseEvent<any>) => {
                if(this.haveEvent("confirm")) {
                    let c = this.doEvent("confirm",e);
                    if(c && c[0] == true) {
                        this.destroy();
                    }
                }else {
                    this.destroy();
                }
            },
            /** 点击模态框右上角叉、取消按钮、Props.maskClosable 值为 true 时的遮罩层或键盘按下 Esc 时的回调*/
            onCancel: (e: React.MouseEvent<any>) => {
                this.close();
                if(this.haveEvent("cancel")) {
                    let c = this.doEvent("cancel",e);
                    if(c && c[0] == true) {
                        this.destroy();
                    }
                }else {
                    this.destroy();
                }
            },
            afterClose: () => {
                this.doEvent("afterClose");
            },
            maxIconClick:()=>{
                this.maxIconClick();
            },
            /** 是否显示遮盖层 */
            mask: this.state.mask,
            /** 底部内容*/
            footer: footer,
            /** 确认按钮文字*/
            okText: this.state.confirmText,
            /** 取消按钮文字*/
            cancelText: this.state.cancelText,
            /** 点击蒙层是否允许关闭*/
            maskClosable: this.state.maskClosable,
            wrapClassName: this.state.wrapClassName,
            maskTransitionName: this.state.maskTransitionName,
            transitionName: this.state.transitionName,
            zIndex:this.state.zIndex,
            keyboard:this.state.keyboard,
            dragable:this.state.dragable
        });
    }

    getInitialState(): state {
        return {
            maximized: this.props.maximized,
            width: this.props.width,
            height: this.props.height,
            confirmLoading: this.props.confirmLoading,
            closable: this.props.closable !=false,
            mask: this.props.mask !=false,
            confirmText: this.props.confirmText || "确定",
            cancelText: this.props.cancelText || "取消",
            maskClosable: this.props.maskClosable !=false,
            wrapClassName: this.props.wrapClassName,
            maskTransitionName: this.props.maskTransitionName,
            transitionName: this.props.transitionName,
            zIndex: this.props.zIndex,
            keyboard: this.props.keyboard,
            content: this.props.content,
            loadType: this.props.loadType,
            url: this.props.url,
            dragable: this.props.dragable != false,
            visible: this.props.visible != false,
            maxable: this.props.maxable||false,
            maxTitle: "最大化",
            isMax: false
        };
    }
    getMaxIconProps(){
        return {
            maxable:this.state.maxable,
            title:this.state.maxTitle,
            type:"border"
        }
    }
    dragEvent = ()=>{//拖拽效果
            let dref = this.ref
            let $dom = G.G$(document);
            $dom.on('mousedown.dragable','.ant-modal',function(ev: any){
                dref.onselectstart=()=>{//禁止选中文字
                    return false
                }
                let $modal =  G.$(this);
                G.$(this).css({
                    "left":G.$(this).offset().left-(document.documentElement.scrollLeft||document.body.scrollLeft)+"px",
                    "margin":0,
                    "padding-bottom":0,   
                })
                let e = ev || window.event;
                let disX = e.clientX-G.$(this).offset().left+(document.documentElement.scrollLeft||document.body.scrollLeft);     //点击时鼠标X坐标与元素原点距离
                let disY = e.clientY-G.$(this).offset().top+(document.documentElement.scrollTop||document.body.scrollTop);     //点击时鼠标Y坐标与元素原点距离
                let dw = window.innerWidth;
                let dh = window.innerHeight;
                $dom.on("mousemove.dragable" , (ev: any)=>{
                    let e = ev||window.event;
                    let l = e.clientX-disX;
                    let t = e.clientY-disY;
                    if(l<0){
                        l=0
                    }else if(l>dw-$modal.width()){
                            l =dw-$modal.width();
                    }
                    if(t<0){
                        t=0
                    }else if(t>dh-$modal.height()){
                            t = dh-$modal.height();
                    }
                    $modal.css({'left': l +'px',"top":t+"px"});
                })
            })
            $dom.on('mouseup.dragable',()=>{
                $dom.off("mousemove.dragable")
            })  
    }
    onOpen(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("open",fun);
        }
    }
    open() {
        this.setState({
            visible: true
        },()=>{
            this.doEvent("open");
        });
    }

    setBody(html: string,callback?: Function){
        this.setState({
            content: html
        },()=>{
            if(callback)
                callback.call(this);
        });
    }

    // 关闭
    close() {
        this.setState({
            visible: false
        },()=>{
            this.doEvent("close");
        });
    }

    // 销毁
    destroy() {
        this.setState({
            destory: true
        });
        delete window._dialog[this.props.id];
    }

    isOpen() {
        return this.state.visible;
    }

    afterRender() {
        let url: any = this.state.url;
        let loadType = this.props.loadType;
        let modalBody = this.find(".ant-modal-body");
        if(url && modalBody[0]){
            if(loadType=="async"){
                modalBody.load(url);
            }else if(loadType=="iframe"){
                modalBody.html("<iframe src='"+url+"' frameBorder='0' width='100%' height='100%' data-dialog='"+this.props.id+"'></iframe>");
            }
        }
    }    
    private oL;oT;oW;oH;bodyH;
    maxIconClick(){
        if(!this.state.isMax){//最大化
            //记录原始大小
            this.oH = G.G$(document).find('.ant-modal-content').outerHeight();
            this.oW = G.G$(document).find('.ant-modal-content').outerWidth();
            this.oT = G.G$('.ant-modal-dialog').offset().top;
            this.oL = G.G$('.ant-modal-dialog').offset().left;
            this.bodyH = G.G$('.ant-modal-body').outerHeight();
            console.log(this.bodyH)
            this.setState({
                isMax:true,
                maxTitle:'向下还原',
                dragable:false

            },function(){
                let $dom = G.G$(document);
                $dom.off('mousedown.dragable','.ant-modal');//解除拖拽事件
                G.G$('.ant-modal-dialog').css({
                    left:0,
                    top:0
                })
                $dom.find('.ant-modal-content').outerHeight(window.innerHeight);
                $dom.find('.ant-modal-content').outerWidth(window.innerWidth);
                $dom.find('.ant-modal-body').outerHeight(window.innerHeight-G.G$('.ant-modal-footer').outerHeight()-G.G$('.ant-modal-header').outerHeight());
            })
        }else{//向下还原
           
            this.setState({
                isMax:false,
                maxTitle:'最大化',
                dragable:true

            },function(){
                let $dom = G.G$(document);
                this.dragEvent();//重新绑定拖拽
                G.G$('.ant-modal-dialog').css({
                    left:this.oL,
                    top:this.oT
                })
                $dom.find('.ant-modal-content').outerHeight(this.oH)
                $dom.find('.ant-modal-content').outerWidth(this.oW)
                $dom.find('.ant-modal-body').outerHeight(this.bodyH)
            })
        }
        

    }
    render() {
        let props:any = this.getProps();
        let iconProps:any = this.getMaxIconProps();
        delete iconProps.maxable;
        let children = this.getChildren() || "";//避免子节点为空时，VoidTag 报错
        if(this.state.destory) {
            return null;
        }
        let style:Object;
        if(this.state.dragable){
            style={
                cursor:"move",
            };
        }else{
            style={
                cursor:"default",
            };
        }
        let voidTagProps:any = {
            onLoadSuccess: ()=> {
                if(this.haveEvent("loadSuccess")) {
                    this.doEvent("loadSuccess");
                }
            }
        }
        let iconStyle:any = {
            cursor:"pointer",
            border: 0,
            background: "transparent",
            position: "absolute",
            right: "56px",
            top: "22px",
            zIndex:10,
            fontWeight: 700,
            lineHeight: 1,
            textDecoration: "none",
            WebkitTransition: "color .3s",
            OTransition: "color .3s",
            transition: "color .3s",
            color: "rgba(0, 0, 0, 0.45)",
            outline: 0,
            padding: 0,
            height:"16px",
            width:"16px",
        };
    
        return <AntdModal {...props} style={style} getContainer={()=>{
            this.ref = document.createElement("div");
            document.body.appendChild(this.ref);
            if(this.state.dragable) this.dragEvent();
            return this.ref;
        }}>
            {this.state.maxable?<AntdIcon {...iconProps} onClick={props.maxIconClick}  style={iconStyle}/>:null}
            <VoidTag {...voidTagProps}>{children}</VoidTag>
        </AntdModal>;
    }

    protected findRealDom() {
        return this.ref;
    }
   
    private getChildren() {
        let content = this.state.content;
        if(content) {
            return G.$(content, true);
        }
        return this.props.children;
    }
    onConfirm(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("confirm",fun);
        }
    }
    
    onCancel(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("close",fun);
        }
    }
    // 设置标题
    setTitle(title: string){
        this.setState({
            title: title
        });
    }
    // 设置内容
    setContent(text: string){
        this.setState({
            content: text
        });
    }
    // 设置是否可见
    setVisible(visible: boolean){
        this.setState({
            visible: visible
        });
    } 
    // 设置确认按钮状态为loading
    setConfirmLoading(loading: boolean){
        this.setState({
            confirmLoading: loading
        });        
    }

    // 显示一个对话框
    static show(param: any):any{
        // 为对话框分配一个ID
        let id:string = param.id || UUID.get();
        let props: any = param;
        if(props.controlBar == false) {
            props.footer = props.controlBar;
        }
        props.style = {
            padding: '0px'
        }
        props.showIcon = true;
        props.visible = true;
        let dialog = <Dialog {...props}></Dialog>;
        let span = document.createElement("span");
        span = document.body.appendChild(span);
        ReactDOM.render(dialog, span);

        // 返回对对话框的操作句柄
        return {
            "id": id,
            "close":function(){
                window._dialog[id].destroy();
            },
            getDialog:()=>{
                return window._dialog[id];
            },
        }
    }
    //设置是否可以拖拽dragable值
    setDragable (dragable:boolean){
        if(dragable){
            this.dragEvent()
        }else{
            let $dom = G.G$(document);
            $dom.off('mousedown.dragable','.ant-modal');
        }     
        this.setState({
            dragable: dragable
        });
    }
    //设置是否可以最大化
    setMaxable(maxable:boolean){
        this.setState({
            maxable:maxable
        })
    }

}