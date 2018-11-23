import { Button,Checkbox} from 'antd';
import { TransferProps as AntdTransferProps } from 'antd/lib/transfer';
import  {FormTag} from '../form';
import * as React from 'react';
import G from '../../Gear';
import { TreeProps as AntdTreeProps } from 'antd/lib/tree';
import * as Tree from './Tree';
import Wrapper from '../Wrapper';
export var props =  {
    ...FormTag.props,
    //左侧标题
    leftTitle:GearType.String,
    //右侧标题
    rightTitle:GearType.String,
    //左侧按钮标题
    leftButtonTitle:GearType.String,
    //右侧按钮标题
    rightButtonTitle:GearType.String,
    //加载数据的URL地址
    url:GearType.String,
    //代码集
    dictype:GearType.String,
    //获取数据的方法
    method:GearType.String,
    //是否显示图标，默认为true
    showIcon:GearType.String,
    //图标样式，默认为default
    iconStyle:GearType.String,
    //是否展示连接线
    lines:GearType.Boolean,
    //当数据发生改变时触发
    onChange:GearType.Function,
    // 只读
    readOnly:GearType.Boolean,
    //禁用
    disabled: GearType.Boolean,
    //选中左树触发的事件
    onLeftTreeCheck:GearType.Function,   
    //选中右树触发的事件
    onRightTreeCheck:GearType.Function,
    onLeftTreeMoved:GearType.Function,
    onRightTreeMoved:GearType.Function,
    className:GearType.Any     
}
export interface state extends FormTag.state{
    readOnly:boolean,
    leftChecked:boolean,
    rightChecked:boolean,
    rightButtonTitle:string,
    leftButtonTitle:string,
    rightTitle:string,
    leftTitle:string,
}
// 穿梭框
export default class Transfer<P extends (typeof props) & AntdTransferProps,S extends state & AntdTransferProps> extends FormTag.default<P,S>{

    // 是否首次初始化
    private _initiated:boolean = false;
    // 树节点的数据（在transfer中缓存一份）
    private _options:Array<any>;

    // 左侧树对象
    private _leftTree:Tree.default<typeof Tree.props & AntdTreeProps,Tree.state & AntdTreeProps>;
    // 右侧树对象
    private _rightTree:Tree.default<typeof Tree.props & AntdTreeProps,Tree.state & AntdTreeProps>;

    constructor(props: P) {
        super(props);
        if(this.props.onLeftTreeMoved) {
            this.bind("lefttreemoved", this.props.onLeftTreeMoved);
        }
        if(this.props.onRightTreeMoved) {
            this.bind("righttreemoved", this.props.onRightTreeMoved);
        }
    }

    getProps() {
        let state: state = this.state;
        let className = this.props.className?"transfer-control-wrapper "+this.props.className:"transfer-control-wrapper";
        if((this.state.disabled==true || this.state.readOnly==true)){
            if(className)
                className = className + " transfer-disabled"
            else
                className = "transfer-disabled";
        }    
        let style = null;
        if(state.style && state.style.display){
            style = {display:state.style.display};
        }    
        delete state.style;
        return G.G$.extend({}, state, {
            className:className,
            tabIndex: 0,
            style:style,
            value:this.getValue(),
        });
    }

    getLeftContainerProps() {

        return {
            className:"transfer-list transfer-left-list",
            style:this.state.style,
        };        
    }

    getRightContainerProps() {

        return {
            className:"transfer-list transfer-right-list",
            style:this.state.style,
        };
    }

    getLeftTreeProps() {
        return {
            checkbox:true,
            cascadeCheck:true,
            url:this.props.url,
            dictype:this.props.dictype,
            method:this.props.method,
            showIcon:this.props.showIcon,
            iconStyle:this.props.iconStyle,
            lines:this.props.lines,
            value:this.props.value,
            oncheck:(node:any)=>{
                if(node.checked==false)
                    this._setLeftChecked(false);
                try{
                    if(this.props.onLeftTreeCheck)
                        this.props.onLeftTreeCheck.call(this,this._leftTree,node);
                    this.doEvent("leftTreeCheck",this._leftTree,node)
                }catch(err){
                    console.error(err);
                }
            },             
            ref:(ele:any)=>{
                this._leftTree = ele;
            },
            updateStateKeysAfterReceiveProps:{
                disabled:false,
                readonly:false,
            },
            // 当加载成功后触发
            onloadsuccess:()=>{
                if(this._initiated==false){
                    // 获取树节点的数据，并将其缓存在本地变量中
                    var options = this._leftTree.getRoots();
                    if(options){
                        this._options = new GearArray(options).clone().toArray();
                    }else{
                        this._options = [];
                    }
                    if(this.props.value){
                        // 如果有默认值，将默认值移至左侧
                        this._transferCheckedItemToRight();
                    }
                    this._initiated = true;
                }
            },
            disabled:this.state.disabled==true || this.state.readOnly==true,                
        };
    }

