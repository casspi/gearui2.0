// /**
//  * 可编辑表格简单包装
//  */
// function EditTable(_id,_url){
	
// 	var _this = this;
	
// 	// 控件ID
// 	var id;
	
// 	var url;
	
// 	// 当前选中的行
// 	var selectedRow;
	
// 	// 当加载成功后触发的方法，包括初始化、添加行后，参数一为加载的容器，参数二为载入的节点的jdom对象
// 	var loadSuccessFun;
	
// 	// 当行被渲染后，传入参数包括当前行jdom，以及行序号
// 	var afterRowRenderFun;
	
// 	var init = function(){
// 		id = _id;
// 		url = _url;
// 	};
	
// 	var loadData = function(data){
// 		// 从后台加载数据
// 		$.ajax({
// 			url:G.util.absoluteUrl(url),
// 			data:data,
// 			method:"POST",
// 			success:function(html){
// 				var jcontent = $(html);
// 				if(data && data.operation=="init"){
// 					$("#"+id+" .tableBody table tbody").hide();
// 					$("#"+id+" .tableBody table tbody").append(jcontent);
// 					$("#"+id+" .tableBody table thead tr").hide();
// 					$("#"+id+" .tableBody table tbody").show();	
// 				}else if(data && data.operation=="add"){
// 					if(data && data.addMethod=="insert" && selectedRow){
// 						$(selectedRow).before(jcontent);
// 						// 只添加一行的情况下，渲染该行
// 						//console.log("=========>"+jcontent.filter("tr").length);
// 						if(jcontent.filter("tr").length==1)
// 							renderingRow(jcontent.filter("tr"));
// 					}else{
// 						$("#"+id+" .tableBody table tbody").append(jcontent);
// 						// 只添加一行的情况下，渲染该行
// 						//console.log("=========>"+jcontent.filter("tr").length);
// 						if(jcontent.filter("tr").length==1)
// 							renderingRow(jcontent.filter("tr"));
// 						$("#"+id+" .tableBody").scrollTop($("#"+id+" .tableBody")[0].scrollHeight);
// 					}
// 				}
				
// 				// 加载成功后，回调loadSuccess方法
// 				if(loadSuccessFun){
// 					loadSuccessFun.call(_this,data,$("#"+id+" .tableBody table tbody"),jcontent);
// 				}				
				
// 				// 重新绑定点击事件
// 				$("#"+id+" .tableBody table tbody tr").unbind("click",onSelectedEditRow);
// 				$("#"+id+" .tableBody table tbody tr").bind("click",onSelectedEditRow);
// 				// 加载完成后生成序号
// 				resetSequence();
// 			}
// 		});	
// 	};
	
// 	//当前编辑中的行的所有G对象清单
// 	var rendedGeles = [];
	
// 	// 验证当前编辑的行
// 	var validateCurrentEditRow = function(){
//         if(selectedRow && rendedGeles.length > 0) {
//         	//console.log(selectedRow);
//         	//console.log(rendedGeles[0]);
//         	//console.log(rendedGeles[0].realDom);
// 			for(var i = 0; i < rendedGeles.length; i++) {
// 				var rendedGele = rendedGeles[i];
// 				if(rendedGele.validate) {
//                     var vresult = rendedGele.validate();
//                     if(vresult == false) {
//                     	return false;
// 					}
// 				}
// 			}
//         }
//         return true;
// 	}
	
// 	// 当选中行时
// 	var onSelectedEditRow = function(){
// 		//console.log(this);
		
// //    	var tr = $(event.target);
// //    	if(tr.is("tr") == false) {
// //            tr = tr.parents("tr");
// //		}
		
// 		var tr = $(this);
// 		//console.log("=======>"+validateCurrentEditRow());
// 		//如果先前编辑的行，数据校验未通过，则不充许执行操作
// 		if(selectedRow != tr[0] && validateCurrentEditRow()==false)
// 			return;
		
