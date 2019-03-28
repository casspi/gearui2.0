import * as JqueryTag from './JqueryTag';
import * as Tag from './Tag';
import * as Component from './Component';
import * as HtmlTag from './HtmlTag';
import * as VoidTag from './VoidTag';
import * as Websocket from './Websocket';
import * as Wrapper from './Wrapper';
import * as basic from './basic';
import * as data from './data';
import * as form from './form';
import * as layout from './layout';
import * as navigation from './navigation';
import * as pack from './pack';
Component.default["props"] = Component.props;
HtmlTag.default["props"] = HtmlTag.props;
Websocket.default["props"] = Websocket.props;
Wrapper.default["props"] = Wrapper.props;
var tags = {
    JqueryTag: JqueryTag.default,
    Tag: Tag.default,
    // FormTag,
    Component: Component.default,
    HtmlTag: HtmlTag.default,
    VoidTag: VoidTag.default,
    websocket: Websocket.default,
    Websocket: Websocket.default,
    wrapper: Wrapper.default,
    Wrapper: Wrapper.default,
}
var components = {};
tags["component"] = Component.default;
tags["Component"] = Component.default;
components["component"] = Component.default;
tags["htmltag"] = HtmlTag.default;
tags["HtmlTag"] = HtmlTag.default;
components["htmltag"] = HtmlTag.default;
tags["websocket"] = Websocket.default;
tags["Websocket"] = Websocket.default;
components["websocket"] = Websocket.default;
tags["wrapper"] = Wrapper.default;
tags["Wrapper"] = Wrapper.default;
components["wrapper"] = Wrapper.default;
var addComponents = function(params:any) {
    for(let key in params) {
        let keyLower = key.toLowerCase();
        if(key && params[key] && params[key].default && params[key].props) {
            params[key].default["props"] = params[key].props;
            tags[keyLower] = params[key].default;
            tags[key] = params[key].default;
            components[keyLower] = params[key].default;
        }
    }
}
addComponents(basic);
addComponents(data);
addComponents(form);
addComponents(layout);
addComponents(navigation);
addComponents(pack);
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