import * as Tag from '../Tag';
import { Icon as AntdIcon,Popover } from 'antd';
import * as React from 'react';
import { Form } from "./index";
import { GearUtil, UUID } from '../../utils';
var props = {
    ...Tag.props,
    editable: GearType.Boolean,
    editCType: GearType.String,
    editCell: GearType.Boolean,
    value: GearType.String,
    form: GearType.VoidT<Form.Form<any, Form.state>>(),
    lower: GearType.String,
    upper: GearType.String,
    label: GearType.String,
    showLink: GearType.Boolean,
    onEditable: GearType.Function
};
interface state extends Tag.state {
    editable?: boolean;
    editCell?: boolean;
    value?: string;
    label?: string;
    oldValue?: string;
    width?:any
}
//可编辑的单元格
export default class EditTableCell<P extends typeof props, S extends state> extends Tag.default<P, S> {
   
    constructor(props: P, context: {}) {
        super(props, context);
        console.log('构造器')
    }

    private gearEle: any;
    //缓存数据
    private cacheValue: any;

    private reactEleKey = UUID.get();
    private reactEle:any = this.getEditGearEle();
    private isValidate:boolean;
    protected afterReceiveProps(nextProps: P): Partial<typeof props> {
        // console.log('nextProps.value'+nextProps.value)
        // console.log('this.state.value'+this.state.value)
        // console.log(this.props.editable)
        // console.log(this.state.value + "-----" + nextProps.editable)
        // console.log(this.state.value + "-----" + this.state.editable)
        // console.log(nextProps.editable !== this.props.editable?nextProps.editable:this.state.editable)
        return {
            editable: nextProps.editable !== this.props.editable?nextProps.editable:this.state.editable,
            value: nextProps.value,
            label: this.getLabel()
        };
    }

    validate() {
        if(this.props.form) {
            return this.props.form.validateField(this.reactEleKey);
        }
        return true;
    }

    getProps() {
        return {
            save: ()=>{
                if(this.doJudgementEvent("beforeSave",this.reactEleKey,this.state.value)==false)
                    return;
                // let error = this.validate();
                // console.log(error)
                // if(error != true) {
                //     return;
                // }
                if(this.isValidate != true){
                    return;
                }
                this.doEvent("change", this.state.value, this.state.oldValue, this.state.value);
                this.editDisable(()=>{
                    //返回false保持编辑状态
                    if(this.doJudgementEvent("save",this.reactEleKey,this.state.value)==false) {
                        this.editEnable();
                        console.log(this.state.editable)
                    }
                });
            },
            edit:()=>{
                //编辑的时候缓存数据
                if(this.doJudgementEvent("beforeEdit",this.reactEleKey,this.state.value)==false)
                    return;
                this.cacheValue = this.state.value;
                this.editEnable();                
            },
            reset:()=>{
                if(this.doJudgementEvent("beforeReset",this.reactEleKey,this.state.value)==false)
                    return;
                this.setValue(this.cacheValue);
            },
            editable: this.state.editable,
            value: this.state.value,
            label: this.state.label,
            showLink: this.props.showLink===false?false:true
        };
    }

    getInitialState(): state {
        this.cacheValue = this.props.value;
        return {
            editable: this.props.editable,
            value: this.props.value,
            label: ""
        };
    }

    render() {
        let props = this.getProps();
        let reactEle = this.reactEle;
        // console.log(reactEle)
        let cellText:any = (reactEle && reactEle['props'] && reactEle['props'].ctype=="file" && props.showLink)?<a key="fileLink" download href={props.label || " "}  className={"cell-value"}>{props.label || " "}</a>:<span key="cellText" className={"cell-value"}>{props.label || " "}</span>;
        if(!(cellText instanceof Array)){
            cellText = [cellText]
        }
        cellText = cellText.filter((o:any)=>typeof o!="string");
        return <div className="edit-table-cell">
                <div className="editable-cell-input-wrapper" style={{display: props.editable?"block":"none"}}>
                        {
                            this.props.editCell ? 
                            <Popover trigger="hover" placement="right" content={<div className="editable-cell-control">
                                <AntdIcon
                                    style={{ cursor:'pointer'}}
                                    type="check"
                                    title="保存"
                                    className={"editable-cell-icon-save"}
                                    onClick={props.save.bind(this)}
                                />
                                <AntdIcon
                                    style={{ cursor:'pointer'}}
                                    type="rollback"
                                    title="取消"
                                    className={"editable-cell-icon-reset"}
                                    onClick={props.reset.bind(this)}
                                />
                            </div>}>
                                <span className={"cell-element"}>{reactEle}</span>
                            </Popover>
                            :
                            <span className={"cell-element"}>{reactEle}</span>
                        }
                </div>
                <div className="editable-cell-text-wrapper" style={{display: props.editable?"none":"block"}}>
                    {
                        this.props.editCell?
                        <Popover trigger="hover" placement="right" content={<div className="editable-cell-control">
                                <AntdIcon
                                    style={{ cursor:'pointer'}}
                                    type="edit"
                                    title="编辑"
                                    className={"editable-cell-icon-edit"}
                                    onClick={props.edit.bind(this)}
                                />
                            </div>}>
                            <span className={"cell-value"}>{cellText}</span>
                        </Popover>
                        :
                        <span className={"cell-value"}>{cellText}</span>
                    }
                </div>
        </div>;
    }

