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
for(let key in Component.props) {
    window.possibleStandardTagNames[key.toLowerCase()] = key;
    let type = Component.props[key];
    window.possibleStandardTypes[key.toLowerCase()] = (typeof type == "string") ? ((type.startsWith("_g_")) ? type.substring(3, type.length) : "any") : "any";
}
tags["htmltag"] = HtmlTag.default;
tags["HtmlTag"] = HtmlTag.default;
components["htmltag"] = HtmlTag.default;
for(let key in HtmlTag.props) {
    window.possibleStandardTagNames[key.toLowerCase()] = key;
    let type = HtmlTag.props[key];
    window.possibleStandardTypes[key.toLowerCase()] = (typeof type == "string") ? ((type.startsWith("_g_")) ? type.substring(3, type.length) : "any") : "any";
}
tags["websocket"] = Websocket.default;
tags["Websocket"] = Websocket.default;
components["websocket"] = Websocket.default;
for(let key in Websocket.props) {
    window.possibleStandardTagNames[key.toLowerCase()] = key;
    let type = Websocket.props[key];
    window.possibleStandardTypes[key.toLowerCase()] = (typeof type == "string") ? ((type.startsWith("_g_")) ? type.substring(3, type.length) : "any") : "any";
}
tags["wrapper"] = Wrapper.default;
tags["Wrapper"] = Wrapper.default;
components["wrapper"] = Wrapper.default;
for(let key in Wrapper.props) {
    window.possibleStandardTagNames[key.toLowerCase()] = key;
    let type = Wrapper.props[key];
    window.possibleStandardTypes[key.toLowerCase()] = (typeof type == "string") ? ((type.startsWith("_g_")) ? type.substring(3, type.length) : "any") : "any";
}
components["gform"] = form.Form.Form;
var addComponents = function(params:any) {
    for(let key in params) {
        let keyLower = key.toLowerCase();
        if(key && params[key] && params[key].default && params[key].props) {
            for(let keyInner in params[key].props) {
                window.possibleStandardTagNames[keyInner.toLowerCase()] = keyInner;
                let type = params[key].props[keyInner];
                window.possibleStandardTypes[keyInner.toLowerCase()] = (typeof type == "string") ? ((type.startsWith("_g_")) ? type.substring(3, type.length) : "any") : "any";
            }
            params[key].default["props"] = params[key].props;
            tags[keyLower] = params[key].default;
            tags[key] = params[key].default;
            components[keyLower] = params[key].default;
            if(params[key].useName) {
                tags[params[key].useName] = params[key].default;
                components[params[key].useName] = params[key].default;
            }
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