    getRightTreeProps() {
        return {
            checkbox:true,
            cascadeCheck:true,   
            showIcon:this.props.showIcon,
            iconStyle:this.props.iconStyle,
            lines:this.props.lines,
            style:this.state.style,         
            oncheck:(node:any)=>{
                if(node.checked==false)
                    this._setRightChecked(false);
                try{
                    if(this.props.onRightTreeCheck)
                        this.props.onRightTreeCheck.call(this,this._rightTree,node);
                    this.doEvent("rightTreeCheck",this._rightTree,node)
                }catch(err){
                    console.error(err);
                }               
            },
            ref:(ele:any)=>{
                this._rightTree = ele;            
            },
            updateStateKeysAfterReceiveProps:{
                disabled:false,
            },
            disabled:this.state.disabled==true || this.state.readOnly==true,       
        };
    } 
    
    getLeftCheckProps() {   
        return {
            onChange:this._onLeftCheckChange.bind(this),
            checked:this.state.leftChecked,
            disabled:this.state.disabled==true || this.state.readOnly==true,         
        };
    }

    getRightCheckProps() {
        
        return {
            onChange:this._onRightCheckChange.bind(this),
            checked:this.state.rightChecked,
            disabled:this.state.disabled==true || this.state.readOnly==true, 
        };
    }
    
    getLeftButtonProps() {
        
        return {
            tabIndex: -1,
            disabled:this.state.disabled==true || this.state.readOnly==true,       
            onClick:()=>{           
                this._transferCheckedItemToLeft();
            }
        };
    }   
    
    getRightButtonProps() {
        
        return {
            tabIndex: -1,
            disabled:this.state.disabled==true || this.state.readOnly==true, 
            onClick:()=>{
                this._transferCheckedItemToRight();
            }
        };
    }       

    //插件初始化，状态发生变化重新进行渲染
    getInitialState() {
        let state = this.state;
        return G.G$.extend({}, state, {
            leftTitle:this.props.leftTitle,
            rightTitle:this.props.rightTitle,
            leftButtonTitle:this.props.leftButtonTitle || "<",
            rightButtonTitle:this.props.rightButtonTitle || ">",
            disabled:this.props.disabled,
            readonly:this.props.readOnly,
        });
    }
    
    render() {
        let props:any = this.getProps();
        let leftTreeProps:any = this.getLeftTreeProps();
        let rightTreeProps:any = this.getRightTreeProps();
        return <Wrapper {...props}>
                <div key={"left"} {...this.getLeftContainerProps()}>
                    <div key={"header"} className={"list-header"}>
                        <div key={"checkall"} className={"checkall"}>
                            <Checkbox {...this.getLeftCheckProps()}>{"全选"}</Checkbox>
                        </div>
                        <div key={"title"} className={"header-title"}>{this.state.leftTitle}</div>
                    </div>
                    <div key={"body"} className={"list-body"}>
                        <Tree.default key={"leftTree"} {...leftTreeProps}/>
                    </div>
                </div>
                <div key={"operation"} className={"transfer-operation"}>
                    <Button {...this.getRightButtonProps()}>{this.state.rightButtonTitle}</Button>
                    <Button {...this.getLeftButtonProps()}>{this.state.leftButtonTitle}</Button>
                </div>
                <div key={"right"} {...this.getRightContainerProps()}>
                    <div key={"header"} className={"list-header"}>
                        <div key={"checkall"} className={"checkall"}>
                            <Checkbox {...this.getRightCheckProps()}>{"全选"}</Checkbox>
                        </div>
                        <div key={"title"} className={"header-title"}>{this.state["rightTitle"]}</div>
                    </div>
                    <div key={"body"} className={"list-body"}>
                        <Tree.default key={"rightTree"} {...rightTreeProps}/>
                    </div>
                </div>      
        </Wrapper>;
    }

    afterRender() {
        //this.find(".transfer-control-wrapper").attr("tabindex","0");
        this.find("input,button").attr("tabindex","-1");
    }

    // 将右侧选中数据移至左侧
    private _transferCheckedItemToLeft() {
        if(this._leftTree && this._rightTree){
            // 得到左侧树节点的数据
            let options = this._rightTree.getRoots();
            let destOptions = this._leftTree.getRoots();

            let newOptions = this.getOptionsAfterTransfer(options,destOptions);
            let oldValue:any;
            if(newOptions.changed==true){
                oldValue = this.getValue();
            }
            this._rightTree.loadData(newOptions.from||[],()=>{
                // 加载完成后触发onchange
                if(newOptions.changed==true){
                    // 数据有发生改变
                    let newValue = this.getValue();
                    this._change(newValue,oldValue);
                }
            });
            this._leftTree.loadData(newOptions.to||[]);
            this._setLeftChecked(false);
            this._setRightChecked(false);
            this.doEvent("righttreemoved", newOptions.moved);
        }else{

        }
    }