// 		renderingRow(tr);
//     };
    
//     // 清除选中行的参数
//     var clearSelectRow = function(){
//     	selectedRow = null;
//     	rendedGeles = [];
//     }
    
//     // 渲染指定的行
//     var renderingRow = function(tr){
//     	if(tr.hasClass("disabledRow")==true)
//     		return;
// 		selectedRow = tr[0];
        
//         $("#"+id+" .tableBody table tbody tr").removeClass("selectedRow");
//         tr.addClass("selectedRow");
//         $("#"+id+" .tableBody table tbody tr").find(".c_input").addClass("hidden");
//         $("#"+id+" .tableBody table tbody tr").find(".c_view").removeClass("hidden");
//         //当前行是否已经渲染过了
//         if(tr.attr("editTable_render")== "true") {
//             tr.find(".c_input").removeClass("hidden");
//             tr.find(".c_view").addClass("hidden");
//             rendedGeles = tr.data("rendedGeles");
// 		}else {
// 			// 待渲染的控件数量
//             var ctypeLength = tr.find("[ctype]").length;
//             // 已渲染的控件个数
//             var rendedCtypeInTr = 0;
//             // 表单对象
//             var form = tr.parents("form");
//             var gform = G.G$(form[0]).data("vmdom");
//             //console.log(ctypeLength);
//             rendedGeles = [];
//             tr.find("[ctype]").each(function(){
//             	var __this = this;
// 				G.render({
// 					el: __this,
//                     parentAst: gform.ast,
// 					mounted: function(cele,gele) {
// 						// 获得当前渲染后的控件
// 						var gControl = gele[0];
// 						rendedGeles.push(gControl);
// 						var onChange = function(newValue){
// 							var cell = _this.getCurrentCell(gControl);
// 							var jview = cell.findJDom(".c_view");
// 							var jhidden = cell.findJDom("input.c_hidden");
// 							if(gControl instanceof G.tag.Check){
// 								//console.log(gControl.props.dataset);
// 								var dataset = gControl.props.dataset;
// 								if(dataset && dataset.checked && dataset.unChecked){
// 									if(gControl.hasChecked()){
// 										jhidden.val(dataset.checked[0]);
// 										jview.text(dataset.checked[1]);
// 									}else{
// 										jhidden.val(dataset.unChecked[0]);
// 										jview.text(dataset.unChecked[1]);
// 									}
// 								}
// 							}else{
// 								if(jview.length>0){
// 									jview.text(gControl.getText());
// 								}
// 								if(jhidden.length>0){
// 									jhidden.val(newValue);
// 								}
// 							}
// 						};
// 						if(gControl instanceof G.tag.AutoComplete){
// 							// 注册一个onChange事件
// 							gControl.onSelect(onChange);	
// 						}else{
// 							// 注册一个onChange事件
// 							gControl.onChange(onChange);
// 						}
						

// 						tr.find('.c_view').addClass("hidden");
//                         tr.find('.c_input').removeClass("hidden");   
//                         rendedCtypeInTr = rendedCtypeInTr + 1;
//                         if(rendedCtypeInTr >= ctypeLength) {
//                         	if(afterRowRenderFun){
//                         		tr.data("rendedGeles",rendedGeles);
//                         		afterRowRenderFun.call(_this,tr,tr.prevAll().length);
//                         	}
// 						}
//                         //if(rendedGeles.length>0){
//                         	//设置默认焦点时有问题，会导至autocomplete中已填写值消失
//                         	//rendedGeles[0].focus();
//                         //}
// 					}
// 				});
//             });
//             tr.attr("editTable_render","true");
// 		}
//     }
	
// 	// 重置序号
// 	var resetSequence = function(){
// 		var index = 0;
// 		$("#"+id+" .tableBody table tbody tr").each(function(){
// 			index++;
// 			$(this).find("td:first").text(index);
// 		});
// 	};
	
