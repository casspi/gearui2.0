import * as React from 'react';
import * as FormTag from './FormTag';
import { Select as AntdSelect } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { ObjectUtil, UUID, Http} from '../../utils';
import { methods } from '../../utils/http';
import DicUtil from '../../utils/DicUtil';
const {Option,OptGroup} = AntdSelect;
import * as Tag from '../Tag';
type size = 'default' | 'large' | 'small';
type mode = 'default' | 'multiple' | 'tags' | 'combobox';
export interface LabeledValue {
    value: string;
    label: React.ReactNode;
    children: LabeledValue[];
}
export declare type SelectValue = string | any[] | LabeledValue | LabeledValue[];
export var props = {
    ...FormTag.props,
    size: GearType.Enum<size>(),
    notFoundContent: GearType.Any,
    transitionName: GearType.String,
    choiceTransitionName: GearType.String,
    editable: GearType.Boolean,
    allowClear: GearType.Boolean,
    disabled: GearType.Boolean,
    readOnly: GearType.Boolean,
    prompt: GearType.String,
    dropdownClassName: GearType.String,
    dropdownStyle: GearType.CssProperties,
    dropdownMenuStyle: GearType.CssProperties,
    onSearch: GearType.Function,
    filterOption: GearType.Function,
    mode: GearType.Enum<mode>(),
    multiple: GearType.Boolean,
    tags: GearType.Boolean,
    combobox: GearType.Boolean,
    optionLabelProp: GearType.Boolean,
    onBeforeSelect: GearType.Function,
    onChange: (value: SelectValue) => GearType.VoidT<any>(),
    onSelect: (value: SelectValue, option: Object) => GearType.Any,
    onUnselect: (value: SelectValue) =>  GearType.Any,
    onHidepanel: () =>  GearType.Any,
    onShowpanel: () =>  GearType.Any,
    dropdownmatchselectwidth:  GearType.Boolean,
    optionFilterProp:  GearType.String,
    defaultActiveFirstOption: GearType.Boolean,
    labelinvalue:  GearType.Boolean,
    //getpopupcontainer?: (triggerNode: Element) => HTMLElement;
    tokenSeparators: GearType.Array<string>(),
    getInputElement: GearType.Any,
    dictype: GearType.Object,
    url: GearType.String,
    lower: GearType.String,
    valuefield: GearType.String,
    labelfield: GearType.String,
    method: GearType.String,
    link:  GearType.String,
    target:  GearType.String,
    upper:  GearType.String,
    onloadsuccess: GearType.Function,
    onloaderror:GearType.Function,
    // 弹出列表所在容器
    popupcontainer: GearType.String,
};
export interface state extends FormTag.state {
    value:any,
    options:any,
    url:string,
    method:any,
    dictype:any,
    onHidepanel:any
}
export default class Select<P extends typeof props & SelectProps, S extends state & SelectProps> extends FormTag.default<P, S> {
    //父级树
    parentSelect: Select<P,state>;
    //子级树
    childSelect: Select<P,state>;
    constructor(props: P, context: {}) {
        super(props, context);
        this.onShowPanel(this.props.onShowPanel);
    }
    getProps() {
        return G.G$.extend({},super.getProps(),{
            size: this.state.size,
            notFoundContent: this.state.notFoundContent||'无匹配结果',
            transitionName: this.props.transitionName,
            choiceTransitionName: this.props.choiceTransitionName,
            showSearch: this.props.editable,
            onHidepanel: this.props.onHidepanel,
            allowClear: this.props.allowClear||true,
            disabled: this.state.disabled || this.state.readOnly,
            placeholder: this.props.prompt,
            dropdownClassName: this.props.dropdownClassName,
            dropdownStyle: this.props.dropdownStyle,
            dropdownMenuStyle: this.props.dropdownMenuStyle,
            onSearch: this.props.onSearch||function(value: string){return},
            //搜索
            filterOption: (input:any, option:any) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
            value: this.state.value,
            defaultValue: this.state.value,
            mode: this.props.multiple?"multiple":this.props.mode,
            tags: this.props.tags,
            combobox: this.props.combobox,
            optionLabelProp: this.props.optionLabelProp,
            onChange: (value:any) => {
                value = value||[];
                let oldValue = this.getValue();
                this.setValue(
                    value
                );
                // if(this.props.onchange) {
                //     this.props.onchange.call(this);
                // }
                this._onChange();
                this.doEvent("change",value,oldValue);
                this.triggerChange({value});
            },
            onSelect: (value:any) => {
                let re = this.doEvent("beforeSelect");
                if(re instanceof Array && re[0] == false) {
                    return false;
                }
                let oldValue = this.getValue();
                if(value != oldValue) {
                    this.select(value);
                }
                this._onSelect();
                let label = this.getTextByValue(value);
                this.doEvent("select",{value,label});
            },
            onDeselect: (value:any) => {
                this.unselect(value);
                this._onUnselect();
                this.doEvent("unSelect",value);
            },
            onBlur: () => {
                this._onHidePanel();
                this.doEvent("hidePanel");
            },
            onFocus: () => {
                this._onShowPanel();
                this.doEvent("showPanel");
            },
            dropdownMatchSelectWidth: this.props.dropdownMatchSelectWidth,
            optionFilterProp: this.props.optionFilterProp,
            defaultActiveFirstOption: this.props.defaultActiveFirstOption||true,
            labelInValue: this.props.labelinvalue,
            getPopupContainer: ()=>{
                // let container = document.body;
                // let containerRe = this.doEvent("getpopupcontainer");
                // if(containerRe && containerRe.length > 0) {
                //     container = containerRe[0];
                // }else {
                //     if(this.propDom != null) {
                //         let parent = G.$(this.propDom.parentElement);
                //         if(parent instanceof Tag) {
                //             parent = parent.realDom;
                //         }else {
                //             parent = parent[0];
                //         }
                //         if(parent) {
                //             container = parent;
                //         }
                //     }
                // }
                // return container;
                let container = document.body;
                if(this.props.popupcontainer) {
                    if("parent"==this.props.popupcontainer){
                        // 在其父级
                        if(this.realDom != null) {
                            let parent= G.$(this.realDom.parentElement);
                            if(parent instanceof FormTag.default) {
                                parent = parent.realDom;
                            }else {
                                parent = parent[0];
                            }
                            if(parent) {
                                container = parent;
                            }
                        }
                    }else{
                        // 在自定义的选择器内，如果自定义的选择器无效，则生成在document.body下
                        let c = G.G$(this.props.popupcontainer);
                        if(c.length>0)
                            container = c[0];
                    }
                }
                return container;                   
            },
            tokenSeparators: this.props.tokenSeparators,
            getInputElement: this.props.getInputElement
        });
    }
    getInitialState() {
        let value = this.getPropStringArrayValue(this.props.value);
        return {
            disabled: this.props.disabled,
            readOnly: this.props.readOnly,
            onBlur: this.props.onHidepanel,
            onFocus: this.props.onShowpanel,
            url: this.props.url,
            dictype: this.props.dictype,
            method: this.props.method,
            value: value,
            options: []
        }
    }
    makeJsx() {
        let props = this.getProps();
        let options = this.getOptions();
        let optionsMap = options.map(function(ele) {
            return ele;
        });
        if(this.form){
            delete props.value;
            delete props.defaultValue;
        }
        return <AntdSelect {...props}>{optionsMap}</AntdSelect>;
    }

