import { TimePicker as AntdTimePicker } from 'antd';
import * as moment from 'moment';
import * as FormTag from './FormTag';
import * as React from 'react';
import G from '../../Gear';
import Tag from '../Tag';
import { TimePickerProps } from 'antd/lib/time-picker';
export var props = {
    ...FormTag.props,
    value:GearType.Any,          //时间
    placeholder: GearType.String,        //"请选择时间"
    format:  GearType.String,		            //展示的时间格式"HH:mm:ss"
    disabled: GearType.Boolean,              //禁止
    readonly: GearType.Boolean,
    size: GearType.Enum<"large"|"defaule"|"small">(),                   //尺寸
    disabledHours: GearType.Any,
    disabledminutes: GearType.Any,
    disabledseconds: GearType.Any,
    hidedisabled: GearType.Boolean,
    hourstep: GearType.Number,   // 小时时间间隔
    minutestep: GearType.Number, // 分针时间间隔
    secondstep: GearType.Number, // 秒钟时间间隔
    // 弹出列表所在容器
    popupcontainer: GearType.String,
    getCalendarContainer: GearType.Function,
    use12Hours:GearType.Boolean       
}
export interface state extends FormTag.state{
    size?: "large"|"defaule"|"small",
    placeholder:string,
    format:string,
    readOnly:boolean,
    hideDisabledOptions:boolean,
    use12Hours:boolean

}
export default class Time<P extends typeof props & TimePickerProps,S extends state  & TimePickerProps> extends FormTag.default<P,S> {

    // constructor(props:any) {
    //     super(props);
    //     this.onChange(this.props.onChange);
    //     this.onOpenChange(this.props.onOpenChange);
    // }

    //获取当前属性
    getProps() {
        let state = this.state;
        return G.G$.extend(state, {
            defaultValue: this.state.value,
            value: this.state.value,
            placeholder: this.state.placeholder,
            format: this.state.format,
            disabled: this.state.disabled || this.state.readOnly,
            size: this.state.size||'default',
            hideDisabledOptions:this.state.hideDisabledOptions,
            use12Hours:this.state.use12Hours || false,
            disabledHours: ()=>{
                return this.disabledHours();
            },
            disabledMinutes:  (selectedHour:any)=>{
                return this.disabledMinutes(selectedHour);
            },
            disabledSeconds: (selectedHour:any,selectedMinute:any)=>{
                return this.disabledSeconds(selectedHour,selectedMinute);
            },
            onChange: (time:any, timeString: string)=>{
                if(this.isValid(timeString)){
                    let oldValue = this.getFormatValue();
                    this.triggerChange(time);
                    this.doEvent("change",timeString, oldValue);
                    this.setState({
                        value:time
                    });
                }
            },
            onOpenChange: (open:boolean)=>{
                this.doEvent("openchange",open);
            },
            getPopupContainer: ()=>{
            //     let container = document.body;
            //     let containerRe = this.doEvent("getpopupcontainer");
            //     if(containerRe && containerRe.length > 0) {
            //         container = containerRe[0];
            //     }else {
            //         //if(this.props.rendertoparent == true) {
            //             if(this.propDom != null) {
            //                 let parent = G.$(this.propDom.parentElement);
            //                 if(parent instanceof Tag) {
            //                     parent = parent.realDom;
            //                 }else {
            //                     parent = parent[0];
            //                 }
            //                 if(parent) {
            //                     container = parent;
            //                 }
            //             }
            //         //}
            //     }
            //     return container;
                let container = document.body;
                if(this.props.popupcontainer) {
                    if("parent"==this.props.popupcontainer){
                        // 在其父级
                        let parent = this.parent();
                        if(parent instanceof Tag) {
                            parent = parent.realDom;
                        }else {
                            parent = parent[0];
                        }
                        if(parent) {
                            container = parent;
                        }
                    }else{
                        // 在自定义的选择器内，如果自定义的选择器无效，则生成在document.body下
                        let c = G.G$(this.props.popupcontainer);
                        if(c.length>0)
                            container = c[0];
                    }
                }
                return container;               
            }
        });

    }

    //插件初始化，状态发生变化重新进行渲染
    getInitialState() {
        let hidedisabled = this.props.hidedisabled;
        let disabledHours:Array<any> = this.props.disabledHours;
        console.log(disabledHours)
        let disabledMinutes:Array<any> = this.props.disabledminutes;
        let disabledSeconds:Array<any> = this.props.disabledseconds;
        if((this.props.hourstep!=null && this.props.hourstep>0)
            || (this.props.minutestep!=null && this.props.minutestep>0)
            || (this.props.secondstep!=null && this.props.secondstep>0)){
            hidedisabled = true;
            if(this.props.hourstep>0){
                disabledHours = [];
                var step:number = this.props.hourstep;
                for(var i=0;i<24;i++){
                    if(i % step!=0)
                        disabledHours.push(i);
                }
            }
            if(this.props.minutestep>0){
                disabledMinutes = [];
                var step:number = this.props.minutestep;
                for(var i=0;i<60;i++){
                    if(i % step!=0)
                        disabledMinutes.push(i);
                }
            }
            if(this.props.secondstep>0){
                disabledSeconds = [];
                var step:number = this.props.secondstep;
                for(var i=0;i<60;i++){
                    if(i % step!=0)
                        disabledSeconds.push(i);
                }
            }   
        }
        let format = this.getFormat();
        let state = super.getInitialState();
        return G.G$.extend({}, state, {
            value: this.isValid(this.props.value)?moment(this.props.value, format):null,
            placeholder: this.props.placeholder,
            format: format,
            disabled: this.props.disabled,
            readonly: this.props.readonly,
            size: this.props.size,
            disabledHours: disabledHours,
            disabledMinutes: disabledMinutes,
            disabledSeconds: disabledSeconds,
            hideDisabledOptions:hidedisabled,
            use12Hours:this.props.use12Hours
            // 目前2.x版本不支持下面的属性，所以得自己实现
            //hourStep:this.props.hourstep,
            //minuteStep:this.props.minutestep,
            //secondStep:this.props.secondstep,            
        });
    }

