import * as React from 'react';
import {Pagination as AntdPagination} from 'antd';
import { PaginationProps } from '../../../node_modules/antd/lib/pagination/Pagination';
import * as Tag from '../Tag';
export var props={
    ...Tag.props,
    total: GearType.String,//数据总数
    defaultCurrent: GearType.String,//默认的当前页数
    current: GearType.String,//当前页数
    defaultPageSize: GearType.String,//默认的每页条数
    pageSize: GearType.String,//每页条数
    // onbeforechange:GearType.Function,//在change前触发，如果返回false可以阻止改变
    // onchange: GearType.Function,//页码改变的回调，参数是改变后的页码及每页条数
    showSizeChanger: GearType.Boolean,//是否可以改变 pageSize
    pageSizeOptions: GearType.Or(GearType.Array,GearType.String),//指定每页可以显示多少条
    // onpagesizechange: GearType.Function,//pageSize 变化的回调
    showquickjumper: GearType.Boolean,//是否可以快速跳转至某页
    // showtotal:GearType.Any,
    // showtotal: (total: number, range: [number, number]) => React.ReactNode,//用于显示数据总量和当前数据顺序
    size: GearType.String,//当为「small」时，是小尺寸分页
    simple: GearType.Boolean,//当添加该属性时，显示为简单分页
    locale: GearType.Object,
    selectPrefixcls: GearType.String,
    // itemrender:GearType.Any
    // itemrender: (page: number, type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next') => React.ReactNode,//用于自定义页码的结构，可用于优化 SEO
}
export interface state extends Tag.state  {
    total?: string,//数据总数
    defaultCurrent?: string,//默认的当前页数
    current?: string,//当前页数
    defaultPageSize?: string,//默认的每页条数
    pageSize?: string,//每页条数
    showsizechanger?: Boolean,//是否可以改变 pageSize
    pageSizeOptions?: any|Array<string>,//指定每页可以显示多少条  
    showquickjumper?: boolean,//是否可以快速跳转至某页
    showtotal?: (total: number, range: [number, number]) => React.ReactNode;//用于显示数据总量和当前数据顺序
    size?: string,//当为「small」时，是小尺寸分页
    simple?: boolean,//当添加该属性时，显示为简单分页
    locale?: Object,
    selectPrefixcls?: string,
    itemrender?: (page: number, type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next') => React.ReactNode;//用于自定义页码的结构，可用于优化 SEO
}
export declare type PaginationLocale = any;
export default class Pagination<P extends typeof props & PaginationProps, S extends state> extends Tag.default<P, S> {
    constructor(props:any) {
        super(props);
        if(this.props.onBeforeChange)
            this.bind("beforeChange",this.props.onBeforeChange);        
        if(this.props.onChange)
            this.bind("change",this.props.onChange);
        if(this.props.onPageSizeChange)
            this.bind("pageSizeChange",this.props.onPageSizeChange);
    }
    getInitialState():state {
        return {
            total: this.getPropIntValue(this.props.total),
            pageSize: this.getPropIntValue(this.props.pageSize),
            current: this.getPropIntValue(this.props.current),
            pageSizeOptions: this.getPropStringArrayValue(this.props.pageSizeOptions),
        };
    }
    getProps() {
        // let props = super.getProps();
        let state = this.state;
        return G.G$.extend({},state,{
            total: this.state.total || 0,//数据总数
            defaultCurrent: this.state.current,//默认的当前页数
            current: this.state.current,//当前页数
            defaultPageSize: this.state.pageSize,//默认的每页条数
            pageSize: this.state.pageSize,//每页条数
            onChange: (page: string, pageSize: string) => {
                this._onChange(page,pageSize);
            },//页码改变的回调，参数是改变后的页码及每页条数
            showSizeChanger: this.props.showSizeChanger || false,//是否可以改变 pageSize
            pageSizeOptions: this.props.pageSizeOptions || ["10","20","30","40"],//指定每页可以显示多少条
            onShowSizeChange: (current: string, size: string) => {
                this._onPageSizeChange(current,size);
            },//pageSize 变化的回调
            showQuickJumper: this.props.showQuickJumper==false?false:true,//是否可以快速跳转至某页
            // showTotal: (total: number, range: [number, number]) => {},//用于显示数据总量和当前数据顺序
            size: this.props.size,//当为「small」时，是小尺寸分页
            simple: this.props.simple,//当添加该属性时，显示为简单分页
            locale: this.props.locale,
            selectPrefixCls: this.props.selectPrefixcls,
            showTotal: (total:any, range:any) => `共${total}条记录`,
            itemRender: this.state.itemrender 
        });
    }

    render() {
        let props: any = this.getProps();
        return <AntdPagination {...props}/>;

    }

    getPageSize() {
        return this.state.pageSize ||10;
    }

    getCurrent() {
        return this.state.current ||1;
    }

    getTotal() {
        return this.state.total || 0;
    }

    protected _onChange(page: string, pageSize: string) {
        let ret = this.doEvent("beforeChange",page,pageSize);
        if(ret && ret instanceof Array){
            for(var i=0;i<ret.length;i++){
                if(ret[i]==false)
                    return;
            }
        }
        this.setState({
            current: page,
            pageSize: pageSize
        },()=>{
            this.doEvent("change",page,pageSize);
        });
    }

    onBeforeChange(fun:any) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("beforeChange",fun);
        }
    }

    onChange(fun:any) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("change",fun);
        }
    }

    protected _onPageSizeChange(current: string, size: string){
        this.setState({
            current: current,
            pageSize: size
        },()=>{
            this.doEvent("pageSizeChange",current,size);
        });
    }
    onPageSizeChange(fun:any) {
        if(fun && G.G$.isFunction(fun)) {
            this.bind("pageSizeChange",fun);
        }
    }

    setParam(param:any) {
        let paramInner = {};
        if(param.pageSize != null) {
            paramInner["pageSize"] = param.pageSize;
        }
        if(param.current != null) {
            paramInner["current"] = param.current;
        }
        if(param.total != null) {
            paramInner["total"] = param.total;
        }
        this.setState(paramInner);
    }

    setPageSizeOptions(pageSizeOptions:any){
        this.setState({
            pageSizeOptions:this.getPropStringArrayValue(pageSizeOptions)
        });
    }
}