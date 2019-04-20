import * as Tag from "../Tag";
import * as React from 'react';
import {Popover,Icon as AntdIcon} from 'antd'
import Parser from '../../core/Parser';
import Link from '../basic/Link';
import { any } from "prop-types";
// import * as Jsplumb from 'jsplumb'
// import { jsPlumb } from 'public/jsplumb1';
// import { jsPlumb } from 'public/jsplumb1';
export declare type connector = 'Bezier' | 'Straight' | 'Flowchart';//贝塞尔曲线、直线、90度折线
export var props = {
    ...Tag.props,
    connector:GearType.Enum<connector>(),
    listWidth:GearType.Number,
    width:GearType.Number,
}
export interface state extends Tag.state {
    datal:any[];
    datar:any[];
    connector:connector,
    // links:any[],
    width?:number,
    listWidth?:string

}

export default class PlumbList<P extends typeof props, S extends state> extends Tag.default<P, S> {
    constructor(...arg:any){
        super(...arg);
    };
    protected cacheData:any[];//缓存数据
    protected loadData(){
        return {
            datal:[
                {
                    id:'l01',
                    text:'item01',
                    target:2,
                    targetArr:['r01','r02']
                },{
                    id:'l02',
                    text:'item02',
                    target:1,
                    targetArr:['r03']    
                },
                {
                    id:'l03',
                    text:'item03',
                    target:1,
                    targetArr:[]    
                },{
                    id:'l04',
                    text:'item04',
                    target:1,
                    targetArr:[]    
                }, {
                    id:'l05',
                    text:'item05',
                    target:1,
                    targetArr:[]    
                },{
                    id:'l06',
                    text:'item06',
                    target:1,
                    targetArr:[]    
                }, {
                    id:'l07',
                    text:'item07',
                    target:1,
                    targetArr:[]    
                },{
                    id:'l08',
                    text:'item08',
                    target:1,
                    targetArr:[]    
                }
            ],
            dater:[
                {
                    id:'r01',
                    text:'item01'
                },{
                    id:'r02',
                    text:'item02'    
                },{
                    id:'r03',
                    text:'item03'
                },{
                    id:'r04',
                    text:'item04'    
                },{
                    id:'r05',
                    text:'item05'
                },{
                    id:'r06',
                    text:'item06'    
                },{
                    id:'r07',
                    text:'item07'
                },{
                    id:'r08',
                    text:'item08'    
                }
            ]
        }
    }
    getInitialState():state{
        return {
            datal: this.loadData().datal,
            datar: this.loadData().dater,
            connector:this.props.connector|| 'Straight',
            width:this.props.width,
            // links:[{id:'l03r01',s:'l03',t:'r01'}],
            listWidth:(this.props.listWidth || 200)+'px'
        }
    }
    getProps(){
        return G.G$.extend({},this.state,{
            className:"plumblist-warp"
        })
    }
    parserList(data:any[],side:'left'|'right'){
        let list:any[]=[];
        data.map((item:any,index:number)=>{
            console.log(index)
            console.log(data.length)
            list.push(
                <Popover key={'pop'+item.id} placement={side}
                    content={<div className="plumb-cell-control">
                        <AntdIcon
                            style={{ cursor:'pointer'}}
                            type="close"
                            title="删除"
                            className={"plumb-cell-icon-delete"}
                            onClick={this.deleteItem.bind(this,item.id,side)}
                        />
                        <AntdIcon
                            style={{ cursor:'pointer',display:index!=0?'inline-block':'none'}}
                            type="arrow-up"
                            title="上移"
                            className={"plumb-cell-icon-up"}
                            onClick={this.upData.bind(this,item,side)}
                        />
                        <AntdIcon
                            style={{ cursor:'pointer',display:index+1<data.length?'inline-block':'none'}}
                            type="arrow-down"
                            title="下移"
                            className={"plumb-cell-icon-down"}
                            onClick={this.downData.bind(this,item,side)}
                        />
                        <AntdIcon
                            style={{ cursor:'pointer'}}
                            type={side=='left'?"arrow-right":'arrow-left'}
                            title={side=='left'?"右移":'左移'}
                            className={"plumb-cell-icon-rollback"}
                            onClick={this.moveData.bind(this,item,side)}
                        />
                </div>}>    
                    <li className="item"  id={item.id} key={item.id}>{item.text}</li>
                </Popover>
            )
        })
        return list;
    }
    
