import * as React from 'react';
import { TreeSelect } from 'antd';
import { TreeProps as AntdTreeProps } from 'antd/lib/tree';
import * as Tree from './Tree';
import Tag from '../Tag';
import { default as Http} from '../../utils/http';
import {StringUtil} from '../../utils';
export var props = {
    ...Tree.props,
    editable: GearType.Boolean,
    popupContainer: GearType.String,
    allowClear: GearType.Boolean,
    prompt: GearType.String,
    searchPlaceHolder: GearType.String,
    dropdownStyle: GearType.CssProperties,
    dropdownMatchSelectWidth: GearType.Boolean,
    treeDefaultExpandAll: GearType.Boolean,
    treeCheckable: GearType.Boolean,
    treeDefaultExpandedKeys: GearType.Array<string>(),
    treeNodeFilterProp: GearType.String,
    treeNodeLabelProp: GearType.String,
    treeDataSimpleMode: GearType.Boolean,
    showCheckedStrategy: GearType.Enum<'SHOW_ALL' | 'SHOW_PARENT' | 'SHOW_CHILD'>(),
    refid:GearType.String,
    //汉字转拼音字符集url
    pinyinUrl:GearType.String,
    //特殊需求，多选时父节点选中时不可选中子节点
    childDisable:GearType.Boolean
};
export interface state extends Tree.state {
    treeCheckable?:boolean,
    treeCheckStrictly?:boolean
}
type TreeNode = Tree.TreeNode;
export default class Combotree<P extends typeof props & AntdTreeProps, S extends state & Partial<AntdTreeProps>> extends Tree.default<P, S> {
    
    pinyinData = {}
    getInitialState(): state & Partial<AntdTreeProps> {
        return {
           options: [],
           method: this.props.method,
           treeCheckable: this.props.multiple?(this.props.onlyLeafCheck ?true:(this.props.cascadeCheck?true:this.props.treeCheckable)):false,
           treeCheckStrictly: this.props.multiple?(this.props.onlyLeafCheck?true:(this.props.cascadeCheck!=undefined?!this.props.cascadeCheck:false)):false,

        };
    }
    static newJsxInstance(props: any) {
        return <Combotree {...props}/>;
    }

