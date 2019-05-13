import * as React from 'react';
// import * as Tag from '../Tag';
import * as FormTag from '../form/FormTag';
import {Upload,message,Modal,Button,Icon} from 'antd';
import G from '../../Gear';
import {Http,UUID,ObjectUtil} from '../../utils';
import Wrapper from '../../components/Wrapper';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider } from 'antd';
export var props =  {
    ...FormTag.props,
    filelist:GearType.Array<Object>(),//已经上传的文件列表（受控），使用此参数时，如果遇到 onChange 只调用一次的问题，请参考 
    url:GearType.String,//必选参数, 上传的地址
    data:GearType.String,//上传所需参数或返回上传参数的方法
    headers:GearType.Object,//设置上传的请求头部，IE10 以上有效
    showUpoadList:GearType.Boolean,//是否展示 uploadList, 可设为一个对象，用于单独设定 showPreviewIcon 和 showRemoveIcon
    accept:GearType.String,//支持上传的类型，详见：https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept
    beforeupload:GearType.Function,//上传文件之前的钩子，参数为上传的文件，若返回 false 则停止上传。支持返回一个 Promise 对象，Promise 对象 reject 时则停止上传，resolve 时开始上传。注意：IE9 不支持该方法。
    customrequest:GearType.Function,//通过覆盖默认的上传行为，可以自定义自己的上传实现
    onChange:GearType.Function,//上传文件改变时的状态，详见 onChange
    listtype: GearType.Enum<"text"|"picture"|"picture-card">(),//上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
    // onPreview: GearType.Function,//点击文件链接或预览图标时的回调
    // onRemove: GearType.Function,//点击移除文件时的回调，返回值为 false 时不移除。支持返回一个 Promise 对象，Promise 对象 resolve(false) 或 reject 时不移除。
    supportserverrender: GearType.Boolean,//服务端渲染时需要打开这个
    disabled: GearType.Boolean,//是否禁用
    readonly: GearType.Boolean,
    withcredentials:GearType.Boolean,//上传请求时是否携带 cookie
    fileListMax:GearType.Number,
    showIcon:GearType.Boolean,//是否显示上传icon
    buttonText:GearType.String,//按钮文字
}
export interface state extends FormTag.state{
    fileList?:any,
    previewVisible?:boolean,
    previewImage?:any,
    fileListMax?:number,
    showIcon?:boolean,
    buttonText?:string,
}
export default class GUpload<P extends typeof props,S extends state> extends FormTag.default<P,S> {

    getProps() {  
        let state = this.state;
        let className = "upload-control-wrapper clearfix";
        if(props["className"])
            className = className + " " +props["className"];        
        return G.G$.extend({}, state, {
            className: className,
        });
    }  