    public loadData(param:any,callback?:Function) {
        if(this._leftTree) {
            this._leftTree.loadData(param, callback);
            this.setValue([]);
        }
    }

    reload(url:string,dictype:object,method:any,callback?:Function) {
        if(this._leftTree) {
            this._leftTree.reload(url,dictype,method,callback);
            this.setValue([]);
        }
    }

    // 将左侧选中数据移至右侧
    private _transferCheckedItemToRight() {
        if(this._leftTree && this._rightTree){
            // 得到左侧树节点的数据
            let options = this._leftTree.getRoots();
            let destOptions = this._rightTree.getRoots();
            let newOptions = this.getOptionsAfterTransfer(options,destOptions);
            let oldValue:any;
            if(newOptions.changed==true){
                oldValue = this.getValue();
            }
            this._leftTree.loadData(newOptions.from||[]);
            this._rightTree.loadData(newOptions.to||[],()=>{
                // 加载完成后触发onchange
                if(newOptions.changed==true){
                    // 数据有发生改变
                    let newValue = this.getValue();
                    this._change(newValue,oldValue);
                }
            });
            this._setLeftChecked(false);
            this._setRightChecked(false);
            this.doEvent("lefttreemoved", newOptions.moved);
        }else{

        }
    }

    // 当左侧全选Check值改变时触发
    private _onLeftCheckChange(e:any){
        console.log('左侧全选点击'+e.target.checked)
        if(this._leftTree){
            if(e.target.checked==true){
                 console.log('左侧全选')
                this._leftTree.checkAll(()=>{
                    this._setLeftChecked(e.target.checked);
                });
            }else{
                console.log('左侧反选')
                this._leftTree.unCheckAll(()=>{
                    this._setLeftChecked(e.target.checked);
                });
            }
        }
    }

    // 当右侧全选Check值改变时触发
    private _onRightCheckChange(e:any){
        if(this._rightTree){        
            if(e.target.checked==true){
                this._rightTree.checkAll(()=>{
                    this._setRightChecked(e.target.checked);
                });
            }else{
                this._rightTree.unCheckAll(()=>{
                    this._setRightChecked(e.target.checked);
                });
            }
        }      
    }    

    // 设置左侧全选框的选中状态
    private _setLeftChecked(checked:boolean){
        this.setState({
            leftChecked:checked
        });
    }

    // 设置右侧全选框的选中状态
    private _setRightChecked(checked:boolean){
        this.setState({
            rightChecked:checked
        });
    }

    private _change(newValue:any,oldValue:any){
        this.triggerChange(newValue);     
        this.setState({});
        // if(this.props.onchange)
        //     this.props.onchange.call(this,newValue,oldValue);
        this.doEvent("change",newValue,oldValue);   
    }

    // 根据叶子节点的选中情况将数据集拆分成两部分
    private getOptionsAfterTransfer(options:Array<any>,destOptions:Array<any>){
        let seekCheckedData = function(array:any[]){
            let fromOptions = [];
            let toOptions = [];
            if(array){
                for(let i=0;i<array.length;i++){
                    array[i].attributes["transfer_moved"] = false;
                    if(array[i].children && array[i].children.length>0){
                        // 对子集进行扫描
                        let data:any = seekCheckedData(array[i].children);
                        if(data.from){
                            fromOptions.push({
                                id:array[i].id,
                                value:array[i].value,
                                text:array[i].text,
                                checked:false,
                                children:data.from,
                                state:array[i].state,
                                attributes:array[i].attributes,
                            });
                        }
                        if(data.moved){
                            if(array[i].checked == true || (array[i].children && data.moved.length == array[i].children.length)) {
                                array[i].attributes["transfer_moved"] = true;
                            }
                            toOptions.push({
                                id:array[i].id,
                                value:array[i].value,
                                text:array[i].text,
                                checked:false,
                                children:data.moved,
                                state:array[i].state,
                                attributes:array[i].attributes,
                            });
                        }                                    
                    }else{ 
                        if(array[i].checked==true){
                            array[i].attributes["transfer_moved"] = true;
                            // 叶子节点，并且是选中的
                            toOptions.push({
                                id:array[i].id,
                                value:array[i].value,
                                text:array[i].text,
                                checked:false,
                                attributes:array[i].attributes,
                            });
                        } else {
                            fromOptions.push({
                                id:array[i].id,
                                value:array[i].value,
                                text:array[i].text,
                                checked:false,
                                attributes:array[i].attributes,
                            });
                        }
                    }
                }
            }            
            return {
                // 源对象剩余的部分
                from:fromOptions.length==0?null:fromOptions,
                to: null, 
                // 从源对象中移出的部分
                moved:toOptions.length==0?null:toOptions,
                // 是否发生改变
                changed:toOptions.length==0?false:true,
            };
        };
        let data:any = seekCheckedData(options);
        // 将新拆分过来的数据和框中原本的数据进行合并
        data.to = this.dataMerge(destOptions,data.moved,"id","children");
        return data;
    }