// 	// 加载数据
// 	_this.loadInitData = function(data){
// 		if(data){
// 			data.operation="init";
// 		}else{
// 			data = {
// 				operation:"init"	
// 			};
// 		}
// 		loadData(data);
// 	};
	
// 	// 添加行
// 	_this.addRow = function(data){
// 		if(validateCurrentEditRow()==true){
// 			if(data){
// 				data.operation="add";
// 			}else{
// 				data = {
// 					operation:"add"
// 				};
// 			}
// 			loadData(data);
// 		}else{
// 			G.messager.simple.warning('当前行填写完整后才可以继续添加！','2');
// 		}
// 	};
	
// 	// 删除行
// 	_this.deleteRow = function(confirm){
// 		if(selectedRow){
// 			if(!confirm){
// 				confirm = "你确定要删除这条记录吗？";
// 			}
// 			G.messager.confirm("系统提示",confirm,function(r){
// 				if(r){
// 					if(selectedRow){
// 						G(selectedRow).remove();
// 						clearSelectRow();
// 						// 重新生成序号
// 						resetSequence();							
// 					}
// 				}
// 			});
// 		}else{
// 			G.messager.alert('系统提示','请先选择要删除的行！');
// 		}
// 	};
	
// 	// 插入一行
// 	_this.insertRow = function(data){
// 		if(validateCurrentEditRow()==true){
// 			if(selectedRow){
// 				if(data){
// 					data.operation="add";
// 					data.addMethod="insert";
// 				}else{
// 					data = {
// 						operation:"add",
// 						addMethod:"insert"
// 					};
// 				}
// 				loadData(data);
// 			}else{
// 				G.messager.alert('系统提示','请先选择要插入的位置！');
// 			}
// 		}else{
// 			G.messager.simple.warning('当前行填写完整后才可以继续添加！','2');
// 		}
// 	};		
	
// 	// 上移一行
// 	_this.moveUp = function(){
// 		if(selectedRow){
// 			if($(selectedRow).prev().length>0){
// 				$(selectedRow).prev().before(selectedRow);
// 				resetSequence();
// 			}
// 		}else{
// 			G.messager.alert('系统提示','请先选择要上移的行！');
// 		}
// 	};	
	
// 	// 下移一行
// 	_this.moveDown = function(){
// 		if(selectedRow){
// 			if($(selectedRow).next().length>0){
// 				$(selectedRow).next().after(selectedRow);
// 				resetSequence();
// 			}
// 		}else{
// 			G.messager.alert('系统提示','请先选择要上移的行！');
// 		}
// 	};
	
// 	// 置顶
// 	_this.moveTop = function(){
// 		if(selectedRow){
// 			if($(selectedRow).prev().length>0){
// 				$(selectedRow).parent().find("tr:first").before(selectedRow);
// 				resetSequence();
// 				$("#"+id+" .tableBody").scrollTop(0);
// 			}
// 		}else{
// 			G.messager.alert('系统提示','请先选择要上移的行！');
// 		}
// 	};	
	
// 	// 置底
// 	_this.moveBottom = function(){
// 		if(selectedRow){
// 			if($(selectedRow).next().length>0){
// 				$(selectedRow).parent().find("tr:last").after(selectedRow);
// 				resetSequence();
// 				$("#"+id+" .tableBody").scrollTop($("#"+id+" .tableBody")[0].scrollHeight);
// 			}
// 		}else{
// 			G.messager.alert('系统提示','请先选择要上移的行！');
// 		}
// 	};	
	
// 	// 定义加载成功后的回调函数，不支持冒泡
// 	_this.onLoadSuccess = function(fun){
// 		loadSuccessFun = fun;
// 	}
	
// 	// 当行编辑控件渲染完成后触发，不支持冒泡
// 	_this.onAfterRowRender = function(fun){
// 		afterRowRenderFun = fun;
// 	}
	
