import * as Tag from "../Tag";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
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
                let jdom:any = this.find("[name='"+key+"']");
                if(jdom && jdom.setValue){
                    jdom.setValue(value)
                }
             
            }
        }
    }

    getValue(){
        var value = {};
        let fn = (ele: any,props?:any) => {
            ele.children_g_().each((index: any,dom: any)=>{
                if(G.$(dom) instanceof Group){
                    value[G.$(dom).props.name]={}
                    fn(G.$(dom),G.$(dom).props.name);
                }else{
                    let children = dom.children;
                    for(let i=0;i<children.length;i++){
                        let gele = G.$(children[i]);
                        if(gele && gele.getValue && gele.props && gele.props.name){
                            if(props==null){
                                value[gele.props.name] = gele.getValue();
                            }else{
                                value[props][gele.props.name] = gele.getValue();
                            }
                        }
                    }
                }
                // let parent = G.G$(dom).parents(".ajaxload-group:first");
                // console.log(dom)
                // console.log(dom.children)
                // if(parent.length > 0 && G.$(parent[0]) == this){
                    
                    
                // }  
                // if(G.$(dom) instanceof Group) {
                //     console.log(G.$(dom))
                //     fn(G.$(dom));
                // }else{
                    
                // }     
            });
        }
        fn(this);
        return value;
    }
}