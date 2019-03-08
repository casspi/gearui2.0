import * as Tag from "../Tag";
import * as React from 'react';
export var props = {
    ...Tag.props
}
export interface state extends Tag.state {

}
export default class Group<P extends typeof props, S extends state> extends Tag.default<P, S> {
    
    getInitialState(): state {
        return {};
    }

    render() {
        let name = {name: this.state.name};
        return <span id={this.props.id} ref={ele=>this.ref=ele} {...name} className={"ajaxload-group" + (this.state.className ? " " + this.state.className : "")}>{this.props.children}</span>;
    }

    setValue(data: any){
        if(data){
            for(let key in data) {
                let value = data[key];
                try{
                    if(typeof value == "function") {
                        value = value();
                    }
                }catch(e){}
                let gele:any;
                for(let i=0;i<this.realDom.children.length;i++){
                    if(G.$((this.realDom.children[i])).state.name==key){
                        // console.log(G.$((this.realDom.children[i])))
                        gele = G.$((this.realDom.children[i]));
                    }
                }
                // console.log(gele)
                if(gele && gele.setValue) {
                    gele.setValue(value);
                }
                // let jdom = this.find("[name='"+key+"']");
                // if(jdom.length>0){
                //     jdom.each((index,dom)=>{
                //         let parent = G.G$(dom).parents(".ajaxload-group:first");
                       
                //         if(parent.length > 0 && G.$(parent[0]) == this){//G.$(parent[0])为Group
                //             // let gele = G.$(dom);
                //             console.log(gele)
                //             if(gele && gele.setValue) {
                //                 gele.setValue(value);
                //             }
                //         }
                //     });
                // }
            }
        }
    }

    getValue(){
        var value = {};
        let fn = (ele: any) => {
            ele.children_g_().each((index: any,dom: any)=>{
                let parent = G.G$(dom).parents(".ajaxload-group:first");
                if(parent.length > 0 && G.$(parent[0]) == this){
                    let gele = G.$(dom);
                    if(gele && gele.getValue && gele.props && gele.props.name) {
                        value[gele.props.name] = gele.getValue();
                    }
                    if(gele.children_g_) {
                        fn(gele);
                    }
                }       
            });
        }
        fn(this);
        return value;
    }
}