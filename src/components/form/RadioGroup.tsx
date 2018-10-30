import { Radio as AntdRadio } from 'antd';
import * as FormTag from './FormTag';
import * as React from 'react';
import { RadioProps } from 'antd/lib/radio';
import  DicUtil  from '../../utils/DicUtil';
// import { ObjectUtil, UUID } from "../../utils";
// import { GearWeb as G } from '../gearwebs';
// import { Dic } from '../core/cores';
// import RadioButton from './RadioButton';
// const AntdRadioButton = AntdRadio.Button;
const AntdRadioGroup = AntdRadio.Group;
export declare type ButtonSize = 'solid' | 'outline';
export var props = {
    ...FormTag.props,
    disabled: GearType.Boolean,   //禁止
    size: GearType.Any,        //尺寸
    options: GearType.Any,        //选项
    url: GearType.String,         //url获取选项
    dictype: GearType.Any,        //字典选项
    value: GearType.Any,          //选中的值
    name: GearType.String,        //RadioGroup下所有radio的name属性
    buttonStyle:GearType.Enum<ButtonSize>()
}
export interface state extends FormTag.state {
    value: any,         //选中的值
    options:any,
    disabled: boolean,   //禁止
    size:any,
    url:any,
    dictype:any,
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
            onChange: this.onChange.bind(this),
            
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
            buttonStyle:this.props.buttonStyle,
            onChange: this.onChange.bind(this)
        });
    }

    //渲染
    render() {
        let props = this.getProps();
        if (this.props.dictype || this.props.url) {
            return <AntdRadioGroup {...props}></AntdRadioGroup>;
        } else {
            let childrenMap:any[] = [];
            if (this.props.children instanceof Array) {
                childrenMap = this.props.children;
                childrenMap = childrenMap.filter(o=>o.key);//过滤空的
                childrenMap = childrenMap.map((child: any, index)=> {
                    let item = child;
                    return (item)
                    // console.log(child)
                    // if(item && item.type && ObjectUtil.isExtends(item.type, "RadioButton")) {
                    //     console.log(item.props)
                    //     let itemJsx = <AntdRadioButton {...item.props} key={this.props.id ? this.props.id + "_item_" + index :UUID.get()}>{item.props.label}</AntdRadioButton>;
                    //     // let itemJsx = <RadioButton {...item.props} key={this.props.id ? this.props.id + "_item_" + index :UUID.get()}>{item.props.children}</RadioButton>;
                    //     return (itemJsx)
                    // }else{
                        // return (item)
                    // }
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
        if(url || dictype) {
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
        this.setState({ disabled: true});
    }

    //开放选择
    enabled() {
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