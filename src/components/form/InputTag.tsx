import { Button as AntdButton, Spin as AntdSpin } from 'antd';
import * as React from 'react';
import * as FormTag from './FormTag';
import * as AutoComplete from './AutoComplete';
import * as Text from './Text';
import { methods } from '../../utils/http';
import * as SelectedTag from './SelectedTag';
import DicUtil from '../../utils/DicUtil';
import { UUID } from '../../utils';

export var props = {
    ...FormTag.props,
    inputWidth: GearType.Number,
    repeatAble: GearType.Boolean,
    color: GearType.String,
    inputVisible: GearType.Boolean,
    mustMatch: GearType.Boolean,
    dictype: GearType.Or(GearType.Object, GearType.Function, GearType.String),
    url: GearType.Or(GearType.String, GearType.Function),
    method: GearType.Enum<methods>(),
    controlType: GearType.String,
    dropdownWidth: GearType.Number,
    async: GearType.Boolean,
    limit: GearType.Number,
    rows: GearType.Number,
    value: GearType.Or(GearType.Array, GearType.Function, GearType.String),
    prompt: GearType.String,
    readonly:GearType.Boolean
};

export interface state extends FormTag.state {
    // 可以重复的，默认为false
    repeatAble?: boolean;
    // Tag颜色
    color?: string;
    // 输入框宽度
    inputWidth?: number;
    inputVisible?: boolean;
    loading?: boolean;
    mustMatch?: boolean;
    dictype?: object | string | Function;
    url?: string | Function;
    method?: methods;
    controlType?: string;
    dropdownWidth?: number;
    async?: boolean;
    limit?: number;
    rows?: number;
    value?: any;
    prompt?: string;
}

export default class InputTag<P extends typeof props, S extends state> extends FormTag.default<P, S>{

    // 是否严格匹配，主要用于数字代码集的选择，默认为true
    private _inputControl: any;   
    private _triggerButton: any;

    getProps() {
        super.getProps();
        let state = this.state;
        let className = state.className ? "inputtag-control-wrapper " + state.className : "inputtag-control-wrapper";
        if((this.state.disabled)){
            if(className)
                className = className + " tag-disabled"
            else
                className = "tag-disabled";
        }

        return G.G$.extend({},state, {
            className: className
        });        
    }

    getSelectedTagProps(key:string,value:string,text:string){
        return {
            key: key,
            value: value,
            text: text,
            color: this.props.color,
            closable:((this.state.readOnly) || this.state.disabled)?false:true,
            // showValue:(this.state.mustMatch && this.state.dictype)?true:false,
            onClose:(e: any) => {
                // 移除当前tag
                this._removeValue(key);
            }
        };
    }   

    getInputProps() {
        return G.G$.extend({},{
            className: "inputtag-text-control",
            style: { width: this.state.inputWidth || 150},// display: this.state.inputVisible ? "" : "none" },
            onBlur:() => {
                let value = this._inputControl.getValue();
                let text = this._inputControl.getText();
                if(value && value.length>0) {
                    // 如果设置为不允许重复，先检查是否和现有值重复
                    if(this.state.repeatAble == false) {
                        // 如果不允许重复，先检查值是否已经存在了
                        if(this.existValue(value)==false){
                            this._addValue(value, text);
                        }else{
                            G.messager.simple.info("输入值已存在于选中项中！");
                        }
                    }else {
                        this._addValue(value, text);
                    }
                }
                this._hideInput();
                // if(this._triggerButton)
                //     this._triggerButton.focus();
            },
            onPressEnter: (e: any) => {
                let value = this._inputControl.getValue();
                let text = this._inputControl.getText();
                if(value && value.length>0) {
                    // 如果设置为不允许重复，先检查是否和现有值重复
                    if(this.state.repeatAble == false) {
                        // 如果不允许重复，先检查值是否已经存在了
                        if(this.existValue(value)==false){
                            this._addValue(value, text);
                        }else{
                            G.messager.simple.info("输入值已存在于选中项中！");
                        }
                    }else {
                        this._addValue(value, text);
                    }
                }
                this._hideInput();
                // if(this.state.mustMatch==false || (this.state.dictype ==null && this.state.url == null)){
                //     // this._inputControl.blur()//Text组件的blur事件，
                //     //由于inputtag引用的text 没有 ast 对象无法正常使用find 所以特殊处理一些操作
                //     G.G$(this._inputControl.realDom).blur();
                //     this._hideInput()
                // }
            },
            ref:(ele: any)=>{
                this._inputControl = ele;
            }        
        });
    }     

