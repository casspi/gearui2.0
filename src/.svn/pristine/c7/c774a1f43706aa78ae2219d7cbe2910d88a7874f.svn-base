import * as Text from './Text';
import { InputProps } from "antd/lib/input";
export var props =  {
    ...Text.props,
    format:GearType.String,//both,moblie,landline
    multiple:GearType.Boolean,//true,false:多个号码逗号相隔
}
export interface state extends Text.state {

}
export default class Telephone<P extends typeof props & InputProps, S extends state> extends Text.default<P, S>{
   
}