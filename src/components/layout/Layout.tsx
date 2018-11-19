import * as React from 'react';
import { Layout as AntdLayout} from 'antd';
import * as Tag from '../Tag';
import { ObjectUtil } from '../../utils';
const AntdHeader = AntdLayout.Header;
const AntdFooter = AntdLayout.Footer;
const AntdSider = AntdLayout.Sider;
const AntdContent = AntdLayout.Content;
export var props = {
    ...Tag.props
}
export interface state extends Tag.state {

}
export default class Layout<P extends typeof props, S extends state> extends Tag.default<P, S> {

    getInitialState() : state {
        return {};
    }

    render() {
        let childrens = this.getChildren();
        console.log(this.state)
        return <AntdLayout {...this.state}>{...childrens}</AntdLayout>;
    }

    private getChildren(children?: any, key?: string) {
        key = key || "";
        children = children || this.props.children || [];
        if(!(children instanceof Array)) {
            children = [children];
        }
        let childrenNew: any[] = [];
        if(children instanceof Array) {
            children.map((child: any, index) => {
                if(child && child.props) {
                    if(ObjectUtil.isExtends(child.type, "Center")) {
                        let props = {
                            className:child.props.className,
                            style:child.props.style
                        }
                        childrenNew.push(<AntdContent key={"Center_" + index} {...props}>{this.getChildren(child.props.children, "Center_" + index)}</AntdContent>);
                    }
                    if(ObjectUtil.isExtends(child.type, "Layout")) {
                        let props = {
                            className:child.props.className,
                            style:child.props.style,
                            hasSider:child.props.hasSider
                        }
                        childrenNew.push(<AntdLayout key={"Layout_" + index} {...props}>{this.getChildren(child.props.children, "Layout_" + index)}</AntdLayout>);
                    }
                    if(ObjectUtil.isExtends(child.type, "Footer")) {
                        let props = {
                            className:child.props.className,
                            style:child.props.style
                        }
                        childrenNew.push(<AntdFooter key={"Footer_" + index} {...props}>{this.getChildren(child.props.children, "Footer_" + index)}</AntdFooter>);
                    }
                    if(ObjectUtil.isExtends(child.type, "Header")) {
                        console.log(child.props)
                        let props = {
                            className:child.props.className,
                            style:child.props.style
                        }
                        childrenNew.push(<AntdHeader key={"Header_" + index} {...props}>{this.getChildren(child.props.children, "Header_" + index)}</AntdHeader>);
                    }
                    if(ObjectUtil.isExtends(child.type, "Sider")) {
                        let props = {
                            className:child.props.className,
                            style:child.props.style,
                            theme:child.props.theme,
                            breakpoint:child.props.breakpoint,
                        }
                        childrenNew.push(<AntdSider key={"Sider_" + index} {...props}>{this.getChildren(child.props.children, "Sider_" + index)}</AntdSider>);
                    }
                }else {
                    childrenNew.push(child);
                }
            });
        }
        return childrenNew;
    }

}