    // 检查当前设置的时间是否有效
    protected isValid(value:any):boolean{
        if(value){
            let m = moment(value, this.state?this.state["format"]:this.getFormat());
            let hour = m.hour();
            let disabledHours = this.disabledHours();
            if(disabledHours && disabledHours.length>0){
                for(var i=0;i<disabledHours.length;i++){
                    if(hour==disabledHours[i])
                        return false;
                }
            }
            let minute = m.minute();
            let disabledMinutes = this.disabledMinutes(hour);
            if(disabledMinutes && disabledMinutes.length>0){
                for(var i=0;i<disabledMinutes.length;i++){
                    if(minute==disabledMinutes[i])
                        return false;
                }
            } 
            let second = m.second();
            let disabledSeconds = this.disabledSeconds(hour,minute);
            if(disabledSeconds && disabledSeconds.length>0){
                for(var i=0;i<disabledSeconds.length;i++){
                    if(second==disabledSeconds[i])
                        return false;
                }
            }     
            return true;                   
        }
        return false;
    }

    getFormat() {
        return this.props.format || "HH:mm:ss";
    }

    private getDisabled(disstr:any) {
        if(disstr){
            if(disstr instanceof Array){
                return disstr;
            }else if(typeof disstr =="string"){
                let disr = [];
                let arr = [];
                if(disstr.indexOf(",")) {
                    arr = disstr.split(",");
                    for(let i = 0; i < arr.length; i++) {
                        try {
                            disr.push(parseInt(arr[i]));  
                        } catch (error) {}
                    }
                }
                if(disstr.indexOf("-")) {
                    arr = disstr.split("-");
                    let start = 0;
                    try {
                        start = parseInt(arr[0]);
                    } catch (error) {}
                    let end = 0;
                    try {
                        end = parseInt(arr[1]);
                    } catch (error) {}
                    for(let i = start; i <= end; i++) {
                        try {
                            disr.push(i);  
                        } catch (error) {}
                    }
                }
                return disr;
            }
        }else{
            return [];
        }
    }

    private disabledHours() {
        let dishr : any;
        let dish = this.state?this.state["disabledHours"]:this.props.disabledHours;
        if(dish) {
            // if(typeof dish=="function")
            //     dish = dish.call(this);
            dishr = this.getDisabled(dish);
        }
        return dishr;
    }
    private disabledMinutes(selectedHour:any) {
        let dishr :any;
        let dish = this.state?this.state["disabledMinutes"]:this.props.disabledminutes;
        if(dish) {
            // if(typeof dish=="function")
            //     dish = dish.call(this,selectedHour);
            dishr = this.getDisabled(dish);
        }
        return dishr;
    }
    private disabledSeconds(selectedHour:any, selectedMinute:any) {
        let dishr :any;
        let dish = this.state?this.state["disabledSeconds"]:this.props.disabledseconds;
        if(dish) {
            // if(typeof dish=="function")
            //     dish = dish.call(this,selectedHour, selectedMinute);
            dishr = this.getDisabled(dish);
        }
        return dishr;
    }
    //渲染
    render() {
        let props = this.getProps();
        return <AntdTimePicker {...props}></AntdTimePicker>;
    }

    setValue(val:any,callback?:Function){
        if(this.isValid(val)){
            let value = moment(val, this.state.format);
            this.triggerChange(value);
            super.setValue(value, callback);
        }
    }

    onChange(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("change",fun);
        }
    }

    onOpenChange(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("change",fun);
        }
    }

    reset(){
        this.setValue(this.props.value);
    }

    clear(){
        this.setValue(null);
    }

    getFormatValue(values?:any) {
        let value = values || this.getValue();
        let valueRe:any = null;
        if (value instanceof Array) {
            valueRe = [];
            value.forEach((valueInner: moment.Moment) => {
                let val = valueInner.format(this.state["format"]);
                valueRe.push(val);
            });
        } else if (moment.isMoment(value)) {
            valueRe = value.format(this.state["format"]);
        }
        return valueRe;
    }

    focus(...args:any[]) { 
        this.find("input").focus(...args);      
    }

    blur(...args:any[]){
        this.find("input").blur(...args);
    }     

}