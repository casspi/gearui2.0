
import * as Tag from "../Tag";
import * as React from 'react';
import * as Http from '../../utils/http';
import ParseHtml from '../../utils/ParseHtml';
import { GearUtil, UUID } from '../../utils';

export var props = {
	...Tag.props,
	url:GearType.String,
	loadSuccess:GearType.Function,
    // buttonText: GearType.String,
    // buttonIcon: GearType.String,
};
export interface state  extends Tag.state {
	theadData?:any,
};
export default class EditTable2<P extends typeof props, S extends state> extends Tag.default<P, S> {
	// 当前选中的行
	selectedRow:any;

	//当前编辑中的行的所有G对象清单
	rendedGeles = [];

	// 当加载成功后触发的方法，包括初始化、添加行后，参数一为加载的容器，参数二为载入的节点的jdom对象
	loadSuccessFun:Function;
	// 当行被渲染后，传入参数包括当前行jdom，以及行序号
	afterRowRenderFun:Function;

	getInitialState():state{
		// console.log(this.props.children);
		return G.G$.extend({},{
		})
	}

	getProps(){
        return G.G$.extend({},this.state,{
			
            ref: (ele: any)=>{
                this.ref = ele;
            },
        })
	} 
	
	render (){
		console.log(this.props)
		let props:any = this.getProps();
		
		return <div {...props}>
			{props.children}
		</div>
	}

	afterRender(){
		this.loadInitData()
	}

	// 加载数据
	loadInitData (data?:any){
		if(data){
			data.operation="init";
		}else{
			data = {
				operation:"init"	
			};
		}
		this.loadData(data);
	};