    getProps() {
        let props = super.getProps();
        let propsNew = G.G$.extend({},props,{
            inputValue: null,
            showSearch: this.props.editable,
            value: this.state.value,
            defaultValue: this.state.value,
            multiple: this.props.multiple,
            placeholder: this.props.prompt,
            allowClear: this.props.allowClear != false,
            onSelect: (value: any,node1:any,extra:any) => {
                let node = this.getNode(value) || this.getNode(value.value);
                // console.log(node)
                if(!node)
                    return;
                if((this.props.onlyLeafCheck && !node.isLeaf)) {
                    return;
                }
                if(this._onBeforeSelect) {
                    let re = this._onBeforeSelect(node);
                    if(re == false) {
                        return;
                    }
                }
                let re = this.doEvent("beforeSelect",node);
                if(re instanceof Array && re[0] == false) {
                    return;
                }
                this.select(value,()=>{
                     //特殊需求，多选时父节点选中时，不可选中子节点
                    if(this.props.childDisable===true && node && node.children && node.children.length>0){
                        node.children.map((childEle:any)=>{
                            if(childEle.id){
                                this.unSelect(childEle.id);
                            }
                        })
                    }
                    this._onSelect(node);
                    Tree.default.onSelect.call(this,node);
                    this.doEvent("select",node);
                });
               
            },
            onChange: (value: any, label: any, extra:any) => {
                console.log(value);
                console.log(extra)
                if(this.props.multiple != true && value != null && value != "") {
                    if(value instanceof Array) {
                        value = value[0];
                    }
                    if(typeof value == "object") {
                        value = value.value;
                    }
                    let node = this.getNode(value);
                    if(this.props.onlyLeafCheck && node && !node.isLeaf) {
                        return;
                    }
                }
                // 当前值
                let oldValue = this.getValue();
                if(value != null) {
                    if(this.state.treeCheckStrictly==true){
                        if(extra.allCheckedNodes && extra.allCheckedNodes.length>0){
                            value = extra.allCheckedNodes.map((item:any)=>{
                                return {value:item.key,label:this.getTextByValue(item.key)}
                            })
                        }
                        if(extra.checked === true){
                            value = [].concat(value,extra.preValue);
                            value = value.filter((item:any,index:number)=>{
                                let arrValue:any[] = [];
                                value.forEach((e:any) => {
                                    arrValue.push(e.value)
                                });
                                return arrValue.indexOf(item.value) === index
                            })
                        }else if(extra.checked === false && extra.allCheckedNodes && extra.allCheckedNodes.length <= 0){//搜索后取消选中
                            value = extra.preValue.filter((o:any)=>{
                                return o.value !== extra.triggerValue
                            })
                            let values = value.map(function(item:any){
                                return item.value;
                            })
                            this.setValue(values)
                            // console.log(value);
                        }
                    }
                    this._onChange(value,oldValue);
                    Combotree.onChange.call(this,value,oldValue);
                }else {
                    if(this.childTree instanceof Tree.default) {
                        this.childTree.setState({
                            options: []
                        });
                        this.childTree.clear();
                    }
                    this.setState({
                        value: undefined
                    },()=>{
                        this.doEvent("change",value,oldValue);
                    });
                }
                
                this.triggerChange(value);
            },
            onSearch: (value: any) => {
                let node = this.findByText(value,true);
                this._onSearch(value,node);
                Combotree.onSearch.call(this,value,node);
                this.doEvent("search",value,node);
            },
            searchPlaceholder: this.props.searchPlaceHolder,
            dropdownStyle: this.props.dropdownStyle,
            dropdownMatchSelectWidth: this.props.dropdownMatchSelectWidth,
            treeDefaultExpandAll: this.props.treeDefaultExpandAll,
            treeDefaultExpandedKeys: this.props.treeDefaultExpandedKeys,
            treeNodeFilterProp: this.props.treeNodeFilterProp,
            treeNodeLabelProp: this.props.treeNodeLabelProp || "text",
            treeDataSimpleMode: this.props.treeDataSimpleMode,
            showCheckedStrategy: this.props.showCheckedStrategy||"SHOW_ALL",
            labelInValue: false,
            disabled: this.state.disabled || this.state.readOnly,
            filterTreeNode: (input: string, node: any) =>{
                if(node.props.title.toLowerCase().indexOf(input.trim().toLowerCase()) != -1) {
                    return true;
                }
                if(StringUtil.getPinyin(node.props.title,true,this.pinyinData).toLowerCase().indexOf(input.trim().toLowerCase()) != -1 || StringUtil.getPinyin(node.props.title,false,this.pinyinData).toLowerCase().indexOf(input.trim().toLowerCase()) != -1){
                    return true;
                }
                return false;
            },
            getPopupContainer: ()=>{
                let container = document.body;
                if(this.props.popupContainer) {
                    if("parent" == this.props.popupContainer){
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
                        let c = G.G$(this.props.popupContainer);
                        if(c.length>0)
                            container = c[0];
                    }
                }
                return container;                
            }
        });
        if(propsNew.treeCheckStrictly == true) {
            if(propsNew.value instanceof Array) {
                let valueNew: any = [];
                for(let i=0; i < propsNew.value.length; i++) {
                    let valInner = propsNew.value[i];
                    if(valInner instanceof String || valInner.label == null) {
                        let label = this.getTextByValue(valInner);
                        if(label != null) {
                            valueNew.push({value: valInner, label});
                        }
                    }else {
                        valueNew.push(valInner);
                    }
                }
                propsNew.value =  [].concat([],valueNew);
                propsNew.defaultValue = [].concat([],valueNew);
            }else {
                if(propsNew.value instanceof String || propsNew.value==null || propsNew.value.label == null) {
                    let label = this.getTextByValue(propsNew.value);
                    if(label != null) {
                        propsNew.value = {value: propsNew.value, label};
                        propsNew.defaultValue = {value: propsNew.value, label};
                    }
                }
            }
        }
        this.initValue = propsNew.value;//修改FormTag
        return propsNew;
    }

    makeJsx() {
        let children = this.getTreeNode();
        let childrenMap = children.map((ele) => {
            return ele;
        });
        let props:any = this.getProps();
        delete props.invalidType;
        delete props.labelText;
        if(this.form){
            delete props.value;
            delete props.defaultValue;
        }
        return <TreeSelect {...props}>{childrenMap}</TreeSelect>;
    }

    afterRender() {
        if(this.ast){
            this.find(".ant-select-selection").attr("tabindex","0");
        }
        super.afterRender();
        if(this.props.multiple == true && this.props.editable == false) {
            this.find(".ant-select-selection").find("input").remove();
        }
        if(this.props.pinyinUrl){
            let p = Http.getMethod('get')(this.props.pinyinUrl,'json');
            if(p){
                p.then((response)=>{
                    this.pinyinData = response.data;
                }).catch((error)=>{
                    return Promise.resolve(error);
                });
            }
        }
    }

    // afterUpdate() {
    //     super.afterUpdate();
    // }

    setValue(values: any, callback?: Function) {
        if(typeof values =="string")
            values = [values];    
        super.setValue(values, callback);
    }

