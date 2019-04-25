import * as Tag from "../Tag";
import * as React from 'react';
import {Popover,Icon as AntdIcon} from 'antd';
import { default as Http} from '../../utils/http';
import Parser from '../../core/Parser';
import Link from '../basic/Link';
import ButtonGroup from "../basic/ButtonGroup";
import Button from "../basic/Button";
import * as Jsplumb from 'jsplumb'
// import { jsPlumb } from 'public/jsplumb1';
import { Control } from '../form/EditTable';
import { debug } from 'util';
// import { jsPlumb } from 'public/jsplumb1';
export declare type connector = 'Bezier' | 'Straight' | 'Flowchart';//贝塞尔曲线、直线、90度折线
export declare type linkType = 1 | 2 | 3 | 4;//1:一对一、2:一对多、3：多对一、4：多对多
export var props = {
    ...Tag.props,
    connector:GearType.Enum<connector>(),
    listWidth:GearType.Number,
    width:GearType.Number,
    showLabel:GearType.Boolean,
    title: GearType.String,
    class: GearType.String,
    url:GearType.String,
    linkType:GearType.Enum<linkType>(),
    leftTitle:GearType.String,
    rightTitle:GearType.String,
    pointRadius:GearType.Number,//短点半径
    pointColor:GearType.Any,//端点颜色
    lineColor:GearType.Any,//连接线的颜色
    lineWidth: GearType.Number,//连接线的宽的
    control:GearType.Any,
}
export interface state extends Tag.state {
    leftData:any[];
    rightData:any[];
    connector:connector,
    width?:number,
    listWidth?:string,
    linkType?:linkType,
    pointRadius?:number,
    pointColor?:any,
    lineColor?:any,
    control?:any[]
}

export default class PlumbList<P extends typeof props, S extends state> extends Tag.default<P, S> {
    constructor(...arg:any){
        super(...arg);
    };
    protected cacheData:any;//缓存数据
    
    getInitialState():state{
        return {
            leftData: [],
            rightData: [],
            connector:this.props.connector|| 'Straight',
            width:this.props.width,
            listWidth:(this.props.listWidth || 200)+'px',
            linkType:this.props.linkType||1,
            pointRadius:this.props.pointRadius || 5,
            pointColor:this.props.pointColor || "#1890ff",
            lineColor:this.props.lineColor || "#1890ff",
            control : this.props.control.split(',').length>0? this.props.control.split(','):['up','down','move','edit','delete']
        }
    }
    getProps(){
        return G.G$.extend({},this.state,{
            className:"plumblist-warp "+this.state.className
        })
    } 

    parseControl(controls:any[]){
        let controlIcons = [];
        for(let c in controls){
            switch (c) {
                case 'delete':
                    controlIcons.push(
                        <AntdIcon
                            style={{ cursor:'pointer'}}
                            type="close"
                            title="删除"
                            className={"plumb-cell-icon-delete"}
                            onClick={this.deleteItem.bind(this,item.id,side)}
                        />
                    )
                    break;
            
                default:
                    break;
            }
        }
    }