	private loadData(data:any){
		console.log(G.util.absoluteUrl(this.props.url))
		// Http.default.get(this.props.url).then((e)=>{
		// 		console.log(e.data)
		// })
		let html = `<tr class="bodytr" >
		<td width="40" class="bodytd sequencetd"></td>
		<td width="200" class="bodytd" >
		<div class="c_input hidden" >
		<span  ctype="autocomplete"  name="fieldCodeInput"  value="{&quot;text&quot;:&quot;TJ00000665(主机HOST)&quot;,&quot;value&quot;:&quot;TJ00000665&quot;}" async="true" width="180" mustMatch="true" url="DIC_DATA_ITEM" required="true" url="/dictionary/query?type=DIC_DATA_ITEM" onSelect="onSelectFieldCode(this,...arguments)" ></span>
		</div>
		<input name="fieldCode" type="hidden" value="TJ00000665" class="c_hidden" />
		<div name="fieldCodeText" style="width:180px" class="c_view" >
		<span  name="fieldCodeLabel"  ctype="label" url="DIC_DATA_ITEM" >TJ00000665(主机HOST)</span>
		</div>
		</td>
		<td width="180" class="bodytd" >
		<div class="c_input hidden" >
		<input  ctype="text"  name="fieldNameInput"  value="主机HOST" width="170" required="true" />
		</div>
		<div name="fieldNameText" style="width:170px;" class="c_view" >主机HOST</div>
		<input name="fieldName" type="hidden" value="主机HOST" class="c_hidden" />
		</td>
		<td width="70" class="bodytd" >
		<div name="fieldTypeText" style="width:45px;" >字符型</div>
		<input name="fieldType" type="hidden" value="字符型" class="c_hidden" />
		</td>
		<td width="40" class="bodytd" >
		<div name="fieldLengthText" style="width:45px;" >256</div>
		<input name="fieldLength" type="hidden" value="256" class="c_hidden" />
		</td>
		<td width="180" class="bodytd" >
		<div class="c_input hidden" >
		
		</div>
		<input name="dataType" type="hidden" value="" class="c_hidden" />
		<div name="dataTypeText" style="width:170px" class="c_view" >
		<span  ctype="label" url="DIC_DEFAULT_VALUE_TYPE" ></span>
		</div>
		</td>
		<td width="130" class="bodytd" >
		<div class="c_input hidden" >
		<input  ctype="text"  name="defaultValueInput" readonly="true" width="120" class="readonlyInput" />
		</div>
		<input name="defaultValue" type="hidden" value="" class="c_hidden" />
		<div name="defaultValueText" style="width:120px" class="c_view" ></div>
		</td>
		<td width="40" class="bodytd" >
		<div class="c_input hidden" >
		<span  ctype="check"  name="isRequiredCheck"  value="1" checked="false" dataset="{unChecked:[&#39;0&#39;,&#39;否&#39;],checked:[&#39;1&#39;,&#39;是&#39;]}" ></span>
		</div>
		<input name="isRequired" type="hidden" value="0" class="c_hidden" />
		<div name="isRequiredText" class="c_view" >否</div>
		</td>
		<td width="40" class="bodytd" >
		<div class="c_input hidden" >
		<span  ctype="check"  name="isSearchCheck"  value="1" checked="false" dataset="{unChecked:[&#39;0&#39;,&#39;否&#39;],checked:[&#39;1&#39;,&#39;是&#39;]}" ></span>
		</div>
		<input name="isSearch" type="hidden" value="0" class="c_hidden" />
		<div name="isSearchText" class="c_view" >否</div>
		</td>
		<td width="40" class="bodytd" >
		<div class="c_input hidden" >
		<span  ctype="check"  name="isControlCheck"  value="1" checked="false" dataset="{unChecked:[&#39;0&#39;,&#39;否&#39;],checked:[&#39;1&#39;,&#39;是&#39;]}" ></span>
		</div>
		<input name="isControl" type="hidden" value="0" class="c_hidden" />
		<div name="isControlText" class="c_view" >否</div>
		</td>
		<td width="0" class="bodytd" >
		<input name="isDelete" type="hidden" value="2" />
		</td>
		<td width="0" class="bodytd" >
		<input name="referenceCount" type="hidden" value="0" />
		</td>
		</tr>`
		let _html = html;
		var jcontent = G.G$(_html);
		if(data && data.operation=="init"){
			console.log(this)
			console.log(this.realDom)
			// this.realDom.firstElementChild()
			G.G$(this.realDom).find(".tableBody table tbody").hide();
			console.log(G.G$(this.realDom).find(".tableBody table tbody"));
			G.G$(this.realDom).find(".tableBody table tbody").append(jcontent);
			G.G$(this.realDom).find(".tableBody table thead tr").hide();
			G.G$(this.realDom).find(".tableBody table tbody").show();	
		}else if(data && data.operation=="add"){
			if(data && data.addMethod=="insert" && this.selectedRow){
				G.G$(this.selectedRow).before(jcontent);
				// 只添加一行的情况下，渲染该行
				//console.log("=========>"+jcontent.filter("tr").length);
				if(jcontent.filter("tr").length==1)
					this.renderingRow(jcontent.filter("tr"));
			}else{
				G.G$(this.realDom).find(".tableBody table tbody").append(jcontent);
				// 只添加一行的情况下，渲染该行
				console.log(jcontent.filter("tr"))
				//console.log("=========>"+jcontent.filter("tr").length);
				if(jcontent.filter("tr").length==1)
					this.renderingRow(jcontent.filter("tr"));
					G.G$(this.realDom).find(".tableBody").scrollTop(G.G$(this.realDom).find(".tableBody")[0].scrollHeight);
			}
		}
		// 加载成功后，回调loadSuccess方法
		if(this.loadSuccessFun){
			// debugger
			this.loadSuccessFun.call(this,data,G.G$(this.realDom).find(".tableBody table tbody"),jcontent);
		}				
		// 重新绑定点击事件
		G.G$(this.realDom).find(".tableBody table tbody tr").unbind("click",this.onSelectedEditRow);
		//鼠标点击伴随事件：若rowUnClick为true则行数据不可修改
		if(!data.rowUnClick){
			// console.log(G.G$(this.realDom).html())
			// console.log(G.G$(this.realDom).find(".tableBody table tbody tr"))	
			G.G$(this.realDom).find(".tableBody table tbody tr").bind("click",this,this.onSelectedEditRow);
		}
		
		// //给批量操作框添全选和单选事件
		// $("#"+id+" .batchtd input[name='checkall']").click(function(){
		// 	if(this.checked){
		// 		$("#"+id+" .batchtd input[name='batchid']").prop('checked',true);
		// 	}else{
		// 		$("#"+id+" .batchtd input[name='batchid']").prop('checked',false);
		// 	}
		// })
		// $("#"+id+" .batchtd input[name='batchid']").click(function(){
		// 	if(this.checked ==false){
		// 		$("#"+id+" .batchtd input[name='checkall']").prop('checked',false);
		// 	}else{
		// 		var count = $("#"+id+" .batchtd input[name='batchid']:checked").length;
		// 		//console.log(count);
		// 		//console.log($("#"+id+" .batchtd input[name='batchid']").length);
		// 		if($("#"+id+" .batchtd input[name='batchid']").length===count){
		// 			$("#"+id+" .batchtd input[name='checkall']").prop('checked',true);
		// 		}
		// 	}
		// })
		
		// 加载完成后生成序号
		this.resetSequence();
	} 