    getAutoCompleteProps() {
        return G.G$.extend({}, {
            dictype: this.state.dictype,
            url: this.state.url,
            mustMatch: this.state.mustMatch,
            controlType: this.state.controlType,
            dropdownWidth: this.state.dropdownWidth || 150,
            async: this.state.async,
            limit: this.props.limit,
            rows: this.state.rows,
            style: { width: this.state.inputWidth || 150,display:this.state.inputVisible?"block":"none"},
            // onMatchFormat: (option: any) => {
            //     this.doEvent("matchFormat", option);
            // },
            onPressEnter:(e:any)=>{
                if(this.state.mustMatch){
                    this._hideInput();
                }else{
                    if(this._inputControl.getValue()){
                        // 如果不允许重复，先检查值是否已经存在了
                        if(this.state.repeatAble == false){
                            if(this.existValue(this._inputControl.getValue())==false){
                                this._addValue(this._inputControl.getValue(),this._inputControl.getValue());
                            }else{
                                G.messager.simple.info("输入值已存在于选中项中！");
                            }
                        }else{
                            this._addValue(this._inputControl.getValue(),this._inputControl.getValue());
                        }
                    }
                    this._hideInput();
                }
            },
            onBlur: (e: any) => {
                this._hideInput();
            },
            onSelect: (v:any) => {//根据antd api 将onchange改为onSelect
                let vobj = this._inputControl.getOption(v);
                let value = vobj.value||"";
                let text = vobj.text || vobj.value;
                if(this.state.mustMatch){
                    // 如果设置为不允许重复，先检查是否和现有值重复
                    if(this.state.repeatAble == false){
                        // 如果不允许重复，先检查值是否已经存在了
                        if(this.existValue(value)==false){
                            if((this.state.mustMatch && this.state.dictype)){
                                this._addValue(value, text);
                            }else{
                                this._addValue(value, value);
                            }
                        }else{
                            G.messager.simple.info("输入值已存在于选中项中！");
                        }
                    }else{
                        if((this.state.mustMatch && this.state.dictype)){
                            this._addValue(value, text);
                        }else{
                            this._addValue(value, value);
                        }
                    }
                    this._hideInput();
                }else{
                    if(this.state.repeatAble == false && (this.existValue(value)==true || this.existValue(text)==true)){
                        G.messager.simple.info("输入值已存在于选中项中！");
                    }else{
                        this._addValue(value, text);
                    }
                    this._hideInput();
                }
            },
            ref:(ele: any)=>{
                this._inputControl = ele;
            } 
        });
    }    

    getButtonProps(){
        return {
            style:{
                display:(this.state.inputVisible ? "none" : "")
            },
            onClick:this._showInput.bind(this),
            ref:(ele: any)=>{
                this._triggerButton = ele;
            }            
        };
    }

    //插件初始化，状态发生变化重新进行渲染
    getInitialState(): state {
        return {
            value: this.props.value || [],
            inputVisible: this.props.inputVisible,
            disabled: this.props.disabled,
            loading: false,
            repeatAble: this.props.repeatAble==true,
            mustMatch: this.props.mustMatch,
            method: this.props.method,
            dictype: this.props.dictype,
            url: this.props.url,
            controlType: this.props.controlType,
            dropdownWidth: this.props.dropdownWidth,
            prompt: this.props.prompt,
            readOnly: this.props.readonly,
            limit:this.props.limit
        };
    }
    