   // 选择
   select(value:any) {
        this.triggerChange(value);
        this.setState({value:value});
    }

    // 取消选择
    unselect(value:any) {
        if(this.props.mode == "tags" || this.props.mode == "multiple" || this.props.multiple == true) {
            let valued:any = this.getValue();
            if(valued instanceof Array) {
                let gvalued = new GearArray(valued);
                gvalued.remove(value);
                valued = gvalued.toArray();
            }else {
                valued = [];
            }
            this.setValue(valued);
        }else {
            this.setValue();
        }
    }

    //组织select中的option选项
    getOptions(options?:Array<any>):Array<React.ReactElement<any>> {
        options = options||this.state.options;
        let optionsArray = new Array<React.ReactElement<any>>();
        if(options && options instanceof Array) {
            options.map((ele,index) => {
                if(ele) {
                    let label = ele.label;
                    let value = ele.value;
                    let attrs = ele.attrs||{};
                    attrs.value = value;
                    attrs.key = UUID.get();
                    attrs.label = label;
                    if(value instanceof Array) {
                        let optionsChildren = this.getOptions(value);
                        let optionsChildrenMap = optionsChildren.map(function(eleIn) {
                            return eleIn;
                        });
                        optionsArray.push(<OptGroup {...attrs}>{optionsChildrenMap}</OptGroup>);
                    }else {
                        optionsArray.push(<Option {...attrs}>{label}</Option>);
                    }
                }
            });
        }
        return optionsArray;
    }