	// 验证当前编辑的行
	validateCurrentEditRow (){
		console.log(this.selectedRow)
		if(this.selectedRow && this.rendedGeles!= undefined && this.rendedGeles.length > 0) {
			//console.log(selectedRow);
			//console.log(rendedGeles[0]);
			//console.log(rendedGeles[0].realDom);
			for(var i = 0; i < this.rendedGeles.length; i++) {
				var rendedGele:any = this.rendedGeles[i];
				if(rendedGele.validate) {
					console.log(rendedGele)
					var vresult = rendedGele.validate();
					if(vresult == false) {
						return false;
					}
				}
			}
		}
		return true;
	}

	// 当选中行时
	onSelectedEditRow (e:any){
		let _this = e.data;
		
		var tr = G.G$(this);
		//console.log("=======>"+validateCurrentEditRow());
		console.log(_this.selectedRow)
		console.log(tr[0])
		console.log(_this.selectedRow != tr[0] && _this.validateCurrentEditRow() == false)
		//如果先前编辑的行，数据校验未通过，则不充许执行操作
		if(_this.selectedRow != tr[0] && _this.validateCurrentEditRow() == false){
			G.messager.simple.warning('请先完成当前行的编辑！');
			return;
		}
		_this.renderingRow(tr);
    };

	// 清除选中行的参数
	clearSelectRow = function(){
		this.selectedRow = null;
		this.rendedGeles = [];	
	}

	// 渲染指定的行
    renderingRow = function(tr:any){
		const edittable2 = this; 
    	if(tr.hasClass("disabledRow")==true)
    		return;
		this.selectedRow = tr[0];
        
        G.G$(this.realDom).find(".tableBody table tbody tr").removeClass("selectedRow");
        tr.addClass("selectedRow");
        G.G$(this.realDom).find(".tableBody table tbody tr").find(".c_input").addClass("hidden");
        G.G$(this.realDom).find(".tableBody table tbody tr").find(".c_view").removeClass("hidden");
        //当前行是否已经渲染过了
        if(tr.attr("editTable_render")== "true") {
            tr.find(".c_input").removeClass("hidden");
            tr.find(".c_view").addClass("hidden");
            this.rendedGeles = tr.data("rendedGeles");
		}else {
			// 待渲染的控件数量
            var ctypeLength = tr.find("[ctype]").length;
            // 已渲染的控件个数
            var rendedCtypeInTr = 0;
            // 表单对象
            var form = tr.parents("form");
            var gform:any = G.G$(form[0]).data("vmdom");
            //console.log(ctypeLength);
            this.rendedGeles = [];
            tr.find("[ctype]").each(function(){
            	var __this = this;
				G.render({
					el: __this,
                    parentAst: gform.ast,
					mounted: function(cele:any,gele:any) {
						// 获得当前渲染后的控件
						var gControl = gele[0];
						edittable2.rendedGeles.push(gControl);
						var onChange = function(newValue:any){
							var cell = edittable2.getCurrentCell(gControl);
							var jview = cell.findJDom(".c_view");
							var jhidden = cell.findJDom("input.c_hidden");
							if(gControl instanceof G.tag.Check){
								//console.log(gControl.props.dataset);
								var dataset = gControl.props.dataset;
								if(dataset && dataset.checked && dataset.unChecked){
									if(gControl.hasChecked()){
										jhidden.val(dataset.checked[0]);
										jview.text(dataset.checked[1]);
									}else{
										jhidden.val(dataset.unChecked[0]);
										jview.text(dataset.unChecked[1]);
									}
								}
							}else{
								if(jview.length>0){
									jview.text(gControl.getText?gControl.getText():gControl.getValue());
								}
								if(jhidden.length>0){
									jhidden.val(newValue);
								}
							}
						};
						if(gControl instanceof G.tag.AutoComplete){
							// 注册一个onChange事件
							gControl.onSelect(onChange);	
						}else{
							// 注册一个onChange事件
							gControl.onChange(onChange);
						}
						

						tr.find('.c_view').addClass("hidden");
                        tr.find('.c_input').removeClass("hidden");   
                        rendedCtypeInTr = rendedCtypeInTr + 1;
                        if(rendedCtypeInTr >= ctypeLength) {
                        	if(edittable2.afterRowRenderFun){
								edittable2.afterRowRenderFun.call(edittable2,tr,tr.prevAll().length);
                        	}
							// console.log(tr.data("rendedGeles"))
							tr.data("rendedGeles",edittable2.rendedGeles);
						}
                        //if(rendedGeles.length>0){
                        	//设置默认焦点时有问题，会导至autocomplete中已填写值消失
                        	//rendedGeles[0].focus();
                        //}
					}
				});
			});
			console.log(this.rendedGeles)
            tr.attr("editTable_render","true");
		}
	}
	
