let events = {
    onabort: GearType.Function,
    onafterchange: GearType.Function,
    onaftercheck: GearType.Function,
    onafterclose: GearType.Function,
    onafterexpand: GearType.Function,
    onafterload: GearType.Function,
    onafterprint: GearType.Function,
    onafterprocess: GearType.Function,
    onafterrender: GearType.Function,
    onafterselect: GearType.Function,
    onaftersubmit: GearType.Function,
    onafterupdate: GearType.Function,
    onbeforecancel: GearType.Function,
    onbeforecheck: GearType.Function,
    onbeforeload: GearType.Function,
    onbeforeprint: GearType.Function,
    onbeforeprocess: GearType.Function,
    onbeforeselect: GearType.Function,
    onbeforesubmit: GearType.Function,
    onbeforeunload: GearType.Function,
    onbeforeupload: GearType.Function,
    onblur: GearType.Function,
    oncancel: GearType.Function,
    oncanplay: GearType.Function,
    oncanplaythrough: GearType.Function,
    onchange: GearType.Function,
    oncheck: GearType.Function,
    onclick: GearType.Function,
    onclickbutton: GearType.Function,
    onclickicon: GearType.Function,
    onclose: GearType.Function,
    oncompassneedscalibration: GearType.Function,
    oncomplete: GearType.Function,
    onconfirm: GearType.Function,
    oncontextmenu: GearType.Function,
    oncustomrequest: GearType.Function,
    ondblclick: GearType.Function,
    ondevicelight: GearType.Function,
    ondevicemotion: GearType.Function,
    ondeviceorientation: GearType.Function,
    ondovalidate: GearType.Function,
    ondrag: GearType.Function,
    ondragend: GearType.Function,
    ondragenter: GearType.Function,
    ondragleave: GearType.Function,
    ondragover: GearType.Function,
    ondragstart: GearType.Function,
    ondrop: GearType.Function,
    ondurationchange: GearType.Function,
    onemptied: GearType.Function,
    onended: GearType.Function,
    onerror: GearType.Function,
    onexpand: GearType.Function,
    onexpanded: GearType.Function,
    onexpandedrow: GearType.Function,
    onexpandedrowschange: GearType.Function,
    onfailed: GearType.Function,
    onfocus: GearType.Function,
    onformatter: GearType.Function,
    onhashchange: GearType.Function,
    onhidepanel: GearType.Function,
    oninput: GearType.Function,
    oninvalid: GearType.Function,
    onkeydown: GearType.Function,
    onkeypress: GearType.Function,
    onkeyup: GearType.Function,
    onlefttreecheck: GearType.Function,
    onload: GearType.Function,
    onloadeddata: GearType.Function,
    onloadedmetadata: GearType.Function,
    onloadfailed: GearType.Function,
    onloadstart: GearType.Function,
    onloadsuccess: GearType.Function,
    onlogout: GearType.Function,
    onmatchformat: GearType.Function,
    onmessage: GearType.Function,
    onmousedown: GearType.Function,
    onmouseenter: GearType.Function,
    onmouseleave: GearType.Function,
    onmousemove: GearType.Function,
    onmouseout: GearType.Function,
    onmouseover: GearType.Function,
    onmouseup: GearType.Function,
    onmousewheel: GearType.Function,
    onmsgesturechange: GearType.Function,
    onmsgesturedoubletap: GearType.Function,
    onmsgestureend: GearType.Function,
    onmsgesturehold: GearType.Function,
    onmsgesturestart: GearType.Function,
    onmsgesturetap: GearType.Function,
    onmsinertiastart: GearType.Function,
    onmspointercancel: GearType.Function,
    onmspointerdown: GearType.Function,
    onmspointerenter: GearType.Function,
    onmspointerleave: GearType.Function,
    onmspointermove: GearType.Function,
    onmspointerout: GearType.Function,
    onmspointerover: GearType.Function,
    onmspointerup: GearType.Function,
    onnotification: GearType.Function,
    onoffline: GearType.Function,
    onok: GearType.Function,
    ononline: GearType.Function,
    onopen: GearType.Function,
    onopenchange: GearType.Function,
    onorientationchange: GearType.Function,
    onpagehide: GearType.Function,
    onpageshow: GearType.Function,
    onpanelchange: GearType.Function,
    onparser: GearType.Function,
    onpause: GearType.Function,
    onplay: GearType.Function,
    onplaying: GearType.Function,
    onpopstate: GearType.Function,
    onpressenter: GearType.Function,
    onpreview: GearType.Function,
    onprocess: GearType.Function,
    onprogress: GearType.Function,
    onratechange: GearType.Function,
    onreadystatechange: GearType.Function,
    onremove: GearType.Function,
    onrender: GearType.Function,
    onreset: GearType.Function,
    onresize: GearType.Function,
    onrightclick: GearType.Function,
    onrighttreecheck: GearType.Function,
    onrowclick: GearType.Function,
    onsave: GearType.Function,
    onscroll: GearType.Function,
    onsearch: GearType.Function,
    onsearchchange: GearType.Function,
    onseeked: GearType.Function,
    onseeking: GearType.Function,
    onselect: GearType.Function,
    onselectchange: GearType.Function,
    onshowpanel: GearType.Function,
    onshowsizechange: GearType.Function,
    onstalled: GearType.Function,
    onstorage: GearType.Function,
    onsubmit: GearType.Function,
    onsubmitfailed: GearType.Function,
    onsubmitsuccess: GearType.Function,
    onsuccess: GearType.Function,
    onsuspend: GearType.Function,
    ontimeupdate: GearType.Function,
    ontouchcancel: GearType.Function,
    ontouchend: GearType.Function,
    ontouchmove: GearType.Function,
    ontouchstart: GearType.Function,
    onunload: GearType.Function,
    onunselect: GearType.Function,
    onvalidate: GearType.Function,
    onvolumechange: GearType.Function,
    onwaiting: GearType.Function,
    onwarn: GearType.Function,
}
let eventUpdate: typeof events = Object.defineProperty(events, "keys", {
    get: function() {
        let allKeys = new GearArray<string>([]);
        for(let key in this) {
            if(key != "keys") {
                allKeys.add(key);
            }
        }
        return allKeys;
    },
    enumerable: false
});
let eventUpdate2: typeof events = Object.defineProperty(eventUpdate, "cannotSetState", {
    get: function() {
        return new GearArray([
            "onafterrender",
            "onafterupdate"
        ]);
    },
    enumerable: false
});
export default eventUpdate2;
// export default new GearArray([
//     "onabort",
//     "onafterprint",
//     "onbeforeprint",
//     "onbeforeunload",
//     "onblur",
//     "oncanplay",
//     "oncanplaythrough",
//     "onchange",
//     "onclick",
//     "oncompassneedscalibration",
//     "oncontextmenu",
//     "ondblclick",
//     "ondevicelight",
//     "ondevicemotion",
//     "ondeviceorientation",
//     "ondrag",
//     "ondragend",
//     "ondragenter",
//     "ondragleave",
//     "ondragover",
//     "ondragstart",
//     "ondrop",
//     "ondurationchange",
//     "onemptied",
//     "onended",
//     "onerror",
//     "onfocus",
//     "onhashchange",
//     "oninput",
//     "oninvalid",
//     "onkeydown",
//     "onkeypress",
//     "onkeyup",
//     "onload",
//     "onloadeddata",
//     "onloadedmetadata",
//     "onloadstart",
//     "onmessage",
//     "onmousedown",
//     "onmouseenter",
//     "onmouseleave",
//     "onmousemove",
//     "onmouseout",
//     "onmouseover",
//     "onmouseup",
//     "onmousewheel",
//     "onmsgesturechange",
//     "onmsgesturedoubletap",
//     "onmsgestureend",
//     "onmsgesturehold",
//     "onmsgesturestart",
//     "onmsgesturetap",
//     "onmsinertiastart",
//     "onmspointercancel",
//     "onmspointerdown",
//     "onmspointerenter",
//     "onmspointerleave",
//     "onmspointermove",
//     "onmspointerout",
//     "onmspointerover",
//     "onmspointerup",
//     "onoffline",
//     "ononline",
//     "onorientationchange",
//     "onpagehide",
//     "onpageshow",
//     "onpause",
//     "onplay",
//     "onplaying",
//     "onpopstate",
//     "onprogress",
//     "onratechange",
//     "onreadystatechange",
//     "onreset",
//     "onresize",
//     "onscroll",
//     "onseeked",
//     "onseeking",
//     "onselect",
//     "onstalled",
//     "onstorage",
//     "onsubmit",
//     "onsuspend",
//     "ontimeupdate",
//     "ontouchcancel",
//     "ontouchend",
//     "ontouchmove",
//     "ontouchstart",
//     "onunload",
//     "onvolumechange",
//     "onwaiting",
//     "onbeforeprocess",
//     "onprocess",
//     "onsuccess",
//     "onfailed",
//     "oncomplete",
//     "onclose",
//     "onsearch",
//     "onpanelchange",
//     "onbeforecancel",
//     "onconfirm",
//     "oncancel",
//     "onok",
//     "onbeforeupload",
//     "oncustomrequest",
//     "onpreview",
//     "onremove",
//     "onsubmit",
//     "onreset",
//     "onsubmitsuccess",
//     "onsubmitfailed",
//     "onbeforesubmit",
//     "onaftersubmit",
//     "onpressenter",
//     "onkeydown",
//     "onformatter",
//     "onparser",
//     "onshowsizechange",
//     "onsave",
//     "onopen",
//     "onopenchange",
//     "onclose",
//     "onunselect",
//     "onhidepanel",
//     "onshowpanel",
//     "onafterchange",
//     "onexpandedrow",
//     "onloadsuccess",
//     "onloadfailed",
//     "onrowclick",
//     "onclickicon",
//     "onclickbutton",
//     "onselectchange",
//     "onsearchchange",
//     "onrightclick",
//     "ondragstart",
//     "ondragenter",
//     "ondragover",
//     "ondragleave",
//     "ondrop",
//     "onafterclose",
//     "onbeforeprocess",
//     "onafterprocess",
//     "onprocess",
//     "onsuccess",
//     "onfailed",
//     "oncomplete",
//     "onmatchformat",
//     "oncheck",
//     "onbeforeselect",
//     "onafterselect",
//     "onbeforecheck",
//     "onaftercheck",
//     "onlefttreecheck",
//     "onrighttreecheck",
//     "onrender",
//     "onafterupdate",
//     "onvalidate",
//     "dovalidate",
//     "onnotification",
//     "onwarn",
//     "onlogout",
//     "onexpand",
//     "onexpanded",
//     "onafterexpand",
//     "onexpandedrowschange",
//     "onafterrender",
//     "onbeforeload",
//     "onafterload",
// ]);