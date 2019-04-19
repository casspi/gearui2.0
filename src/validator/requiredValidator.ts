import * as validates from './index';
export default class RequiredValidator extends validates.Validator {

    name:string = this.name || "required";
    message:string =  this.message||"值不能为空";

    validator = (rule: any,value: any,callback: any) => {
        if(value != null && typeof value=="string"?value.trim()!="":value) {
            if(value instanceof Array) {
                if(value.length > 0) {
                    callback();
                    return;
                }else{
                    callback(this.message);
                    return
                }
            }else if(typeof value == "string") {
                if(value.trim() != "") {
                    callback();
                    return;
                }
            }else {
                callback();
                return;
            }
        }else{
            callback(this.message);
            return;
        }
    }

    // param: {required?:boolean;}
    // constructor(param) {
    //     super();
    //     this.param = param;
    // }

    // message() {
    //     let message = "值不能为空";
    //     return message;
    // }

    // validate(ele:tags.Tag<tags.TagProps>) {
    //     let value = (ele instanceof tags.Tag) ? (ele.state["value"]||"") : ele;
    //     let required = this.param.required;
    //     if(required == true) {
    //         if(value != null && value != "") {
    //             return true;
    //         }else {
    //             return this.message();
    //         }
    //     }
    // }
}