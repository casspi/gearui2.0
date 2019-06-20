import * as Tag from "../Tag";
import * as Text from "../form/Text";
import * as Number from "../form/Number";
import * as File from "../form/File";
import * as Time from "../form/Time";
import * as Date from "../form/Date";
import * as Datetime from "../form/Datetime";
import * as Radio from "../form/Radio";
import * as Textarea from "../form/Textarea";
import * as TimePicker from "../form/TimePicker";
import { Form as AntdForm  } from 'antd';
import { FormComponentProps } from 'antd/es/form/Form';
import * as React from 'react';
import { ObjectUtil, UUID } from "../../utils";
import { Validator } from "../../validator";
import Http, { methods } from '../../utils/http';
import * as Hidden from './Hidden';
import { Label } from "../data";
export var props = {
    //是否验证隐藏控件，在validator中使用
    validateHidden: GearType.Boolean,
    invalidType: GearType.String,
    ...Tag.props,
    showProgress: GearType.Boolean,
    action: GearType.Or(GearType.String, GearType.Function),//表单提交的地址，如果不设置则默认会使用请求当前页面的servletPath
    method: GearType.Enum<methods>(),//表单提交方式，取值范围包括post、get、put、delete默认为post
    target: GearType.String,//表单提交时的目标窗口
    iframe: GearType.Boolean,//是否以iframe的方式提交
    ajax: GearType.Boolean,//提交表单时是否使用ajax提交，默认为true
    redirect: GearType.String,//提交完成之后转向的路径，仅ajax或iframe方式可用
    // validate:GearType.Boolean
};
export interface state extends Tag.state {
    //控件是否开启验证，每一个控件都存储
    invalidType?: string;
    otherParams?: any;
    showProgress?: boolean;
    action?: string|Function;
    iframe?: boolean;
    validateHidden?: boolean;
    target?: string;
    ajax?: boolean;
    method?: methods;
    redirect?: string;
    validate?: boolean;
    hiddenValue?:any;
    
};

export class Form<P extends (typeof props & FormComponentProps), S extends state> extends Tag.default<P, S> {

    // private values = {};

    // private cacheItems: any = null;

    private addedOtherParam = false;
    private addedParam = false;

    noSubmitArr?:any[] = [];

    constructor(props: P, context: {}) {
        super(props, context);
    }

    afterReceiveProps(nextProps: P) {
        return {};
    }

    getInitialState(): state {
        
        return {
            invalidType: this.props.invalidType,
            validateHidden: this.props.validateHidden,
            showProgress: this.props.showProgress,
            otherParams: {},
            action: this.props.action,
            iframe: this.props.iframe,
            target: this.props.target,
            ajax: this.props.ajax==false?false:true,
            method: this.props.method,
            validate: true,
            redirect: this.props.redirect,
            hiddenValue:null,
            // children: children
        };
    }

    private getProps() {
        if(this.state.ajax == false){
            return G.G$.extend(
                {
                    encType: "multipart/form-data"
                },
                this.state
            ) 
        }
        return G.G$.extend({},this.state);
    }

    private getChildren() {
        let children:any = this.props.children;
        // children.push(<div className={"hidden-warp"} key="hidden-warp">{this.state.hiddenValue}</div>)
        // console.log(children)
        let methodParam = this.getMethodParam();
        if(methodParam != null) {
            if(children instanceof Array) {
                children.push(methodParam);
            }else {
                return [children, methodParam];
            }
        }
        
        return children;
    }
        
    render() {
        let props:any = this.getProps();
        delete props.otherParams;
        delete props.formTagStates;
        delete props.invalidType;
        delete props.validateHidden;
        delete props.showProgress;
        delete props.validate;
        delete props.validation;
        delete props.ajax;
        delete props.hiddenValue;
        let children = this.getChildren();
        
        return (<AntdForm {...props}>
            {children}{this.state.hiddenValue}
        </AntdForm>);
    }

    private getMethodParam() {
        let key = this.ast.id + "_form_item__method";
        let children: any = this.props.children;
        let have = false;
        if(children instanceof Array) {
            children.forEach((child)=>{
                if(child.key == key) {
                    have = true;
                }
            });
        }else {
            if(children && children.key == key) {
                have = true;
            }
        }
        let method = this.state.method;
        if(method && method.toLowerCase() == "put" && !have) {
            let formTag: any = this.props.form.getFieldDecorator("_method",{
                initialValue: "put",
                rules: []
            })(<input type="hidden" name="_method"/>);
            let formItem = <AntdForm.Item key={this.ast.id + "_form_item__method"}>
               {formTag}
            </AntdForm.Item>;
            return formItem;
        }
        return null;
    }


