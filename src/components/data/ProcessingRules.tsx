import * as Tag from "../Tag";
import * as React from 'react';
import * as Button from '../basic/Button';
import {Popover,Icon as AntdIcon,Select,Spin as AntdSpin} from 'antd';
import { default as Http} from '../../utils/http';
import UUID from '../../utils/uuid';
export declare type connector = 'Bezier' | 'Straight' | 'Flowchart';//贝塞尔曲线、直线、90度折线
export var props = {
    ...Tag.props,
    lineColor:GearType.String,
    connector:GearType.Enum<connector>(),
    rightListWidth:GearType.Number,
    url:GearType.String

}
export interface state extends Tag.state {
    loading:boolean,
    lineColor:string,
    url:string,
    ruleData:[],
}

export default class ProcessingRules<P extends typeof props, S extends state> extends Tag.default<P, S> {
   
    protected cacheData:any;//缓存数据
    
    getInitialState():state{
        return {
            loading: true,
            lineColor: this.props.lineColor,
            url: this.props.url || "",
            ruleData: [],
            
        }
    }

    getProps(){
        return G.G$.extend({},this.state,{
            className: "processing-rules-warp "+ this.state.className,
            ref: (ele: any)=>{
                this.ref = ele;
            },
        })
    } 

    
    render(){
        let props:any = this.getProps();
        delete props.lineColor;
        delete props.loading;
        delete props.url;
        delete props.ruleData;
        return <div {...props}>
               <AntdSpin spinning={this.state.loading} style={{"minHeight":"21px"}} delay={100}>
               {this.parserChildren()}
               </AntdSpin>
        </div>
    }

    afterRender(){
        this.loadData()
    }
    
    parserChildren(){
        return <div>
            {this.parserRules()}
            <a className="process-add-rule">+创建规则</a>
        </div>
    }

    parserRules(){
        let list:any[] = [];
        let ruleData:any = this.state.ruleData;
        let setLabel = (status:any)=>{
            let label = "";
            switch (status) {
                case "01":
                    label = "暂存";
                    break;
                case "02":
                    label = "下发中";
                    break;
                case "03":
                    label = "已下发";
                    break;
                case "04":
                    label = "撤销中";
                    break;
                case "05":
                    label = "已撤销";
                    break;
                default:
                    break;
            }
            return label
        }
        let setButton = (status:any)=>{
            let button:any;
            // switch (status) {
            //     case '01':
            //         button = <Button.default></Button.default>
            //         break;
            //     default:
            //         button =
            //         break;
            // }
        }
        ruleData.map((item:any,index:number)=>{
            console.log(item)
            list.push(<li className="rule-list-item" key={'rule-' + index}>
            {<span className={"rule-text"}>
                {item.title}
                <span className={"rule-text-label rule-text-label"+item.status}>{
                   setLabel(item.status)
                }</span>
            </span>}{setButton(item.status)}
            </li>)
        })
        return ruleData.length>0? <ul className="rule-list">
            {list}
        </ul> : null
    }

    protected loadData(){
        console.log(this.state.url)
        let p = Http.getMethod('get')(this.state.url,'json');
        console.log(p)
        if(p){
            p.then((response)=>{
                let resData = response.data;
                console.log(resData);
                this.setState({
                    ruleData:resData,
                    loading:false
                })
            }).catch((error)=>{
                this.setState({
                    loading:false
                })
                return Promise.resolve(error);
            });
        }
    }

    afterUpdate(){
        
    }
    
    componentDidMount(){
        super.componentDidMount()
        
    }

    
}