import { Validator } from './index';
import {StringUtil} from "../utils";
export default class LengthValidator extends Validator {

    name:any = this.name || "len";
    validator = (rule:any,value:any,callback:any)=>{
        if(value && value.value!= undefined ){//textarea时：值为{value：xxx}
            value = value.value
        }
        this.min = parseInt(this.props.min);
        this.max = parseInt(this.props.max);
        if(this.props.judgeString===true){//判断字符串长度
            if(this.min >0 && this.max >0){
                this.message = this.message||"长度必须大于：" + this.min + "且小于：" + this.max;
            }else if(this.min >0 && !(this.max >0)){
                this.message = this.message ||"长度必须大于：" + this.min;               
            }else if(!(this.min >0) && this.max >0){
                this.message = this.message||"长度必须小于：" + this.max;
            }
            if(value && value.trim()){
                let strLength = value.length;//字符串长度
                if(this.max>0 && strLength>this.props.max){
                    callback(this.message);
                    return
                }else if(this.min>0 && strLength<this.props.min){
                    callback(this.message);
                    return
                }else{
                    callback();
                    return
                }
            }else{
                callback();
                return
            }

        }else{//判断字节数
            this.message = this.message || "长度不符合限制";
            if(value && value.trim()){
                let bytesLength = StringUtil.getBytesLength(value).length;//字节长度
                if(this.max>0 && bytesLength>this.max){
                    callback(this.message);
                    return
                }else if(this.min>0 && bytesLength<this.min){
                    callback(this.message);
                    return
                }
                else{
                    callback();
                    return
                }
            }else{
                callback();
                return
            }
        };
    
        
    }
    
}