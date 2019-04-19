import * as Tag from "../Tag";
import * as React from 'react';
import {Popover,Icon as AntdIcon} from 'antd'
import Parser from '../../core/Parser';
import Link from '../basic/Link';
// import * as Jsplumb from 'jsplumb
export declare type connector = 'Bezier' | 'Straight' | 'Flowchart';//贝塞尔曲线、直线、90度折线
export var props = {
    ...Tag.props,
    connector:GearType.Enum<connector>(),
    listWidth:GearType.Number,
    width:GearType.Number
}
export interface state extends Tag.state {
    datal:any[];
    datar:any[];
    connector:connector,
    links:any[],
    width?:number

}

export default class PlumbList<P extends typeof props, S extends state> extends Tag.default<P, S> {
    constructor(...arg:any){
        super(...arg);
    }
    getInitialState():state{
        return {
            datal: [
                {
                    key:'l01',
                    text:'item01',
                    target:2,
                    targetArr:['r01','r02']
                },{
                    key:'l02',
                    text:'item02',
                    target:1    
                },
                {
                    key:'l03',
                    text:'item01',
                    target:1
                },{
                    key:'l04',
                    text:'item02',
                    target:1    
                }, {
                    key:'l05',
                    text:'item01',
                    target:1
                },{
                    key:'l06',
                    text:'item02',
                    target:1    
                }, {
                    key:'l07',
                    text:'item01',
                    target:1
                },{
                    key:'l08',
                    text:'item02',
                    target:1    
                },{
                    key:'l09',
                    text:'item01',
                    target:1
                },{
                    key:'l10',
                    text:'item02',
                    target:1    
                },
                {
                    key:'l11',
                    text:'item01',
                    target:1
                },{
                    key:'l12',
                    text:'item02',
                    target:1    
                }
            ],
            datar:[
                {
                    key:'r01',
                    text:'item01'
                },{
                    key:'r02',
                    text:'item02'    
                },{
                    key:'r03',
                    text:'item03'
                },{
                    key:'r04',
                    text:'item04'    
                },{
                    key:'r05',
                    text:'item05'
                },{
                    key:'r06',
                    text:'item06'    
                },{
                    key:'r07',
                    text:'item07'
                },{
                    key:'r08',
                    text:'item08'    
                }
            ],
            connector:this.props.connector|| 'Straight',
            width:this.props.width,
            links:[{id:'l03r01',s:'l03',t:'r01'}]
        }
    }
    getProps(){
        return G.G$.extend({},this.state,{
            className:"plumblist-warp"
        })
    }
    parserList(data:any[],p:'left'|'right'='right'){
        let list:any[]=[];
        data.map((item:any)=>{
            list.push(
                <Popover key={'pop'+item.key} placement={p}
                    content={<div className="editable-cell-control">
                        <AntdIcon
                            style={{ cursor:'pointer'}}
                            type="close"
                            title="保存"
                            className={"editable-cell-icon-save"}
                            onClick={this.clickEvent.bind(this,item.key)}
                        />
                </div>}>    
                    <li className="item" onClick={this.clickEvent.bind(this,item.key)} key={item.key} id={item.key}>{item.text}</li>
                </Popover>
            )
        })
        return list;
    }
    //删除某个节点
    clickEvent(key:any){
        this.delPlumb(key)
        //为了同步数据，再次更新数据????
        let datal=this.state.datal.filter(o=>o.key!=key)
        // console.log(datal)
        // this.setState({
        //     datal
        // });
    }
    //删除某个节点的端点
    delPlumb(key:any){
        console.log(key)
        jsPlumb.remove([key])
    }
    render(){
        let data = this.state.datal;
        let data1 = this.state.datar;
        this.dragLinks()
        return <div {...this.getProps()}>
            <h3 onClick={this.clickEvent.bind(this)}>关系图</h3>
            <div className="list-warp">
                <ul id="item-left" key="left" className="list" style={{width:this.props.listWidth}}>
                    {this.parserList(data,'left')}
                </ul>
                <ul id="item-right" key="right" className="list" style={{marginLeft:"200px",width:this.props.listWidth}}>
                    {this.parserList(data1,'right')}
                </ul>
            </div>  
        </div>
    }
    afterRender(){
        
    }
    // afterUpdate(){
    //     this.dragLinks()
    // }
    dragLinks(){
        let jsPlumb = window.jsPlumb;
        let _this = this;
        jsPlumb.ready(function () {
            // jsPlumb.connect({
            //   source: 'l01',
            //   target: 'r02',
            //   endpoint: 'Dot',
            //   overlays: [ ['Arrow', { width: 12, length: 12, location: 0.5 }] ]
            // });
            var common = {
                connector: [_this.state.connector],
                maxConnections: -1,
                endpointStyle: { radius : 6, fill : "#1890ff" },
                connectorStyle: {
                    outlineStroke: '#1890ff',
                    strokeWidth:1
                }
            }
            //给做出列表每项增加端点
            _this.state.datal.map((item:any,index:number)=>{
                jsPlumb.addEndpoint([item.key],{
                    anchors: ['Right'],
                    isSource: true,
                    uuid: item.key,
                    maxConnections: item.target
                },common)
            });
            //给右侧列表每项设置终点
            _this.state.datar.map((item:any,index:number)=>{
                jsPlumb.addEndpoint([item.key],{
                    anchors: ['Left'],
                    isTarget: true,
                    uuid: item.key||1,
                    maxConnections: item.target
                },common)
            });
             
            _this.state.datal.map((item:any,i:number)=>{
                if(item.targetArr){
                    item.targetArr.map((t:any)=>{   
                        _this.linkNode(item.key,t,common)
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
            // jsPlumb.draggable(['l01','l02'])
            let timer:any = null;
            jsPlumb.bind('click', function (conn:any, originalEvent:any) {
                let linkId = conn.sourceId+conn.targetId;
                _this.state.links.map((l,i)=>{
                    if(l.id===linkId){//先判断数据中有没有，防止重复点击报错
                        G.messager.confirm({message:'确定解除所点击的链接吗？',callback:(key:any)=>{
                            if(key){
                                console.log('点击了ok')
                                console.log(_this.state.links)    
                                let links = _this.state.links.filter(o=>{o.id===linkId});
                                console.log(links)
                                debugger;
                                _this.setState({
                                    links
                                },()=>{
                                    console.log(_this.state.links)
                                    jsPlumb.deleteConnection(conn)
                                })
                            }else{
                                console.log('点击了cancel')    
                            }
                        }});
                    }
                })
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
            // setTimeout(function () {
            //     jsPlumb.connect({ uuids: ['l06', 'r01'] })
            //   }, 3000)
        })
    }
    //连接两个节点
    linkNode(source:any,target:any,common?:any){
        jsPlumb.connect({
            uuids: [source, target],
            anchor: ['Left', 'Right'], 
        },common)
    }

}