    //控件渲染完成之后触发
    afterRender() {
        this.find(".ant-select-selection").attr("tabindex","0");
        //获取父子树的映射关联
        this.getParentTree();
        this.getChildTree();
        this._onBeforeLoad();
        let re = this.doEvent("beforeLoad");
        if(re && re[0] == false) {
            return;
        }
        //如果存在父节点，需要父节点有初始值的情况下才去加载子节点
        if(this.parentSelect == null) {
            this.loadData();
        }
    }

    getParentTree() {
        let upperName = this.props.upper;
        if(!upperName) {
            return null;
        }
        let parentSelect = G.$("#"+upperName);
        if(parentSelect instanceof Select) {
            this.parentSelect = parentSelect;
            if(parentSelect.childSelect == null) {
                parentSelect.childSelect = this;
                if(parentSelect.state.options instanceof Array && parentSelect.state.options.length > 0) {
                    parentSelect.afterUpdate();
                }
            }
        }
    }

    getChildTree() {
        let lowerName = this.props.lower;
        if(!lowerName) {
            return;
        }
        let lower:Select<P,state> = G.$("#"+lowerName);
        console.log(lower)
        if(lower instanceof Select) {
            this.childSelect = lower;
            lower.parentSelect = this;
        }
    }

    afterUpdate() {
        //连动效果 当组件值发生改变之后再执行
        let value:any = this.getValue();
        if(value instanceof Array) {
            value = value[value.length - 1];
        }
        if(this.childSelect instanceof Select) {
            if(this.state["options"] != null && this.state["options"].length > 0) {
                let data = this.findByValue(value);
                if(data) {
                    if(this.childSelect._promise){
                        this.childSelect._promise.then((e)=>{
                            let _childSelect = e.result;
                            if(_childSelect.props.dictype || _childSelect.props.url) {
                                _childSelect.loadData(Http.appendUrlParam(_childSelect.props.url,{code:data.value}));
                            }else {
                                _childSelect.loadData(data.children);
                            }
                        })
                    }
                }else {
                    if(this.childSelect._promise){
                        this.childSelect._promise.then((e)=>{
                            let _childSelect = e.result;
                            _childSelect.setState({
                                options: []
                            },()=>{
                                _childSelect.clear();
                            });
    
                        })
                    }else{
                        this.childSelect.setState({
                            options: []
                        },()=>{
                            this.childSelect.clear();
                        });
                    }
                }
            }else {
                if(this.childSelect._promise){
                    this.childSelect._promise.then((e)=>{
                        let _childSelect = e.result;
                        _childSelect.setState({
                            options: []
                        },()=>{
                            _childSelect.clear();
                        });

                    })
                }else{
                    this.childSelect.setState({
                        options: []
                    },()=>{
                        this.childSelect.clear();
                    });
                }
            }
        }
    }