// 	// 得到Body对象
// 	_this.getBody = function(){
// 		var jdom = $("#"+id+" .tableBody table tbody");
// 		return {
// 			// 返回当前的JQuery对象
// 			getJDom:function(){
// 				return jdom;
// 			},			
// 			// JDom为控件的JQuery对象
// 			findJDom:function(selector){
// 				return jdom.find(selector);
// 			}
// 		};
// 	}
	
// 	// 得到当前控件所在行的DOM
// 	_this.getCurrentRow = function(control){
// 		var jdom = $(control.realDom).parents("tr:first");
// 		return makeOperationObject(jdom);
// 	};
	
// 	// 得到当前控件所在列的DOM
// 	_this.getCurrentCell = function(control){
// 		var jdom = $(control.realDom).parents("td:first");
// 		return makeOperationObject(jdom);
// 	};
// 	// 得到当前选中的行
// 	_this.getSelectedRow = function(){
// 		if(selectedRow){
// 			var jdom = $(selectedRow);
// 			return makeOperationObject(jdom);
// 		}else{
// 			return null;
// 		}
// 	};
	
// 	// 得到指定行号的行
// 	_this.getRow = function(any){
// 		if(typeof any == "number"){
// 			var jdom = $("#"+id+" .tableBody table tbody tr").eq(any);
// 			return makeOperationObject(jdom);
// 		}else if(any instanceof jQuery){
// 			return makeOperationObject(any);
// 		}else if(typeof any == "object"){
// 			return makeOperationObject($(any));
// 		}else
// 			return null;
// 	};	
// 	var makeOperationObject = function(jdom){
// 		return {
// 			// 返回当前的JQuery对象
// 			getJDom:function(){
// 				return jdom;
// 			},	
// 			// 禁用行编辑
// 			disabled:function(){
// 				jdom.addClass("disabledRow");
// 			},
// 			// 启用行编辑
// 			enabled:function(){
// 				jdom.removeClass("disabledRow");
// 			},
// 			// 设置值name->控件名, value->hidden, text->view div
// 			setValue:function(name,value,text){
// 				var gdom = findGDom(jdom,"[name="+name+"Input]");
// 				if(gdom instanceof G.tag.Tag){
// 					gdom.setValue(value);
// 				}else{
// 					jdom.find("[name="+name+"Input]").attr("value",value);
// 				}
// 				jdom.find("[name="+name+"]").val(value);
// 				jdom.find("[name="+name+"Text]").text(text);
// 			},
// 			// JDom为控件的JQuery对象
// 			findJDom:function(selector){
// 				return jdom.find(selector);
// 			},
// 			// 得到序号
// 			index:function(){
// 				return jdom.index();
// 			},
// 			// GDom为GearUI的控件对象
// 			findGDom:function(selector){
// 				return findGDom(jdom,selector);
// 			}
// 		};
// 	};
	
// 	var findGDom = function(jdom,selector){
//         var index = jdom.index();
//         var geleArray = G(selector);
//         for(var i = 0; i < geleArray.length; i++) {
//         	let gele = geleArray[i];
//         	let realDom = gele.realDom;
// //        	if(realDom && $(realDom).parents('.c_input').hasClass("hidden") == false) {
// //				return gele;
// //			}
//         	var tr = $(realDom).parents('tr:first')[0];
//         	if(tr==jdom[0]){
//         		return gele;
//         	}
// 		}
//         //return G(selector)[index];
//         return null;
// 	}
	
// 	// 初始化
// 	init();
// }
import * as Tag from "../Tag";
import * as React from 'react';
import * as Http from '../../utils/http';
import * as Form from './Form';
import ParseHtml from '../../utils/ParseHtml';
import { GearUtil, UUID } from '../../utils';

