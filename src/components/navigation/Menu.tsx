import * as React from 'react';
import { Menu as AntdMenu } from 'antd';
const AntdSubMenu = AntdMenu.SubMenu;
const AntdMenuItem = AntdMenu.Item;
const AntdItemGroup = AntdMenu.ItemGroup;
const AntdDivider = AntdMenu.Divider;
import * as Tag from '../Tag';
import { ObjectUtil,UUID } from '../../utils';
import { stat } from 'fs';
export var props = {
    ...Tag.props,
    defaultOpenKeys: GearType.Array<string>(),//初始展开的 SubMenu 菜单项 key 数组
    defaultSelectedKeys: GearType.Array<string>(),//初始选中的菜单项 key 数组
    forceSubMenuRender: GearType.Boolean,//在子菜单展示之前就渲染进 DOM
    inlineCollapsed: GearType.Boolean,//inline 时菜单是否收起状态
    inlineIndent: GearType.Number,//inline 模式的菜单缩进宽度
    mode: GearType.Enum<"vertical"|"vertical-right"|"horizontal"|"inline">(),//菜单类型，现在支持垂直、水平、和内嵌模式三种
    multiple: GearType.Boolean,//是否允许多选	
    openKeys: GearType.Array<string>(),//当前展开的 SubMenu 菜单项 key 数组
    selectable: GearType.Boolean,//是否允许选中
    selectedKeys: GearType.Array<string>(),//当前选中的菜单项 key 数组
    style: GearType.CssProperties,//根节点样式
    subMenuCloseDelay: GearType.Number,//用户鼠标离开子菜单后关闭延时，单位：秒
    subMenuOpenDelay: GearType.Number,//用户鼠标进入子菜单后开启延时，单位：秒
    theme: GearType.Enum<"light"|"dark">(),//主题颜色
    openAnimation: GearType.Any,
    openTransitionName: GearType.String,
    focusable: GearType.Boolean
};

export interface state extends Tag.state {
    defaultOpenKeys?: Array<string>;
    defaultSelectedKeys?: Array<string>;
    forceSubMenuRender?: boolean;
    inlineCollapsed?: boolean;
    inlineIndent?: number;
    mode?: "vertical"|"vertical-right"|"horizontal"|"inline";
    multiple?: boolean;
    openKeys?: Array<string>;
    selectable?: boolean;
    selectedKeys?: Array<string>;
    style?: React.CSSProperties;
    subMenuCloseDelay?: number;
    subMenuOpenDelay?: number;
    theme?: 'light' | 'dark';
    openAnimation?: string | Object;
    openTransitionName?: string | Object;
    focusable?: boolean;
}
export default class Menu<P extends typeof props, S extends state> extends Tag.default<P, S> {

    getInitialState(): state {
        return {
            defaultOpenKeys: this.props.defaultOpenKeys || [],
            defaultSelectedKeys: this.props.defaultSelectedKeys||[],
            forceSubMenuRender: this.props.forceSubMenuRender|| false,
            inlineCollapsed: this.props.inlineCollapsed,
            inlineIndent: this.props.inlineIndent || 24,
            mode: this.props.mode||'vertical',
            multiple: this.props.multiple||false,
            openKeys: this.props.openKeys,
            selectable: this.props.selectable || true,
            selectedKeys: this.props.selectedKeys,
            subMenuCloseDelay: this.props.subMenuCloseDelay || 0.1,
            subMenuOpenDelay: this.props.subMenuOpenDelay || 0,
            theme: this.props.theme||'light',
            openAnimation: this.props.openAnimation,
            openTransitionName: this.props.openTransitionName,
            focusable: this.props.focusable,
            
        };
    }
    getProps(){
        let state:any = this.state;
        if(this.state.mode!=="inline"){
            delete state.inlineCollapsed
        }
        if(state.openKeys==null || state.openKeys.length<=0){//该属性未定义或者为空时，无法打开节点，所以手动删除
            delete  state.openKeys
        }
        if(state.selectedKeys==null || state.selectedKeys.length<=0){//该属性未定义或者为空时，无法选中节点，所以手动删除
            delete  state.selectedKeys
        }
        return G.G$.extend({},state,{
        })
    }
    render() {
        let childrens = this.getChildren();
        return <AntdMenu {...this.getProps()}>{...childrens}</AntdMenu>;
    }

    private getChildren(children1?: any, key?: string) {
        key = key || "";
        let children:any[] = children1 || this.props.children || [];
        if(!(children instanceof Array)) {
            children = [children];
        }
        children = children.filter(o => o!=0)
        let childrenNew: any[] = [];
        if(children instanceof Array) {
            children.map((child: any, index) => {
                if(child && child.props) {
                    if(ObjectUtil.isExtends(child.type, "SubMenu")) {
                        let props:any={
                            disabled:child.props.disabled,
                            title:child.props.title,
                            onTitleClick:child.props.onTitleClick||function(){}
                        }
                        let subKey:string=key + "SubMenu_"+index;
                        if(child.props.open===true){//默认打开的submenu
                            let defaultOpenKeys:any = this.state.defaultOpenKeys || [];
                            defaultOpenKeys.push(subKey)
                        }
                        childrenNew.push(<AntdSubMenu key={subKey} {...props}>{this.getChildren(child.props.children, subKey)}</AntdSubMenu>);
                    }else if(ObjectUtil.isExtends(child.type, "MenuItem")) {
                        let props:any = {
                            disabled:child.props.disabled,
                            title:child.props.title
                        };
                        let itemKey:string=key + "MenuItem_"+index;
                        if(child.props.selected===true){//默认选中的itemenu
                            let defaultSelectedKeys:any = this.state.defaultSelectedKeys || [];
                            defaultSelectedKeys.push(itemKey)
                        }
                        childrenNew.push(<AntdMenuItem key={itemKey} {...props}>{this.getChildren(child.props.children, "MenuItem_"+index)}</AntdMenuItem>);
                    }else if(ObjectUtil.isExtends(child.type, "MenuItemGroup")) {
                        let props:any = {
                            title:child.props.title,
                        };
                        let ItemGroupKey = key + "ItemGroup_"+index;
                        childrenNew.push(<AntdItemGroup key={ItemGroupKey} {...props}>{this.getChildren(child.props.children, ItemGroupKey)}</AntdItemGroup>);
                    }else if(ObjectUtil.isExtends(child.type, "MenuDivider")) {
                        childrenNew.push(<AntdDivider key={key + "Divider_"+index}></AntdDivider>);
                    }else{
                        childrenNew.push(child)
                    }
                }else {
                    childrenNew.push(child);
                }
            });
        }
        return childrenNew;
        
    }
}