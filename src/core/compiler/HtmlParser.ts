import CompilerUtil from './CompilerUtil';
import { UUID } from 'src/utils';
// Regular Expressions for parsing tags and attributes
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
// could use https://www.w3.org/TR/1999/REC-xml-names-19990114/#NT-QName
// but for Vue templates we can enforce a simple charset
const ncname = '[a-zA-Z_][\\w\\-\\.]*';
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const startTagClose = /^\s*(\/?)>/;
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const doctype = /^<!DOCTYPE [^>]+>/i;
const comment = /^<!\--/;
const conditionalComment = /^<!\[/;

let IS_REGEX_CAPTURING_BROKEN = false;
'x'.replace(/x(.)?/g, (m, g) => {
    IS_REGEX_CAPTURING_BROKEN = g === '';
    return '';
});

// Special Elements (can contain anything)
const reCache = {};

const decodingMap = {
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&amp;': '&',
    '&#10;': '\n',
    '&#9;': '\t'
};
const encodedAttr = /&(?:lt|gt|quot|amp);/g;
const encodedAttrWithNewLines = /&(?:lt|gt|quot|amp|#10|#9);/g;

// #5992
const isIgnoreNewlineTag = CompilerUtil.makeMap('pre,textarea', true);
const shouldIgnoreFirstNewline = (tag: any, html: any) => tag && isIgnoreNewlineTag(tag) && html[0] === '\n';

export default class HtmlParser {

    isPlainTextElement = CompilerUtil.makeMap('script,style,textarea', true);
    options: CompilerOptions;
    html: string;
    cacheHtml: string = "";
    index = 0;
    stack: any[] = [];
    lastTag: any;
    expectHTML: boolean;
    isUnaryTag: any;
    canBeLeftOpenTag: any;

    constructor(html: string, options: CompilerOptions) {
        this.html = html;
        this.options = options;
    }
     
    private isColumn:boolean = false;

    parseHTML() {
        this.expectHTML = this.options.expectHTML ? this.options.expectHTML : false;
        this.isUnaryTag = this.options.isUnaryTag || CompilerUtil.no;
        this.canBeLeftOpenTag = this.options.canBeLeftOpenTag || CompilerUtil.no;

        let last;
        let __this = this;

        while (this.html) {
            last = __this.html;
            // Make sure we're not in a plaintext content element like script/style
            if (!this.lastTag || !this.isPlainTextElement(this.lastTag)) {
                let textEnd = this.html.indexOf('<');
                if (textEnd === 0) {
                    // Comment:
                    if (comment.test(this.html)) {
                        const commentEnd = this.html.indexOf('-->');

                        if (commentEnd >= 0) {
                            if (this.options.shouldKeepComment) {
                                this.options.comment(this.html.substring(4, commentEnd));
                            }
                            this.advance(commentEnd + 3);
                            continue;
                        }
                    }
                    if (conditionalComment.test(this.html)) {
                        const conditionalEnd = this.html.indexOf(']>');

                        if (conditionalEnd >= 0) {
                            this.cacheHtml += this.advance(conditionalEnd + 2);
                            continue;
                        }
                    }
                    if (conditionalComment.test(this.html)) {
                        const conditionalEnd = this.html.indexOf(']>');

                        if (conditionalEnd >= 0) {
                            this.cacheHtml += this.advance(conditionalEnd + 2);
                            continue;
                        }
                    }

                    // Doctype:
                    const doctypeMatch = this.html.match(doctype);
                    if (doctypeMatch) {
                        this.cacheHtml += this.advance(doctypeMatch[0].length);
                        continue;
                    }

                    // End tag:
                    const endTagMatch = this.html.match(endTag);
                    // console.log(endTagMatch)
                    if (endTagMatch) {
                        const curIndex = this.index;
                        let cacheHtml = this.advance(endTagMatch[0].length);
                        let endMessage = this.parseEndTag(endTagMatch[1], curIndex, this.index);
                        let index = endMessage.index;
                        let currentElement = endMessage.currentElement;
                        
                        if(currentElement && (currentElement.tag=='g-column' || currentElement.attrsMap.ctype=='column')){
                            // console.log(currentElement);
                            this.isColumn = false;
                        }
                        if(endTagMatch[1] === "br") {
                            cacheHtml = cacheHtml.replace("</br", "</br "+ Constants.HTML_PARSER_DOM_INDEX +"=\"" + index+"\"");
                        }
                        if(endTagMatch[1] === "p") {
                            cacheHtml = cacheHtml.replace("</p", "</p "+ Constants.HTML_PARSER_DOM_INDEX +"=\"" + index+"\"");
                        }
                        this.cacheHtml += cacheHtml;
                        continue;
                    }

                    // Start tag:
                    const startTagMatch = this.parseStartTag();
                    if (startTagMatch) {
                        if(startTagMatch.tagName == 'g-column' || startTagMatch.ctype == 'column'){
                            // console.log(startTagMatch)
                            this.isColumn = true;
                        }
                        let index = this.handleStartTag(startTagMatch);
                        this.cacheHtml = this.cacheHtml.replace("{" + Constants.HTML_PARSER_DOM_INDEX + "}", index);
                        if (shouldIgnoreFirstNewline(this.lastTag, this.html)) {
                            this.cacheHtml += this.advance(1);
                        }
                        continue;
                    }
                }
                let text, rest, next;
                if (textEnd >= 0) {
                    rest = this.html.slice(textEnd);
                    while (
                        !endTag.test(rest) &&
                        !startTagOpen.test(rest) &&
                        !comment.test(rest) &&
                        !conditionalComment.test(rest)
                    ) {
                        // < in plain text, be forgiving and treat it as text
                        next = rest.indexOf('<', 1);
                        if (next < 0) break;
                        textEnd += next;
                        rest = this.html.slice(textEnd);
                    }
                    text = this.html.substring(0, textEnd);
                    this.cacheHtml += this.advance(textEnd);
                }

                if (textEnd < 0) {
                    text = this.html;
                    this.html = '';
                }

                if (this.options.chars && text) {
                    this.options.chars(text);
                }
            } else {
                let endTagLength = 0;
                const stackedTag = this.lastTag.toLowerCase();
                const reStackedTag = reCache[stackedTag] || (reCache[stackedTag] = new RegExp('([\\s\\S]*?)(</' + stackedTag + '[^>]*>)', 'i'));
                const rest = this.html.replace(reStackedTag, (all, text, endTag) => {
                    endTagLength = endTag.length;
                    if (!this.isPlainTextElement(stackedTag) && stackedTag !== 'noscript') {
                        text = text.replace(/<!\--([\s\S]*?)-->/g, '$1').replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1');
                    }
                    if (shouldIgnoreFirstNewline(stackedTag, text)) {
                        text = text.slice(1);
                    }
                    if (this.options.chars) {
                        let charStr = this.options.chars(text);
                        this.cacheHtml += charStr;
                    }
                    return endTag;
                })
                this.index += this.html.length - rest.length;
                this.html = rest;
                this.parseEndTag(stackedTag, this.index - endTagLength, this.index);
            }
            if (this.html === last) {
                this.options.chars && this.options.chars(this.html)
                if (process.env.NODE_ENV !== 'production' && !this.stack.length && this.options.warn) {
                    this.options.warn(`Mal-formatted tag at end of template: "${this.html}"`)
                }
                break
            }
        }
        // Clean up any remaining tags
        this.parseEndTag();
        return this.cacheHtml;
    }

    private decodeAttr(value: any, shouldDecodeNewlines: any) {
        const re = shouldDecodeNewlines ? encodedAttrWithNewLines : encodedAttr
        return value.replace(re, (match: any) => decodingMap[match])
    }

    private advance(n: number) {
        this.index += n;
        let cache = this.html.substring(0, n);
        this.html = this.html.substring(n)
        return cache || "";
    }

    private parseStartTag() {
        const start = this.html.match(startTagOpen);
        if (start) {
            let inputType = "";
            const match: any = {
                tagName: start[1],
                ctype: null,
                tagClass: null,
                attrs: [],
                start: this.index
            }
            this.cacheHtml += this.advance(start[0].length)
            let end, attr;
            let hasId = false;
            while (!(end = this.html.match(startTagClose)) && (attr = this.html.match(attribute))) {
                if(attr[1] == "ctype") {
                    match.ctype = attr[3];
                }
                if(attr[1] == "id") {
                    hasId = true;
                }
                if(match.tagName == "input" && attr[1] == "type") {
                    inputType = attr[3];
                }
                this.cacheHtml += this.advance(attr[0].length);
                match.attrs.push(attr);
            }
            if (end) {
                if(!hasId) {
                    let id = UUID.get();
                    let attrInner = ["id=\"" + id + "\"","id","=",id];
                    match.attrs.push(attrInner);
                    this.cacheHtml += " id=\"" + id + "\"";
                }
                this.cacheHtml += " " + Constants.HTML_PARSER_DOM_INDEX + "=\"{" + Constants.HTML_PARSER_DOM_INDEX + "}\"";
                match.unarySlash = end[1];
                this.cacheHtml += this.advance(end[0].length);
                match.end = this.index;
                if(match.ctype) {
                    match.tagClass = G.components[match.ctype];
                }
                if(match.tagClass == null) {
                    if(match.tagName) {
                        if(match.tagName.startsWith("g")) {
                            if(match.tagName.startsWith("g-")) {
                                match.tagClass = G.components[match.tagName.substring(2, match.tagName.length)];
                            }else {
                                match.tagClass = G.components[match.tagName.substring(1, match.tagName.length)];
                            }
                        }
                        // else if(match.tagName == "input") {
                        //     match.tagClass = G.components[inputType];
                        //     if(match.tagClass == null) {
                        //         match.tagClass = G.components["text"];
                        //     }
                        // }
                    }
                }
                return match;
            }
        }
    }

    private handleStartTag(match: any) {
        const tagName = match.tagName;
        const tagClass = match.tagClass;
        const unarySlash = match.unarySlash;

        if (this.expectHTML) {
            if (this.lastTag === 'p' && this.options.isNonPhrasingTag(tagName)) {
                this.parseEndTag(this.lastTag);
            }
            if (this.canBeLeftOpenTag(tagName) && this.lastTag === tagName) {
                this.parseEndTag(tagName);
            }
        }

        const unary = this.isUnaryTag(tagName) || !!unarySlash;
        const l = match.attrs.length;
        const attrs = new Array(l);
        for (let i = 0; i < l; i++) {
            const args = match.attrs[i];
            // hackish work around FF bug https://bugzilla.mozilla.org/show_bug.cgi?id=369778
            if (IS_REGEX_CAPTURING_BROKEN && args[0].indexOf('""') === -1) {
                if (args[3] === '') { delete args[3]; }
                if (args[4] === '') { delete args[4]; }
                if (args[5] === '') { delete args[5]; }
            }
            const value = args[3] || args[4] || args[5] || '';
            const shouldDecodeNewlines = tagName === 'a' && args[1] === 'href'
                ? this.options.shouldDecodeNewlinesForHref
                : this.options.shouldDecodeNewlines;
            let valueNew = this.decodeAttr(value, shouldDecodeNewlines);
            let name = args[1];
            if(tagClass) {
                // let type = this.getAttributeValueType(name,valueNew);
                name = window.getPossibleStandardTagName(args[1]);
                valueNew = this.parseAttributeValue(name, valueNew);
            }else {
                name = window.getPossibleStandardName(args[1]);
                valueNew = this.formatDomProperties(name, valueNew);
            }
            attrs[i] = {
                name: name,
                value: valueNew
            };
        }

        if (!unary) {
            this.stack.push({ tag: tagName, lowerCasedTag: tagName.toLowerCase(), attrs: attrs });
            this.lastTag = tagName;
        }

        let index: string = "";

        if (this.options.start) {
            index = this.options.start(tagName, tagClass, attrs, unary, match.start, match.end);
        }
        return index;
    }

    private formatDomProperties(name: string, value: any) {
        if(name == "style") {
            return GearJson.fromStyle(value).toJson();
        }else {
            if(G.events.contains(name.toLowerCase())) {
                value = (function(value) {
                    return function(...args: any[]){
                        try{
                            return eval(value);
                        }catch(err){
                            console.error(err);
                        }
                    }
                })(value);
            }
        }
        return value;
    }

    // 解析属性值
    private parseAttributeValue(name:string,value:string, typeConstractor?: any,htmlTag?: boolean){
        // 解析value中的表达式 G{xxx} ，对表达式中的函数或变量进行解析处理
        value = value.replace(/\G\{([^\}]+)\}/g,function(match,m1){
            // 获得表达式，如果表达式是以“();”结尾的，去除之
            var expression = m1.replace(/\([\.|$|\w]{0,}\);?$/,"");
            // 先检查window作用域中是否存在该函数或变量
            var v = window[expression];
            if(v){
                // 如果存在
                if(typeof v =="function"){
                    // 如果是个函数，则调用它（函数应返回一个字符串值，为防止函数返回其它值，这里对返回值作了判断）
                    var r = v.call(window);
                    if(r)
                        return r;
                    else
                        return "";
                }else{
                    // 其它类型直接返回（这里应只有字符串类型，否则也会被转为字符串类型）
                    return v;
                }
            }else{
                // 如果不存在，则使用eval来解析函数
                var fun = function(){
                    try{
                        return eval(expression);
                    }catch(err){
                        console.error(err);
                        return "";
                    }
                }
                var r = fun.call(window);
                if(r)
                    return r;
                else
                    return "";                    
            }
        });
        if(G.events.contains(name.toLowerCase())){
            let values = value.split(";");
            let funs = [];
            for(let i = 0; i < values.length; i++) {
                let typeConstractor = this.getAttributeValueType(name,value)
                let valueInner = values[i];
                if(typeConstractor == "script" || typeConstractor == "function") {
                    valueInner = valueInner.replace(/^javascript:/,"");
                    return function(...args: any[]){
                        try{
                            return eval(valueInner);
                        }catch(err){
                            console.error(err);
                        }
                    }
                }else {
                    let methodName = valueInner.replace(/\([\.|$|\w]{0,}\);?/,"");
                    if(G.cannotSetStateEvents.contains(name)) {
                        this.removeSetStateFromCannotSetStateFunction(methodName, name);
                    }
                    let script = methodName + ".bind(this)(...arguments)";
                    // 如果该属性名称在常用事件名称列表中，这里按照事件的规则处理
                    funs.push(function(...args: any[]){
                        try{
                            return eval(script);
                        }catch(err){
                            console.error(err);
                        }
                    });
                }
            }
            if(funs.length == 1) {
                return funs[0];
            }
            return funs;
        }else {
            // let type = typeConstractor;
            let type = this.getAttributeValueType(name,value)
            // if(name=='value'){
            //     console.log(type)
            //     // type = 'object'
            // }
            //回调函数
            try {
                if(type == 'function') {//|| type.indexOf("_g_function")>-1
                    if(htmlTag == true) {
                        return value;
                    }
                    let values = value.split(";");
                    let funs = [];
                    for(let i = 0; i < values.length; i++) {
                        let valueInner = values[i];
                        let methodName = valueInner.replace(/\([\.|$|\w]{0,}\);?/,"");
                        methodName = methodName.replace(/^javascript:/,"")//防止老版中，如：link属性也会有javascript:fun()写法
                        if(window[methodName] && window[methodName] instanceof Function) {
                            funs.push(window[methodName]);
                        }
                    }
                    if(funs.length == 1) {
                        return funs[0];
                    }
                    return funs;
                }else if(type == "script") {
                    if(htmlTag == true) {
                        return value;
                    }
                    let script = value.replace(/^javascript:/,"");
                    return function(...args: any[]) {
                        try{
                            return eval(script);
                        }catch(err){
                            console.error(err);
                        }
                    }
                }else if(type == 'boolean') {
                    if(htmlTag == true) {
                        return value;
                    }
                    if(value == "true") {
                        return true;
                    }else {
                        return false;
                    }
                }else if(type == 'number' && value.indexOf('\\.') != -1) {
                    if(htmlTag == true) {
                        return value;
                    }
                    return parseFloat(value);
                }else if(type == 'number' && value.indexOf('\\.') == -1) {
                    if(htmlTag == true) {
                        return value;
                    }
                    return parseInt(value);
                }else if(type == 'object' || type == "array") {
                    if(htmlTag == true) {
                        return value;
                    }
                    return eval("(" + value + ")");
                }else if(type == 'CssProperties') {
                    return GearJson.fromStyle(value).toJson();
                }else {
                    return value;
                } 
            } catch (error) {
                return value;
            }
            
        }
    }

    private removeSetStateFromCannotSetStateFunction(methodName: string, eventName: string) {
        let method = window[methodName];
        if(method instanceof Function) {
            let methodStr:string = method.toString();
            let setStateReg = /[;|\n]{1,}[\t| ]{0,}[$|\w]{1,}\.setState[\t| |\n]{0,}\([ |\t|\n]{0,}/;
            let s = methodStr.match(setStateReg);
            if(s) {
                throw eventName + " = " + methodName + " cannot invoke setState";
            }
        }
    }

    private getAttributeValueType(name: string, value:string) {
        let type = window.getPossibleStandardType(name);
        if(type.indexOf("any") < 0 && type.indexOf(",") < 0 ) {
            return type;
        }
        let testReg = /^{.*}$/;//判断是否是{}包裹的写法，针对table的 column 解析此处都作为string
        if(testReg.test(value) && this.isColumn === true){
            return "string"
        }
        
        value = value.trim();
        type = "string";
        let valueTypeArr = value.split("::");
        if(valueTypeArr.length > 1) {
            type = valueTypeArr[1];
        }else {
            if(value == "true" || value == "false") {
                type = "boolean";
            }else {
                let methodReg = /[$|\w]{1,}\([\.|$|\w]{0,}\);?/;
                let match = value.match(methodReg);
                if(match  && window[match[0].replace(/\([\.|$|\w]{0,}\);?/,"")]) {
                    type = "function";
                }else if(G.events.contains(name) && /^javascript:.+/.test(value)){
                    // 如果以javascript开头，则认为是脚本
                    type = "script";
                }else {
                    if(/^\{[\s\S]+\}$/.test(value) || /^\[[\s\S]+\]$/.test(value)) {
                        try {
                            type = typeof eval("(" + value + ")");
                        }catch(e) {
                            type = "string";
                        }
                    }else {
                        type = "string";
                    }
                }
            }
        }
        return type;
    }

    private parseEndTag(tagName?: string, start?: any, end?: any) {
        let pos, lowerCasedTagName;
        let currentElement;
        if (start == null) start = this.index;
        if (end == null) end = this.index;

        if (tagName) {
            lowerCasedTagName = tagName.toLowerCase();
        }

        // Find the closest opened tag of the same type
        if (tagName) {
            for (pos = this.stack.length - 1; pos >= 0; pos--) {
                if (this.stack[pos].lowerCasedTag === lowerCasedTagName) {
                    break;
                }
            }
        } else {
            // If no tag name is provided, clean shop
            pos = 0;
        }
        let index:string = "";
        if (pos >= 0) {
            // Close all the open elements, up the stack
            for (let i = this.stack.length - 1; i >= pos; i--) {
                if (process.env.NODE_ENV !== 'production' && (i > pos || !tagName) && this.options.warn) {
                    this.options.warn(`tag <${this.stack[i].tag}> has no matching end tag.`);
                }
                if (this.options.end) {
                    currentElement = this.options.end(this.stack[i].tag, start, end);
                }
            }

            // Remove the open elements from the stack
            this.stack.length = pos;
            this.lastTag = pos && this.stack[pos - 1].tag;
        } else if (lowerCasedTagName === 'br') {
            if (this.options.start) {
                index = this.options.start(tagName,"br", [], true, start, end);
            }
        } else if (lowerCasedTagName === 'p') {
            if (this.options.start) {
                index = this.options.start(tagName,"p", [], false, start, end);
            }
            if (this.options.end) {
                currentElement = this.options.end(tagName, start, end);
            }
        }
        return {index: index, currentElement: currentElement};
    }
}