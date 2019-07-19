import * as React from 'react';
import Table from './Table';
import EditTable from '../form/EditTable';
import { Button, Icon, Spin as AntdSpin, Tooltip } from 'antd';
import * as Text from '../form/Text';
import * as Date from '../form/Date';
import * as Datetime from '../form/Datetime';
import * as Combotree from '../form/Combotree';
import { UUID, ObjectUtil } from '../../utils';
import * as Tag from '../Tag'
export interface TableColumns {
    //字段名称
    name: string;
    //字段中文名称
    title?: string;
    //字段数据key
    dataIndex?: string;
    className?: string;
    width?: any;
    key?: string;
    fixed?: "left"|"right";
    render?: any;
    ellipsisSpanWidth?: number;
    ordercolumn?: any;
    sortorder?: boolean;
    sorter?: Function;
    filterdropdown?: any;
    filterdropdownvisible?: any;
    onFilterDropdownVisibleChange?: Function;
    filterIcon?: any;
    filterid?:string,
    children?: any[];
    rowSpan?: any;
    index?: any;
}
export declare type ColumnFilterItem = {
    text: string;
    value: string;
    children?: ColumnFilterItem[];
};
export declare type CompareFn<T> = ((a: T, b: T, sortorder?: 'ascend' | 'descend') => number);
export default class Column<T> {

    name: string;
    align: 'left' | 'right' | 'center' = 'left';
    className: string;
    colSpan: number;
    dataIndex: string;
    defaultsortorder: 'ascend' | 'descend';
    filterDropdown?: React.ReactNode | ((props: Object) => React.ReactNode);
    filterDropdownVisible?: boolean;
    filtered: boolean;
    filter: boolean;
    filteredValue?: any[];
    filterIcon?: React.ReactNode;
    filterMultiple?: boolean;
    filters?: ColumnFilterItem[];
    fixed?: boolean | ('left' | 'right');
    key?: React.Key;
    render?: (text: any, record: T, index: number) => React.ReactNode;
    sorter?: boolean | CompareFn<T>;
    sortorder?: 'ascend' | 'descend' | boolean;
    title?: React.ReactNode;
    label?: string;
    width?: any;
    ellipsisSpanWidth?: string | number;
    onCell?: (record: T) => any;
    onFilter?: (value: any, record: T) => boolean;
    onFilterDropdownVisibleChange?: (visible: boolean) => void;
    onCellClick?: (record: T, event: any) => void;
    onHeaderCell?: (props: Column<T>) => any;
    children?: Column<T>[];
    index: number;
    rowSpan: any;
    ref: any;
    table: Table<any, any>;
    display: string;
    ellipsis: boolean;
    class: string;
    ordercolumn: string;
    filterid: string;
    filtertype: string;
    filtersurl: string;
    filtersMethod: string;

    static getSequence(table: Table<any, any>) {
        let sequence = new Column(table, null, 0);
        sequence.key = table.props.id + "_sequence";
        sequence.name = "sequence";
        sequence.width = table.props.sequenceWidth+'px' || 40;
        sequence.dataIndex = "sequence";
        sequence.title = table.state.sequenceLabel || "序号";
        sequence.className = "ant-table-sequence-column";
        return sequence;
    }

    static getControl(table: EditTable<any, any>) {
        let control = new Column(table, null, 0);
        control.key = table.props.id + "_control";
        control.name = "control";
        control.width = 40;
        control.dataIndex = "control";
        control.title = table.state.controlLabel || "操作";
        control.className = "ant-table-column-control";
        control.render = table.parseControlColumnRender.bind(table)();
        return control;
    }