    parserList(data:any[],side:'left'|'right'){
        let list:any[]=[];
        let controlArray:any = this.state.control;
        data.map((item:any,index:number)=>{
            list.push(
                <Popover key={'pop'+item.id} placement={side}
                    content={<div className="plumb-cell-control">
                    
                        {controlArray.includes('delete')?<AntdIcon
                            style={{ cursor:'pointer'}}
                            type="close"
                            title="删除"
                            className={"plumb-cell-icon-delete"}
                            onClick={this.deleteItem.bind(this,item.id,side)}
                        />:null}
                        {controlArray.includes('delete')?<AntdIcon
                            style={{ cursor:'pointer',display:index!=0?'inline-block':'none'}}
                            type="arrow-up"
                            title="上移"
                            className={"plumb-cell-icon-up"}
                            onClick={this.upData.bind(this,item,side)}
                        />:null}
                        {controlArray.includes('down')?<AntdIcon
                            style={{ cursor:'pointer',display:index+1<data.length?'inline-block':'none'}}
                            type="arrow-down"
                            title="下移"
                            className={"plumb-cell-icon-down"}
                            onClick={this.downData.bind(this,item,side)}
                        />:null}
                        {controlArray.includes('move')?<AntdIcon
                            style={{ cursor:'pointer'}}
                            type={side=='left'?"arrow-right":'arrow-left'}
                            title={side=='left'?"右移":'左移'}
                            className={"plumb-cell-icon-rollback"}
                            onClick={this.moveData.bind(this,item,side)}
                        />:null}
                        {controlArray.includes('moveLeft') && side=='right'?<AntdIcon//只允许左移
                            style={{ cursor:'pointer'}}
                            type={'arrow-left'}
                            title={'左移'}
                            className={"plumb-cell-icon-rollback"}
                            onClick={this.moveData.bind(this,item,side)}
                        />:null}
                        {controlArray.includes('moveRight') && side=='left'?<AntdIcon//只允许右移
                            style={{ cursor:'pointer'}}
                            type={'arrow-right'}
                            title={'右移'}
                            className={"plumb-cell-icon-rollback"}
                            onClick={this.moveData.bind(this,item,side)}
                        />:null}
                        {controlArray.includes('edit')?<AntdIcon//编辑
                            style={{ cursor:'pointer'}}
                            type={'edit'}
                            title={'编辑'}
                            className={"plumb-cell-icon-edit"}
                            onClick={this.setItem.bind(this,item.id,side,'999')}
                        />:null}
                </div>}>    
                    { (item.text instanceof Array)?
                    <li className="item"  id={item.id} key={item.id}>{this.parserText(item.text)}</li>:
                    <li className="item"  id={item.id} key={item.id}>{item.text}</li>}
                </Popover>
            )
        })
        return list;
    }
    parserText(arr:any){
        let children:any[]=[];
        arr.map((item:any,index:number)=>{
            children.push(
                <span className="cell-span" key={'item_span'+index}>{item}</span>
            )
        })
        return children;
    }
    //删除某个节点的端点
    delPlumb(id:any){
        jsPlumb.remove([id])
    }
    render(){
        console.log('render')
        console.log(this.state.leftData)
        let leftData = this.state.leftData;
        let rightData = this.state.rightData;
        let props:any = this.getProps();
        delete props.listWidth;
        delete props.leftData;
        delete props.rightData;
        delete props.linkType;
        delete props.pointRadius;
        delete props.pointColor;
        delete props.lineColor;
        return <div  ref={(ele:any)=>this.ref = ele} {...props}>
            <h3>{this.props.title||'映射关系图'}</h3>
            {/*   */}
            <div className="list-warp">
                <ul id="item-left" key="left" className="list" style={{width:this.state.listWidth}}>
                    <li><h4 className="left-list-title">{this.props.leftTitle||'左侧列表'}</h4></li>
                    {leftData.length>0?this.parserList(leftData,'left'):null}
                </ul>
                <ul id="item-right" key="right" className="list" style={{width:this.state.listWidth}}>
                    <li><h4 className="right-list-title">{this.props.rightTitle||'左侧列表'}</h4></li>
                    {rightData.length>0?this.parserList(rightData,'right'):null}
                </ul>
            </div>  
        </div>
    }
   
    // afterRender(){
    //     console.log('afterRender');
    //     this.loadData();
    // }
    
    afterUpdate(){//更细数据后画点、连线
        console.log('afterupdate');
        console.log(this.state.leftData);
        console.log(this.state.rightData);
        this.dragLinks();
        // console.log(
        //     jsPlumb.getAllConnections()
        // );
        // console.log(G.G$('.jtk-endpoint'));

    }
    
    componentDidMount(){
        //初始化画点、连线
        this.loadData();
        console.log('mount');
        console.log(this.state.leftData);
       
    }

    protected loadData(){
        let p = Http.getMethod('get')(this.props.url,'json');
        if(p){
            p.then((response)=>{
                this.cacheData = response.data;
                this.setState({
                    leftData:response.data.leftData,
                    rightData:response.data.rightData
                })
            }).catch((error)=>{
                return Promise.resolve(error);
            });
        }
    }