    //验证提示类型
    public getInvalidType(): string | undefined {
        return this.state.invalidType;
    } 

    public validateHidden() {
        return this.state.validateHidden;
    }


    //设置一个form控件的值
    public setFieldValue(name: string, value: any, callback?: Function) {
        let params = {};
        params[name] = value;
        // console.log(params)
        // console.log(this.props.form.getFieldsValue())
        this.props.form.setFieldsValue(params);
        this.validateField(name, callback);
    }
    
    public setFieldsValue(params:any,callback?:Function){
        setTimeout(()=>{
            this.props.form.setFieldsValue(params);
            // this.validateField([""], callback);
        },0)
    }

    //验证一个form控件
    validateField(name: string, callback?: Function): boolean {
        let result: boolean = false;
        this.props.form.validateFieldsAndScroll([name],{force:true},(err, values) => {
            if(!err) {
                result = true;
            }
            if(callback) {
                callback.call(this);
            }
        });
        return result;
    }

    /**
     * 为指定的控件增减验证器
     * @param name 
     * @param rule 
     */
    addValidatorRule(name: string, rule: Validator) {
        G.$("[name='"+name+"']").addValidatorRule(rule);
    }

    /**
     * 获取指定控件的验证错误信息
     * @param name 
     */
    getError(name: string) {
        let errors = this.props.form.getFieldError(name);
        return errors;
    }

    /**
     * 重置控件的值
     */
    reset(name?: string) {
        if(name) {
            this.props.form.resetFields([name]);
        }else {
            this.props.form.resetFields();
        }
    }

    //添加参数的隐藏域
    addParams() {
        //先删除所有的隐藏域
        this.removeAllHiddens(true);
        //获取当前修改过的字段的数据---暂时未实现
        let values: any = this.props.form.getFieldsValue();
        for(let key in values) {
            // console.log(G.$('#'+key))
            let gearObjs = G.$("#" + key)//G.$("[name='" + key + "']");
            if((gearObjs.length == null || gearObjs.length <=0 || gearObjs.eq == null) && !(gearObjs instanceof Tag.default)) {
                //gearObjs = gearObjs.parent()
                gearObjs = G.$("[name='" + key + "']");
                if((gearObjs.length == null || gearObjs.length <=0 || gearObjs.eq == null) && !(gearObjs instanceof Tag.default)) {
                    gearObjs = gearObjs.parent();
                }
            } 
            if(gearObjs.length && gearObjs.length > 1 && gearObjs.eq) {
                for(let i=0; i < gearObjs.length; i++) {
                    let gearObj = gearObjs.eq(i);
                    if(!(gearObj instanceof Tag.default)) {
                        //gearObjs = gearObjs.parent()
                        gearObj = G.$("[name='" + key + "']");
                        if(!(gearObj instanceof Tag.default)) {
                            gearObj = gearObj.parent();
                        }
                    }
                    this.addParamsValueFormat(gearObj, values, key);
                }
            }else {
                this.addParamsValueFormat(gearObjs[0], values, key);
            }
        }
    }

    private addParamsValueFormat(gearObj: any, values: any, key: any) {
        // text、number、file控件，直接使用自身传值
        // if(gearObj instanceof Tag.default && !(gearObj instanceof Text.default || gearObj instanceof Hidden.default || gearObj instanceof Number.default || gearObj instanceof File.default || gearObj instanceof Label.default|| gearObj instanceof Time.default)){
        if(gearObj instanceof Tag.default && !(gearObj instanceof Text.default || gearObj instanceof Hidden.default || gearObj instanceof Number.default || gearObj instanceof File.default || gearObj instanceof Label.default|| gearObj instanceof Time.default ||  gearObj instanceof Radio.default || gearObj instanceof Textarea.default)){
        
            let name = gearObj.props.name || gearObj.props.id;
            let value = values[key];
            if(gearObj instanceof Date.default || gearObj instanceof Datetime.default || gearObj instanceof Time.default) {
                value = gearObj.getFormatValue(value);
            }
            //if(name && gearObj.props.disabled != true) 
            if(name && gearObj.isEnable() == true) {
                this.addHiddenValue(name,value, true);
            }
        }
    }