    // private filterContainerId:any = UUID.get();
    constructor(table: Table<any, any>,column: React.ReactElement<Column<T>>|null, index: number) {
        // console.log(this.filterContainerId)
        this.table = table;
        if(column && column.props) {
            let props = column.props;
            this.key = this.name = props.name || "";
            this.dataIndex = props.name || "";
            this.title = props.label || props.title || "";
            this.index = index;
            this.rowSpan = props.rowSpan;
            this.ref = props.name;
            if(props.fixed) {
                this.fixed = props.fixed;
            }
            if(props.width && props.width > 0) {
                this.width = (props.width)*1;
            }
            let className = props.class || props.className;
            let classNameArr = GearArray.fromString(className," ")||new GearArray();
            let ellipsisSpanWidth: string | number | undefined = 0;

            if(props.ellipsis){
                classNameArr.add("ant-table-ellipsis-column");
                ellipsisSpanWidth = this.width;
                this.render = (text:any)=><Tooltip title={text}>
                        <span style={{"cursor":'pointer'}}><span>{text}</span></span>
                    </Tooltip>
            }
            if(ellipsisSpanWidth && ellipsisSpanWidth > 0) {
                this.ellipsisSpanWidth = ellipsisSpanWidth;
            }
            //获取排序信息
            let ordercolumn:string = props.ordercolumn;
            // if(classNameArr.length() > 0) {
            // }
            if(ordercolumn != null && ordercolumn != "") {
                classNameArr.add(ordercolumn);
            }
            this.className = classNameArr.toString(" ");
            if(ordercolumn != null && ordercolumn != "") {
                this.ordercolumn = ordercolumn;
                //打开该字段的排序
                this.sorter = true//(a: any,b: any): number => {return 0};
                //禁用排序图标的自动控制，使用自定义控制setSortClass方法
                this.sortorder = false;
            }
            // let filter:boolean = props.filter;
            let filterid:string = props.filterid;
            let filtertype:any = props.filtertype;
            if(filterid  && filtertype) {
                this.filterDropdown = this.getFilter(props);
                this.filterDropdownVisible = this.table.getFilterVisible()[filterid]==true?true:false;
                this.onFilterDropdownVisibleChange = (visible: any) => {
                    let filterVisible = G.G$.extend({},this.table.getFilterVisible(),{});
                    filterVisible[filterid] = visible;
                    this.table.setFilterVisible(filterVisible, ()=>{
                        if(visible == true) {
                            //this.table.getSearchNodes(filterid).ast = this.table.ast;
                            this.table.getSearchNodes(filterid).focus();
                        }else {
                            this.table._search.bind(this.table)();
                        }
                    });
                };
                this.filterIcon = <Icon type="filter" style={{ color: this.table.getFiltered()[filterid] ? '#108ee9' : '#aaa' }} />;
            }
            let childrenInProps = props.children;
            if(childrenInProps) {
                if(!(childrenInProps instanceof Array)) {
                    childrenInProps = [childrenInProps];
                }
                let childrenIsColumn = false;
                if(childrenInProps instanceof Array) {
                    let childrenJsx: Column<T>[] = [];
                    childrenInProps.map((child:any, index: any)=>{
                        if(ObjectUtil.isExtends(child.type, "Column")) {
                            let columnInnder = new Column(table, child.props, index);
                            childrenJsx.push(columnInnder);
                            childrenIsColumn = true;
                        }
                    });
                    if(childrenJsx.length > 0) {
                        this.children = childrenJsx;
                    }
                }
                //如果子节点是column的，就没有render方法
                if(!childrenIsColumn) {
                    this.render = this.parseRender(props, ellipsisSpanWidth);
                }
            }
        }
    }

    //渲染column
    protected parseRender(props: Column<T>, ellipsisSpanWidth?: any) {
        let children = props.children;
        let render = null;
        ((children, ellipsisSpanWidth)=>{
            render = (text: any,record: any,indexColumn: any) => {
                let jsxEles: any[] = [];
                if(children && !(children instanceof Array)) {
                    children = [children];
                }
                if(children instanceof Array) {
                    children = children.filter((o:any)=>o.$$typeof!=null)
                    children.map((child:any, index: any)=>{
                        jsxEles.push(this.parseColumnChild(child, ellipsisSpanWidth, record, indexColumn, index));
                    });
                }else {
                    jsxEles.push(this.parseColumnChild(children, ellipsisSpanWidth, record, indexColumn, 0));
                }
                // console.log(props);
                // if(props.ellipsis){
                //     return <span>{jsxEles}</span>
                // }
                // // column['render'] = (text:any)=><span style={{"cursor":'pointer'}} title={text}>{text}</span>
                return jsxEles;
            };
        })(children, ellipsisSpanWidth || 0);
        
        return render;
    }

