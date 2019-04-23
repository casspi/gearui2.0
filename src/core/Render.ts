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
        // let reactElesa:Array<{ele: any, ast:ASTElement}> = [];
        // console.log('newReactInstancestart:'+newReactInstancestart)
        asts.forEach((ast)=>{
            // let time1 = new Date().getTime();
            // let clazz = GearUtil.getClass(ast);
            // if(clazz) {
                let reactEle = GearUtil.newReactInstance(ast);
                reactEles.push(reactEle);
            // }
            
            // let time2 = new Date().getTime();
            // console.log('创建单个耗时:'+(time2 - time1));
        });
        // let time22 =new Date();
        // let newReactInstanceend = time22.getTime();
        // console.log('newReactInstancestart:'+newReactInstanceend)
        // console.log('newReactInstance-count:'+(newReactInstanceend-newReactInstancestart));
        // let time33 = new Date();
        // let render_render_start = time33.getTime();
        // console.log('render_renderstart:'+render_render_start)
        // reactElesa.forEach(function(ele) {
        //     let parent = ele.ast.parent.dom;
        //     ReactDOM.render(ele.ele, parent, ()=>{
        //         let time44 =new Date();
        //         let render_render_end = time44.getTime();
        //         console.log('render_renderstart:'+render_render_end)
        //         console.log('render_render-count:'+(render_render_end-render_render_start));
        //         if(callback) {
        //             let childrenTags: any = [];
        //             let children = G.G$(parent).children();
        //             children.each((index, ele)=>{
        //                 childrenTags.push(G.$(ele));
        //             });
        //             console.log(childrenTags)
        //             callback.call(window, childrenTags);
        //         }
        //     });
        // });
        ReactDOM.render(reactEles, parent, ()=>{
            // let time44 =new Date();
            // let render_render_end = time44.getTime();
            // console.log('render_renderstart:'+render_render_end)
            // console.log('render_render-count:'+(render_render_end-render_render_start));
            if(callback) {
                let childrenTags: any = [];
                let children = G.G$(parent).children();
                children.each((index, ele)=>{
                    childrenTags.push(G.$(ele));
                });
                callback.call(window, childrenTags);
            }
        });
        
    }
}