    makeJsx() {  
        // 输入框是否可见
        let inputControl;
        let _props:any = this.getProps();
        delete _props.inputVisible;
        delete _props.loading;
        delete _props.repeatAble;
        delete _props.mustMatch;
        delete _props.controlType;
        delete _props.dropdownWidth;
        delete _props.invalidType;
        delete _props.labelText;
        delete _props.validation;
        if(this.form){
            delete _props.value
        }
        if(this.state.dictype || this.state.url){
            let props:any = this.getAutoCompleteProps();
            delete props.invalidType;
            delete props.labelText;
            delete props.validation;
            if(this.form){
                delete props.value
            }
            inputControl = <AutoComplete.default key={"input"} {...props}></AutoComplete.default>
        }else{
            let props:any = this.getInputProps();
            delete props.invalidType;
            delete props.labelText;
            delete props.validation;
            // if(this.form){
            //     delete props.value
            // }
            inputControl = <span style={{display:this.state.inputVisible?'block':'none'}}><Text.default key={"input"}  {...props} ></Text.default></span>;
        }
        return <div {..._props}>
                <AntdSpin size={"default"} spinning={this.state.loading}  delay={100}>
                    <div key={"taglist"} className={"tag-list"}>
                        {...this.getTags()}
                    </div>
                    {(this.state.readOnly || this.state.disabled) ? null : (
                    <div key={"taginput"} className={"tag-input"}>
                        {inputControl}
                        <AntdButton key={"button"} size="small" type="dashed" {...this.getButtonProps()}>{this.state.prompt || " + 添加新值"}</AntdButton>
                    </div>)}
                </AntdSpin>
            </div>;
    }

    //获取所有的标签
    private getTags() {
        let values: any = this.state.value;
        let tags: any[] = [];
        if(values instanceof Array) {
            values.map((value: any,index:number)=>{
                let props: any = this.getSelectedTagProps(value.key,value.value,value.text);
                tags.push(<SelectedTag.default  {...props} key={"tag_"+value.key+index}/>);
            });
        }
        return tags;
    }

    //渲染完成之后处理默认值
    afterRender() {
        this._loadDefault();

    }
   
    private _loadDefault(){
        if(this.props.value){
            this.setState({
                loading: true
            },()=>{
                // 如果有设置默认值，支持以逗号分隔的字符串，支持json格式字符串
                if(typeof this.props.value=='string'){
                    let values: any = this.getPropStringArrayValue(this.props.value);
                    if(this.state.dictype && this.state.mustMatch) {
                        let url = this.state.url;
                        let method = this.state.method;
                        let dictype = this.state.dictype;
                        let fn = async () => {
                            let result = await DicUtil.getDic({url, method, dictype});
                            if(result.success) {
                                let message = result.data;
                                let nValues = [];
                                for(var i=0;i<values.length;i++){
                                    for(var j=0;j<message.length;j++){
                                        if(values[i]==message[j].value){
                                            nValues.push(message[j])
                                        }
                                    }
                                }
                                this.setValue(nValues);
                            }else {
                                this.setState({
                                    loading: false
                                });
                            }
                        }
                        fn()
                    }
                    else{
                        // 否则直接赋值
                        this.setValue(values);
                    }
                }else{
                    // Json对象或数组
                    let values: any = this.props.value;
                    this.setValue(values);
                }
            });
        }
    }

    // 显示输入控件
    private _showInput(){  
        this.setState({
            inputVisible: true,
        },()=>{
            if(this._inputControl){
                // console.log(this._inputControl.realDom)
                G.G$(this._inputControl.realDom).find('input').focus()
                // this._inputControl.focus();
            }
        });
    }

    // 隐藏输入框
    private _hideInput(){   
        // if(this._inputControl.toggle){
        //     this._inputControl.toggle(false)
        // } 
        this.setState({
            inputVisible: false,
        },()=>{
            if(this._inputControl){
                this._inputControl.clear();
            }     
        });
    }    

    // 添加一个选中的值
    private _addValue(value: string,text?: string){
        let oldValues = this.getValue();
        let values = this.state.value || [];
        values.push({
            key: UUID.get(),
            value: value,
            text: text
        });
        this.setState({
            value: values
        },()=>{
            this._change(this.getValue(),oldValues);
        });
    }

