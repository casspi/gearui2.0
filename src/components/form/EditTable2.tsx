/**
 * 可编辑表格简单包装
 */
function EditTable(_id,_url){
	
	var _this = this;
	
	// 控件ID
	var id;
	
	var url;
	
	// 当前选中的行
	var selectedRow;
	
	// 当加载成功后触发的方法，包括初始化、添加行后，参数一为加载的容器，参数二为载入的节点的jdom对象
	var loadSuccessFun;
	
	// 当行被渲染后，传入参数包括当前行jdom，以及行序号
	var afterRowRenderFun;
	
	var init = function(){
		id = _id;
		url = _url;
	};
	
	var loadData = function(data){
		// 从后台加载数据
		$.ajax({
			url:G.util.absoluteUrl(url),
			data:data,
			method:"POST",
			success:function(html){
				var jcontent = $(html);
				if(data && data.operation=="init"){
					$("#"+id+" .tableBody table tbody").hide();
					$("#"+id+" .tableBody table tbody").append(jcontent);
					$("#"+id+" .tableBody table thead tr").hide();
					$("#"+id+" .tableBody table tbody").show();	
				}else if(data && data.operation=="add"){
					if(data && data.addMethod=="insert" && selectedRow){
						$(selectedRow).before(jcontent);
						// 只添加一行的情况下，渲染该行
						//console.log("=========>"+jcontent.filter("tr").length);
						if(jcontent.filter("tr").length==1)
							renderingRow(jcontent.filter("tr"));
					}else{
						$("#"+id+" .tableBody table tbody").append(jcontent);
						// 只添加一行的情况下，渲染该行
						//console.log("=========>"+jcontent.filter("tr").length);
						if(jcontent.filter("tr").length==1)
							renderingRow(jcontent.filter("tr"));
						$("#"+id+" .tableBody").scrollTop($("#"+id+" .tableBody")[0].scrollHeight);
					}
				}
				
				// 加载成功后，回调loadSuccess方法
				if(loadSuccessFun){
					loadSuccessFun.call(_this,data,$("#"+id+" .tableBody table tbody"),jcontent);
				}				
				
				// 重新绑定点击事件
				$("#"+id+" .tableBody table tbody tr").unbind("click",onSelectedEditRow);
				$("#"+id+" .tableBody table tbody tr").bind("click",onSelectedEditRow);
				// 加载完成后生成序号
				resetSequence();
			}
		});	
	};
	
	//当前编辑中的行的所有G对象清单
	var rendedGeles = [];
	
	// 验证当前编辑的行
	var validateCurrentEditRow = function(){
        if(selectedRow && rendedGeles.length > 0) {
        	//console.log(selectedRow);
        	//console.log(rendedGeles[0]);
        	//console.log(rendedGeles[0].realDom);
			for(var i = 0; i < rendedGeles.length; i++) {
				var rendedGele = rendedGeles[i];
				if(rendedGele.validate) {
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
	var onSelectedEditRow = function(){
		//console.log(this);
		
//    	var tr = $(event.target);
//    	if(tr.is("tr") == false) {
//            tr = tr.parents("tr");
//		}
		
		var tr = $(this);
		//console.log("=======>"+validateCurrentEditRow());
		//如果先前编辑的行，数据校验未通过，则不充许执行操作
		if(selectedRow != tr[0] && validateCurrentEditRow()==false)
			return;
		
		renderingRow(tr);
    };
    
    // 清除选中行的参数
    var clearSelectRow = function(){
    	selectedRow = null;
    	rendedGeles = [];
    }
    
    // 渲染指定的行
    var renderingRow = function(tr){
    	if(tr.hasClass("disabledRow")==true)
    		return;
		selectedRow = tr[0];
        
        $("#"+id+" .tableBody table tbody tr").removeClass("selectedRow");
        tr.addClass("selectedRow");
        $("#"+id+" .tableBody table tbody tr").find(".c_input").addClass("hidden");
        $("#"+id+" .tableBody table tbody tr").find(".c_view").removeClass("hidden");
        //当前行是否已经渲染过了
        if(tr.attr("editTable_render")== "true") {
            tr.find(".c_input").removeClass("hidden");
            tr.find(".c_view").addClass("hidden");
            rendedGeles = tr.data("rendedGeles");
		}else {
			// 待渲染的控件数量
            var ctypeLength = tr.find("[ctype]").length;
            // 已渲染的控件个数
            var rendedCtypeInTr = 0;
            // 表单对象
            var form = tr.parents("form");
            var gform = G.G$(form[0]).data("vmdom");
            //console.log(ctypeLength);
            rendedGeles = [];
            tr.find("[ctype]").each(function(){
            	var __this = this;
				G.render({
					el: __this,
                    parentAst: gform.ast,
					mounted: function(cele,gele) {
						// 获得当前渲染后的控件
						var gControl = gele[0];
						rendedGeles.push(gControl);
						var onChange = function(newValue){
							var cell = _this.getCurrentCell(gControl);
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
									jview.text(gControl.getText());
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
                        	if(afterRowRenderFun){
                        		tr.data("rendedGeles",rendedGeles);
                        		afterRowRenderFun.call(_this,tr,tr.prevAll().length);
                        	}
						}
                        //if(rendedGeles.length>0){
                        	//设置默认焦点时有问题，会导至autocomplete中已填写值消失
                        	//rendedGeles[0].focus();
                        //}
					}
				});
            });
            tr.attr("editTable_render","true");
		}
    }
	
	// 重置序号
	var resetSequence = function(){
		var index = 0;
		$("#"+id+" .tableBody table tbody tr").each(function(){
			index++;
			$(this).find("td:first").text(index);
		});
	};
	
	// 加载数据
	_this.loadInitData = function(data){
		if(data){
			data.operation="init";
		}else{
			data = {
				operation:"init"	
			};
		}
		loadData(data);
	};
	
	// 添加行
	_this.addRow = function(data){
		if(validateCurrentEditRow()==true){
			if(data){
				data.operation="add";
			}else{
				data = {
					operation:"add"
				};
			}
			loadData(data);
		}else{
			G.messager.simple.warning('当前行填写完整后才可以继续添加！','2');
		}
	};
	
	// 删除行
	_this.deleteRow = function(confirm){
		if(selectedRow){
			if(!confirm){
				confirm = "你确定要删除这条记录吗？";
			}
			G.messager.confirm("系统提示",confirm,function(r){
				if(r){
					if(selectedRow){
						G(selectedRow).remove();
						clearSelectRow();
						// 重新生成序号
						resetSequence();							
					}
				}
			});
		}else{
			G.messager.alert('系统提示','请先选择要删除的行！');
		}
	};
	
	// 插入一行
	_this.insertRow = function(data){
		if(validateCurrentEditRow()==true){
			if(selectedRow){
				if(data){
					data.operation="add";
					data.addMethod="insert";
				}else{
					data = {
						operation:"add",
						addMethod:"insert"
					};
				}
				loadData(data);
			}else{
				G.messager.alert('系统提示','请先选择要插入的位置！');
			}
		}else{
			G.messager.simple.warning('当前行填写完整后才可以继续添加！','2');
		}
	};		
	
	// 上移一行
	_this.moveUp = function(){
		if(selectedRow){
			if($(selectedRow).prev().length>0){
				$(selectedRow).prev().before(selectedRow);
				resetSequence();
			}
		}else{
			G.messager.alert('系统提示','请先选择要上移的行！');
		}
	};	
	
	// 下移一行
	_this.moveDown = function(){
		if(selectedRow){
			if($(selectedRow).next().length>0){
				$(selectedRow).next().after(selectedRow);
				resetSequence();
			}
		}else{
			G.messager.alert('系统提示','请先选择要上移的行！');
		}
	};
	
	// 置顶
	_this.moveTop = function(){
		if(selectedRow){
			if($(selectedRow).prev().length>0){
				$(selectedRow).parent().find("tr:first").before(selectedRow);
				resetSequence();
				$("#"+id+" .tableBody").scrollTop(0);
			}
		}else{
			G.messager.alert('系统提示','请先选择要上移的行！');
		}
	};	
	
	// 置底
	_this.moveBottom = function(){
		if(selectedRow){
			if($(selectedRow).next().length>0){
				$(selectedRow).parent().find("tr:last").after(selectedRow);
				resetSequence();
				$("#"+id+" .tableBody").scrollTop($("#"+id+" .tableBody")[0].scrollHeight);
			}
		}else{
			G.messager.alert('系统提示','请先选择要上移的行！');
		}
	};	
	
	// 定义加载成功后的回调函数，不支持冒泡
	_this.onLoadSuccess = function(fun){
		loadSuccessFun = fun;
	}
	
	// 当行编辑控件渲染完成后触发，不支持冒泡
	_this.onAfterRowRender = function(fun){
		afterRowRenderFun = fun;
	}
	
	// 得到Body对象
	_this.getBody = function(){
		var jdom = $("#"+id+" .tableBody table tbody");
		return {
			// 返回当前的JQuery对象
			getJDom:function(){
				return jdom;
			},			
			// JDom为控件的JQuery对象
			findJDom:function(selector){
				return jdom.find(selector);
			}
		};
	}
	
	// 得到当前控件所在行的DOM
	_this.getCurrentRow = function(control){
		var jdom = $(control.realDom).parents("tr:first");
		return makeOperationObject(jdom);
	};
	
	// 得到当前控件所在列的DOM
	_this.getCurrentCell = function(control){
		var jdom = $(control.realDom).parents("td:first");
		return makeOperationObject(jdom);
	};
	// 得到当前选中的行
	_this.getSelectedRow = function(){
		if(selectedRow){
			var jdom = $(selectedRow);
			return makeOperationObject(jdom);
		}else{
			return null;
		}
	};
	
	// 得到指定行号的行
	_this.getRow = function(any){
		if(typeof any == "number"){
			var jdom = $("#"+id+" .tableBody table tbody tr").eq(any);
			return makeOperationObject(jdom);
		}else if(any instanceof jQuery){
			return makeOperationObject(any);
		}else if(typeof any == "object"){
			return makeOperationObject($(any));
		}else
			return null;
	};	
	var makeOperationObject = function(jdom){
		return {
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
			setValue:function(name,value,text){
				var gdom = findGDom(jdom,"[name="+name+"Input]");
				if(gdom instanceof G.tag.Tag){
					gdom.setValue(value);
				}else{
					jdom.find("[name="+name+"Input]").attr("value",value);
				}
				jdom.find("[name="+name+"]").val(value);
				jdom.find("[name="+name+"Text]").text(text);
			},
			// JDom为控件的JQuery对象
			findJDom:function(selector){
				return jdom.find(selector);
			},
			// 得到序号
			index:function(){
				return jdom.index();
			},
			// GDom为GearUI的控件对象
			findGDom:function(selector){
				return findGDom(jdom,selector);
			}
		};
	};
	
	var findGDom = function(jdom,selector){
        var index = jdom.index();
        var geleArray = G(selector);
        for(var i = 0; i < geleArray.length; i++) {
        	let gele = geleArray[i];
        	let realDom = gele.realDom;
//        	if(realDom && $(realDom).parents('.c_input').hasClass("hidden") == false) {
//				return gele;
//			}
        	var tr = $(realDom).parents('tr:first')[0];
        	if(tr==jdom[0]){
        		return gele;
        	}
		}
        //return G(selector)[index];
        return null;
	}
	
	// 初始化
	init();
}