import * as Tag from "../Tag";
import * as Validate from './Validate';
import { Form } from "./index";
import { Validator } from "../../validator";
import { ObjectUtil, UUID } from '../../utils';
import * as React from 'react';
import {FormComponentProps, WrappedFormUtils} from 'antd/es/form/Form';
import { Form as AntdForm ,LocaleProvider} from 'antd';
const AntdFormItem = AntdForm.Item;
import Tooltip from "../pack/Tooltip";
export var props = {
    
    //配合 label 属性使用，表示是否显示 label 后面的冒号
    colon: GearType.Boolean,
    //额外的提示信息，和 help 类似，当需要错误信息和提示文案同时出现时，可以使用这个
    extra: GearType.String,
    //配合 validateStatus 属性使用，展示校验状态图标，建议只配合 Input 组件使用
    hasFeedback: GearType.Boolean,
    //是否显示提示信息
    showHelp:GearType.Boolean,
    //提示信息，如不设置，则会根据校验规则自动生成
    help: GearType.String,
    //label 标签的文本
    labelText: GearType.String,
    //label 标签布局，同 <Col> 组件，设置 span offset 值，如 {span: 3, offset: 12} 或 sm: {span: 3, offset: 12}
    lableCol: GearType.Object,
    //是否必填，如不设置，则会根据校验规则自动生成
    required: GearType.Boolean,
    //校验状态，如不设置，则会根据校验规则自动生成，可选：'success' 'warning' 'error' 'validating'
    validateStatus: GearType.String,
    //需要为输入控件设置布局样式时，使用该属性，用法同 labelCol
    wrapperCol: GearType.Object,
    //onChange
    onChange: GearType.Function,
    //验证
    validation: GearType.Boolean,
    //错误的校验信息
    invalidMessage: GearType.Any,
    
    validationType: GearType.String,
    // 表单验证方式，优先取控件本身的，如果控件本身无配置再获取form上的
    invalidType: GearType.String,

    readOnly: GearType.Boolean,
    
    rules: GearType.Array<any>(),
    value: GearType.Any,
    ...Validate.props,
    ...Tag.props,
    judgeString: GearType.Boolean,//为true时长度判断为字符串长度
};
export interface state extends Tag.state {
    value?: string | string[] | number;
    invalidType?: string;
    //验证
    validation?: boolean;
    //验证器
    rules?: Array<Validator>;
    readOnly?: boolean;
    labelText?: string;
};
export default abstract class FormTag<P extends typeof props, S extends state> extends Tag.default<P, S> {

    protected cannotUpdate:GearArray<keyof S> = new GearArray<keyof state>(["name","id"]);
    protected form: Form.Form<typeof Form.props & FormComponentProps, Form.state>;
    protected initValue=this.state.value;
    // protected itemId = (this.props.id || UUID.get()) + "_item-id"
    constructor(props:any, context: {}){
        super(props);
        this.setForm(this.ast);
    }

    private setForm(ast: ASTElement) {
        if(ast) {
            let parent = ast.parent;
            if(parent && ObjectUtil.isExtends(parent.vmdom, "Form")) {
                this.form = parent.vmdom;
            }else {
                this.setForm(parent);
            }
        }
    }

    protected afterReceiveProps(nextProps: P): Partial<typeof props> {
        let value:any = nextProps.value;
        //日期组件特殊处理
        if(ObjectUtil.isExtends(this, "Date") || ObjectUtil.isExtends(this, "Datetime") || ObjectUtil.isExtends(this, "Time") ){
            value = this.state.value
        }
        return {
            value: value,//
            // ????
            // onChange: nextProps.onChange
        };
    }
    triggerChange(changedValue: any, callback?: Function) {
        let id:any = this.state.id;
        if(this.form) {
            this.form.setFieldValue(id, changedValue, callback);
            // this.needChange = true;
        }else{
        
        }
    }
    protected getProps(){
        let state:any = G.G$.extend({},this.state);
        delete state.invalidType;
        delete state.labelText;
        delete state.validation;
        delete state.value;
        return state;
    }
    getInitialState(): state {
        let props = G.G$.extend({},this.props)
        return {
            rules: Validator.getValidators(props,this),
            validation: this.props.validation!=false,
            invalidType: this.props.invalidType,
            readOnly: this.props.readOnly,
            value: this.props.value,
            labelText: this.props.labelText,
            name: this.props.name,
            id: this.props.id || this.props.name || UUID.get() 
        };
    }

    onChange(fun: Function): void{
        if(fun && G.G$.isFunction(fun)) {
            this.bind("change",fun);
        }else{
            this.find("input").change();
        }  
    }

    setValue(value: any, callback?: Function) {
        if(this.form) {
            this.setState({
                value
            }, () => {
                this.triggerChange(value, callback);
                if(callback){
                    callback.call(this)
                }
            });            
        }else {
            this.setState({
                value
            }, () => {
                if(callback) {
                    callback();
                }
            });
        }
    }

    getValue() {
        return this.state.value;
    }
    
    validate(fun?: Function): boolean {
        let id: any = this.state.id;
        if(this.form && id) {
            return this.form.validateField(id, fun);
        }
        return true;
    }