    //解析column的子节点
    private parseColumnChild(child: any, ellipsisSpanWidth: any, record: any, indexColumn: any, index: any) {
        if(!(ObjectUtil.isExtends(child.type, "Column"))) {
            let childProps =G.G$.extend({},child.props);
            childProps = this.parseRegexColumnValue(childProps,record);
            // console.log(childProps)
            let style = childProps.style instanceof String ? GearJson.fromStyle(childProps.style || "") : new GearJson(childProps.style);
            if(ellipsisSpanWidth > 0) {
                style.put("width", ellipsisSpanWidth+"");
            }
            childProps.style = style.toJson();
            childProps.id = childProps.id || record.key + indexColumn + index;
            childProps.__record__ = record;
            childProps.key = record.key + indexColumn + index;
            childProps.name = childProps.name || record.key + indexColumn + index;
            let jsxEle = null;
            if(child.type) {
                jsxEle = React.cloneElement(child, childProps);
                // console.log(child)
                // console.log(child instanceof Text.default)
                // if(child.type instanceof Text.default){
                //     jsxEle = React.cloneElement(child, childProps);
                // }else{
                //     jsxEle = React.cloneElement(child, childProps, childProps.children || []);
                // }
            }else {
                jsxEle = child;
            }
            return jsxEle;
        }
        return null;
    }

    protected parseRegexColumnValue(props: any,record: any) {
        let cacheChildren:any;
        if(props.children instanceof Array && props.children.length>0){//children是组件的话，就不再转译
            // console.log(props.children.length)
            for(let i=0,propsChildren = props.children; i < propsChildren.length ; i++){
                if(ObjectUtil.isExtends(propsChildren[i].type,'Tag')){
                    cacheChildren = propsChildren;
                }    
            }
            
        }
        let newProps:any;
        newProps = ObjectUtil.parseDynamicProps(props, record,true);
        // if(props.children && typeof props.children[0]=='string'){//当单元格子节点，值需要转译换算时
        // }else{//单元格节点是复杂嵌套型，暂时不支持转译
        //     newProps = props
        // }
        if(cacheChildren){
            newProps.children = cacheChildren;
        }
        return newProps;
    }

    show() {
        this.display = "block";
        this.table.updateColumns();
    }

    hide() {
        this.display = "none";
        this.table.updateColumns();
    }

    setTitle(title: any) {
        this.title = title;
        this.table.updateColumns();
    }

    setWidth(width: string | number) {
        this.width = width;
        this.table.updateColumns();
    }

    addClass(clazz: string) {
        let className:string = this.className;
        if(className == null) {
            this.className = clazz;
        }else if((className.indexOf(" ") == -1 && className.indexOf(clazz) == -1) || (className.indexOf(" ") != -1 && className.indexOf(" " + clazz) == -1)){
            this.className += " " + clazz;
        }
        this.table.updateColumns();
    }

    // 文本过滤器
    protected getFilter(props: Column<T>) {
        let filterid = props.filterid;
        let filterProps: any = {
            // getCalendarContainer: ()=> {
            //     return G.G$("#" + this.filterContainerId)[0];
            // }
        };
        let filterJsx: any;
        let filtertype:any = props.filtertype;
        if(filtertype == "text") {
            let textProps: any = {
                prompt: "请输入查询条件...",
                buttonIcon: "search",
                width: 200,
                onClickButton: this.table._search.bind(this.table),
                onPressEnter:this.table._search.bind(this.table)
            };
            filterJsx = <Text.default key={'text'} ref={(ele:any) => this.table.setSearchNode(filterid, ele)} {...textProps}/>;
        }else {
            let elseProps: any;
            if(filtertype == "date" || filtertype == "datetime") {
                elseProps = {
                    ...filterProps,
                    type: "range",
                }
            }else {
                let filterMultiple:any = props.filterMultiple || props["filterMutiple"];
                let filters:any = props.filters;
                let filtersurl:any = props.filtersurl;
                let filtersMethod:any = props.filtersMethod;
                elseProps = {
                    ...filterProps,
                    multiple: filterMultiple,
                    treeCheckable: filterMultiple == true? true : false,
                    cascadeCheck: false,
                    dictype: filters,
                    url: filtersurl,
                    method: filtersMethod,
                    width: 300,
                }
            }
            filterJsx = [];
            if(filtertype == "date") {
                filterJsx.push(<Date.default key={"date"} ref={(ele:any) => this.table.setSearchNode(filterid, ele)} {...elseProps}/>);
            }else if(filtertype == "datetime") {
                filterJsx.push(<Datetime.default key={"datetime"} ref={(ele:any) => this.table.setSearchNode(filterid, ele)} {...elseProps}/>);
            }else {
                filterJsx.push(<Combotree.default key={"combotree"} ref={(ele:any) => this.table.setSearchNode(filterid, ele)} {...elseProps}/>);
            }
            filterJsx.push(<Button key={"botton"} type="primary" onClick={this.table._search.bind(this.table)}>查询</Button>);
        }
        return <div className="list-custom-filter-dropdown">
            {filterJsx}
        </div>;
    }
}