import { Validator } from './index';
import {StringUtil} from "../utils";
export default class LengthValidator extends Validator {

    name:string = this.name || "len";

    constructor(props: any, clazz?: any) {
        super(props);
        if (props.min) {
            this.min = parseInt(props.min);
        } else {
            this.min = parseInt(this.props.min);
        }
        if (props.max) {
            this.max = parseInt(props.max);
        } else {
            this.max = parseInt(this.props.max);
        }
        if(props.judgeString===true){//判断字符串长度

            if (props.message) {
                this.message = props.message;
            } else {
                if(this.min && this.min > 0 && this.max && this.max > 0){
                    this.message = this.props.invalidmessage || "长度必须大于：" + this.min + "节且小于：" + this.max;
                }else if(this.min && !this.max){
                    this.message = this.props.invalidmessage || "长度必须大于：" + this.min;               
                }else if(!this.min && this.max){
                    this.message = this.props.invalidmessage || "长度必须小于：" + this.max;
                }
            }

        }else{//判断字节数(默认)

            if (props.message) {
                this.message = props.message;
            } else {
                if(this.min && this.min > 0 && this.max && this.max > 0){
                    this.message = this.props.invalidmessage || "长度必须大于：" + this.min + "个字节且小于：" + this.max+"个字节";
                }else if(this.min && !this.max){
                    this.message = this.props.invalidmessage || "长度必须大于：" + this.min+"个字节";               
                }else if(!this.min && this.max){
                    this.message = this.props.invalidmessage || "长度必须小于：" + this.max+"个字节";
                }
            }
            //将汉字转换为字母aa，去判断字节
            this.transform = (value)=> {if(value!=null)  return value = StringUtil.getBytesLength(value)};

        }
        this.parseMessage(props);
    }
}