    //删除某个节点的端点
    delPlumb(id:any){
        console.log(id)
        jsPlumb.remove([id])
    }
    render(){
        console.log('render')
        let data = this.state.datal;
        let data1 = this.state.datar;
        // this.dragLinks(data)
        let props:any = this.getProps();
        delete props.listWidth;
        return <div {...props}>
            <h3>关系图</h3>
            <div className="list-warp">
                <ul id="item-left" key="left" className="list" style={{width:this.state.listWidth}}>
                    {this.parserList(data,'left')}
                </ul>
                <ul id="item-right" key="right" className="list" style={{width:this.state.listWidth}}>
                    {this.parserList(data1,'right')}
                </ul>
            </div>  
        </div>
    }
    // afterRender(){
    //     console.log('afterRender')
    //     this.dragLinks([]);
    // }
    // componentDidUpdate(){
        
    // }
    afterUpdate(){//更细数据后画点、连线
        console.log('afterupdate');
        console.log(this.state.datal);
        console.log(this.state.datar);
        this.dragLinks();
        console.log(
            jsPlumb.getAllConnections()
        )
    }
    
    componentDidMount(){
        //初始化画点、连线
        this.dragLinks();
        console.log('mount');
        // console.log(this.state.datal)
    }
    dragLinks(){
        let jsPlumb:any = window.jsPlumb;
        let _this = this;
        jsPlumb.ready(function () {
            console.log(G.G$('.jtk-endpoint'))
            G.G$('.jtk-endpoint').remove()//删除所有的点
            jsPlumb.deleteEveryConnection();//初始化删除所有连线
            console.log(_this.state.datal);
            console.log(_this.state.datar);
            var common = {
                connector: [_this.state.connector],
                maxConnections: -1,
                endpointStyle: { radius : 6, fill : "#1890ff" },
                connectorStyle: {
                    outlineStroke: '#1890ff',
                    strokeWidth:1
                },
                EndpointHoverStyle:{opacity: 0.8},
                ConnectionOverlays:[
                    [ "Label", { label:"关联",cssClass:"csslabel"} ]//这个是鼠标拉出来的线的属性
                    ],
            };
            
            //给做出列表每项增加端点
            _this.state.datal.map((item:any,index:number)=>{
                jsPlumb.addEndpoint([item.id],{
                    anchors: ['Right'],
                    isSource: true,
                    isTarget: true,
                    uuid: item.id,
                    maxConnections: item.target
                },common)
            });
            //给右侧列表每项设置终点
            _this.state.datar.map((item:any,index:number)=>{
                jsPlumb.addEndpoint([item.id],{
                    anchors: ['Left'],
                    isTarget: true,
                    isSource: true,
                    uuid: item.id||1,
                    maxConnections: item.target
                },common)
            });
             
            _this.state.datal.map((item:any,i:number)=>{
                if(item.targetArr){
                    item.targetArr.map((t:any)=>{   
                        _this.linkNode(item.id,t,common)
                    })
                }
            })
            // jsPlumb.addEndpoint(['l01','l02','l03','l04','l05','l06','l07','l08'], {
            //     anchors: ['Right'],
            //     isSource: true,
            // },common);
            // jsPlumb.addEndpoint(['r01','r02'], {
            //     anchors: ['Left'],
            //     isTarget: true,
            // },common);
            //设置默认连接线
            
            // jsPlumb.makeSource(['l01','l02'], {
            //     endpoint:"Dot",
            //     anchor: "Continuous"
            // })
    
            // jsPlumb.makeTarget(['r01','r02'], {
            //     endpoint:"Dot",
            //     anchor: "Continuous"
            // })

            // //可以拖动的节点
            // jsPlumb.draggable('r02')
            // jsPlumb.draggable(['l01','l02']);
            jsPlumb.bind("connection", function (connInfo:any, originalEvent:any) {
                //连线时动作
                //例如给连线添加label文字
                let conn = connInfo.connection;
                let labelText = '连接'+conn.source.innerText+'----'+conn.target.innerText;
                conn.setLabel(labelText);
                //修改数据
                _this.addLinks(conn.sourceId,conn.targetId)
            })
            jsPlumb.bind('click', function (conn:any, originalEvent:any) {
                _this.setState({
                    datal: _this.deleteLinks(conn.sourceId,conn.targetId)
                })
                // let linkId = conn.sourceId+conn.targetId;
                // _this.state.links.map((l,i)=>{
                //     if(l.id===linkId){//先判断数据中有没有，防止重复点击报错
                //         G.messager.confirm({message:'确定解除所点击的链接吗？',callback:(id:any)=>{
                //             if(id){
                //                 console.log('点击了ok')
                //                 console.log(_this.state.links)    
                //                 let links = _this.state.links.filter(o=>{o.id===linkId});
                //                 console.log(links)
                //                 _this.setState({
                //                     links
                //                 },()=>{
                //                     console.log(_this.state.links)
                //                     jsPlumb.deleteConnection(conn)
                //                 })
                //             }else{
                //                 console.log('点击了cancel')    
                //             }
                //         }});
                //     }
                // })
            });
            // 当链接建立前
            jsPlumb.bind('beforeDrop', function (info:any) {
                console.log(info)
                if (1) {
                console.log('链接会自动建立')
                return true // 链接会自动建立
                } else {
                console.log('链接取消')
                return false // 链接不会建立，注意，必须是false
                }
            })
            jsPlumb.fire();
            // setTimeout(function () {
            //     jsPlumb.connect({ uuids: ['l06', 'r01'] })
            //   }, 3000)
        })
    }
    //连接两个节点
    protected linkNode(source:any,target:any,common?:any){
        jsPlumb.connect({
            uuids: [source, target],
            anchor: ['Left', 'Right'], 
        },common)
    }
    //删除某个节点
    deleteItem(id:any,side:string){
        if(side=='left'){
            let datal=this.state.datal.filter(o=>o.id!=id)
            this.setState({
                datal
            });
        }else{
            let datar=this.state.datar.filter(o=>o.id!=id);
            //右侧的话，需要删除左侧相关的连线
            this.setState({
                datal:this.deleteLinks(null,id),
                datar
            });
        }
    }