export var props = {
	...Tag.props,
    url:GearType.String,
    // buttonText: GearType.String,
    // buttonIcon: GearType.String,
};
export interface state  extends Tag.state {
	theadData:any,
    dataList:any
};
export default class EditTable2<P extends typeof props, S extends state> extends Tag.default<P, S> {

	defaultRecord:any;

	getInitialState():state{
		// console.log(this.props.children);
		return G.G$.extend({},{
			theadData:this.props.children?this.filterTh(this.props.children):[],
			dataList:[]
		})
	}
	getProps(){
        return G.G$.extend({},this.state,{
			className:'edittable '+this.state.className,
            ref: (ele: any)=>{
                this.ref = ele;
            },
        })
    } 
	render (){
		let props:any = this.getProps();
		delete props.dataList;
		delete props.theadData;
		return <table {...props}>
			<thead>
					{this.parseThead(this.state.theadData)}
			</thead>
			<tbody>
				{this.state.dataList && this.state.dataList.length>0?this.parseTbody(this.state.dataList):null}
			</tbody>
		</table>
	}

	//根据children来解析出th数据
	filterTh(children:any[]){
		let childrenArr = children.filter(o=>o.props)
		childrenArr = childrenArr.map((child:any)=>{
			if(child && child.props){
				return child.props
			}
		})
		let record = {}
		for (let i in childrenArr){
			record[i['dataindex']] = null; 
		}
		this.defaultRecord = record;
		return childrenArr; 
	}

	//根据数据解析表头
	parseThead(data:any[]){
		// console.log(data)
		let thead:any[]=[];
        data.map((item:any,index:number)=>{
            thead.push(
                <td key={UUID.get()}>{item.label}</td>
            )
        })
        return <tr className="edittable-tr edittable-thead-tr">{thead}</tr>;
	}

	parseTd(thData:any[],rowData:any,rowIndex:number){
		let tdList:any[] = [];
		thData.map((props:any,index:number)=>{
			// console.log(props)
			let editProps:any = G.G$.extend({},props,{
				id: props.id + rowIndex + index,
				name: props.dataindex,
				value: rowData[props.dataindex],
				onClick: ()=>{
					console.log('click');
					return  false
				},
				onChange:(value: any,oldValue: any)=>{
					debugger;
					let data = this.state.dataList;
					data = data.map((item:any)=>{
						if(rowData.id === item.id){
							rowData[props.dataindex] = value
						};
						return item;
					})
				}
			})
			delete editProps.children;
			let editDom = GearUtil.newInstanceByType(editProps.editctype, editProps, this);
			// console.log(editDom)
			// console.log(rowData)
			tdList.push(<td width={props.width} key={"td"+rowIndex+"_"+index}>
				{rowData.editAble?<span className="td-edit">{editDom}</span>:
								<span className='td-text'>{rowData[props.dataindex]}</span>}
			</td>)
		})
		return tdList;
	}

	parseTbody(data:any[]){
		// console.log(data)
		let tbody:any[]=[];
		let thData:any = this.state.theadData;		
        data.map((item:any,index:number)=>{
            tbody.push(
                <tr key={'tobody-tr'+index} className={`edittable-tr ${item.editAble?"selected-tr":" "}`} onClick={this.selectRow.bind(this,item)}>{
					this.parseTd(thData,item,index)
				}</tr>
            )
		})
		console.log(tbody)
        return tbody;
	}