    // 获取文本
    getText() {
        let value:any = this.getValue();
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
    // 数据过滤
    dataFilter(q:any) {}
    //当获取焦点的时候触发
    protected _onShowPanel() {

    }
    onShowPanel(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("showPanel",fun);
        }
    }
    // 当失去焦点的时候触发
    protected _onHidePanel() {

    }
    onHidePanel(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("hidePanel",fun);
        }
    }
    //获取焦点
    showPanel() {
        let dom = G.G$(this.realDom);
        dom.find("input").focus();
        dom.trigger('click');
    }
    // 失去焦点
    hidePanel() {
        let dom = G.G$(this.realDom);
        dom.find("input").blur();
    }
    // 加载数据
    loadData(param?:any,callback?:Function) {
        let url: any = null;
        let data = null;
        let method = this.state.method;
        if(param) {
            if(typeof param == "string") {
                url = param;
            }
            if(param instanceof Object) {
                data = param;
            }
        }else {
            url = this.state.url;
            data = this.state.dictype;
        }
        this.reload(url,data,method,callback);
    }
    // 通过指定的url或者data加载数据
    reload(url:string,dictype:object,method:methods,callback?:Function) {
        let fn = async ()=> {
            let result = await DicUtil.getDic({url, method, dictype});
            if(result.success){
                let dic = result.data;
                if(dic){
                    dic = this._loadFilter(dic);
                    if(dic==null){
                        this.triggerChange([]);
                        this.setState({
                            options: [],
                            value: []
                        });
                        return;
                    }
                    let result:any = this.doEvent("loadFilter",dic);
                    if(result && result.length > 0) {
                        dic = result[result.length - 1];
                    }
                    let initValue = this.getInitValue(dic);
                    // this.triggerChange(initValue);
                    this.setState({
                        value: initValue||[],
                        options: dic
                    },()=>{
                        if(this._onLoadSuccess) {
                            this._onLoadSuccess();
                        }
                        this.doEvent("loadSuccess");
                        if(callback){
                            callback.call(this);
                        }
                    });
                    this._onLoadSuccess();
                    this.doEvent("loadSuccess",dic);
                }
            }else{
                this._onLoadError();
                this.doEvent("loadError",result);
                if(callback){
                    callback.call(this);
                }
            }
        };
        fn();
    }

    //获取初始值
    getInitValue(dic:any) {
        let value:any = this.state.value;
        if(this.props.multiple != true && value instanceof Array) {
            value = value[0];
        }
        let valueC = value;
        if(this.props.multiple == true) {
            valueC = [];
            if(value instanceof Array) {
                value.forEach((valueIn)=>{
                    let nodeRe = this.findByValue(valueIn,dic);
                    if(nodeRe != null) {
                        valueC.push(valueIn);
                    }
                });
            }
        }else {
            let nodeRe = this.findByValue(valueC,dic);
            if(nodeRe == null) {
                valueC = [];
            }
        }
        return valueC;
    }
    //格式化数据
    protected _loadFilter(data:any) {
        if(data == null) {
            return null;
        }
        if(!data) {
            return null;
        }
        if(this.props.dictype != null) {
            let dic = null;
            if(this.parentSelect && this.parentSelect instanceof Tag.default) {
                let value = this.parentSelect.getValue();
                if(value.length > 0) {
                    let code = value[0];
                    for(var i=0;i<data.length;i++){
                        if(data[i].value==code || data[i].id==code){
                            dic = data[i];
                        }
                    }
                    if(dic != null) {
                        data = dic.children;
                    }else {
                        data = null;
                    }
                }else {
                    data = null;
                }
            }
        }
        let treeNodes:Array<LabeledValue> = [];
        if(data != null) {
            if(data['data']) {
                treeNodes = data.data;
            }else {
                treeNodes = data;
            }
            for(let i = 0; i < treeNodes.length; i++) {
                this.parse(treeNodes[i]);
            }
        }
        return treeNodes;
    }
    private parse(dataInner:LabeledValue) {
        if(!dataInner) {
            return;
        }
        if(dataInner['attributes'] == null) {
            dataInner['attributes'] = {};
        }
        // 支持将lvb中properties的属性加入到树节点的attributes中
        if(dataInner['properties']){
            dataInner['attributes'] = G.G$.extend({},dataInner['attributes'],dataInner['properties']);
            delete dataInner['properties'];
        }
        
        let link = dataInner['attributes']["link"] || this.props.link;
        if(link){
            //处理link
            link = link.replace("{id}",dataInner['id']);
            for(let key in dataInner['attributes']) {
                link = link.replace("{"+key+"}",dataInner['attributes'][key]);
            }
            dataInner['attributes']["link"] = link;
            dataInner['attributes']["target"] = dataInner['attributes']["target"] || this.props.target;
        }
        
        if(dataInner.children && dataInner.children.length > 0) {
            for(let i = 0; i < dataInner.children.length; i++) {
                this.parse(dataInner.children[i]);
            }
        }
        if(!dataInner["label"]) {
            dataInner["label"] = dataInner["text"];
        }
        if(!dataInner["value"]) {
            dataInner["value"] = dataInner["id"];
        }
    };
    //数据过滤
    loadFilter(fun:Function) {
        if(fun && $.isFunction(fun)) {
            this.bind("loadFilter",fun);
        }
    }
    protected _onChange() {

    }
    onChange(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("change",fun);
        }
    }
    // 当被选中的时候触发
    protected _onSelect() {
    }
    onSelect(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("select",fun);
        }
    }
    // 当数据加载完成的时候触发
    protected _onLoadSuccess() {
        var value = this.getValue();
        // G.G$(this.propDom).attr("init_first","false");
    };
    onLoadSuccess(fun:Function) {
        if(fun && $.isFunction(fun)) {
            this.bind("loadSuccess",fun);
        }
    }
    //清空数据
    clear() {
        this.triggerChange([]);
        this.setState({
            value: []
        });
        this._onClear();
        this.doEvent("clear");
    }
    protected _onClear() {
    };
    onClear(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("clear",fun);
        }
    }

    protected _onBeforeLoad(){

    }
    onBeforeLoad(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("beforeLoad",fun);
        }
    }
    protected _onLoadError(){

    }
    onLoadError(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("loadError",fun);
        }
    }
    protected _onUnselect() {

    }
    onUnselect(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("unSelect",fun);
        }
    }
    findByValue(value:any,data?:any):any {
        let dataInner = data||this.getAllData();
        for(var i = 0; i < dataInner.length; i++) {
            if(value == dataInner[i]["value"]) {
                return dataInner[i];
            }else if(dataInner[i]["value"] instanceof Array) {
                return this.findByValue(value,dataInner[i]["value"]);
            }
        }
        return null;
    }
    getAllData() {
        return this.state.options;
    }

    // 设置值
    setValues(values:any) {
        this.setValue(values);
    }
    // 设置值
    setValue(...value:any) {
        if(value && value.length > 0) {
            this.triggerChange(value[0]);
            this.setState({
                value: value[0]
            });
        }else {
            this.triggerChange([]);
            this.setState({
                value: []
            });
        }
    }
    // 获取值
    getValue() {
        return this.state.value;
    }
    // 通过文本设置值
    setTexts(texts:any) {
        this.setText(texts);
    }
    // 通过文本设置值
    setText(...text:any) {
        if(text) {
            if(text instanceof Array && text[0] instanceof Array) {
                text = text[0];
            }
            let values = Array<any>();
            if(text instanceof Array) {
                for(let i = 0; i < text.length;i++) {
                    values.push(this.getValueByText(text[i]));
                }
            }else {
                values.push(this.getValueByText(text));
            }
            this.triggerChange(values);
            this.setState({
                value: values
            });
        }else {
            this.triggerChange([]);
            this.setState({
                value: []
            });
        }
    }
    // 通过值获取对应的文本
    getValueByText(text:any,options?:Array<any>) {
        options = options||this.state.options||[];
        let value = null;
        if(options) {
            options.map((ele) => {
                if(ele instanceof Array) {
                    value = this.getValueByText(text,ele);
                    if(value) {
                        return value;
                    }
                }else {
                    if(ele.label == text) {
                        value = ele.value;
                    }
                }
            });
        }
        return value;
    }
    // 通过文本获取对应值
    getTextByValue(value:any,options?:Array<any>):any {
        options = options||this.state.options||[];
        let text = null;
        if(options) {
            for(let i = 0; i < options.length; i++) {
                let ele = options[i];
                if(ele instanceof Array) {
                    text = this.getTextByValue(value,ele);
                }else {
                    if(ele.value == value) {
                        text = ele.label;
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
        }
        return text;
    }

    disable() {
        this.setState({
            disabled: true
        });
    }

    enable() {
        this.setState({
            disabled: false
        });
    }

    onBeforeSelect(fun:Function) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("beforeSelect",fun);
        }
    }

    focus(...args:any) { 
        this.find(".ant-select-selection").focus(...args);      
    }

    blur(...args:any){
        this.find(".ant-select-selection").blur(...args);
    }

}
