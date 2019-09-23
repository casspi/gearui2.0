import * as React from 'react';
import * as Icon from '../basic/Icon';
import * as Tag from '../Tag';
import DicUtil from "../../utils/DicUtil";
export var props = {
    ...Tag.props,
    icon: GearType.String,
    prompt: GearType.String,
    format: GearType.String,
    value: GearType.String,
    isvisible: GearType.Any,
    dictype: GearType.Or(GearType.Object, GearType.Function, GearType.String),
    async: GearType.Boolean,
    showHtmlStr:GearType.Boolean,//是否显示为html字符串

};

export interface state extends Tag.state {
    icon?: string;
    prompt?: string;
    format?: string;
    value?: string;
    isvisible?:any;
    options?:any;
    async?:any;
    dictype?: object | string | Function;
    showHtmlStr?:boolean
}
export default class Label<P extends typeof props, S extends state> extends Tag.default<P, S> {
    constructor(props:any){
        super(props);
    }
    getInitialState(): state {
        return {
            value: this.props.value || this.props.children,
            format: this.props.format,
            prompt: this.props.prompt,
            icon: this.props.icon,
            isvisible: this.props.isvisible,
            async: this.props.async === true?true:false,
            dictype: this.props.dictype,
            showHtmlStr: this.props.showHtmlStr===true?true:false
        };
    }

    getProps() {
        let props: any = G.G$.extend({}, this.state);
        delete props.children;
        return props;
    }

    render() {
        let value: any = this.state.value;
        if("richtext" == this.state.format){
            if(value){
                // react不支持br，为防止其它地方有问题，这里替换成p
                var array = (value+"").split("\n");
                value = ""
                for(var i=0;i<array.length;i++){
                    value+= "<p>"+array[i]+"</p>";
                }
                value = value.replace(/\s/g,"&nbsp;");
            }
        }
        let props:any = this.getProps();
        delete props.value;
        delete props.showHtmlStr;
        if(!this.state.showHtmlStr){
            if(this.state.icon){
                var iconProps: any = {
                    key:"icon",
                    type: this.state.icon,
                };
                if(this.props.children && this.state.format != 'richtext'){//富文本情况下value是string，不为react dom
                    return <span {...props}><Icon.default {...iconProps}/><span key="text">{value}</span></span>;
                }
                return <span {...props}><Icon.default {...iconProps}/><span key="text" dangerouslySetInnerHTML={{__html:value}}></span></span>;
            }else
                if(this.props.children && this.state.format != 'richtext'){//富文本情况下value是string，不为react dom
                    return <span key="text" {...props}>{value}</span>
                }
                return <span key="text" {...props} dangerouslySetInnerHTML={{__html:value}}></span>;
        }else{//显示html字符串
            value = [value]
            let style = G.G$.extend({},props.style,{
                whiteSpace:'pre-wrap',
                display: 'block'
            })
            return <span key="text" {...props} style={style} >{value}</span>
        }
    }
 
    afterRender(){
        if(this.state.dictype){
            if(!this.state.async){
                let dictype = this.state.dictype;
                let fn = async () => {
                    let result = await DicUtil.getDic({dictype});
                    if(result.success) {
                        let dic = result.data;
                        if(dic) {
                            this.setState({
                                options: dic
                            },()=>{
                                this.formatValue(this.state.value)
                            });
                        }
                    }
                }
                fn();
            }else{
                this.formatValue(this.state.value)
            }
            
        }
    }

    getValueByCode(values:any[]){//通过code去字典中查询
        let method = 'post';
        let dictype = this.state.dictype;
        let resData:any[] = []
        DicUtil.getDataByCode(dictype,values,(message:any)=>{
            // console.log(message)
            if(message.status==0 && message.data){
                resData = message.data
            }
        },method)
        return resData
    }

    formatValue(value:any,callback?:Function){//从字典中匹配数据
        let values = this.getPropStringArrayValue(value) || [];
        let options:any[] = []; 
        if(!this.state.async){
            options = this.state.options
        }else{
            for(let i=0;i<values.length;i++){
                options = options.concat(this.getValueByCode(values[i]));
            }
        }
        if(values.length>0 && values.length===1){
            let newValue:any = values[0];
            let fun = (options:any)=>{
                for(let i=0;i<options.length;i++){
                    if(values[0] == options[i].value){
                        newValue = options[i].label || options[i].text;
                        break;
                    }
                    if(options[i].children && options[i].children.length>0){
                        fun(options[i].children)
                    }
                }
            }
            if(this.state.dictype && options.length>0){
                fun(options)
                this.setState({
                    value: newValue
                },()=>{
                    if(callback){
                        callback()
                    }
                });
            }
        }else if(values.length>1){
            let newValue:any = "";
            let fun = (options:any,value:any)=>{
                for(let i=0;i<options.length;i++){
                    if(value == options[i].value){
                        newValue += "，"+(options[i].label || options[i].text);
                        break;
                    }
                    if(options[i].children && options[i].children.length>0){
                        fun(options[i].children,value)
                    }
                }
            }
            if(this.state.dictype && options.length>0){
                for(let i=0;i<values.length;i++){
                    fun(options,values[i]);
                }
                if(newValue){
                    newValue = newValue.substring(1);
                }
                this.setState({
                    value: newValue || value
                },()=>{
                    if(callback){
                        callback()
                    }
                });
            }


        }
        
    }

    getValue() {
        return this.state.value;
    }
    
    getText() {
        return this.state.value;
    }
    
    setValue(value: string,callback?:Function) {
        if(this.state.dictype){
            this.formatValue(value,callback)
        }else{
            this.setState({
                value
            },()=>{
                if(callback){
                    callback()
                }
            });
        }
    }
}