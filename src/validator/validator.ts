import * as validators from '.';
import { ObjectUtil } from '../utils';
// import * as FormTag from '../components/form/FormTag';
// type paramType = NonNullable<typeof FormTag.props & typeof Validator.instance>;
export default class Validator {

    name: string;
    props: any;

    /** validation error message */
    message?: string;
    /** built-in validation type, available options: https://github.com/yiminghe/async-validator#type */
    /**
     * string: Must be of type string. This is the default type.
     * number: Must be of type number.
     * boolean: Must be of type boolean.
     * method: Must be of type function.
     * regexp: Must be an instance of RegExp or a string that does not generate an exception when creating a new RegExp.
     * integer: Must be of type number and an integer.
     * float: Must be of type number and a floating point number.
     * array: Must be an array as determined by Array.isArray.
     * object: Must be of type object and not Array.isArray.
     * enum: Value must exist in the enum.
     * date: Value must be valid as determined by Date
     * url: Must be of type url.
     * hex: Must be of type hex.
     * email: Must be of type email.
     */
    type?: string;
    /** indicates whether field is required */
    required?: boolean;
    /** treat required fields that only contain whitespace as errors */
    whitespace?: boolean;
    /** validate the exact length of a field */
    len?: number;
    /** validate the min length of a field */
    min?: number|string;
    /** validate the max length of a field */
    max?: number|string;
    /** validate the value from a list of possible values */
    enum?: string | string[];
    /** validate from a regular expression */
    pattern?: RegExp;
    /** transform a value before validation */
    transform?: (value: any) => any;
    /** custom validate function (Note: callback must be called) */
    //validator? = (rule: any, value: any, callback: any, source?: any, options?: any) => {};
    validator?: any;
    judgeString?:boolean;
    //自定义校验规则
    static customvalidtors = {};
    //全局校验提示信息
    static invalidMessage = {};

    static instance = new Validator();

    constructor(props?: any, clazz?: any) {
        if(props == null) {
            return;
        }
        this.props = props;
        // if (props.name) {
        //     this.name = props.name;
        // }
        this.message = typeof this.props.invalidMessage==="string"?this.props.invalidMessage:null || 
        (this.props.invalidMessage&&this.props.invalidMessage[this.props.vtype])?this.props.invalidMessage[this.props.vtype]:null ||
         Validator.invalidMessage[this.name] || this.message;
        // if (props.type) {
        //     this.type = props.type;
        // }
        if (props.required) {
            this.required = props.required;
        }
        if (props.whitespace) {
            this.whitespace = props.whitespace;
        }
        if (props.len) {
            this.len = props.len;
        }
        if (props.min) {
            this.min = props.min;
        }
        if (props.max) {
            this.max = props.max;
        }
        if (props.enum) {
            this.enum = props.enum;
        }
        if (props.pattern) {
            this.pattern = props.pattern;
        }
        if (props.transform) {
            this.transform = props.transform;
        }
        if (props.validator) {
            this.validator = props.validator || null;
        }
        this.parseMessage(props);
    }

    //解析验证信息中的正则信息
    parseMessage(props: any) {
        if(this.message) {
            this.message = this.message.replace(/\{([a-zA-Z0-9_\-]+)\}/g,function(match,m1){
                var propertyName = m1;
                if (props[propertyName]) {
                    return props[propertyName];
                } else if (props.props && props.props[propertyName]) {
                    return props.props[propertyName];
                }
            });
        }
    }

    static createValidator(props: any) {
        if (props.name == null) {
            let v = new Validator(props);
            return v;
        } else {
            console.error("验证器的name属性不能为空");
        }
        return null;
    }

    static extendValidtor(props: any) {
        if (props.name == null && props.name != "") {
            this.customvalidtors[props.name] = props;
        } else {
            console.error("验证器的name属性不能为空");
        }
    }