    removeAllHiddens(inner?:boolean){
        if(inner==true){
            this.find(".inner-hidden").remove();
        }else{
            this.find("div.hidden").remove();       
        }
    }

    //添加其他参数
    addOtherParams() {
        let otherParams: any = this.state.otherParams;
        if(otherParams) {
            if(otherParams instanceof Array) {
                let count = otherParams.length;
                if(count > 0) {
                    otherParams.map((ele) => {
                        let eleKey = ele.split("=")[0];
                        let eleVal = ele.split("=")[1];
                        
                        this.setHiddenValue(eleKey,eleVal, true);
                    });
                }
            }else {
                for(let key in otherParams){
                    let value = otherParams[key];
                    this.setHiddenValue(key,value,true);
                }
            }
        }
    }

    // 设置指定名称的隐藏字段的值
    setHiddenValue(name: any,value: any,inner?:boolean){
        let hiddenDiv = this.getHiddenContainer(inner);
        if(value instanceof Array) {
            // 先删除以前的
            this.removeHiddenValue(name,inner);
            value.forEach((valueInner,index) => {
                this.addHiddenValue(name,valueInner,inner);
            });
        }else {
            // 获取到表单内所有未禁用的指定名称的隐藏控件
            var jinput = hiddenDiv.find("input[type='hidden'][name='"+name+"']").not(":disabled");
            if(jinput.length==0){
                this.addHiddenValue(name,value,inner);
            }else if(jinput.length==1){
                jinput.val(value);
            }else if(jinput.length>1){
                this.removeHiddenValue(name,inner);
                this.addHiddenValue(name,value,inner);
            }
        }
    }

    private getHiddenContainer(inner?:boolean){
        let hiddenDiv;
        // return new Promise(function(resolve){
            let _this = G.G$(this.realDom);
            if(inner==true){
                // this.setState({hiddenValue:<div className='inner-hidden' style={{"display":"none"}}></div>},()=>{
                //     console.log(G.G$('.inner-hidden'));
                //     hiddenDiv = G.G$('.inner-hidden');
                //     // resolve(hiddenDiv);
                // })
                hiddenDiv = _this.find(".inner-hidden");
                if(hiddenDiv.length==0){
                    // hiddenDiv = G.G$("<div class='inner-hidden' style='display:none'></div>")
                    _this.append("<div class='inner-hidden' style='display:none'></div>");
                    // console.log(this.find(".inner-hidden"))
                    // console.log(G.$('#'+this.state.id+'-inner-warp'))
                }
                return _this.find(".inner-hidden");
            }else{
                // this.setState({hiddenValue:<div className='hidden' style={{"display":"none"}}>99999999999</div>},()=>{
                //     // console.log(G.G$('.hidden'));
                //     hiddenDiv = G.G$('.hidden');
                //     // resolve(hiddenDiv);
                // })
                hiddenDiv = _this.find("div.hidden");
                if(hiddenDiv.length==0){
                    // hiddenDiv = G.G$("<div class='hidden' style='display:none'></div>")
                    _this.append("<div class='hidden' style='display:none'></div>");
                }
                return _this.find("div.hidden");          
            }
        // })
        
        
    }

    // 移除隐藏字段
    removeHiddenValue(name: any,inner?:boolean){
        let hiddenDiv = this.getHiddenContainer(inner);
        hiddenDiv.find("input[type='hidden'][name='"+name+"']").not(":disabled").remove();
    }

    // 向指定名称的隐藏字段中添加值，追加的值以逗号分隔
    appendHiddenValue(name: any,value: any,split?:string,inner?:boolean){
        let hiddenDiv = this.getHiddenContainer(inner);
        // 获取到表单内所有未禁用的指定名称的隐藏控件
        var jinput = hiddenDiv.find("input[name='"+name+"']").not(":disabled");
        value = value || "";
        split = split || ",";
        if(value instanceof Array) {
            let newValue: any = null;
            value.forEach((valueInner,index) => {
                if(newValue==null)
                    newValue = valueInner;
                else
                    newValue = newValue+split+valueInner;
            });
            value = newValue;             
        }
        if(jinput.length==0){
            hiddenDiv.append("<input type='hidden' name='"+name+"' value='"+value+"'/>");
        }else{
            var preValue = jinput.val();
            if(preValue == null || preValue == "")
                jinput.val(value);
            else
                jinput.val(preValue + split + value);
        }        
    }

