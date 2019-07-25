import * as FormTag from "./FormTag";
import * as React from 'react';
import { Tag as AntdTag } from 'antd';
import DicUtil from "../../utils/DicUtil";
import { UUID } from "../../utils";
export var props = {
    ...FormTag.props,
    url: GearType.Or(GearType.String, GearType.Function),
    dictype: GearType.Or(GearType.Object, GearType.Function, GearType.String),
    value: GearType.Or(GearType.Array, GearType.Function),
};
const AntdCheckTag = AntdTag.CheckableTag;
export interface state extends FormTag.state {
    options: Array<CheckTagOption>;
    dictype?: object | string | Function;
    url?: string | Function;
}

interface CheckTagOption {
    key?: string;
    value: string;
    text?: string;
    checked?: boolean;
}

export default class CheckTag<P extends typeof props, S extends state> extends FormTag.default<P, S> {
    
    private waitSetValue:any = []

    shouldComponentUpdate (nextProps: P, nextState: S) {
        let shouldUpdate = this.shouldUpdate(nextProps, nextState);
        // console.log(nextState == this.state && this.props == nextProps);
        // if((ObjectUtil.isExtends(this, "HtmlTag"))) {
        //     return shouldUpdate;
        // }
        // if(nextState == this.state && this.props == nextProps) {
        //     return false;
        // }else{

        // }
        return shouldUpdate;
    }

    getInitialState(): state {
        return {
            options: [],
            dictype:this.props.dictype,
            url:this.props.url,
            disabled: this.props.disabled,
            readOnly: this.props.readOnly,
        };
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
        return <div {...props}>
            {this.getTags()}
        </div>;
    }

    
    //获取当前属性
    getProps() {
        let state:any = this.state;
        delete state.invalidType;
        let className = this.state.className ? "checktag-control-wrapper " + this.state.className : "checktag-control-wrapper";
        if((this.state.disabled == true)){
            if(className) {
                className = className + " tag-disabled";
            } else {
                className = "tag-disabled";
            }
        }
        return G.G$.extend({},state,{
            className: className,
        });
    }
    
    //获取当前属性
    getCheckTagProps(key: any,value: any,text: any,checked: any) {
        return G.G$.extend({},{
            key:key,
            "data-value": value,
            "data-text": text,
            tabIndex:0,
            checked: checked,
            readOnly:this.state.readOnly,
            disabled:this.state.disabled,
            onChange:(chked: any)=>{
                if(this.state.readOnly == true || this.state.disabled == true)
                return;
                let oldValues = this.getValue();
                this._setChecked(key,chked,()=>{
                    this._change(this.getValue(),oldValues);
                });
            }
        });
    }
    
    private getTags() {
        let options = this.state.options;
        let tags: any[] = [];
        if(options) {
            options.forEach((o)=>{
                tags.push(<AntdCheckTag {...this.getCheckTagProps(o.key,o.value,o.text,o.checked)}>{o.text}</AntdCheckTag>);
            });
        }
        return tags;
    }
    
    afterRender() {
        this.blur(()=>{
            this.find(".gearui-control-wrapper").removeAttr("tabindex");
        })
        if (this.state.url || this.state.dictype) {
            let url = this.state.url;
            let dictype = this.state.dictype;
            let fn = async () => {
                let result = await DicUtil.getDic({url, dictype});
                if(result.success) {
                    let dic = G.G$.isArray(result.data)?result.data:result.data.data;
                    if(dic) {
                        this.setState({
                            options: dic.map((ele: any)=>{
                                return {
                                    key: UUID.get(),
                                    value:ele.value,
                                    text: ele.text || ele.label || ele.value,
                                    checked: ele.checked
                                }
                            })
                        },()=>{
                            // 设置默认选中状态
                            let value = this.state.value;
                            this.setValue(value,true);
                            // console.log(this.waitSetValue)
                            if(this.waitSetValue.length>0){
                                for(let i=0;i<this.waitSetValue.length;i++){
                                    this.waitSetValue[i]()
                                }
                            }
                        });
                    }
                }
            }
            fn();
        }        
    }    
    

    private _change(newValues: any,oldValues: any){
        super.setValue(newValues);
        this.doEvent("change",newValues,oldValues);
    }    

    private _setChecked(key: any,checked: any,fun: any){
        this.setState({
            options:(this.state.options || []).map((option)=>{
                if(key==option.key){
                    option.checked = checked;
                }
                return option;
            })
        },fun);
    }

    getValue(){
        let values = [];
        let options = this.state.options || [];
        for(var i=0;i<options.length;i++){
            if(options[i].checked){
                values.push(options[i].value);
            }
        }
        return values;
    }

    getText(){
        let texts = [];
        let options = this.state.options || [];
        for(var i=0;i<options.length;i++){
            if(options[i].checked){
                texts.push(options[i].text);
            }
        }
        return texts;
    }    
    
    _setValue(values:any[]){
        
    }

    setValue(values: any,args?:any){
        if(values instanceof Array == false && typeof values=="string"){
            values = [values];
        }
        if(values){
            let fns = ()=>{
                this.setState({
                    options:(this.state.options || []).map((option)=>{
                        let valuesGearArr = new GearArray(values);
                        if(valuesGearArr.contains(option.value))
                            option.checked = true;
                        else
                            option.checked = false;
                        return option;
                    })
                },()=>{
                    super.setValue(this.getValue(),()=>{
                        if(args instanceof Function){
                            args()
                        }
                    });
                });
            }
            fns();
            if(args!==true && !(args instanceof Function)){//不是回调函数，不是afterrender中
                this.waitSetValue.push(fns)//push到异步列表中，初始化afterrender调用
            }
        }
    }

    addValue(value:string,callback?:Function){
        if(value){
            let fn =()=>{
                this.setState({
                    options:(this.state.options || []).map((option)=>{
                        if(value == option.value)
                            option.checked = true;
                        return option;
                    })
                },()=>{
                    super.setValue(this.getValue(),()=>{
                        if(callback){
                            callback()
                        }
                    });
                });
            } 
            fn();
            this.waitSetValue.push(fn)//push到异步列表中，初始化afterrender调用
        }        
    }

    checkAll(){
        this.setState({
            options:(this.state.options || []).map((option)=>{
                option.checked = true;
                return option;
            })
        },()=>{
            super.setValue(this.getValue());
        });        
    }

    unCheckAll(){
        this.setState({
            options:(this.state.options || []).map((option)=>{
                option.checked = false;
                return option;
            })
        },()=>{
            super.setValue(this.getValue());
        }); 
    }



    focus(...args: any[]) { 
        this.attr("tabindex","0");
        super.focus(...args); 
        this.find(".gearui-control-wrapper").focus(...args);      
    }

    blur(...args: any[]){
        this.attr("tabindex","-1");
        this.find(".gearui-control-wrapper").blur(...args);
    }  

    reset(){
        let initValue:any = this.props.value;
        if(typeof initValue == 'string'){
            initValue = initValue.split(',')
        }
        this.setValue(initValue)
    }

    clear(){
        this.setValue('')
    }
}