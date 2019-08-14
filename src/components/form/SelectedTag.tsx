import { Tag as AntdTag} from 'antd';
import * as React from 'react';
import * as FormTag from './FormTag';

export var props = {
    ...FormTag.props,
    color: GearType.String,
    text: GearType.String,
    closable: GearType.Boolean,
    key:GearType.Boolean,
    closeHandle:GearType.Function
};

export interface state extends FormTag.state {
    // 是否可以关闭，默认为false
    closable?: boolean;
    // 颜色
    color?: string;
    // 文本值
    text?: string;
    key?:string
}

// 穿梭框
export default class SelectedTag<P extends typeof props, S extends state> extends FormTag.default<P, S> {
    
    getProps() {
        let state:any = this.state;
        return G.G$.extend({}, state, {
            closable: this.state.closable,
            color: this.state.color,
            value: this.state.value,
            text: this.state.text,
            onClose: (e: any) => {
                this.props.closeHandle(this.state.value);//提供给inputTag删除数据
                this.doEvent("close");
            },
            afterClose: () => {
                this.doEvent("afterClose");
            }
        });
    }

    //插件初始化，状态发生变化重新进行渲染
    getInitialState(): state {
        return {
            color: this.props.color,
            value: this.props.value,
            text: this.props.text,
            closable:this.props.closable,
            
        };
    }
    
    makeJsx() {        
        let props:any = this.getProps();
        delete props.validation;
        return <AntdTag {...props}>{this.getText()||this.getValue()}</AntdTag>;
    }

    getText(){
        return this.state.text;
    }

    setText(text:string){
        this.setState({
            text:text
        });
    }

}