    private _removeValue(key: string){
        let oldValues = this.getValue();
        let values = this.state.value;
        if(values){
            let newValues:any = [];
            for(var i=0;i<values.length;i++){
                if(values[i].key!=key){
                    newValues.push(values[i]);
                }
            }
            this.setState({
                value: newValues
            },()=>{
                this._change(this.getValue(),oldValues);
            });
            
        }
    }

    // 判断当前选中值中是否有指定的值
    private existValue(value: string): boolean{
        let values: any = this.state.value || [];
        for(var i=0; i<values.length; i++){
            if(values[i].value == value) {
                return true;
            }
        }
        return false;
    }

    private _change(newValues: any, oldValues: any){
        this.doEvent("change",newValues,oldValues);
    }

    getValue(): Array<string> {
        let v = [];
        let values = this.state.value || [];
        for(var i=0;i<values.length;i++){
            v.push(values[i].value);
        }        
        return v;
    }

    getText(): Array<string>{
        let v = [];
        let values = this.state.value || [];
        for(var i=0;i<values.length;i++){
            v.push(values[i].text);
        }        
        return v;
    }

    setValue(values: Array<any>, callback?: ()=>void){       
        let v: any[] = [];
        if(values){
            if((values instanceof Array) == false){
                values = [values];
            }             
            for(var i=0;i<values.length;i++){
                if(typeof values[i] == "string"){
                    v.push({
                        key:UUID.get(),
                        value:values[i],
                        text:values[i]
                    });
                }else{
                    v.push({
                        key:UUID.get(),
                        value:values[i].value,
                        text:values[i].text || values[i].label || values[i].value
                    });
                }
            }
        }
        
        this.setState({
            loading:true,
        },()=>{
            super.setValue(v);
            this.setState({
                loading: false
            }, callback);
        });
    }

    addValue(value:any, callback?: ()=>void){
        let values = this.state.value || [];
        if(typeof value == "string"){
            values.push({
                key:UUID.get(),
                value:values,
                text:values
            });
        }else{
            values.push({
                key:UUID.get(),
                value:values.value,
                text:values.text || values.label || values.value
            });
        }  
        this.setState({
            loading:true,
        },()=>{
            super.setValue(values);
            this.setState({
                loading: false
            }, callback);
        });    
    }

    removeValue(value: any, callback?: ()=>void){
        if(value){
            let values = this.state.value || [];
            let newValues: any[] = [];
            for(var i=0;i<values.length;i++){
                if(typeof value == "string"){
                    if(value!=values[i].value){
                        newValues.push(values[i]);
                    }
                }else if(value instanceof Array){
                    let match = false;
                    for(var j=0;j<value.length;j++){
                        if(typeof value[j]== "string"){
                            if(value[j]==values[i].value){
                                match = true;
                            }     
                        }else{
                            if(value[j].value==values[i].value){
                                match = true;
                            }                              
                        }                  
                    }
                    if(match==false){
                        newValues.push(values[i]);
                    }
                }else{
                    if(value.value!=values[i].value){
                        newValues.push(values[i]);
                    }
                }
            }
            this.setState({
                loading:true,
            },()=>{
                super.setValue(newValues);
                this.setState({
                    loading: false
                }, callback);
            }); 
        }     
    }

    //只读
    readonly(readonly?:boolean) {
        this.setState({
            readOnly: readonly==null?true:readonly
        });
    }

    //禁用
    disable() {
        this.setState({
            disabled: true
        });
    }

    //启用
    enable() {
        this.setState({
            disabled: false
        });
    }  

    reset(){
        super.reset();
        this._loadDefault();
        // if(this.form) {
        // }else {
        // }
        
    }

    // 清除选中值
    clear(){
        if(this.form) {
            super.clear();
        }else {
            this.setValue([]);
        }
    }    

    focus(...args: any[]) { 
        this.find(".ant-btn").focus(...args);      
    }

    blur(...args: any[]){
        this.find(".ant-btn").blur(...args);
    }     
}