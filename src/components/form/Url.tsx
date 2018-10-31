import * as Text from './Text';
import * as React from 'react';
import  G  from '../../Gear';
import { Input } from 'antd';
import { InputProps } from 'antd/lib/input';
export var props = {
    ...Text.props
    
}
export interface state extends Text.state {

}
export default class Url<P extends (typeof props) & InputProps ,S extends state> extends Text.default<P,S>{
    getProps() {
        super.getProps()
        let state = this.state;
        return G.G$.extend({}, state, {
        });
    }

    //插件初始化，状态发生变化重新进行渲染
    getInitialState() {
        let state = this.state;
        return G.G$.extend({}, state, {
        });
    }
    
    render() {
        let props = this.getProps();
        console.log(props)
        return <Input {...props}></Input>;
    }

}