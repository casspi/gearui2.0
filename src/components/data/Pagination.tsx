import * as React from 'react';
import { Pagination as AntdPagination, message as AntdMessage,Tooltip as AntdTooltip } from 'antd';
import { PaginationProps } from '../../../node_modules/antd/lib/pagination/Pagination';
const Locale = require('../../../node_modules/rc-pagination/es/locale/zh_CN').default;
import * as Tag from '../Tag';
import {Message} from '../pack';
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
    showJumpertips:GearType.Boolean,//是否显示超出总页数，跳转到最后一页提示
    // showtotal: (total: number, range: [number, number]) => React.ReactNode,//用于显示数据总量和当前数据顺序
    size: GearType.String,//当为「small」时，是小尺寸分页
    simple: GearType.Boolean,//当添加该属性时，显示为简单分页
    locale: GearType.Object,
    selectPrefixcls: GearType.String,
    // itemrender: (page: number, type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next') => React.ReactNode,//用于自定义页码的结构，可用于优化 SEO
    showTooltipAble:GearType.Boolean
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
    showTooltip?:boolean,
}
export declare type PaginationLocale = any;
export default class Pagination<P extends typeof props & PaginationProps, S extends state> extends Tag.default<P, S> {
    constructor(props:any) {
        super(props);
    }
    getInitialState():state {
        return {
            total: this.getPropIntValue(this.props.total),
            pageSize: this.getPropIntValue(this.props.pageSize),
            current: this.getPropIntValue(this.props.current),
            pageSizeOptions: this.getPropStringArrayValue(this.props.pageSizeOptions),
            showTooltip:false,
        };
    }
    getProps() {
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
            pageSizeOptions: this.state.pageSizeOptions || ["10","20","30","40"],//指定每页可以显示多少条
            onShowSizeChange: (current: string, size: string) => {
                this._onPageSizeChange(current,size);
            },//pageSize 变化的回调
            showQuickJumper: this.props.showQuickJumper==false?false:true,//是否可以快速跳转至某页
            // showTotal: (total: number, range: [number, number]) => {},//用于显示数据总量和当前数据顺序
            size: this.props.size,//当为「small」时，是小尺寸分页
            simple: this.props.simple,//当添加该属性时，显示为简单分页
            locale: this.props.locale||Locale,
            selectPrefixCls: this.props.selectPrefixcls || 'ant-select',
            showTotal: (total:any, range:any) => `共${total}条记录`,
            itemRender: this.state.itemrender,
        });
    }
    render() {
        let props: any = this.getProps();
        return this.props.showTooltipAble!==false
        ?<AntdTooltip placement="right"  visible={this.state.showTooltip}  title="跳转页大于总页数，为您跳转到最后一页">
           <span><AntdPagination {...props}></AntdPagination></span> 
        </AntdTooltip>
        :<AntdPagination {...props}></AntdPagination>;
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
    timer:any;
    protected _onChange(page: string, pageSize: string) {
        let ret = this.doEvent("beforeChange",page,pageSize);
        if(this.props.showJumpertips!==false&&this.props.showQuickJumper!==false){
            let total:any=this.state.total;
            let value:any = G.G$(this.realDom).find('.ant-pagination-options-quick-jumper input').val();
            if(value>Math.ceil(parseInt(total)/parseInt(pageSize))){
                clearTimeout(this.timer);
                this.setState({
                    showTooltip:true,
                },()=>{
                    this.timer = setTimeout(()=>{
                        this.setState({
                            showTooltip:false
                        })
                    },5500)
                })
            }
        }
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

    protected _onPageSizeChange(current: string, size: string){
        this.setState({
            current: current,
            pageSize: size
        },()=>{
            this.doEvent("pageSizeChange",current,size);
        });
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