    getUploadProps() {
        let props:any = this.getProps();
        // 移除在父类定义的属性
        delete props["className"];
        delete props["key"];
        delete props["data-id"];
        delete props["value"];
        delete props["ref"];       
        return G.G$.extend({},props,{//http://localhost:8080/example/Upload/intro
            name: this.props.name,
            defaultFileList: this._dataFilter(this.props.value),//默认已经上传的文件列表
            fileList: this.state.fileList,//已经上传的文件列表（受控），使用此参数时，如果遇到 onChange 只调用一次的问题，请参考 
            action: this.props.url || Http.absoluteUrl("upload"),//必选参数, 上传的地址
            data: this.props.data,//上传所需参数或返回上传参数的方法
            //headers: this.props.headers,//设置上传的请求头部，IE10 以上有效
            showUploadList: this.props.showUpoadList==false?false:true,//是否展示 uploadList, 可设为一个对象，用于单独设定 showPreviewIcon 和 showRemoveIcon
            multiple: false,//是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件。
            accept: this.props.accept,//支持上传的类型，详见：https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-accept
            beforeUpload: (file:any, fileList:any) => {
                return this._beforeUpload(file, fileList);
            },//上传文件之前的钩子，参数为上传的文件，若返回 false 则停止上传。支持返回一个 Promise 对象，Promise 对象 reject 时则停止上传，resolve 时开始上传。注意：IE9 不支持该方法。
            customRequest: this.props.customrequest,//通过覆盖默认的上传行为，可以自定义自己的上传实现
            listtype: this.props.listtype,//上传列表的内建样式，支持三种基本样式 text, picture 和 picture-card
            onChange: (info:any) => {
                if(info.fileList.length>this.state.fileListMax){
                    message.warn(`上传文件数量不能超过 ${this.state.fileListMax} 个`);
                    return
                }
                if (info.file.status == 'uploading') {
                    // 在上传开始时将文件列表加入，不加的话后面就不走了..
                    this.setState({
                        fileList:info.fileList,
                    });
                }
                if (info.file.status === 'done') {
                    if(info.file.response && info.file.response.status==0 && ObjectUtil.isEmpty(info.file.response.data)==false){
                        let data = info.file.response.data;
                        let oldValue = this.getValue();
                        // 上传成功后，更新列表，将列表中当前上传文件中添加服务端的响应对象
                        this.setState({
                            fileList:info.fileList.map((ele:any)=>{
                                if(ele.uid==info.file.uid){
                                    ele.value = data[0];
                                    ele.url = data[0].url;
                                }
                                return ele;
                            }),
                        },()=>{
                            // 触发onChange
                            let newValue = this.getValue();
                            this._change(newValue,oldValue);
                        });
                        message.info(`${info.file.name} 文件上传成功`);
                    }else{
                        message.error(`${info.file.name} 文件上传失败`);
                    }
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} 文件上传失败`);
                }
            },//上传文件改变时的状态，详见 onChange
            onRemove: (file:any) => {
                let oldValue = this.getValue();
                let fileList:Array<any> = this.state.fileList;
                const index = fileList.indexOf(file);
                const newFileList = fileList.slice();
                newFileList.splice(index, 1);
                this.setState({
                    fileList: newFileList
                },() => {
                    this.doEvent("remove",file);
                    if(this.props.onRemove) {
                        this.props.onRemove.call(this);
                    }
                    let newValue = this.getValue();
                    this._change(newValue,oldValue);            
                });
            },//点击移除文件时的回调，返回值为 false 时不移除。支持返回一个 Promise 对象，Promise 对象 resolve(false) 或 reject 时不移除。
            //onPreview: (file) => {
            //    this._onPreview(file);
            //},//点击文件链接或预览图标时的回调（有此方法时，下载不能用，暂时不需要图片预览，所以先注解掉）          
            supportServerRender: this.props.supportserverrender,//服务端渲染时需要打开这个
            disabled: this.state.disabled,//是否禁用
            readonly: this.state.readOnly,//是否只读
            withCredentials:  this.props.withcredentials//上传请求时是否携带 cookie
        });
    }

    getInitialState() {
        let state = this.state;
        let fileList = this._dataFilter(this.props.value);
        return G.G$.extend({},state,{
            previewVisible: false,
            previewImage: null,
            fileList: fileList,
            disabled: this.props.disabled,
            readOnly: this.props.readonly,
            fileListMax: this.props.fileListMax || 9999,
            buttonText: this.props.buttonText || '',
            showIcon: this.props.showIcon==false?false:true
        });
    }

    private _dataFilter(fileList:any) {
        if(fileList){
            let fileListRe = [];
            if(fileList instanceof Array == false) {
                fileList = [fileList];
            }

            for(let i = 0; i < fileList.length; i++) {
                let data = fileList[i];
                let file = {};
                if(typeof data == "string") {
                    file["uid"] = UUID.get();
                    file["name"] = data;
                    file["status"] = "done";
                    file["value"] = {
                        name:data
                    };
                }else{              
                    file["uid"] = data["id"] || UUID.get();
                    file["name"] = data["name"];
                    file["status"] = data["status"] || "done";
                    file["url"] = data["url"];
                    file["value"] = data;
                }
                fileListRe.push(file);
            }
            return fileListRe;
        }
        return null;
    }

    handleCancel = () => this.setState({ previewVisible: false });

    makeJsx () {
        let props = this.getUploadProps();
        let wProps:any = this.getProps();
        return<LocaleProvider locale={zhCN}>
                <Wrapper {...wProps}>
                        <Upload {...props}>
                            <Button disabled={props.disabled==true||props.readonly==true} style={props.style}>
                                {this.state.showIcon?<Icon type={"upload"}></Icon>:null}{this.state.buttonText}
                            </Button>
                        </Upload>
                        <Modal visible={this.state["previewVisible"]} footer={null} onCancel={this.handleCancel}>
                            <img alt="example" style={{ width: '100%' }} src={this.state["previewImage"]} />
                        </Modal>
                    </Wrapper>
            </LocaleProvider> ;
    }

    afterRender() {
        let value = this.getValue();
        //？？？初始化时候不触发验证
        // this.triggerChange(ObjectUtil.isEmpty(value)?null:JSON.stringify(value));        
    }    

    private _change(newValue:any,oldValue:any){
        // 向后台传值时应传json值，所以这里将对象转为json
        this.triggerChange(ObjectUtil.isEmpty(newValue)?null:JSON.stringify(newValue));
        this.setState({},()=>{
            this.doEvent("change",newValue,oldValue);            
        });
        // if(this.props.onchange) {
        //     this.props.onchange.call(this,newValue,oldValue);
        // }
    }

    onChange(fun:any) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("change",fun);
        }
    }

    onRemove(fun:any) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("remove",fun);
        }
    }

    _onPreview(file:any) {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true
        },() => {
            if(this.props.onPreview) {
                this.props.onPreview.call(this);
            }
            this.doEvent("preview",file);
        });
    };
    onPreview(fun:any) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("preview",fun);
        }
    }

    protected _beforeUpload(file:any, fileList:any){
        let re = this.doEvent("beforeUpload");
        if(re instanceof Array && re.length > 0) {
            return re[0];
        }
        if(re){
            return re
        }
        if(this.props.beforeupload) {
            return this.props.beforeupload.call(this);
        }
        return true;
    };
    onBeforeUpload(fun:any) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("beforeUpload",fun);
        }
    }   

    getValue(){
        let value = [];
        let fileList = this.state.fileList;
        if(fileList){
            for(var i=0;i<fileList.length;i++){
                if(fileList[i].value){
                    value.push(fileList[i].value);
                }
            }
        }
        return value;
    }  
    
    focus(...args:any[]) { 
        this.find("button").focus(...args);      
    }

    blur(...args:any[]){
        this.find("button").blur(...args);
    }  

}