    static getValidators(props: any, clazz?: any) {
        let validatorsArray: Array<any> = [];
        //必填校验
        if ((props.required && props.required == true)) {
            props.vtype = 'required';
            validatorsArray.push(new validators.RequiredValidator(props));
        }
        //Email格式校验
        if (ObjectUtil.isExtends(clazz, "Email")) {
            props.vtype = 'email';
            validatorsArray.push(new validators.EmailValidator(props));
        }
        //身份证格式校验
        if (ObjectUtil.isExtends(clazz, "IdNumber")) {
            props.vtype = 'idnumber';
            validatorsArray.push(new validators.IdNumberValidator(props));
        }
        //IP格式校验
        if (ObjectUtil.isExtends(clazz, "Ip")) {
            props.vtype = 'ip';
            validatorsArray.push(new validators.IpValidator(props));
        }
        //MAC地址格式校验
        if (ObjectUtil.isExtends(clazz, "Mac")) {
            props.vtype = 'mac';
            validatorsArray.push(new validators.MacValidator(props));
        }
        //电话号码格式校验
        if (ObjectUtil.isExtends(clazz, "Telephone")) {
            props.vtype = 'telephone';
            validatorsArray.push(new validators.TelephoneValidator(props));
        }
        //url格式校验
        if (ObjectUtil.isExtends(clazz, "Url")) {
            props.vtype = 'url';
            validatorsArray.push(new validators.UrlValidator(props));
        }
        //number格式校验
        if (ObjectUtil.isExtends(clazz, "Number")) {
            props.vtype = 'number';
            validatorsArray.push(new validators.NumberValidator(props));
        }
        //长度及最大最小值校验
        if (props.min || props.max || props.mins || props.maxs) {
            if ((ObjectUtil.isExtends(clazz, "Textarea")) 
                || ObjectUtil.isExtends(clazz, "Password")
                || ObjectUtil.isExtends(clazz, "Email")) {
                //校验文本框内容长度
                props.type = "text";
                props.vtype = 'length';
                validatorsArray.push(new validators.LengthValidator(props));
            } else if (ObjectUtil.isExtends(clazz, "Datetime")) {
                //校验日期时间的最大最小值
                props.type = "datetime";
                props.vtype = 'range';
                validatorsArray.push(new validators.RangeValidator(props));
            } else if (ObjectUtil.isExtends(clazz, "Date")) {
                //校验日期的最大最小值
                props.type = "date";
                props.vtype = 'range';
                validatorsArray.push(new validators.RangeValidator(props));
            } else if (ObjectUtil.isExtends(clazz, "Time")) {
                //校验日期的最大最小值
                props.type = "time";
                props.vtype = 'range';
                validatorsArray.push(new validators.RangeValidator(props));
            } else if (ObjectUtil.isExtends(clazz, "Ip")) {
                //校验IP地址最大最小值
                props.type = "ip";
                props.vtype = 'range';
                validatorsArray.push(new validators.RangeValidator(props));
            } else if (ObjectUtil.isExtends(clazz, "Mac")) {
                //校验mac地址最大最小值
                props.type = "mac";
                props.vtype = 'range';
                validatorsArray.push(new validators.RangeValidator(props));
            } else if (ObjectUtil.isExtends(clazz, "Number")) {
                //校验数值最大最小值
                props.type = "number";
                props.vtype = 'range';
                validatorsArray.push(new validators.RangeValidator(props));
            } else if (ObjectUtil.isExtends(clazz, "Int")) {
                //校验整数最大最小值
                props.type = "int";
                props.vtype = 'range';
                validatorsArray.push(new validators.RangeValidator(props));
            } else if(ObjectUtil.isExtends(clazz, "Text")){
                //校验文本框内容长度
                props.type = "text";
                props.vtype = 'length';
                validatorsArray.push(new validators.LengthValidator(props));
            }
        }
        if (props.equals) {
            ((props) => {
                props.__ast__.afterRender = () => {//定义一个afterRender函数，在渲染后执行
                    //用来处理被依赖的组件值发生变化是，触发组件验证
                    let equalsSrc = props.equals;
                    let srcEle: any = G.$(equalsSrc);
                    if(srcEle) {
                        let form: any = srcEle.form;
                        if(form) {
                            srcEle.onChange(function(newValue: any, oldValue: any){
                                form.validateField(props.id);
                            });
                        }
                    }
                }
                props.vtype = 'equals';
                validatorsArray.push(new validators.EqualsValidator(props));
            })(props);
           
        }
        ((props) => {
            let compare = props.compare;
            if(compare) {
                var compareMsg = compare.split(",");
                let ele1: any =  G.$(compareMsg[1]);
                let ele2 =  G.$(compareMsg[2]);
                if(ele1 && ele1.props && ele1.props.form && ele2 && ele2.props && ele1.props.form) {
                    let formEle: any = ele1.props.form;
                    ele1.onChange((newValue: any, oldValue: any) => {
                        formEle.validateField(props.id);
                        formEle.validateField(ele2.props.id);
                    });
                    ele2.onChange((newValue: any, oldValue: any) => {
                        formEle.validateField(props.id);
                        formEle.validateField(ele1.props.id);
                    });
                    props.vtype = 'compare';
                    validatorsArray.push(new validators.CompareValidator(props, clazz));
                }
            }
        })(props);
        if (props.remote) {
            props.vtype = 'remote';
            validatorsArray.push(new validators.RemoteValidator(props));
        }
        if (props.regexp) {
            props.vtype = 'regexp';
            validatorsArray.push(new validators.RegexValidator(props));
        }
        if (props.validatorName) {
            if (this.customvalidtors[props.validatorName]) {
            validatorsArray.push(new Validator(this.customvalidtors[props.validatorName]));
            }
        }
        // 自定义的验证过程
        if(props.doValidate){
            validatorsArray.push({
                name: props.name,
                validator : (rule: any, value: any, callback: any) => {
                    var ctl = G.G$("#"+props.id);
                    let message = props.doValidate.call(ctl,value);
                    if(message)
                        callback(message);
                    else
                        callback();
                }
            });
        }
        for(var i=0;i<validatorsArray.length;i++){
            let v:Validator = validatorsArray[i];
            if(v.validator){
                let vfun = v.validator;
                let form: any = props.form;
                if(form){
                    // 根据表单上的设置来处理，默认设置为不验证隐藏的控件
                    let validateHidden = form.validateHidden();
                    if(validateHidden!=true){
                        v.validator = (rule: any,value: any,callback: any)=>{
                            var ctl = G.G$("#"+props.id);
                            if(ctl.is(":visible")==true){
                                vfun.call(this,rule,value,callback);
                            }else{
                                callback();
                            }
                        }
                    }
                }
            }
        }
        // console.log(validatorsArray)
        return validatorsArray;
    }
}