	getCurrentCell = function(control:any){
		var jdom = G.G$(control.realDom).parents("td:first");
		return this.makeOperationObject(jdom);
	};

	makeOperationObject = (jdom:any)=>({
			// 返回当前的JQuery对象
			getJDom:function(){
				return jdom;
			},	
			// 禁用行编辑
			disabled:function(){
				jdom.addClass("disabledRow");
			},
			// 启用行编辑
			enabled:function(){
				jdom.removeClass("disabledRow");
			},
			// 设置值name->控件名, value->hidden, text->view div
			setValue:(name:string,value:string,text:string)=>{
				//设置控件的值
				var gdom = this.findGDom(jdom,"[name="+name+"Input]");
				if(gdom instanceof G.tag.Tag){
					gdom.setValue(value);
				}else{
					jdom.find("[name="+name+"Input]").attr("value",value);
				}
				//设置隐藏的值
				jdom.find("[name="+name+"]").val(value);
				//设置非编辑状态的值
				jdom.find("[name="+name+"Text]").realDom.innerText = text;
			},
			// JDom为控件的JQuery对象
			findJDom:function(selector:any){
				console.log(jdom)
				return jdom.find(selector);
			},
			// 得到序号
			index:function(){
				return jdom.index();
			},
			// GDom为GearUI的控件对象
			findGDom:(selector:any)=>{
				return this.findGDom(jdom,selector);
			}
		
	});

	findGDom (jdom:any,selector:string){
        // var index = jdom.index();
		var geleArray = G.$(selector);
		console.log(selector)
        for(var i = 0; i < geleArray.length; i++) {
        	let gele = geleArray[i];
        	let realDom = gele.realDom;
//        	if(realDom && $(realDom).parents('.c_input').hasClass("hidden") == false) {
//				return gele;
//			}
        	var tr = G.G$(realDom).parents('tr:first')[0];
        	if(tr==jdom[0]){
        		return gele;
        	}
		}
        //return G(selector)[index];
        return null;
	}

	// 重置序号
	resetSequence = function(){
		let index = 0;
		console.log(this.find(".tableBody table tbody tr"))
		this.find(".tableBody table tbody tr").each(function(){
			index++;
			G.G$(this).find("td.sequencetd").text(index);
		});
	};

	//清空列表
	clear = function(){
		this.rendedGeles = [];
		this.selectedRow = null;
		G.G$(this.realDom).find(".tableBody table tbody").empty();
	}

	// 添加行
	addRow (data:any){
		if(this.validateCurrentEditRow()==true){
			if(data){
				data.operation="add";
			}else{
				data = {
					operation:"add"
				};
			}
			this.loadData(data);
		}else{
			G.messager.simple.warning('当前行填写完整后才可以继续添加！');
		}
	};

	// 删除行
	deleteRow (confirm:any){
		if(this.selectedRow){
			if(!confirm){
				confirm = "你确定要删除这条记录吗？";
			}
			G.messager.confirm("系统提示",confirm,(r:boolean)=>{
				if(r){
					if(this.selectedRow){
						G.$(this.selectedRow).remove();
						this.clearSelectRow();
						// 重新生成序号
						this.resetSequence();							
					}
				}
			});
		}else{
			G.messager.alert('系统提示','请先选择要删除的行！');
		}
	};

