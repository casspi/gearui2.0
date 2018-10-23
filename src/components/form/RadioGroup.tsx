import { Radio as AntdRadio } from 'antd';
import * as FormTag from './FormTag';
import * as React from 'react';
import { RadioProps } from 'antd/lib/radio';
import  DicUtil  from '../../utils/DicUtil';
// import { GearWeb as G } from '../gearwebs';
// import { Dic } from '../core/cores';

const AntdRadioGroup = AntdRadio.Group;

export var props = {
    ...FormTag.props,
    disabled: GearType.Boolean,   //禁止
    size: GearType.Any,        //尺寸
    options: GearType.Any,        //选项
    url: GearType.String,         //url获取选项
    dictype: GearType.Any,        //字典选项
    value: GearType.Any,          //选中的值
    name: GearType.String        //RadioGroup下所有radio的name属性
}
export interface state extends FormTag.state {
    value: any,         //选中的值
    options:any,
    disabled: boolean,   //禁止
    size:any,
    url:any,
    dictype:any
}
export default class RadioGroup<P extends typeof props &  RadioProps,S extends state & RadioProps> extends FormTag.default<P,S> {
    //获取当前属性
    getProps() {
        let   state = this.state;
        return G.G$.extend(state, {
            disabled: this.state.disabled,
            size: this.state.size,
            options: this.state.options,
            url: this.state.url,
            dictype: this.state.dictype,
            value: this.state.value,
            name: this.state.name,
            onChange: this.onChange.bind(this)
        });
    }

    //插件初始化，状态发生变化重新进行渲染
    getInitialState() {
        let state = this.state;
        return G.G$.extend({}, state, {
            disabled: this.props.disabled,
            size: this.props.size,
            options: this.props.options,
            url: this.props.url,
            dictype: this.props.dictype,
            value: this.props.value,
            name: this.props.name,
            onChange: this.onChange.bind(this)
        });
    }

    //渲染
    render() {
        let props = this.getProps();
        if (this.props.dictype || this.props.url) {
            return <AntdRadioGroup {...props}></AntdRadioGroup>;
        } else {
            let childrenMap = null;
            if (this.props.children instanceof Array) {
                childrenMap = this.props.children.map(function (ele:any) {
                    return (ele);
                });
            }
            return <AntdRadioGroup {...props}>{childrenMap}</AntdRadioGroup>;
        }
    }

    //onchange函数
    onChange(e:any) {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    }

    //获取字典
    afterRender() {
        let url = this.props.url;
        let dictype = this.props.dictype;
        let fn = async () => {
            let result = await DicUtil.getDic({url, dictype});
            if(result.success) {
                let dic = result.data;
                if(dic) {
                    this.setState({
                        options: dic
                    });
                }
            }
        }
        fn();
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
        this.setState({ disabled: true});
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
        this.setState({ value: val });
    }

    //通过指定数据查找按钮
    findByValue(val:any) {
        return G.G$(this.realDom).find("[value='" + val + "']");
    }

}