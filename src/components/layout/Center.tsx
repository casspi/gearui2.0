import * as React from 'react';
import * as Tag from '../Tag';
import { Layout as AntdLayout } from 'antd';
const AntdContent = AntdLayout.Content;

export var props = {
    ...Tag.props
};

export interface state extends Tag.state {
    
}
export default class Center<P extends typeof props, S extends state> extends Tag.default<P, S> {

    getInitialState(): state {
        return {};
    }

}