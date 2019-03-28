import { Form } from '../form/Form';
import G from '../../Gear';
import { default as Message} from '../pack/Message';
import { ObjectUtil } from '../../utils';
import * as Button from './Button';
export var props = {
    ...Button.props,
    url: GearType.String,//表单提交的地址，不设置的话则使用form action属性上的路径
    method:  GearType.String,//可选：post(默认)、get、put、delete，如果form上的method属性为空，就使用控件上的method来提交form
    ajax:  GearType.Boolean,//控件不是在form中的情况下，是否通过ajax提交到后台，可选值：true、false
    callback: GearType.Function,
    form: GearType.String,//指定使用的是那一个form，如果不指定则默认是控件所在范围内的form，如果控件不在form中，则取页面第一个form
};
export interface state extends Button.state {

}
export default class Submit<P extends typeof props,S extends state> extends Button.default<P,S> {

    protected form: Form<any, any>;
    constructor(props:any, context: {}){
        super(props);
        // this._propsValue = this.props.value;
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

    // 定义一个click事件
    protected clickEvent(){
        // 先查找当前控件的上级form定义
        let form = this.form;
        if(this.props.form) {
            form = G.$("#"+this.props.form);
        }
        if(form == null || !(form instanceof Form)){
            // 先查找当前控件的上级form对象
            form = this.form;
        }
        if(form == null || !(form instanceof Form)){
            // 还没有就找页面上第一个form
            form = this.getForm(G.G$("form:first"));
        }
        if(this._onBeforeSubmit) {
            let r = this._onBeforeSubmit.call(this);
            if(r!=null && r==false)
                return;
        }
        if(form){
            // 表单存在
            if(form instanceof Form) {
                // 是一个gear-form表单
                if(this.props.url || this.props.method) {
                    form.setForm({
                        action: this.props.url,
                        method: this.props.method,
                        ajax: this.props.ajax,
                    });
                }
                if(form.props != null && form.props.showprogress != false) {
                    this.setLoading(true);
                }
                form.submit((data:any)=>{
                    console.log(data)
                    this.setLoading(false);
                });
            }else{
                // // 是个普通表单
                // if(Util.isTrue(this.props.ajax)) {
                //     // 如果使用ajax提交
                //     let formdata = form["serializeArray"]();
                //     let _callback = this.props.callback; 
                //     Ajax.getMethod(this.props.method||"post")(this.props.url,formdata).done(function(data){
                //         console.log(data);
                //         if(_callback) {
                //             _callback.call(this);
                //         }
                //     }).fail(function(err){
                        
                //     });
                // }else {
                //     // 按普通表单的方式提交
                //     if(this.props.url)
                //         form["attr"]("action",this.props.url);
                //     if(this.props.method)
                //         form["attr"]("method",this.props.method);
                //     form["submit"]();
                // }
                Message.error("错误","表单类型不匹配");
            }
        }else{
            Message.error("错误","没有可供提交的表单");
        }
    }

    // 根据jquery-form对象获得gear-form对象
    private getForm(jqform:any){
        if(jqform.length>0){
            return G.$(jqform[0]);
        } 
        return null;       
    }

    getInitialState() {
        let state = this.state;
        return G.G$.extend({},state,{
            type: this.props.buttonStyle || "primary",
            onClick: this.clickEvent.bind(this)
        });
    }     

    _onBeforeSubmit:Function;
    onBeforeSubmit(fun:any) {
        if(fun && G.G$.isFunction(fun)) {
            this._onBeforeSubmit = fun.bind(this);
        }
    }
}