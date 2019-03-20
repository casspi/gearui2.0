import * as React from 'react';
import Table from './Table';
import EditTable from '../form/EditTable';
import { Button, Icon } from 'antd';
import * as Text from '../form/Text';
import * as Date from '../form/Date';
import * as Datetime from '../form/Datetime';
import * as Combotree from '../form/Combotree';
import { UUID, ObjectUtil } from '../../utils';
export interface TableColumns {
    //字段名称
    name: string;
    //字段中文名称
    title?: string;
    //字段数据key
    dataIndex?: string;
    className?: string;
    width?: number;
    key?: string;
    fixed?: "left"|"right";
    render?: any;
    ellipsisSpanWidth?: number;
    orderColumn?: any;
    sortOrder?: boolean;
    sorter?: Function;
    filterDropdown?: any;
    filterDropdownVisible?: any;
    onFilterDropdownVisibleChange?: Function;
    filterIcon?: any;
    children?: any[];
    rowspan?: any;
    index?: any;
}
export declare type ColumnFilterItem = {
    text: string;
    value: string;
    children?: ColumnFilterItem[];
};
export declare type CompareFn<T> = ((a: T, b: T, sortOrder?: 'ascend' | 'descend') => number);
export default class Column<T> {

    name: string;
    align: 'left' | 'right' | 'center' = 'left';
    className: string;
    colSpan: number;
    dataIndex: string;
    defaultSortOrder: 'ascend' | 'descend';
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
    sortOrder?: 'ascend' | 'descend' | boolean;
    title?: React.ReactNode;
    label?: string;
    width?: string | number;
    ellipsisSpanWidth?: string | number;
    onCell?: (record: T) => any;
    onFilter?: (value: any, record: T) => boolean;
    onFilterDropdownVisibleChange?: (visible: boolean) => void;
    onCellClick?: (record: T, event: any) => void;
    onHeaderCell?: (props: Column<T>) => any;
    children?: Column<T>[];
    index: number;
    rowspan: any;
    ref: any;
    table: Table<any, any>;
    display: string;
    ellipsis: boolean;
    class: string;
    orderColumn: string;
    filterId: string;
    filterType: string;
    filtersUrl: string;
    filtersMethod: string;

    static getSequence(table: Table<any, any>) {
        let sequence = new Column(table, null, 0);
        sequence.key = table.props.id + "_sequence";
        sequence.name = "sequence";
        sequence.width = 40;
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

    private filterContainerId = UUID.get();

    constructor(table: Table<any, any>,column: React.ReactElement<Column<T>>|null, index: number) {
        this.table = table;
        if(column && column.props) {
            let props = column.props;
            this.key = this.name = props.name || "";
            this.dataIndex = props.dataIndex || "";
            this.title = props.label || props.title || "";
            this.index = index;
            this.rowspan = props.rowspan;
            this.ref = props.name;
            if(props.fixed) {
                this.fixed = props.fixed;
            }
            if(props.width && props.width > 0) {
                this.width = props.width;
            }
            let className = props.class || props.className;
            let classNameArr = GearArray.fromString(className," ")||new GearArray();
            let ellipsisSpanWidth: string | number | undefined = 0;

            if(props.ellipsis){
                classNameArr.add("ant-table-ellipsis-column");
                ellipsisSpanWidth = this.width;
            }
            if(ellipsisSpanWidth && ellipsisSpanWidth > 0) {
                this.ellipsisSpanWidth = ellipsisSpanWidth;
            }
            //获取排序信息
            let orderColumn:string = props.orderColumn;
            if(classNameArr.length() > 0) {
                if(orderColumn != null && orderColumn != "") {
                    classNameArr.add(orderColumn);
                }
                this.className = classNameArr.toString(" ");
            }
            if(orderColumn != null && orderColumn != "") {
                this.orderColumn = orderColumn;
                //打开该字段的排序
                this.sorter = (a: any,b: any): number => {return 0};
                //禁用排序图标的自动控制，使用自定义控制setSortClass方法
                this.sortOrder = false;
            }
            let filter:boolean = props.filter;
            let filterId:string = props.filterId;
            let filterType:any = props.filterType;
            if(filterId && filter && filterType) {
                this.filterDropdown = this.getFilter(props);
                this.filterDropdownVisible = this.table.getFilterVisible()[filterId];
                this.onFilterDropdownVisibleChange = (visible: any) => {
                    let filterVisible = this.table.getFilterVisible()||{};
                    filterVisible[filterId] = visible;
                    this.table.setFilterVisible(filterVisible, ()=>{
                        if(visible == true) {
                            this.table.getSearchNodes(filterId).focus();
                        }else {
                            this.table._search.bind(this.table)();
                        }
                    });
                };
                this.filterIcon = <Icon type="filter" style={{ color: this.table.getFiltered()[filterId] ? '#108ee9' : '#aaa' }} />;
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
                    this.children = childrenJsx;
                }
                //如果子节点是column的，就没有render方法
                if(!childrenIsColumn) {
                    this.render = this.parseRender(props, ellipsisSpanWidth);
                }
            }
        }
    }

