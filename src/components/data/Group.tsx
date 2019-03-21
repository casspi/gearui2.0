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

                // let gele:any;
                // for(let i=0;i<this.realDom.children.length;i++){
                //     console.log(G.$(this.realDom.children))
                //     if(G.$((this.realDom.children[i])).state&&G.$((this.realDom.children[i])).state.name&&G.$((this.realDom.children[i])).state.name==key){
                //         // console.log(G.$((this.realDom.children[i])))
                //         gele = G.$((this.realDom.children[i]));
                //     }
                // }
                // // console.log(gele)
                // if(gele && gele.setValue) {
                //     gele.setValue(value);
                // }
                
                let jdom = this.find("[name='"+key+"']");// let jdom = G.$(this.realDom).find("[name='"+key+"']");
                // console.log(jdom)
                if(jdom.length>0){
                    jdom.each((index:number,dom:any)=>{
                        let parent = G.$(dom).parents(".ajaxload-group:first");
                        // console.log(dom);
                        // console.log(jdom[index]);
                        // console.log(parent[0])
                        if(parent.length > 0 && G.$(parent[0]) == this){//G.$(parent[0])为Group
                            let children = G.$(parent).find('*');
                            for(let i=0;i<children.length;i++){
                                if(G.$(children[i]).state&&G.$(children[i]).state.name ==key&&G.$(children[i]).setValue){
                                    G.$(children[i]).setValue(value)
                                }
                            }
                            // gele.doRender((ele:any)=>{
                            //     console.log(999)
                            //     gele = G.$('ele');
                            //     if(gele["setValue"])
                            //         gele.setValue(value);
                            // });
                            // if(gele && gele.setValue) {                         
                            //     gele.setValue(value);
                            // }
                        }
                    });
                }
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