    getLabel() {
        let label;
        if(this.gearEle != null && this.gearEle.getText) {
            label = this.gearEle.getText();
        }
        if(label) {
            return label;
        }
        // else {
        //     label = G.$(this.props.columnEle).attr("text");
        //     return ObjectUtil.parseDynamicValue(label,this.props.record);
        // }
    }

    afterRender() {  
        let editable = this.state.editable;
        if(editable != true) {
            let label = this.getLabel();
            this.setState({
                label: label
            });
        }
    }
    
    getEditGearEle() { 
        let _props:any =G.G$.extend({},this.props,true);
        let editCType = this.props.editCType;
        let lower = this.props.lower;
        let upper = this.props.upper;
        delete _props.ctype;
        delete _props.editCell;
        delete _props.editable;
        delete _props.label;
        delete _props.__ast__;
        delete _props.children;
        let onchangebak = _props.onChange;
        let props:any = G.G$.extend({},
            _props,
            {
                required:this.props['required'],
                id: this.reactEleKey,
                dictype:this.props['dictype'],
                key: this.reactEleKey,
                name: this.reactEleKey,
                ref: (ele: any)=>{
                    if(ele) {
                        this.gearEle = ele;
                        this.gearEle["cell"] = this;
                        this.ref = this
                    }
                },
                lower: lower,
                upper: upper,
                "data-cellId": this.props.id,
                "data-record": _props['record'],
                onChange: (value: any,oldValue: any) => {
                    _props.onChangeValue(value)
                    this.isValidate = this.validate();
                    // let record = _props.record;
                    // record[this.props.name] = value;
                    this.setState({
                        value,
                        oldValue,
                    },()=>{
                        this.setState({
                            editable:true,
                            label:this.getLabel()
                        })
                        
                    //     // if(this.props.form){
                    //     //     this.gearEle.triggerChange(value);
                    //     // }
                    })
                    if(onchangebak && G.G$.isFunction(onchangebak)) {
                        onchangebak.call(this.gearEle,value,oldValue);
                    }
                    // debugger
                    // console.log(this.gearEle)
                    this.gearEle.focus();
                    console.log(this.state.editable)
                },
                onLoadSuccess:()=>{//涉及到需要加载数据的组件
                    let editable = this.state.editable;
                    if(editable != true) {
                        let label = this.getLabel();
                        if(this.state['label']!=label){
                            this.setState({
                                label: label
                            });
                        }
                    };
                },
                value: this.state.value,
        });
        return GearUtil.newInstanceByType(editCType, props, this);
        // return editCType?GearUtil.newInstanceByType(editCType, props):this.props.children; 
    }

    setValue(value: any,callback?: Function) {
        let text: any;
        let oldValue: any = this.state.value;
        if(this.gearEle) {
            this.gearEle.setValue(value, ()=> {
                text = this.gearEle.getText();
                this.doEvent("change", value, oldValue, text);
                if(callback) {
                    callback();
                }
            });
        }else {
            this.doEvent("change", value, oldValue, text);
            if(callback) {
                callback();
            }
        }
        
    }

    setText(text: any,callback?: Function) {
        let oldValue: any = this.state.value;;
        if(this.gearEle) {
            this.gearEle.setText(text, ()=> {
                let value = this.gearEle.getValue();
                this.doEvent("change", value, oldValue, text);
                if(callback) {
                    callback();
                }
            });
        }else {
            this.doEvent("change", text);
            if(callback) {
                callback();
            }
        }
    }

    editEnable(callback?: Function) {
        // debugger
        // this.props.onEditable(true)
        this.setState({
            editable: true
        },()=>{
            if(callback) {
                callback();
            }
        });
    }

    editDisable(callback?: Function) {
        this.setState({
            editable: false
        },()=>{
            debugger;
                console.log(this.state.editable)
            if(callback) {
                callback();
                console.log(this.state.editable)
            }
        });
    }
}