    //在ctype=column中存在内部节点的渲染处理
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
                    children.map((child:any, index: any)=>{
                        jsxEles.push(this.parseColumnChild(child, ellipsisSpanWidth, record, indexColumn, index));
                    });
                }else {
                    jsxEles.push(this.parseColumnChild(children, ellipsisSpanWidth, record, indexColumn, 0));
                }
                return jsxEles;
            };
        })(children, ellipsisSpanWidth || 0);
        return render;
    }

    //解析column的子节点
    private parseColumnChild(child: any, ellipsisSpanWidth: any, record: any, indexColumn: any, index: any) {
        if(!(ObjectUtil.isExtends(child.type, "Column"))) {
            let childProps = child.props;
            childProps = this.parseRegexColumnValue(childProps,record);
            let style = childProps.style instanceof String ? GearJson.fromStyle(childProps.style || "") : new GearJson(childProps.style);
            if(ellipsisSpanWidth > 0) {
                style.put("width", ellipsisSpanWidth+"");
            }
            childProps.style = style.toJson();
            childProps.id = record.key + indexColumn + index;
            childProps.__record__ = record;
            childProps.key =record.key + indexColumn + index;
            let jsxEle = React.cloneElement(child, childProps, child.props.children);
            return jsxEle;
        }
        return null;
    }

    protected parseRegexColumnValue(props: any,record: any) {
        let newProps: any = ObjectUtil.parseDynamicProps(props, record);
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
        let filterId = props.filterId;
        let filterProps: any = {
            getCalendarContainer: ()=> {
                return G.G$("#" + this.filterContainerId)[0];
            }
        };
        let filterJsx: any;
        let filterType:any = props.filterType;
        if(filterType == "text") {
            let textProps: any = {
                prompt: "请输入查询条件...",
                buttonIcon: "search",
                width: 200,
                onClickButton: this.table._search.bind(this.table)
            };
            filterJsx = <Text.default ref={(ele:any) => this.table.setSearchNode(filterId, ele)} {...textProps}/>;
        }else {
            let elseProps: any;
            if(filterType == "date" || filterType == "datetime") {
                elseProps = {
                    ...filterProps,
                    type: "range",
                }
            }else {
                let filterMultiple:any = props.filterMultiple || props["filterMutiple"];
                let filters:any = props.filters;
                let filtersUrl:any = props.filtersUrl;
                let filtersMethod:any = props.filtersMethod;
                elseProps = {
                    ...filterProps,
                    multiple: filterMultiple,
                    treeCheckable: filterMultiple == true? true : false,
                    cascadeCheck: false,
                    dictype: filters,
                    url: filtersUrl,
                    method: filtersMethod,
                    width: 300,
                }
            }
            filterJsx = [];
            if(filterType == "date") {
                filterJsx.push(<Date.default ref={(ele:any) => this.table.setSearchNode(filterId, ele)} {...elseProps}/>);
            }else if(filterType == "datetime") {
                filterJsx.push(<Datetime.default ref={(ele:any) => this.table.setSearchNode(filterId, ele)} {...elseProps}/>);
            }else {
                filterJsx.push(<Combotree.default ref={(ele:any) => this.table.setSearchNode(filterId, ele)} {...elseProps}/>);
            }
            filterJsx.push(<Button type="primary" onClick={this.table._search.bind(this.table)}>查询</Button>);
        }
        return <div className="list-custom-filter-dropdown">
            {filterJsx}
        </div>;
    }
}