	// 插入一行
	insertRow (data:any){
		if(this.validateCurrentEditRow()==true){
			if(this.selectedRow){
				if(data){
					data.operation="add";
					data.addMethod="insert";
				}else{
					data = {
						operation:"add",
						addMethod:"insert"
					};
				}
				this.loadData(data);
			}else{
				G.messager.alert('系统提示','请先选择要插入的位置！');
			}
		}else{
			G.messager.simple.warning('当前行填写完整后才可以继续添加！');
		}
	};

	// 上移一行
	moveUp (){
		if(this.selectedRow){
			if(G.G$(this.selectedRow).prev().length>0){
				G.G$(this.selectedRow).prev().before(this.selectedRow);
				this.resetSequence();
			}
		}else{
			G.messager.alert('系统提示','请先选择要上移的行！');
		}
	};			
		
	// 下移一行
	moveDown (){
		if(this.selectedRow){
			if(G.G$(this.selectedRow).next().length>0){
				G.G$(this.selectedRow).next().after(this.selectedRow);
				this.resetSequence();
			}
		}else{
			G.messager.alert('系统提示','请先选择要下移的行！');
		}
	};

	// 置顶
	moveTop (){
		if(this.selectedRow){
			if(G.G$(this.selectedRow).prev().length>0){
				G.G$(this.selectedRow).parent().find("tr:first").before(this.selectedRow);
				this.resetSequence();
				G.G$(this.realDom).find(".tableBody").scrollTop(0);
			}
		}else{
			G.messager.alert('系统提示','请先选择要置顶的行！');
		}
	};	
	
	// 置底
	moveBottom = function(){
		if(this.selectedRow){
			if(G.G$(this.selectedRow).next().length>0){
				G.G$(this.selectedRow).parent().find("tr:last").after(this.selectedRow);
				this.resetSequence();
				G.G$(this.realDom).find(".tableBody").scrollTop(G.G$(this.realDom).find(".tableBody")[0].scrollHeight);
			}
		}else{
			G.messager.alert('系统提示','请先选择要置底的行！');
		}
	};	

	//获取批量操作数据
	getBatchActionData(){
		var batchData:any = {};
		batchData.checkedAll = "no";
		if(G.G$(".batchtd input[name='checkall']:checked").length===1){
			batchData.checkedAll = "yes";
		}
		if(batchData.checkedAll === "no"){
			batchData.batchids = []
			G.G$(".batchtd input[name='batchid']").each(function(){
				if(this.checked){
					batchData.batchids.push($(this).val());
				}
			})
		}
		if(pid){
			var p = G.$("#"+pid);
			if(p.length>0){
				batchData.currentPage = p.getCurrent();
				batchData.pageSize = p.getPageSize();
			}
		}
		return batchData;
	}

	// 定义加载成功后的回调函数，不支持冒泡
	onLoadSuccess(fun:Function){
		this.loadSuccessFun = fun;
	}
	
	// 当行编辑控件渲染完成后触发，不支持冒泡
	onAfterRowRender (fun:Function){
		this.afterRowRenderFun = fun;
	}

	// 得到Body对象
	getBody (){
		var jdom = G.G$(".tableBody table tbody");
		return {
			// 返回当前的JQuery对象
			getJDom:function(){
				return jdom;
			},			
			// JDom为控件的JQuery对象
			findJDom:function(selector:any){
				return jdom.find(selector);
			}
		};
	}
	
	// 得到当前控件所在行的DOM
	getCurrentRow (control:any){
		var jdom = G.G$(control.realDom).parents("tr:first");
		return this.makeOperationObject(jdom);
	};

	// 得到当前选中的行
	getSelectedRow (){
		if(this.selectedRow){
			var jdom = G.$(this.selectedRow);
			return this.makeOperationObject(jdom);
		}else{
			return null;
		}
	};

	// 得到指定行号的行
	getRow (any:any){
		if(typeof any == "number"){
			G.G$(this.realDom).find
			var jdom = G.G$(this.realDom).find(".tableBody table tbody tr").eq(any);
			return this.makeOperationObject(jdom);
		}else if(any instanceof jQuery){
			return this.makeOperationObject(any);
		}else if(typeof any == "object"){
			return this.makeOperationObject(G.$(any));
		}else
			return null;
	};	
}