    // 向表单中追回一个隐藏字段
    addHiddenValue(name: any,value: any,inner?:boolean){
        value = value || "";
        if(value instanceof Array) {
            if(value.length>0){
                value.forEach((valueInner,index) => {
                    this.addHiddenValue(name,valueInner,inner);
                });            
            }else{
                this.addHiddenValue(name,null,inner)
            }
        }else{
            let hiddenDiv = this.getHiddenContainer(inner);
            if(typeof value == "object" && value.value){
                value = value.value
            }
            hiddenDiv.append("<input type='hidden' name='"+name+"' value='"+value+"'/>");
        }
    }

    // 设置参数
    setForm(param:{action?: any,ajax?: any,method?: any,otherParams?: any},callback?: Function) {
        this.setState(param,()=>{
            if(callback) {
                callback();
            }
        });    
    }

    validate():boolean {
        let values = this.props.form.getFieldsValue();
        let fieldsname:any[] = [];
        for( let key in values){
            fieldsname.push(key)
            // console.log(fieldsname)
        }
        let noSubmitArr:any = this.noSubmitArr;
        if(noSubmitArr.length > 0){//过滤不需提交的
            for (let i=0;i<noSubmitArr.length;i++){
                fieldsname = fieldsname.filter(o=>o!=noSubmitArr[i])
            }
        }
        let result = false;
        if(this.state.validate == true) {
            this.props.form.validateFieldsAndScroll(fieldsname.length>0?fieldsname:[],{force:true},(err, values) => {
                if (!err) {
                    result = true; 
                }
            });
            return result;
        }
        return true;
    }

    protected _onSubmit() {
        if(this.state.showProgress != false) {
            this.showProgress();
        }
    }

    // 关闭表单提交时的进度条
    private closeProgress(){
        G.messager.progress("close");
    }    

    // 显示表单提交时的进度条
    private showProgress(){
        G.messager.progress();
    }

    submit(param?: any) {
        let callback;
        if(param){
            if(typeof param == "function")
                // 如果param是函数，则直接作为回调函数
                callback = param;
            else if(typeof param == "object")
                // 如果param是对象，则从对象中获取callback属性
                callback = param.callback;
        }
        // console.log(this.props.form.getFieldsValue())
        let validResult = this.validate();
        if(validResult == true) {
            let bsub:any = this.doEvent("beforeSubmit");
            let sub = true;
            if(bsub && bsub.length > 0) {
                sub = bsub[0];
            }
            if(sub == true && (this.realDom instanceof HTMLFormElement)) {
                this._onSubmit();
                this.doEvent("submit");
                //设置了target以后就直接走同步的form提交
                if(this.state.iframe && this.state.target == null) {
                    this.addParams();
                    this.addOtherParams();
                    this.submitIframe();
                }else {
                    if(this.state.ajax == false || this.state.target != null) {
                        //增加额外参数，只提交修改参数
                        this.addParams(); 
                        this.addOtherParams();
                        (this.realDom as any).submit();
                    }else {
                        this.ajaxSubmit(callback);
                    }
                }
                
            }else{
                if(callback)
                    // 6:业务上处理失败，放弃提交
                    callback.call(this,{status:6,message:"在前置事件中取消了操作！"})                
            }
        }else{
            // 如果验证不成功，则直接触发回调，通知提交完成
            if(callback)
                // 4:数据检查失败
                callback.call(this,{status:4,message:"表单验证不通过！"})
        }
    }
    
    //提交form
    ajaxSubmit(callback?:Function){
        if (window["FormData"] !== undefined){
            this.submitXhr(callback);
        } else {
            this.addParams();
            this.addOtherParams();
            this.submitIframe();
        }
    }

