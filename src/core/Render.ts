import * as ReactDOM from 'react-dom';
import { GearUtil } from '../utils';
export default class Render {

    /**
     * 渲染
     * @param asts ast树
     * @param parent 没有parent相当于从html直接渲染
     */
    public render(ast: ASTElement, parent: Element, callback?: Function) {
        let reactEles: any = [];
        let asts = ast.children;
        let time11 =new Date();
        let newReactInstancestart = time11.getTime();
        console.log('newReactInstancestart:'+newReactInstancestart)
        asts.forEach((ast)=>{
            console.log(ast)
            let reactEle = GearUtil.newReactInstance(ast);
            reactEles.push(reactEle);
        });
        let time22 =new Date();
        let newReactInstanceend = time22.getTime();
        console.log('newReactInstancestart:'+newReactInstanceend)
        console.log('newReactInstance-count:'+(newReactInstanceend-newReactInstancestart)/1000);
        let time33 = new Date();
        let render_render_start = time33.getTime();
        console.log('render_renderstart:'+render_render_start)
        ReactDOM.render(reactEles, parent, ()=>{
            let time44 =new Date();
            let render_render_end = time44.getTime();
            console.log('render_renderstart:'+render_render_end)
            console.log('render_render-count:'+(render_render_end-render_render_start)/1000);
            if(callback) {
                let childrenTags: any = [];
                let children = G.G$(parent).children();
                children.each((index, ele)=>{
                    childrenTags.push(G.$(ele));
                });
                console.log(childrenTags)
                callback.call(window, childrenTags);
            }
        });
    }
}