import * as Tag from './Tag';
import * as React from 'react';
import G  from '../Gear';
// import {Input,Button} from 'antd';
// import {Util} from '../util/utils';
// const InputGroup = Input.Group;

export var props = {
    ...Tag.props,
    className:GearType.String
}
export interface state extends Tag.state {

}

// 提供部分自定义控件使用，用于在最外层的包装，实现对数据的校验
export default  class Wrapper<P extends typeof props,S extends state> extends Tag.default<P,S>{

    // private value;

    // 设置默认属性值
    static defaultProps = {
        updateStateKeysAfterReceiveProps : null
    }    

    constructor(props:P) {
        super(props);
    } 
    getInitialState(): state{
        return G.G$.extend({},{
            className:this.props.className
        },this.state)
    };
    getProps() {  
        let state = this.state;
        let className = "gearui-control-wrapper";
        if(state.className)
            className =  className + " " + state.className;
        return G.G$.extend({}, state, {
            className:className,
            value:null,
        });
    }  
      
    render() {
        return <div {...this.getProps()}>{this.props.children}</div>;
    }

    afterRender() {
        //this.fireChange();
    }

    afterUpdate() {
        //this.fireChange();
    }    

    // fireChange(){
    //     if(this.props["data-id"] && this.props["onChange"]){
    //         let isChanged = false;
    //         if(this.props.value!=null){ 
    //             if(this.value==null){
    //                 // 首次时直接设置默认值
    //                 this.value = this.props.value;
    //                 // 如果默认值不为空，触发一次检查
    //                 if(Util.isEmpty(this.value)==false)
    //                     isChanged = true;
    //             }else{
    //                 if(Util.isValueEqual(this.value,this.props.value)==false){
    //                     this.value = this.props.value;
    //                     // 如果值有变化，触发检查
    //                     isChanged = true;
    //                 }
    //             }
    //         }
    //         if(isChanged){
    //             let parent = G.$("#"+this.props["data-id"]);
    //             //parent.triggerChange.call(parent,this.value);
    //             this.props["onChange"].call(parent,this.value);
    //             parent.setState({});
    //         }
    //     }
    // }

    // fireChange(value){
    //     if(this.props["data-id"] && this.props["onChange"]){
    //         let parent = G.$("#"+this.props["data-id"]);
    //         this.props["onChange"].call(parent,value);
    //     }
    // }     
}