    submitIframe(){
		var frameId = UUID.get();
		var frame = G.G$('<iframe id='+frameId+' name='+frameId+'></iframe>').appendTo('body');
		frame.attr('src', window["ActiveXObject"] ? 'javascript:false' : 'about:blank');
		frame.hide();
		
		let submit = () => {
			var form = G.$(this.realDom);
			if (this.state.action){
				form.attr('action', this.state.action);
			}
			var t = form.attr.target, a = form.attr.action;
			form.attr('target', frameId);
			try {
				checkState();
				form[0].submit();
			} finally {
				form.attr('action', a);
				t ? form.attr('target', t) : form.removeAttr('target');
			}
        }
		
		let checkState = () => {
			var f = G.$('#'+frameId);
			if (!f.length){return}
			try{
				var s = f.contents()[0].readyState;
				if (s && s.toLowerCase() == 'uninitialized'){
					setTimeout(checkState, 100);
				}
			} catch(e){
				cb();
			}
		}
		
		var checkCount = 10;
		let cb = () => {
			var f = G.$('#'+frameId);
			if (!f.length){return}
			f.unbind();
			var data = '';
			try{
				var body = f.contents().find('body');
				data = body.html();
				if (data == ''){
					if (--checkCount){
						setTimeout(cb, 100);
						return;
					}
				}
				var ta = body.find('>textarea');
				if (ta.length){
					data = ta.val();
				} else {
					var pre = body.find('>pre');
					if (pre.length){
						data = pre.html();
					}
				}
			} catch(e){
			}
			this.success(data);
			setTimeout(function(){
				f.unbind();
				f.remove();
			}, 100);
        }
        frame.bind('load', cb);
        submit();
    }
    
    submitXhr(callback?:Function){
        let data = this.getParamsAsFormData();
        let action: any = this.state.action||""
        let method = this.state.method||"post";
        if(this.state.method == "put"){
            method = 'post'
        }
        G.G$.ajax({
            url: action,
            type: method,
            xhr: ()=>{
                var xhrMethod = G.G$.ajaxSettings.xhr;
                let xhr: any;
                if(xhrMethod) {
                    xhr = xhrMethod();
                    if (xhr.upload) {
                        xhr.upload.addEventListener('progress', (e: any)=>{
                            if (e.lengthComputable) {
                                var total = e.total;
                                var position = e.loaded || e.position;
                                var percent = Math.ceil(position * 100 / total);
                                this._onProgress(percent);
                                this.doEvent("process",percent);
                            }
                        }, false);
                    }
                }
                return xhr;
            },
            data,
            dataType: 'html',
            cache: false,
            contentType: false,
            processData: false,
            success: (data, textStatus)=>{
                this.success(data);
                if(callback)
                    callback.call(this,data);
            },
            error: (xhr, textStatus, errorThrown)=>{
                console.error("Error:");
                console.error(xhr);
                let data = {
                    status:98,
                    message:"请求失败，请求的URL不存在或者网络异常"
                };
                this.error(data);
                if(callback)
                    callback.call(this,data);                
            }
        });
        
    }

    public setMethod(method:methods) {
        this.setState({
            method: method
        });
    }

    protected _onProgress(percent: any) {

    }
    
    //获取所有的条件
    getParamsAsFormData() {
        this.addParams();
        this.addOtherParams();
        let formData: FormData|undefined;
        if(window["FormData"] !== undefined) {
            
            if(this.realDom instanceof HTMLFormElement) {
                formData = new FormData(this.realDom);
            }
        }else {
            formData = this.serializeArray();
        }
        return formData;
    }

    setOtherParams(param: any,callback?: Function) {
        this.setState({
            otherParams: param
        },()=>{
            if(callback) {
                callback();
            }
        });
    }

    success(data: any) {
        if(typeof data == "string") {
            try{
                data = eval("(" + data + ")");
            }catch(e) {
                console.error("Error for:" + data);
                console.error(e);
                //添加错误处理
                this.error({
                    status: 97,
                    message: "无法识别的响应消息"
                });
                return false;
            }
        }
        this.closeProgress();
        this.careMessage(data);
        return true;
    }

    private error(funOrData: any) {
        this.closeProgress();
        this.careMessage(funOrData || {
            status: 98,
            message: "未知错误"
        });
    }

    //处理返回信息
    private careMessage(data: any) {
        if(!data) {
            return false;
        }
        if(data.action && G.G$.isFunction(data.action)) {
            data.action();
        }else {
            if(data.redirect || this.state.redirect) {
                Http.redirect((data.redirect || this.state.redirect));
                return false;
            }else {
                if(data.status == 0){
                    this._onSubmitSuccess(data);
                    
                    if(this.haveEvent("submitSuccess")) {
                        this.doEvent("submitSuccess",data);
                    }else {
                        Form.submitSuccess(data);
                    }
                }else {
                    this._onSubmitFailed(data);
                    if(this.haveEvent("submitFailed")) {
                        this.doEvent("submitFailed",data);
                    }else {
                        Form.submitFailed(data);
                    }
                }
            }
        }
        return true;
    }

    cancel(){}