    // 将两个对象的数据根据唯一健值进行比较合并后返回
    private dataMerge(options:Array<any>,newOptions:Array<any> | null,uniqueKey:string,childrenKey:string):Array<any>{
        if(options && options.length>0){
            if(newOptions && newOptions.length>0){
                // 用于检查目标对象是否存在于当前列表中
                let dataMatcher = function(dataOptions:Array<any>,data:any){
                    for(let i=0;i<dataOptions.length;i++){
                        if(dataOptions[i][uniqueKey]==data[uniqueKey])
                            return dataOptions[i];
                    }
                    return null;
                }
                for(let i=0;i<newOptions.length;i++){
                    // 检查当前数据是否在目标节点中存在
                    let newData = newOptions[i];
                    let data = dataMatcher(options,newData);
                    if(data){
                        // 如果新对象已经存在，则检查其子对象
                        if(data[childrenKey] && newData[childrenKey]){
                            // 如果新对象和目标对象都有子节点，则合并子节点
                            data[childrenKey] = this.dataMerge(data[childrenKey],newData[childrenKey],uniqueKey,childrenKey);
                        }else if(newData[childrenKey]){
                            // 如果只有新元素有子节点，则直接将子节点赋给老元素
                            data[childrenKey] = newData[childrenKey];
                        }
                    }else{
                        // 如果是纯新对象，则直接扔入
                        options.push(newData);
                    }
                }
                return options;
            }else
                // 不需要合并了，直接返回
                return options;
        }else
            // 不需要合并了，直接返回
            return newOptions;
    }


    // 得到当前已选择的值
    getValue(){
        let values = new GearArray([]);
        if(this._rightTree){
            let options = this._rightTree.getRoots();
            var seek = function(array:any){
                if(array){
                    for(var i=0;i<array.length;i++){
                        if(array[i].children){
                            seek(array[i].children);
                        }
                        if(array[i].value && values.contains(array[i].value)==false)
                            values.add(array[i].value);
                    }
                }                
            }
            seek(options);
        }
        return values.toArray();
    }
    // 设置值
    setValue(value:Array<string>){
        if(value){
            if(typeof value == "string")
                value = [value];
            if(this._leftTree){
                var options = new GearArray(this._options).clone().toArray();
                this._leftTree.loadData(options,()=>{
                    this._leftTree.setValue(value,()=>{
                        this._rightTree.loadData([],()=>{
                            this._transferCheckedItemToRight();
                        });
                    })
                });
            }
        }
    }

    // 得到当前已选择值的文本
    getText(){
        let texts:any[] = [];
        if(this._rightTree){
            let options = this._rightTree.getRoots();
            var seek = function(array:any[]){
                if(array){
                    for(var i=0;i<array.length;i++){
                        if(array[i]["children"]){
                            seek(array[i]["children"]);
                        }
                        if(array[i].label || array[i].text)
                        texts.push(array[i].label || array[i].text);
                    }
                }                
            }
            seek(options);
        }
        return texts;        
    }

    //禁用
    disable() {
        this.setState({
            disabled: true
        });
    }

    //启用
    enable() {
        this.setState({
            disabled: false
        });
    }
    
    onLeftTreeCheck(fun:Function){
        if(fun && G.G$.isFunction(fun)) {
            this.bind("leftTreeCheck",fun);
        }
    }

    onLeftTreeMoved(fun:Function){
        if(fun && G.G$.isFunction(fun)) {
            this.bind("lefttreemoved",fun);
        }
    }

    onRightTreeMoved(fun:Function){
        if(fun && G.G$.isFunction(fun)) {
            this.bind("righttreemoved",fun);
        }
    }

    onRightTreeCheck(fun:Function){
        if(fun && G.G$.isFunction(fun)) {
            this.bind("rightTreeCheck",fun);
        }
    }

    reset(){
        if(this._leftTree){
            var options = new GearArray(this._options).clone().toArray();
            this._leftTree.loadData(options,()=>{
                this._leftTree.setValue([])
            });
        } 
        if(this._rightTree){
            this._rightTree.loadData([]);
        }
        this._setLeftChecked(false);
        this._setRightChecked(false);
    }   

    focus(...args:any[]) { 
        this.find(".gearui-control-wrapper").focus(...args);      
    }

    blur(...args:any[]){
        this.find(".gearui-control-wrapper").blur(...args);
    }  
    
}