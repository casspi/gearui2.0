import * as React from 'react';
import { Input as AntdInput, Button as AntdButton } from 'antd';
import * as FormTag from './FormTag';
export var props = {
    ...FormTag.props,
    prompt: GearType.String
};

export interface state extends FormTag.state {
    disabled?: boolean;
    prompt?: string;
}

export default class File<P extends typeof props, S extends state> extends FormTag.default<P, S>{

    getInputProps() {
        return G.G$.extend({},{
            key: "input",
            value: this.state.value,
            readOnly: true,
            disabled: this.state.disabled == true || this.state.readOnly == true,
            placeholder: this.state.prompt,
            onClick: (e: any) => {
                this.find("input[type='file']").click();
                this.doEvent("click",e);
            },
            suffix: <AntdButton key="button" icon={"folder-open"} disabled={this.state["disabled"]} onClick={()=>{
                this.find("input[type='file']").click()
            }}>{"选择文件"}</AntdButton>,
            name:this.props.name || this.props.id
        });
    }

    getFileInputProps() {
        return G.G$.extend({},{
            key: "file",
            type: "file", 
            name: this.props.name,
            style: { display: "none" },
            value: this.state.value,
            onChange: (e: any) => {
                let oldValue = this.getValue();
                let newValue = e.target.value;
                this.setValue(newValue,()=>{
                    this.doEvent("change", newValue, oldValue);
                });
            },
        });
    }    

    //插件初始化，状态发生变化重新进行渲染
    getInitialState() {
        return {
            value: this.props.value,
            disabled: this.props.disabled,
            prompt: this.props.prompt,
        };
    }
    makeJsx() {
        let state:any = G.G$.extend({},this.state);
        delete state.invalidType;
        delete state.labelText;
        delete state.validation;
        delete state.validateTempId
        let inputProps:any = this.getInputProps();
        let fileProps:any = this.getFileInputProps();
        if(this.form){
            delete state.value;
            //delete inputProps.value;
            // delete fileProps.value;
        }
        return <div {...state}>
                <AntdInput {...inputProps}/>
                <AntdInput {...fileProps}/>
            </div>;
    }

    afterRender() {
        this.find("button").attr("tabindex","-1");
        this.find("input:hidden").attr("tabindex","-1");
        
    }

    getValue(){
        return this.state.value;
    }

    
    onChange(fun:Function){
        if(fun && G.G$.isFunction(fun)) {
            this.bind("change",fun);
        }else{
            this.find("input").change();
        }     
    }
    
    
    // 清除选中值
    clear(){
        this.setState({
            value: undefined
        },()=>{
        });        
    }    
    
    focus(...args: any[]) { 
        this.find("input").focus(...args);      
    }

    blur(...args: any[]){
        this.find("input").blur(...args);
    } 

    getOriginurl(){
        let fileInput:any = this.realDom.querySelectorAll('input')[1];
        if(fileInput.files[0]){
            let url = window.URL.createObjectURL(fileInput.files[0]);
            return url;
        }else{
            console.error('您还没有选中任何文件!')
            return
        }
    }  
}