import { Validator } from './index';
export default class LengthValidator extends Validator {

    name:string = this.name || "len";

    constructor(props: any, clazz?: any) {
        super(props);
        if (props.min) {
            this.min = props.min;
        } else {
            this.min = parseInt(this.props.min);
        }
        if (props.max) {
            this.max = props.max;
        } else {
            this.max = parseInt(this.props.max);
        }
        if (props.message) {
            this.message = props.message;
        } else {
            if(this.min && this.min > 0 && this.max && this.max > 0){
                this.message = this.props.invalidmessage || "长度必须大于：" + this.min + "个字节且小于：" + this.max+"个字节(每个数字和字母为1个字节，每个汉字为两个字节)";
            }else if(this.min && !this.max){
                this.message = this.props.invalidmessage || "长度必须大于：" + this.min+"个字节(每个数字和字母为1个字节，每个汉字为两个字节)";               
            }else if(!this.min && this.max){
                this.message = this.props.invalidmessage || "长度必须小于：" + this.max+"个字节(每个数字和字母为1个字节，每个汉字为两个字节)";
            }
        }
        this.parseMessage(props);
        //将汉字转换为字母aa，去判断字节
        this.transform = (value)=> value = value.replace(/[\u0391-\uFFE5]/g,"aa");
    }
}