    dragLinks(){
        let jsPlumb:any = window.jsPlumb;
        let _this = this;
        jsPlumb.ready(function () {
            // console.log(G.G$('.jtk-endpoint'))
            //jsPlumb是根据元素id取绘制，所以每次更新都需要重新绘制，所以删除所有的节点和线
            jsPlumb.deleteEveryEndpoint();//删除所有的点
            jsPlumb.deleteEveryConnection();//初始化删除所有连线
            // console.log(G.G$('.jtk-endpoint'))
            // console.log(_this.state.leftData);
            // console.log(_this.state.rightData);
            // let myJsPlumb = jsPlumb.getInstance()
           
            var common = {
                connector: [_this.state.connector],
                maxConnections: -1,
                endpointStyle: { radius : _this.state.pointRadius, fill : _this.state.pointColor},
                connectorStyle: {
                    outlineStroke: _this.state.lineColor,
                    strokeWidth:_this.props.lineWidth || 1
                },
                EndpointHoverStyle:{opacity: 0.8},
                // ConnectionOverlays:[],//这个是鼠标拉出来的线的属性
                overlays: [
                    ['Arrow', { width: 12, length: 12, location: .95 ,paintStyle: {fill: _this.state.lineColor,stroke: _this.state.lineColor}}],
                    // ["Label", {  //标签参数设置 
                    //     id: "label",
                    //     cssClass: "activeLabel", //hover时label的样式名
                    //     events: {
                    //         tap: function () {
                    //         }
                    //     },
                    //     visible: false
                    // }]
                ],
                // ReattachConnections: false,      
            };
            let sTargetMax:number,tTargetMax:number;
            switch (_this.state.linkType) {
                case 1://一对一
                    sTargetMax = 1,tTargetMax = 1
                    break;
                case 2://一对多
                    sTargetMax = 1,tTargetMax = -1
                    break;
                case 3://多对一
                    sTargetMax = -1,tTargetMax = 1
                    break;
                case 4://多对多
                    sTargetMax = -1,tTargetMax = -1
                    break;
                default:
                    break;
            }
            //给做出列表每项增加端点
            _this.state.leftData.map((item:any,index:number)=>{
                jsPlumb.addEndpoint([item.id],{
                    anchors: ['Right'],
                    isSource: true,//作为起点
                    // isTarget: true,//作为终点
                    uuid: item.id,
                    maxConnections: sTargetMax
                },common)
            });
            //给右侧列表每项设置终点
            _this.state.rightData.map((item:any,index:number)=>{
                jsPlumb.addEndpoint([item.id],{
                    anchors: ['Left'],
                    isTarget: true,
                    // isSource: true,
                    uuid: item.id||1,
                    maxConnections: tTargetMax
                },common)
            });
             
            //先解绑事件
            jsPlumb.unbind('click');
            jsPlumb.unbind('connection');
            jsPlumb.unbind('beforeDrop');
            jsPlumb.unbind('connectionDetached');

            jsPlumb.bind("connection", function (connInfo:any, originalEvent:any) {
                //连线时动作
                //例如给连线添加label文字
                let conn = connInfo.connection;
                console.log(!(_this.props.showLabel===false))
                if(!(_this.props.showLabel===false) && conn.source && conn.target){
                    let labelText = '连接'+conn.source.innerText+'----'+conn.target.innerText;
                    conn.setLabel(labelText);
                }
                //修改数据
                _this.addLinks(conn.sourceId,conn.targetId);
            })
            _this.state.leftData.map((item:any,i:number)=>{
                if(item.targetArr){
                    item.targetArr.map((t:any,i:number)=>{  
                        if(sTargetMax==1 && tTargetMax==1 && i==1){//如果只能1队1
                            _this.linkNode(item.id,t,common)
                        }else{
                            _this.linkNode(item.id,t,common)
                        }
                    })
                }
            })
             
            //连接线点击事件
            jsPlumb.bind('click', function (conn:any, originalEvent:any) {
                console.log(originalEvent);
                // G.messager.confirm({message:"确定要删除连接线吗？",callback:()=>{
                    _this.setState({
                        leftData: _this.deleteLinks(conn.sourceId,conn.targetId)
                    })
                // }})
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
            });

            // //取消连接
            // jsPlumb.bind("connectionDetached", function (conn:any, originalEvent:any) {   
            //     // return false  
            //     console.log('取消了')
            //     debugger
            //     if (conn.sourceId == conn.targetId) {      
            //         //自己连接自己时会自动取消连接      
            //     }else{      
            //         _this.setState({
            //             leftData: _this.deleteLinks(conn.sourceId,conn.targetId)
            //         })     
            //     }      
            // });
            // G.G$(document).on('mouseenter.link','.jtk-connector',function(){
            //     console.log(G.G$(this).index());
            //     console.log( G.G$(document).find('.jtk-overlay'))
            //     G.G$(document).find('.jtk-overlay').show()
            // }).on('mouseleave.link','.jtk-connector',function(){
            //     console.log(G.G$(this).index());
            //     console.log( G.G$(document).find('.jtk-overlay'))
            //     G.G$(document).find('.jtk-overlay').hide(2000)
            // })
            G.G$(document).find('.jtk-endpoint').bind('onmousedown',function(){
                return false
            })
            jsPlumb.fire();
        })
    }
    //连接两个节点
    protected linkNode(source:any,target:any,common?:any){
        jsPlumb.connect({
            uuids: [source, target],
            // anchor: ['Left', 'Right'], 
        },common)
    }
    //删除某个节点
    deleteItem(id:any,side:string){
        if(side=='left'){
            let leftData=this.state.leftData.filter(o=>o.id!=id)
            this.setState({
                leftData
            });
        }else{
            let rightData=this.state.rightData.filter(o=>o.id!=id);
            //右侧的话，需要删除左侧相关的连线
            this.setState({
                leftData:this.deleteLinks(null,id),
                rightData
            });
        }
    }

