import * as Number from './Number';
import { ObjectUtil } from '../../utils';
export var props = {
    ...Number.props
};
export interface state extends Number.state {

}

export default class Int<P extends typeof props, S extends state> extends Number.default<P, S> {
    //所有实现都在父类中
    getInitialState(): state {
        let value:any = this.props.value;
        if(value && ObjectUtil.isNumber(value)) {
            if(ObjectUtil.isInteger(value)) {
                value = parseInt(value);
            }else {
                value = parseFloat(value);
            }
        }else {
            value = 0;
        }
        let min:any = this.props.min;
        if(min && ObjectUtil.isInteger(min)) {
            if(ObjectUtil.isInteger(min)) {
                min = parseInt(min);
            }else {
                min = parseFloat(min);
            }
        }else {
            min = 0;
        }
        let max:any = this.props.max;
        if(max && ObjectUtil.isInteger(max)) {
            if(ObjectUtil.isInteger(max)) {
                max = parseInt(max);
            }else {
                max = parseFloat(max);
            }
        }else {
            max = 999999999;
        }
        return {
            value: value,
            precision: 0,//整数
            min: min,
            max: max,
            step: 1,
            prompt: this.props.prompt,
            size: this.props.size,
            prefix: this.props.prefix || "",
            suffix: this.props.suffix || ""
        };
    }

    setValue(value:number,callback?: Function) {
        if(value && ObjectUtil.isInteger(value)) {
            this.setState({
                value:value
            },()=>{
                this.triggerChange(value);
                if(callback){
                    callback()
                }
            });
        }
    }
}