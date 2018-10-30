import { Switch as AntdSwitch, Icon as AntdIcon } from 'antd';
import * as Tag from "../Tag";
import * as React from 'react';
import  G  from '../../Gear';
import * as FormTag from './FormTag';
import { SwitchProps } from 'antd/lib/switch';
export var props = {
    ...FormTag.props,
    code:GearType.String,
    label:GearType.String,
    icon:GearType.String,
    showLabel:GearType.Boolean,
    size:GearType.String,
    readOnly:GearType.String,
    checked:GearType.Boolean,
    // defaultChecked:GearType.Any
}
export interface state extends FormTag.state {
    readOnly:boolean;
    checked: boolean;	        //指定当前是否选中,且无法改变	
    onchange: Function;         //变化时回调函数
    code?: any;      //开关的取值，默认为“1,0” 1表示选中 0表示未选中
    label?: string;  //开关上的文字，可以设置两个，以逗号好隔
    icon?: string;    //图标，可以设置两个，以逗号分隔
    size: string;               //	开关大小default/small
    disabled: boolean;          //禁止
    showLabel: boolean; //显示label，默认为false
    defaultChecked:any
}

export default class Switch<P extends (typeof props) & SwitchProps,S extends state> extends FormTag.default<P,S> {
    // 选中时的代码
    private _checkedCode:string;
    // 未选中时的代码
    private _unCheckedCode:string;
    // 选中时的标签
    private _checkedLabel:string;
    // 未选中时的标签
    private _unCheckedLabel:string;

    private _readonly:boolean;

    constructor(props:any) {
        super(props);     
        if(this.state.readOnly && this.state.readOnly==true)
            this._readonly = true;
        else
            this._readonly = false;
    }

    //获取当前属性
    getProps() {
        let state: state = G.G$.extend({}, this.state);
        delete state.invalidType;
        return G.G$.extend({},state,{
            checked: this.state.checked,
            defaultChecked: this.state.defaultChecked,
            onChange: (checked:boolean) => {
                if(this._readonly==true)
                    return;
                let oldValue = this.getValue();
                this.setState({
                    checked:checked
                },() => {
                    let value = this.getValue();
                    let args = [value,oldValue];
                    //执行自定义注册的事件
                    this.doEvent("change", ...args);
                    //执行控件属性指定的事件
                    // if (this.props.onchange) {
                    //     this.props.onchange.call(this, ...args);
                    // }
                    this.triggerChange(value);
                });
            },
            size: this.state.size,
            disabled: this.state.disabled,
        });
    }

    //插件初始化，状态发生变化重新进行渲染
    getInitialState(): state {
        let state = this.state;
        let codes = (this.props.code || "1,0").split(",");
        if(codes.length>0)
            this._checkedCode = codes[0] || "1";
        else
            this._checkedCode = "1";
        if(codes.length>1)
            this._unCheckedCode = codes[1] || "0";
        else
            this._unCheckedCode = "0";  

        let checked;
        if(this.props.value){
            if(this.props.value==this._checkedCode){
                checked = true;
            }else{
                checked = false;
            }
        }else{
            checked = this.props.checked || false;
        }
        return G.G$.extend({}, state, {
            checked: checked,
            defaultChecked: checked,
            label: this.props.label || "是,否",
            icon: this.props.icon,
            readOnly: this.props.readOnly,
            size: this.props.size,
            disabled: this.props.disabled,
            showLabel: this.props.showLabel
        });
    }

    //渲染
    render() {
        let props = this.getProps();
        let checkedChildren:string|React.ReactNode;
        let unCheckedChildren:string|React.ReactNode;
        // 选中状态时显示的文本
        let _checkedChildren:Array<React.ReactNode> = [];
        // 未选中状态时显示的文本
        let _unCheckedChildren:Array<React.ReactNode> = [];
        // 是否显示label
        let showLabel:boolean;
        if(this.state.showLabel && this.state.showLabel==true)
            showLabel = true;
        else
            showLabel = false;

        if(this.state.icon){
            let icons = this.state.icon.split(",");
            if(icons.length>0)
                _checkedChildren.push(<AntdIcon key={1} type={icons[0]}/>);
            if(icons.length>1)
                _unCheckedChildren.push(<AntdIcon key={1} type={icons[1]}/>);    
        } 

        if(this.state.label){
            let labels = this.state.label.split(",");
            if(labels.length>0){
                this._checkedLabel = labels[0];
                if(showLabel==true)
                    _checkedChildren.push(<span key={2}>{labels[0]}</span>);
            }else{
                this._checkedLabel = "是";
            }
            if(labels.length>1){
                this._unCheckedLabel = labels[1];
                if(showLabel==true)
                    _unCheckedChildren.push(<span key={2}>{labels[1]}</span>);  
            }else{
                this._unCheckedLabel = "否";
            }
        }else{
            this._checkedLabel = "是";
            this._unCheckedLabel = "否";
        }
        if(_checkedChildren.length>0){
            checkedChildren = <span>{_checkedChildren}</span>
        }
        if(_unCheckedChildren.length>0){
            unCheckedChildren = <span>{_unCheckedChildren}</span>
        }
        return <AntdSwitch {...props} checkedChildren={checkedChildren} unCheckedChildren={unCheckedChildren}></AntdSwitch>;
    }

    onChange(fun:any) {
        if (fun && G.G$.isFunction(fun)) {
            this.bind("change", fun);
        }
    }   

    // 赋值
    setValue(val:string){
        let checked:boolean;
        if(val && val==this._checkedCode)
            checked = true;
        else
            checked = false;

        this.setState({
            checked:checked
        });
    }
    
    // 取值
    getValue(){
        if(this.isChecked())
            return this._checkedCode;
        else
            return this._unCheckedCode;
    }

    // 取文本值
    getText(){
        if(this.isChecked())
            return this._checkedLabel;
        else
            return this._unCheckedLabel;
    }

    //只读
    readonly(readonly?:boolean) {
        this._readonly = readonly || true;
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

    //是否选中
    isChecked(){
        return this.state["checked"] || false;
    }

    // 选中
    checked() {
        this.setState({ 
            checked: true 
        });
    }
    
    // 不选中
    unChecked() {
        this.setState({ 
            checked: false 
        });
    }

}
