import * as JqueryTag from './JqueryTag';
import * as Tag from './Tag';
import * as Component from './Component';
import * as HtmlTag from './HtmlTag';
import * as VoidTag from './VoidTag';
import * as Websocket from './Websocket';
import * as Wrapper from './Wrapper';
import * as basic from './basic';
import * as data from './data';
// import * as form from './form';
// import * as layout from './layout';
// import * as navigation from './navigation';
// import * as pack from './pack';
Component.default["props"] = Component.props;
HtmlTag.default["props"] = HtmlTag.props;
Websocket.default["props"] = Websocket.props;
Wrapper.default["props"] = Wrapper.props;
var tags = {
    JqueryTag: JqueryTag.default,
    Tag: Tag.default,
    // FormTag,
    component: Component.default,
    Component: Component.default,
    htmltag: HtmlTag.default,
    HtmlTag: HtmlTag.default,
    VoidTag: VoidTag.default,
    websocket: Websocket.default,
    Websocket: Websocket.default,
    wrapper: Wrapper.default,
    Wrapper: Wrapper.default,
}
var components = {};
for(let key in basic) {
    let keyLower = key.toLowerCase();
    if(key && basic[key] && basic[key].default && basic[key].props) {
        basic[key].default["props"] = basic[key].props;
        tags[keyLower] = basic[key].default;
        tags[key] = basic[key].default;
        components[key] = basic[key].default;
    }
}

for(let key in data) {
    let keyLower = key.toLowerCase();
    if(key && data[key] && data[key].default && data[key].props) {
        data[key].default["props"] = data[key].props;
        tags[keyLower] = data[key].default;
        tags[key] = data[key].default;
        components[key] = data[key].default;
    }
}

export {
    tags,
    components,
    JqueryTag,
    Tag,
    // FormTag,
    Component,
    HtmlTag,
    VoidTag,
    Websocket,
    Wrapper
};