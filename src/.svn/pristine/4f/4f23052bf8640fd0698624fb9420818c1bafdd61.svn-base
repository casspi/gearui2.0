// import * as Tag from '../Tag';
import * as FormTag from './FormTag';
import * as React from 'react';
import { Input } from 'antd';
import  G from '../../Gear';


const AntdTextArea = Input.TextArea;
export var props = {
    ...FormTag.props,
    autoSize:GearType.Any,
    readOnly:GearType.Boolean,
    maxRows:GearType.Number,
    minRows:GearType.Number,
    prompt:GearType.String,
    rows:GearType.Number,
    onPressenter:GearType.Function
}
export interface state extends FormTag.state {
    placeholder?: string;
    prompt?: string;
    disabled?: boolean;
    readOnly?: boolean;
    type: string;
    minrows: number;
    maxrows: number;
    autosize: boolean;
    rows: number;
    onPressenter: Function;
    onChange:Function;
}

export default class Textarea<P extends typeof props,S extends state> extends FormTag.default<P,S> {

    constructor(props:any, context: {}) {
        super(props, context);
    }

    getProps() {
        let state = this.state;
        return G.G$.extend({}, state, {
            placeholder: this.state.placeholder,
            disabled: this.state.disabled,
            readOnly: this.state.readOnly,
            value: this.state.value,
            autosize: this.state.autosize,
            rows: this.state.rows,
            onPressEnter: (e:any) => {
                //控件基础改变事件
                this.pressEnter(e);
            },
            onChange: (e:any) => {
                this._change(e);
            }
        });
    }

    //插件初始化，状态发生变化重新进行渲染
    getInitialState() {
        let state = this.state;
        let autosize:any = this.props.autoSize;
        if(this.props.maxRows != null) {
            autosize = {
                minRows: this.props.minRows || 1,
                maxRows: this.props.maxRows
            }
        }
        let value = this.props.value;
        if(!this.props.value) {
            if(this.ast && this.ast.children && this.ast.children.length >= 1) {
                if(this.ast.children[0].type == 3) {
                    value = this.ast.children[0].text;
                }
            }
        }
        return G.G$.extend({}, state, {
            placeholder: this.props.prompt,
            disabled: this.props.disabled,
            readOnly: this.props.readOnly,
            value: value,
            autosize: autosize,
            rows: this.props.rows,
        });
    }

    makeJsx() {
        let props:any = this.getProps();
        delete props.invalidType;
        delete props.labelText;
        delete props.validation;
        delete props.indeterminate;
        if(this.form){
            delete props.value;
        }
        return <AntdTextArea {...props}></AntdTextArea>;
    }
    //改变事件
    pressEnter(e:any) {
        //执行自定义注册的事件
        this.doEvent("pressEnter", e);
        if(this.props.onPressenter && G.G$.isFunction(this.props.onPressenter)) {
            this.props.onPressenter.call(this,e);
        }
    }

    onPressEnter(fun:Function) {
        if (fun && G.G$.isFunction(fun)) {
            this.bind("pressEnter", fun);
        }
    }

    //改变事件
    protected _change(e:any) {
        let oldValue = this.getValue();
        let value = e.target.value;
        this.setState({ value: value },() => {
            let args = [value,oldValue];
            //执行自定义注册的事件
            this.doEvent("change", ...args);
            //执行控件属性指定的事件
            // if (this.props.onchange) {
            //     this.props.onchange.call(this, ...args);
            // }
        });
        this.triggerChange({ value });
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

    //只读
    readonly(readonly:boolean) {
        this.setState({
            readOnly: readonly
        });
    }
}