import { Radio as AntdRadio } from 'antd';
import * as FormTag from './FormTag';
import { RadioProps } from 'antd/lib/radio';
import * as React from 'react';
const AntdRadioButton = AntdRadio.Button;
export var props = {
    ...FormTag.props,
    value: GearType.Any,         //选中的值
    disabled: GearType.Boolean,   //禁止
    size: GearType.String,        //尺寸
    label: GearType.String,       //单个radio时的label
    checked: GearType.Boolean    //单选确认选择
}
export interface state extends FormTag.state {
    value: any,         //选中的值
    disabled: boolean,   //禁止
    size: string,
    label:string  
}
export default class RadioButton<P extends typeof props &  RadioProps,S extends state & RadioProps> extends FormTag.default<P,S> {

    //获取当前属性
    getProps() {
        // let superProps = super.getProps();
        let state = this.state;
        return G.G$.extend({},state, {
            checked: this.state.checked,
            disabled: this.state.disabled,
            size: this.state.size,
            label: this.state.label,
            value: this.state.value
        });
    }

    //插件初始化，状态发生变化重新进行渲染
    getInitialState() {
        let state = this.state;
        return G.G$.extend({}, state, {
            disabled: this.props.disabled,
            size: this.props.size,
            value: this.props.value||"",
            name: this.props.name,
            checked: this.props.checked
        });
    }

    //渲染
    makeJsx() {
        let props:any = this.getProps();
        delete props.invalidType;
        delete props.labelText;
        if(this.form){
            delete props.value;
        }
        return <AntdRadioButton {...props}>{this.props.label}</AntdRadioButton >;
    }

    //onchange函数
    onChange(e:any) {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    }

    //Easy-UI接口方法集合
    //变化函数
    onChangeFun(fun:any) {
        if (fun && (typeof fun) == "function") {
            this.setState({
                onChange: fun.bind(this)
            });
        }
    }

    //禁止选择
    disabled() {
        let disabled = true;
        this.setState({ disabled: true });
    }

    //开放选择
    enabled() {
        let disabled = false;
        this.setState({ disabled: false });
    }

    //获取值
    getValue() {
        return this.state.value;
    }

    //赋值
    setValue(val:any) {
        this.setState({ value: val });
    }

    //选择选项
    choseByValue(val:any) {
        if (this.props.value == val) {
            let checked = true;
            this.setState({ checked: this.state.checked});
        }
    }

    //通过指定数据查找按钮
    findByValue(val:any) {
        return G.G$(this.realDom).find("[value='" + val + "']");
    }
}