    //删除指定连接线
    deleteLinks(s:any,t:any){
        let datal = this.state.datal;
        if(s&&t){//如果起点终点都有，即删除指定线条
            // G.messager.confirm({message:'确定解除所点击的链接吗？',callback:(id:any)=>{})
            datal = datal.map((item)=>{
               if(item.id===s){
                 item.targetArr = item.targetArr.filter((o:any)=>o!=t)
               }
               return item; 
            });
        }else if(s){//如果只有起点，即删除所有以此为起点的线
            datal = datal.map((item)=>{
                if(item.id===s){
                  item.targetArr = [];
                } 
            })
        }else if(t){//如果只有终点，即删除所有以此为终点的线
            datal = datal.map((item)=>{
                item.targetArr = item.targetArr.filter((o:any)=>o!=t);
                return item
            });
        }
        return datal;
    }

    //新增连接线
    addLinks(s:any,t:any){
        let datal = this.state.datal;
        datal.map((item:any)=>{
            
            if(s===item.id){
                item.targetArr.push(t)
            }
            //初始化的时候会重复添加 此处做去重操作
            // console.log(item.targetArr)
            // console.log(new Set(item.targetArr));
            item.targetArr = Array.from(new Set(item.targetArr));
            
        });
        // this.setState({
        //     datal
        // })
    }

    //上移
    upData(item:any,side:string){
        if(side=='left'){
            let datal = this.state.datal;
            let index = datal.indexOf(item);
            datal[index] = datal.splice(index-1,1,datal[index])[0]
            // console.log(datal);
            this.setState({
                datal
            })
        }else{
            let datar = this.state.datar;
            let index = datar.indexOf(item);
            datar[index] = datar.splice(index-1,1,datar[index])[0]
            // console.log(datar);
            this.setState({
                datar
            })
        }
    }

    //下移
    downData(item:any,side:string){
        if(side=='left'){
            let datal = this.state.datal;
            let index = datal.indexOf(item);
            datal[index] = datal.splice(index+1,1,datal[index])[0]
            this.setState({
                datal
            })
        }else{
            let datar = this.state.datar;
            let index = datar.indexOf(item);
            datar[index] = datar.splice(index+1,1,datar[index])[0]
            this.setState({
                datar
            })
        }
    }

    //移动数据
    moveData(item:any,side:any){
        if(side=='left'){//左边数据
            let datar = this.state.datar;
            // let index = datal.indexOf(item);
            // let mData:any = datal.splice(index,1)[0];
            delete item.targetArr;
            datar.push(item)
            this.deleteItem(item.id,side);//先删除左侧的;
            this.setState({
                datar
            })
        }else{
            let datal = this.state.datal;
            // let index = datal.indexOf(item);
            // let mData:any = datal.splice(index,1)[0];
            item.targetArr=[];
            datal.push(item)
            this.deleteItem(item.id,side);//先删除右侧的;
            this.setState({
                datal
            })
        }
    }

    getValue(){
        return {leftDate:this.state.datal,rightData:this.state.datar}
    }

}