    load(data: any) {
        this.props.form.setFieldsValue(data);
    }
    enableValidation() {
        this.setState({
            validate: true
        });
    }
    disableValidation() {
        this.setState({
            validate: false
        });
    }
    resetValidation() {
        this.enableValidation();
    }
    resetDirty() {
        // this[this.tagName]("resetDirty");
    }

    //是否更新
    shouldUpdate(nextProps: P, nextState: S): boolean {
        return true;
    }

    focus() {
        this._onFocus();
        this.doEvent("focus");
        let firstPropDom = G.G$(this.realDom).find("input:not(':hidden')").eq(0);
        let firstTag = G.G$(firstPropDom[0]);
        if(firstTag[0]) {
            let inputs = G.G$(this.realDom).find("input:not(':hidden')");
            inputs.each((i,ele)=>{
                let inputTag = G.G$(ele);
                ((inputTag,inputs)=>{
                    inputTag.bind("keyup",(event)=>{
                        //enter键事件
                        if(event.keyCode === 13) {
                            var next_focus = false;
                            for(var i = 0; i < inputs.length; i ++) {
                                var ele = inputs.eq(i);
                                //G.$(ele) instanceof Tag
                                if(next_focus && ele[0] && ele.css("display") != "none") {
                                    ele.focus();
                                    break;
                                }
                                if((ele[0] == inputTag[0]) && i < inputs.length - 1) {
                                    next_focus = true;
                                }
                            }
                            if(!next_focus) {
                                //代表现在是最后一个控件，如果form上的enter提交时打开的，就自动提交form
                                var form = G.$(this.realDom);
                                if(form) {
                                    form.submit();
                                }
                            }
                        }
                    });
                })(inputTag,inputs);
            });
            
            
            firstTag.focus();
        }
    }
    protected _onFocus() {}

    protected _onSubmitFailed(data: any) {}

    protected _onSubmitSuccess(data: any) {}

    onSubmitSuccess(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("submitSuccess",fun);
        }
    }

    static submitSuccess(fun: any) {
    	if(fun && G.G$.isFunction(fun)) {
        	Form.submitSuccess = fun;
        }else {
        	G.messager.alert('消息','操作成功',"info");
        }
        return Form;
    }

    static focus(index: any) {
    	index = index || 0;
    	var form = G.G$(document).find("[ctype='form']").eq(index);
    	if(!form[0]) {
    		return;
        }
        let formTag: Form<typeof props & FormComponentProps, state> = G.$(form[0]);
    	if(form.attr("focus") != "false") {
    		formTag.focus();
    	}else {
    		index = index + 1;
    		Form.focus(index);
    	}
    }
    //全局提交失败的处理
    static submitFailed(funOrData: any) {
        if(funOrData && G.G$.isFunction(funOrData)) {
        	Form.submitFailed = funOrData;
        }else {
            var data = funOrData;
    		if(data.status==1){
    			G.messager.error('错误','请求了错误的路径');
    		}else if(data.status==2){
    			G.messager.error('错误','你没有登录，请先登录');
    		}else if(data.status==3){
    			G.messager.error('错误','你没有访问该功能的权限');
    		}else if(data.status==4){
    			// 提交的数据验证失败
    			if(data.data && data.data.errors){
    				if($("#form-error").length>0){
                        $("#form-error").empty();
    					var errors = data.data.errors;
    					for(var i=0;i<errors.length;i++){
    						$("#form-error").append("<li>"+errors[i].description+"</li>");
    					}
    					$("#form-error").show();
    				}else{
    					var errors = data.data.errors;
    					var errorString = null;
    					for(var i=0;i<errors.length;i++){
    						if(errorString==null)
    							errorString = errors[i].description;
    						else
    							errorString = errorString + "<br>" + errors[i].description;
    					}
    					G.messager.error('错误',errorString);
    				}
    			}
    		}else{
    			// 其它错误
    			if(data.message){
    				G.messager.error('错误',data.message);
    			}else{
    				G.messager.error('错误',"未知错误，请联系系统管理员");
    			}
    		}
        }
        return Form;
    }

    onSubmitFailed(fun:Function) {
        if(fun && $.isFunction(fun)) {
            this.bind("submitFailed",fun);
        }
    }

    onBeforeSubmit(fun:Function) {
        if(fun && $.isFunction(fun)) {
            this.bind("beforeSubmit",fun);
        }
    }
    //是否开启验证
    public isValidation(): boolean | undefined {
        return this.state.validate;
    } 

}
export default AntdForm.create({})(Form);