import * as Tag from '../Tag';

export var props = {
    ...Tag.props,
};

export interface state extends Tag.state {
}
export default class SubMenu<P extends typeof props, S extends state> extends Tag.default<P, S> {

    getInitialState(): state {
        console.log(this)
        return {
        };
    }
}