	afterRender(){
		if(this.props.url){
			let fun = async () => {
				// let result = await Http.default.post(this.props.url);
				let data = {"status":0,"data":[{"preId":"qiaogr","id":"qiaogr","nameControl":{"ctype":"text","value":"乔国瑞","required":true},"data":[{"value":"0","label":"男性"},{"value":"1","label":"女性"}],"name":"乔国瑞","mobile":"13817232524","email":"qiaogr@mail.taiji.com.cn","unitName":"公安SUB","unitId":"0101","groupName":"应用平台部","groupId":"01010101"},{"preId":"hechao","id":"hechao","nameControl":{"ctype":"text","value":"贺超","required":true},"data":[{"value":"0","label":"男性"},{"value":"1","label":"女性"}],"name":"贺超","mobile":"18621965668","email":"hechao@mail.taiji.com.cn","unitName":"公安SUB","unitId":"0101","groupName":"应用平台部","groupId":"01010101"},{"preId":"liwei","id":"liwei","nameControl":{"ctype":"text","value":"李伟","required":true},"data":[{"value":"0","label":"男性"},{"value":"1","label":"女性"}],"name":"李伟","mobile":"18916096186","email":"liweia@mail.taiji.com.cn","unitName":"公安SUB","unitId":"0101","groupName":"数据平台部","groupId":"01010102"},{"preId":"liugc","id":"liugc","nameControl":{"ctype":"text","value":"刘广仓","required":true},"data":[{"value":"0","label":"男性"},{"value":"1","label":"女性"}],"name":"刘广仓","mobile":"15821647520","email":"liugc@mail.taiji.com.cn","unitName":"公安SUB","unitId":"0101","groupName":"大项目产品线","groupId":"01010202"},{"preId":"dinglq","id":"dinglq","nameControl":{"ctype":"text","value":"丁立清","required":true},"data":[{"value":"0","label":"男性"},{"value":"1","label":"女性"}],"name":"丁立清","mobile":"18621062061","email":"dinglq@mail.taiji.com.cn","unitName":"公安SUB","unitId":"0101","groupName":"数据平台部","groupId":"01010102"},{"preId":"wangcheng","id":"wangcheng","nameControl":{"ctype":"text","value":"王诚","required":true},"data":[{"value":"0","label":"男性"},{"value":"1","label":"女性"}],"name":"王诚","mobile":"13011235742","email":"wangcheng@mail.taiji.com.cn","unitName":"公安SUB","unitId":"0101","groupName":"应用平台部","groupId":"01010101"}]};
				let mapData = data.data.map(function(item:any){
					item['editAble'] = false;
					return item;
				})
				if(true) {
					this.setState({
						dataList: mapData
					},()=>{
					
					})
				}else {
					console.log(mapData)
				}
			};
			fun();
		}


	}

	cellChange(){
		console.log()
	}

	selectRow(row:any){
		if(row.editAble){
			return 
		}
		let dataMap = this.state.dataList;
		dataMap = dataMap.map((item:any)=>{
			if(row.id===item.id){
				item.editAble = true;
			}else{
				item.editAble = false;
			}
			return item;
		})
		this.setState({
			dataList:dataMap
		})
	}

	getData(){
		return this.state.dataList;
	}


	addRow(){
		let dataSource:any = this.getData()||[];
        let dataClone:any = {};
        if(dataSource instanceof Array && dataSource.length > 0) {
            dataClone = G.G$.extend({},dataSource[dataSource.length - 1]);
        }else if(dataSource instanceof Array && dataSource.length == 0){
            dataClone = G.G$.extend({},this.defaultRecord)
        }
        for(let key in dataClone) {
            dataClone[key] = null;
		}
		// dataClone.editAble = true;
		dataClone.id = 'record_'+UUID.get()
		dataSource.push(dataClone)
		this.setState({
			dataList:dataSource
		},()=>{
			this.selectRow(dataClone)
		})
	}

	save(){
		let data = this.state.dataList;
		data = data.map((item:any)=>{
			item.editAble = false;
			return item
		});
		this.setState({
			dataList: data
		})
	}
}
// import * as React from 'react';
// import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';
import Item from '../../beans/Item';
import EditTable from './EditTable';
// console.log(InputNumber)
// const data:any[] = [];
// for (let i = 0; i < 100; i++) {
//   data.push({
//     key: i.toString(),
//     name: `Edrward ${i}`,
//     age: 32,
//     address: `London Park no. ${i}`,
//   });
// }
// const EditableContext = React.createContext();