    //删除指定连接线
    deleteLinks(s:any,t:any){
        let leftData = this.state.leftData;
        if(s&&t){//如果起点终点都有，即删除指定线条
            // G.messager.confirm({message:'确定解除所点击的链接吗？',callback:(id:any)=>{})
            leftData = leftData.map((item)=>{
               if(item.id===s){
                 item.targetArr = item.targetArr.filter((o:any)=>o!=t)
               }
               return item; 
            });
        }else if(s){//如果只有起点，即删除所有以此为起点的线
            leftData = leftData.map((item)=>{
                if(item.id===s){
                  item.targetArr = [];
                } 
                return item
            })
        }else if(t){//如果只有终点，即删除所有以此为终点的线
            leftData = leftData.map((item)=>{
                item.targetArr = item.targetArr.filter((o:any)=>o!=t);
                return item
            });
        }
        console.log(leftData)
        return leftData;
    }

    //新增连接线
    addLinks(s:any,t:any){
        let cacheData = JSON.parse(JSON.stringify(this.state.leftData)); 
        let leftData = this.state.leftData;
        leftData = leftData.map((item:any)=>{
            
            if(s===item.id){
                item.targetArr.push(t)
            }
            //初始化的时候会重复添加 此处做去重操作
            item.targetArr = Array.from(new Set(item.targetArr));
            return item
            
        });
        //连线动作在afterupdate中进行，所以为避免死循环，每次setState前先判断
        let isChange:boolean = false;
        for(let i=0;i<cacheData.length;i++){
            if(cacheData[i].targetArr.length!=leftData[i].targetArr.length){
                isChange = true;
            }
        }
        console.log(this.state.leftData)
        if(isChange){
            this.setState({
                leftData
            })
        }
    }

    //上移
    upData(item:any,side:string){
        if(side=='left'){
            let leftData = this.state.leftData;
            let index = leftData.indexOf(item);
            leftData[index] = leftData.splice(index-1,1,leftData[index])[0]
            // console.log(leftData);
            this.setState({
                leftData
            })
        }else{
            let rightData = this.state.rightData;
            let index = rightData.indexOf(item);
            rightData[index] = rightData.splice(index-1,1,rightData[index])[0]
            // console.log(rightData);
            this.setState({
                rightData
            })
        }
    }

    //下移
    downData(item:any,side:string){
        if(side=='left'){
            let leftData = this.state.leftData;
            let index = leftData.indexOf(item);
            leftData[index] = leftData.splice(index+1,1,leftData[index])[0]
            this.setState({
                leftData
            })
        }else{
            let rightData = this.state.rightData;
            let index = rightData.indexOf(item);
            rightData[index] = rightData.splice(index+1,1,rightData[index])[0]
            this.setState({
                rightData
            })
        }
    }

    //移动数据
    moveData(item:any,side:any,target:number=1){//target:即移动后该节点可连接线数
        if(side=='left'){//左边数据
            let rightData = this.state.rightData;
            // let index = leftData.indexOf(item);
            // let mData:any = leftData.splice(index,1)[0];
            delete item.targetArr;
            rightData.push(item);//push到右侧
            this.deleteItem(item.id,side);//删除左侧的;
            this.setState({
                rightData
            })
        }else{
            let leftData = this.state.leftData;
            // let index = leftData.indexOf(item);
            // let mData:any = leftData.splice(index,1)[0];
            item.targetArr=[];
            leftData.push(item);//push到左侧
            this.deleteItem(item.id,side);//删除右侧的;
            this.setState({
                leftData
            })
        }
    }

    getValue(){
        return {leftDate:this.state.leftData,rightData:this.state.rightData}
    }

    setItem(id:any,side:string,text:any){//设置指定节点的值
        if(side=='left'){//如果值左侧
            let leftData = this.state.leftData;
            leftData = leftData.map((item)=>{
                if(item.id===id){
                    item.text = text;
                }
                return item
            });
            this.setState({leftData})
        }else{
            let rightData = this.state.rightData;
            rightData = rightData.map((item)=>{
                if(item.id===id){
                    item.text = text;
                }
                return item
            });
            this.setState({rightData})
        }
    }

    // onChange

    onEditItem(fun:any){
        if(fun && G.G$.isFunction(fun)) {
            this.bind("editItem",fun);
        }
    }
}