import { TimePicker as AntdTimePicker} from 'antd';
import * as moment from 'moment';
import * as Tag from '../Tag';
import * as React from 'react';
import G from '../../Gear';
// 推荐在入口文件全局设置 locale
import '../../../node_modules/moment/locale/zh-cn';
import * as FormTag  from '../form/FormTag';
moment.locale('zh-cn');
export var props =  {
    ...FormTag.props,
    value: GearType.Any,         //时间
    placeholder: GearType.String,	        //"请选择时间"
    format: GearType.String,	            //展示的时间格式"HH:mm:ss"
    disabled: GearType.Boolean,              //禁止
    size: GearType.String                   //尺寸
}
export interface state extends FormTag.state {
    defaultValue?:any,
    placeholder?: string,	        //"请选择时间"
    format?: string,		            //展示的时间格式"HH:mm:ss"
    disabled?: boolean,              //禁止
    size?:any,     
    value?:string
}
export default class Timepicker<P extends typeof props,S extends state> extends FormTag.default<P,S> {

    // constructor(props) {
    //     super(props);
    //     console.log(this.props.value);
    //     console.log(this.props.format);
    // }

    //获取当前属性
    getProps() {
        let state = this.state;
        if(this.state.value!=null){
            return G.G$.extend(state, {
                defaultValue: moment(this.state.defaultValue,this.state.format),
                value: moment(this.state.value,this.state.format),
                placeholder:this.state.placeholder,
                format:this.state.format,
                disabled:this.state.disabled,
                size:this.state.size,
            });
        }else{
            return G.G$.extend(state, {
                placeholder:this.state.placeholder,
                format:this.state.format,
                disabled:this.state.disabled,
                size:this.state.size,
            });
        }
        
    }

    //插件初始化，状态发生变化重新进行渲染
    getInitialState() {
        let state = this.state;
        return G.G$.extend({}, state, {
            defaultValue:moment(this.props.value),
            value:this.props.value,
            placeholder:this.props.placeholder,
            format:this.props.format,
            disabled:this.props.disabled,
            size:this.props.size,
        });
    }

    //渲染
    makeJsx() {
        let props:any = this.getProps();
        if(this.form){
            delete props.value;
            delete props.defaultValue
        }
        return <AntdTimePicker {...props}></AntdTimePicker>;
    }

}