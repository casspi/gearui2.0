import * as Tag from '../Tag';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Modal as AntdModal } from 'antd';
import { ObjectUtil, UUID ,GearUtil} from '../../utils';
import { Http } from "../../utils";
import {Icon as AntdIcon} from 'antd';

export var props = {
    ...Tag.props,
    footer: GearType.Or<boolean, string>(GearType.Boolean, GearType.String),
    maximized: GearType.Boolean,
    confirmLoading: GearType.Boolean,
    closable: GearType.Boolean,
    mask: GearType.Boolean,
    confirmText: GearType.String,//确认按钮文字
    cancelText: GearType.String,//取消按钮文字
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
    // maxable:GearType.Boolean,
    // maxIconClick:GearType.Function,
    centered:GearType.Boolean,//是否垂直居中
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
    centered?:boolean,//是否垂直居中
    maxIconType:string
}

export default class Dialog<P extends typeof props, S extends state> extends Tag.default<P, S> {

    private warpDivId:any;//外部包裹div的id
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
        let width,height;
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
                width = 800;
            }       
            if(this.state.height){
                if(ObjectUtil.isInteger(this.state.height)==true)
                    height = parseInt(this.state.height+"");
                else
                    height = this.state.height;
            }
            
            if(this.state.height){
                // 如果有设置高度，则使用固定大小的样式
                className = className +" ant-modal-dialog ant-modal-dialog-fixedsize";
            }else{
                className = className +" ant-modal-dialog";
            }
            if(this.props.footer!=false){
                className = className + ' ant-modal-hasfooter'
            }
            if(this.props.title!=null){
                className = className + ' ant-modal-hasheader'
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
            //是否垂直居中
            centered: this.state.centered, 
            /** 窗口宽度 */
            width: width,
            height:height,
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
            closable: this.props.closable != false,
            mask: this.props.mask != false,
            confirmText: this.props.confirmText || "确定",
            cancelText: this.props.cancelText || "取消",
            maskClosable: this.props.maskClosable != false,
            wrapClassName: this.props.wrapClassName,
            maskTransitionName: this.props.maskTransitionName,
            transitionName: this.props.transitionName,
            zIndex: this.props.zIndex,
            keyboard: this.props.keyboard,
            content: this.props.content,
            loadType: this.props.loadType || "iframe",
            url: this.props.url,
            dragable: this.props.dragable === true? true : false,
            visible: this.props.visible != false,
            maxable: this.props.maxable||false,
            maxTitle: "最大化",
            isMax: false,
            centered: this.props.centered === true? true : false,
            maxIconType:'border',//switcher//border
            children:[]
        };
    }
    getMaxIconProps(){
        return {
            maxable:this.state.maxable,
            title:this.state.maxTitle,
            type:this.state.maxIconType
        }
    }
    dragEvent() {//拖拽效果
            let dref = this.ref;
            let $dom = G.G$(document);
            let warpId = this.state.id+"dialog-warp";
            // console.log(G.$('#'+warpId+'  '+' .ant-modal'))//通过ID找  
            $dom.on('mousedown.dragable','#'+warpId+'  '+' .ant-modal',function(ev: any){
                dref.onselectstart=()=>{//禁止选中文字
                    return false
                }
                let $modal =  G.$(this);
                G.$(this).css({
                    "left":G.$(this).offset().left-(document.documentElement ? document.documentElement.scrollLeft:document.body.scrollLeft)+"px",
                    "margin":0,
                    "padding-bottom":0,   
                })
                let e = ev || window.event;
                let disX = e.clientX-G.$(this).offset().left+(document.documentElement ? document.documentElement.scrollLeft:document.body.scrollLeft);     //点击时鼠标X坐标与元素原点距离
                let disY = e.clientY-G.$(this).offset().top+(document.documentElement ? document.documentElement.scrollTop : document.body.scrollTop);     //点击时鼠标Y坐标与元素原点距离
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
        //删除外部div
        G.$("#" + this.warpDivId).remove();
        this.setState({
            destory: true
        },()=>{
            if(window['_dialogAfterClose'] && G.G$.isFunction(window['_dialogAfterClose'])){
                window['_dialogAfterClose'](this)
            }
        });
        delete window._dialog[this.props.id];
    }

    isOpen() {
        return this.state.visible;
    }
    
    // renderBody(){
    //     let url: any = this.state.url;
    //     let loadType = this.state.loadType;
    //     let warpId = this.state.id+"dialog-warp";
    //     // console.log(G.$('#'+warpId+'  '+' .ant-modal-body'))  
    //     let modalBody = G.$('#'+warpId+'  '+' .ant-modal-body');
    //     if(url && modalBody[0]){
    //         if(loadType=="async"){
    //             modalBody.html("")
    //             modalBody.load(url);
    //         }else if(loadType=="iframe"){
    //             modalBody.html("")
    //             modalBody.html("<iframe src='"+url+"' frameBorder='0' width='100%' height='100%' data-dialog='"+this.props.id+"'></iframe>");
    //         }
    //     }
       
    // }

    afterRender() {
        if(window['_dialogAfterShow'] && G.G$.isFunction(window['_dialogAfterShow'])){
            window['_dialogAfterShow'](this)
        }
        if(this.state.dragable) this.dragEvent();//绑定拖拽事件
        this.getChildren()
    }    
    afterUpdate() {
        
        
    }
    private oL:any;oT:any;oW:any;oH:any;bodyH:any;
    maxIconClick(){
        if(!this.state.isMax){//最大化
            let offset = G.G$('.ant-modal-dialog').offset();
            let offsetTop = 0;
            if(offset) {
                offsetTop = offset.top;
            }
            let offsetLeft = 0;
            if(offset) {
                offsetLeft = offset.left;
            }
            //记录原始大小
            this.oH = G.G$(document).find('.ant-modal-content').outerHeight();
            this.oW = G.G$(document).find('.ant-modal-content').outerWidth();
            this.oT = offsetTop-(document.documentElement ? document.documentElement.scrollTop : document.body.scrollTop);
            this.oL = offsetLeft-(document.documentElement ? document.documentElement.scrollTop : document.body.scrollTop);
            this.bodyH = G.G$('.ant-modal-body').outerHeight();
            this.setState({
                isMax:true,
                maxTitle:'向下还原',
                dragable:false,
                maxIconType:"switcher"

            },function(){
                let $dom = G.G$(document);
                $dom.off('mousedown.dragable','.ant-modal');//解除拖拽事件
                G.G$('.ant-modal-dialog').css({
                    left:0,
                    top:0,
                    margin:0
                });
                
                $dom.find('.ant-modal-content').outerHeight(window.innerHeight);
                $dom.find('.ant-modal-content').outerWidth(window.innerWidth);
                let outerHeight = G.G$('.ant-modal-footer').outerHeight();
                let headerOuterHeight = G.G$('.ant-modal-header').outerHeight();
                if(outerHeight && headerOuterHeight) {
                    $dom.find('.ant-modal-body').outerHeight(window.innerHeight-outerHeight-headerOuterHeight);
                }
                
            })
        }else{//向下还原
            this.setState({
                isMax:false,
                maxTitle:'最大化',
                dragable:true,
                maxIconType:'border'

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
        // let children = this.getChildren() ||"";//避免子节点为空时，VoidTag 报错
        if(this.state.destory) {
            return null;
        }
        let style:Object;
        if(this.state.dragable){
            style = G.G$.extend({},props.style,{
                cursor:"move",
            });
        }else{
            style = G.G$.extend({},props.style,{
                cursor:"default",
            });
        }
        if(!this.state.footer){
            style['paddingBottom'] = 0
        }
        // let voidTagProps:any = {
        //     onLoadSuccess: ()=> {
        //         if(this.haveEvent("loadSuccess")) {
        //             this.doEvent("loadSuccess");
        //         }
        //         this.renderBody();//渲染modal-body内容
        //         if(this.state.dragable) this.dragEvent();//绑定拖拽事件
        //     },
        // }
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
        delete props.dragable
        return <AntdModal centered  {...props} style={style} getContainer={()=>{
            let node:any = document.querySelector('#'+this.state.id+'dialog-warp');
            if(node){//由于每次显示隐藏都会创建新的节点，所以此处先清处
               node.remove()
            }
            this.ref = document.createElement("div");
            this.ref.id = (this.state.id || UUID.get()) + 'dialog-warp'; 
            // 暂存这个id
            this.warpDivId = this.ref.id;
            document.body.appendChild(this.ref);
            return this.ref;
        }}>
            {this.state.maxable?<AntdIcon {...iconProps} onClick={props.maxIconClick} style={iconStyle}/>:null}
            {props.children}
        </AntdModal>;
    }

    

    private getChildren() {
        let url: any = this.state.url;
        let loadType = this.state.loadType;
        let children: any[] = [];
        if(url) {
            if(loadType=="async"){
                let fn = async ()=> {
                    let result = await Http.get(url);
                    if(result.success){
                        let data = result.data;
                        // let html = "";
                        // data.replace(/<body.*?>([\s\S]+?)<\/body>/img,function(htmls:any){
                        //     //请求页面含有html body标签会报错，此处截取body内容作为渲染
                        //     html = htmls.replace('<body>',"").replace('</body>',"")
                        // })
                        
                        //截取异步请求中的<script></script>
                        let jsReg = new RegExp(/<script.*?>([\s\S]+?)<\/script>/img);
                        // console.log(jsReg)
                        let scriptCode = '';
                        data.replace(jsReg,function(str:any,js:any){
                            scriptCode=str;
                        })
                        scriptCode = scriptCode.replace(/<script.*?>/,"").replace('</script>',"");

                        //截取异步请求中的<style></style>
                        // console.log(data)
                        let matchRes = data.match(/<style.*?>([\s\S]+?)<\/style>/img)//(/<style[^>]*>(.*?)<\/style>/g)
                        // console.log(matchRes)
                        let style = document.createElement("style");
                        style.type = "text/css";
                        if(matchRes && matchRes.length>0){
                            for(let i=0;i<matchRes.length;i++){
                                try{
                                　　style.appendChild(document.createTextNode(matchRes[i].replace(/<style[^>]*>/g,"").replace(/<\/style>/g,"")));
            
                                }catch(ex){
                                　　style.styleSheet.cssText = matchRes[i].replace(/<style[^>]*>/g,"").replace(/<\/style>/g,"");//针对IE
            
                                }
                            }
                        }
                        
                        let r = G.$(data, undefined, true);
                        children = r instanceof Array? r:[r];
                        this.setState({children},()=>{
                            //执行异步加载所需的js代码
                            // console.log(".async-body-"+this.state.id)
                            // G.G$(".async-body-"+this.state.id).load(url)
                            // console.log(scriptCode)
                            eval(scriptCode);
                            var head = document.getElementsByTagName("head")[0];
                            head.appendChild(style);
                        })
                    }
                };
                fn();
            }else if(loadType=="iframe"){
                children = [<iframe key={this.props.id + "_iframe"} src={url} frameBorder={0} width={"100%"} height={"100%"} data-dialog={this.props.id}></iframe>];
                this.setState({children})
            }
        }else {
            let content = this.state.content;
            if(content) {
                children = G.$(content, undefined, true);
                this.setState({children})
            }else {
                children = this.props.children;
                this.setState({children})
            }
        }
        // return children;
    }

    protected findRealDom() {
        return this.ref;
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
        let props: any = G.G$.extend({},param,{
            id:id,
            loadType:param.loadType || 'iframe'
        });
        if(props.controlBar == false) {
            props.footer = props.controlBar;
        }
        props.style = {
            padding: '0px',
            top: props.top + "px"
        }
        props.showIcon = true;
        props.visible = true;
        let dialog =  <Dialog  {...props} ></Dialog>;
        let span = document.createElement("span");
        span.id = id + "span";
        document.body.appendChild(span);
        ReactDOM.render(dialog,span);
        G.$("#" + span.id).remove();
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
            let warpId = this.state.id+"dialog-warp";
            $dom.off('mousedown.dragable','#'+warpId+'  '+' .ant-modal' );
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