    enableValidation(params: any) {
        if(this.form) {
            let state = this.state;
            let newState = G.G$.extend({},state, {
                validation: true
            });
            if(params){
                let _validateProps = G.G$.extend(this.props,params);
                newState = G.G$.extend({},newState, {
                    rules: Validator.getValidators(_validateProps, this.constructor)
                });
            }
            this.setState(newState);
        }
    }

    disableValidation() {
        if(this.form) {
            this.setState({
                validation: false
            });
        }
    }

    /**
     * 添加一个验证器
     * @param rule 
     */
    addValidatorRule(rule: Validator) {
        if(this.form) {
            if(rule instanceof Validator) {
                let rules = this.state.rules;
                if(rules) {
                    rules.push(rule);
                    this.setState({
                        rules
                    });
                }
            }else {
                console.error("不是一个正确的验证器类型，请使用G.validator.createValidator({name:'',})");
            }
        }
    }

    // 
    /**
     * 清空控件数据
     */
    clear() {
        if(this.form) {
            if(this.state.value instanceof Array) {
                this.setValue([]);
            }else if(this.state.value instanceof Object) {
                this.setValue({});
            }else if(this.state.value instanceof Number){
                this.setValue(0);
            }else {
                this.setValue("");
            }
        }
    }
    reset(){
        if(this.form) {
            this.form.reset(this.state.id || this.state.name);
        }
    }

    /**
     * 获取控件验证信息
     */
    getValidateMessage() {
        let id: any = this.state.id;
        if(this.form) {
            return this.form.getError(id);
        }
        return null;
    }

    isFormTag() {
        return true;
    }

    //只读
    readonly(readOnly?:boolean) {
        this.setState({
            readOnly: readOnly == null ? true : readOnly
        });
    }

    isReadonly(){
        if(this.state.readOnly == true)
            return true;
        else
            return false;
    }

    onClick(fun:Function) {
        if (fun && G.G$.isFunction(fun)) {
            this.bind("click", fun);
        }
    }

    makeJsx(): React.ReactNode {return null;}
    render() {
        if(this.form){
            if(this.state.disabled===true){//disabled 就不验证
                let arr:any = this.form.noSubmitArr
                if(arr.indexOf(this.state.id)<0){//不含有载push
                    arr.push(this.state.id);
                }
                this.form.noSubmitArr = arr;
            }
        }
        let name: any = this.state.id;
        let ele: React.ReactNode = this.makeJsx();
        // console.log(this.state.rules)
        if(this.form) {
            // console.log(this.initValue)
            let formUtils: WrappedFormUtils = this.form.props.form;
            let rules: any = this.state.rules;
            let formTag = formUtils.getFieldDecorator(name, {
                initialValue: this.initValue,
                rules: this.isValidation() ? rules : [],
            })(ele);
            // console.log(this.state.id)
            // console.log(G.G$(this.state.id))
            return this.getFormItem(formTag);
        }else {
            return Tooltip.addTooltip(ele,this.state.title,this.state.titleAlign);
        }
    }

    /**
     * 获取一个FormItem的标签
     * @param formTag formTag标签
     */
    private getFormItem(formTag: React.ReactNode) {
        let formUtils: WrappedFormUtils = this.form.props.form;
        let tagName: any = this.state.id;
        let validateStatus:'success' | 'warning' | 'error' | 'validating' = "success";
        let help = null;
        let invalidType = this.getInvalidType();
        let errors = formUtils.getFieldError(tagName);
        if(errors && errors.length > 0) {
            validateStatus = "error";
            help = errors[0] || null;
            // 表单验证方式，优先取控件本身的，如果控件本身无配置再获取form上的
            if(invalidType == "fixed") {
                let ele = Tooltip.addInvalidTooltip(formTag,tagName,null,this.state.titleAlign);
                return <AntdFormItem
                hasFeedback={false}
                validateStatus={validateStatus}
                help={help}
                >{ele}</AntdFormItem>;
            }else {
                let ele = Tooltip.addInvalidTooltip(formTag,tagName,errors[0],this.state.titleAlign);
                return <AntdFormItem className={"ant-form-item-with-float-help"}
                    hasFeedback={false}
                    validateStatus={validateStatus}
                    help={null}
                >{ele}</AntdFormItem>;
            }
        }else {
            let ele = Tooltip.addTooltip(formTag,this.state.title,this.state.titleAlign);
            if(invalidType == "fixed") {
                return <AntdFormItem
                hasFeedback={false}
                    validateStatus={validateStatus}
                    help={help}
                >{ele}</AntdFormItem>;
            }else{
                return <AntdFormItem className={"ant-form-item-with-float-help"}
                hasFeedback={false}
                    validateStatus={validateStatus}
                    help={help}
                >{ele}</AntdFormItem>;
            }
        }
    }

    public isValidation(): boolean | undefined {
        if(this.state.validation != null) {
            return this.state.validation;
        }else {
            if(this.form) {
                return this.form.isValidation();
            }
        }
        return true;
    }

    //验证提示类型
    public getInvalidType(): string | undefined {
        if(this.state.invalidType) {
            return this.state.invalidType;
        }else {
            if(this.form) {
                return this.form.getInvalidType();
            }
        }
        return this.state.invalidType;
    } 
    
}