    formartValue(values:any){
        if(values instanceof Array) {
            let valueNew: any = [];
            for(let i=0; i < values.length; i++) {
                let valInner = values[i];
                if(valInner instanceof String || valInner.label == null) {
                    let label = this.getTextByValue(valInner);
                    if(label != null) {
                        valueNew.push({value: valInner, label});
                    }
                }else {
                    valueNew.push(valInner);
                }
            }
            values =  [].concat([],valueNew);
        }else {
            if(values instanceof String || values==null || values.label == null) {
                let label = this.getTextByValue(values);values
                if(label != null) {
                    values = {value: values, label};
                }
            }
        }
        return values
    }

    getValue(): any {
        if(this.props.multiple==true){
            return this.state.value;
        }else{
            let value:any = this.state.value;
            if(value && value instanceof Array && value.length>0){
                return value[0];
            }else{
                return value;
            }
        }
    }

    getSelected(): any {
        let value = this.getValue();
        let nodes = [];
        if(value instanceof Array) {
            for(let i = 0; i < value.length; i++) {
                let node = this.getNode(value[i]);
                if(node != null) {
                    nodes.push(node);
                }
            }
        }else {
            return this.getNode(value);
        }
        return nodes;
    }

    getText() {
        let value = this.getValue();
        if(value instanceof Array) {
            let texts = [];
            for(let i=0; i < value.length; i++) {
                texts.push(this.getTextByValue(value[i]));
            }
            return texts;
        }else {
            return this.getTextByValue(value);
        }
    }

    // 通过文本获取对应值
    getTextByValue(value: any,options?:Array<any>): any {
        options = options||this.state.options||[];
        let text = null;
        for(let i = 0; i < options.length; i++) {
            let ele = options[i];
            if(ele instanceof Array) {
                text = this.getTextByValue(value,ele);
            }else {
                if(ele.value == value) {
                    text = ele.label||ele.text;
                }else {
                    if(ele.children instanceof Array) {
                        text = this.getTextByValue(value,ele.children);
                    }
                }
            }
            if(text != null) {
                break;
            }
        }
        return text;
    }
    
    select(id: any,callBack:Function) {
        super.select(id);
        let valueOld: any = [];
        if(this.props.multiple) {
            valueOld = this.state.value;
        }else {
            valueOld = [];
        }
        if(valueOld instanceof Array) {
            let valueArr = new GearArray(valueOld);
            if(!valueArr.contains(id)) {
                valueOld.push(id);
            }
        }
        if(this.state.treeCheckStrictly==true){
            valueOld = valueOld.map((item:any)=>{
                if(typeof item.value === 'string'){
                    return item.value;
                }else{
                    return item
                }
            })
        }
        this.setValue(valueOld,callBack);
    }

    unSelect(id: any) {
        super.unSelect(id);
        let valueOld: any = [];
        if(this.props.multiple) {
            valueOld = this.state.value;
        }else {
            valueOld = [];
        }
        if(valueOld instanceof Array) {
            let valueArr = new GearArray(valueOld);
            if(valueArr.contains(id)) {
                valueArr.remove(id);
                valueOld = valueArr.toArray();
            }
        }
        this.setValue(valueOld);
    }

    protected _onChange(value: any,oldValue:any) {
        this.setState({
            value: value
        },()=>{
            this.doEvent("change",value,oldValue);
        });
    };
    onChange(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("change",fun);
        }
    }
    static onChange() {
        
    }
    
    //当选中节点的时候触发
    protected _onSearch(value:string,node:TreeNode) {};
    //静态-全局的tree.onSelect
    static onSearch(value:string,node:TreeNode) {}
    onSearch(fun:Function){
        if(fun && G.G$.isFunction(fun)) {
            this.bind("search",fun);
        }
    }
    focus(...args: any[]) { 
        if(this.ast){
            this.find(".ant-select-selection input").focus(...args);     
        }else{
            G.G$(this.realDom).find(".ant-select-selection").find("input").focus(...args);
        }
    }

    getInput() {
        return this.find(".ant-select-selection input")[0];
    }

    blur(...args: any[]){
        // this.find(".ant-select-selection").blur(...args);
        this.find(".ant-select-selection input").blur(...args);
    }      
   
    reset(){
        if(this.form) {
            this.form.reset(this.state.id || this.state.name);
        }else{
            this.setValue(this.props.value)
        }
    }
    //当加载完成的时候触发
    protected _onLoadSuccess(data: any){
        //multiple="true" onlyLeafCheck="true"两者为true时，treeCheckStrictly即为true
        //此时antd treeselect value强制为{label:'',value:''},此处在数据加载完成后用setValue格式化 modified by zhibing
        if(this.state.treeCheckStrictly == true) {
            this.setValue(this.state.value)
        }
    }
}