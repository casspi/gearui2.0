import * as Text from '../form/Text';
import * as React from 'react';
import G  from '../../Gear';
import { Input } from 'antd';
import { SearchProps } from "antd/lib/input";
const AntdSearch = Input.Search;
export var props = {
    ...Text.props,
    onSearch: GearType.Function,//点击搜索或按下回车键时的回调
    prompt:GearType.Any,
    size:GearType.Any,
    disabled:GearType.Boolean,
    defaultValue:GearType.Any,
    enterButton: GearType.Or(GearType.Boolean,GearType.Any),
};
export interface state extends Text.state {
    
}
export default class Search<P extends typeof props & SearchProps,S extends (state & SearchProps)> extends Text.default<P ,S>{
    getProps() {
        super.getProps();
        let state = this.state;
        return G.G$.extend({}, state, {
            placeholder: this.state.placeholder,
            size: this.state.size,
            disabled: this.state.disabled,
            defaultValue: this.state.defaultValue,
            // onSearch:this.props.onSearch,
            // addonBefore: this.state["addonBefore"],
            // addonAfter: this.state["addonAfter"],
            // onKeydown: this.state["onKeydown"],
            // onChange: this.state["onChange"],
            // onClick: this.state["onClick"],
            // onFocus: this.state["onFocus"],
            // onBlur: this.state["onBlur"],
            // autoComplete: this.state["autoComplete"],
            // prefix: this.state["prefix"],
            // suffix: this.state["suffix"],
            // spellCheck: this.state["spellCheck"],
            // autoFocus: this.state["autoFocus"],
        });
    }

    //插件初始化，状态发生变化重新进行渲染
    getInitialState() {
        let state = this.state;
        return G.G$.extend({}, state, {
            placeholder: this.props.prompt,
            size: this.props.size,
            disabled: this.props.disabled,
            defaultValue: this.props.value,
            enterButton:this.props.enterButton || false
            // onSearch:this.props.onSearch,
            // addonBefore: this.props.addonbefore,
            // addonAfter: this.props.addonafter,
            // onPressenter: this.props.onpressenter,
            // onKeydown: this.props.onkeydown,
            // onChange: this.props.onchange,
            // onClick: this.props.onclick,
            // onFocus: this.props.onfocus,
            // onBlur: this.props.onblur,
            // autoComplete: this.props.autocomplete,
            // prefix: this.props.prefix,
            // suffix: this.props.suffix,
            // spellCheck: this.props.spellcheck,
            // autoFocus: this.props.autofocus,
        });
    }
    render() {
        let props = this.getProps();
        return <AntdSearch {...props} ></AntdSearch>;
    }
}