// class EditableCell extends React.Component {
//   getInput = () => {
//     if (this.props.inputType === 'number') {
//       return <InputNumber />;
//     }
//     return <Input />;
//   };

//   renderCell = ({ getFieldDecorator }:any) => {
//     const {
//       editing,
//       dataIndex,
//       title,
//       inputType,
//       record,
//       index,
//       children,
//       ...restProps
//     } = this.props;
//     return (
//       <td {...restProps}>
//         {editing ? (
//           <Form.Item style={{ margin: 0 }}>
//             {getFieldDecorator(dataIndex, {
//               rules: [
//                 {
//                   required: true,
//                   message: `Please Input ${title}!`,
//                 },
//               ],
//               initialValue: record[dataIndex],
//             })(this.getInput())}
//           </Form.Item>
//         ) : (
//           children
//         )}
//       </td>
//     );
//   };

//   render() {
//     return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
//   }
// }

// class EditableTable extends React.Component {
//   constructor(props:any) {
//     super(props);
//     this.state = { data, editingKey: '' };
//     this.columns = [
//       {
//         title: 'name',
//         dataIndex: 'name',
//         width: '25%',
//         editable: true,
//       },
//       {
//         title: 'age',
//         dataIndex: 'age',
//         width: '15%',
//         editable: true,
//       },
//       {
//         title: 'address',
//         dataIndex: 'address',
//         width: '40%',
//         editable: true,
//       },
//       {
//         title: 'operation',
//         dataIndex: 'operation',
//         render: (text:string, record:any) => {
//           const { editingKey } = this.state;
//           const editable = this.isEditing(record);
//           return editable ? (
//             <span>
//               <EditableContext.Consumer>
//                 {form => (
//                   <a
//                     onClick={() => this.save(form, record.key)}
//                     style={{ marginRight: 8 }}
//                   >
//                     Save
//                   </a>
//                 )}
//               </EditableContext.Consumer>
//               <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
//                 <a>Cancel</a>
//               </Popconfirm>
//             </span>
//           ) : (
//             <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
//               Edit
//             </a>
//           );
//         },
//       },
//     ];
//   }

//   isEditing = record => record.key === this.state.editingKey;

//   cancel = () => {
//     this.setState({ editingKey: '' });
//   };

//   save(form, key) {
//     form.validateFields((error, row) => {
//       if (error) {
//         return;
//       }
//       const newData = [...this.state.data];
//       const index = newData.findIndex(item => key === item.key);
//       if (index > -1) {
//         const item = newData[index];
//         newData.splice(index, 1, {
//           ...item,
//           ...row,
//         });
//         this.setState({ data: newData, editingKey: '' });
//       } else {
//         newData.push(row);
//         this.setState({ data: newData, editingKey: '' });
//       }
//     });
//   }

//   edit(key) {
//     this.setState({ editingKey: key });
//   }

//   render() {
//     const components = {
//       body: {
//         cell: EditableCell,
//       },
//     };

//     const columns = this.columns.map(col => {
//       if (!col.editable) {
//         return col;
//       }
//       return {
//         ...col,
//         onCell: record => ({
//           record,
//           inputType: col.dataIndex === 'age' ? 'number' : 'text',
//           dataIndex: col.dataIndex,
//           title: col.title,
//           editing: this.isEditing(record),
//         }),
//       };
//     });

//     return (
//       <EditableContext.Provider value={this.props.form}>
//         <Table
//           components={components}
//           bordered
//           dataSource={this.state.data}
//           columns={columns}
//           rowClassName="editable-row"
//           pagination={{
//             onChange: this.cancel,
//           }}
//         />
//       </EditableContext.Provider>
//     );
//   }
// }

// const EditableFormTable = Form.create()(EditableTable);

// // ReactDOM.render(<EditableFormTable />, mountNode);