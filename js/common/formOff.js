//表单关闭函数

function off(){
	
	 var index = parent.layer.getFrameIndex(window.name);  
	    parent.layer.close(index);//关闭当前页 
}

//表单重置
function reset(elem){
	var id ='#'+elem;
	$(id)[0].reset();
	layui.form.render();
}

/*清除input框的值
如要使用需是
<div>
	<div>
	<input></input>
	</div>
	<div>
	 <button>
	</div>
</div>
	的节点结构
*/
function resetSearch(obj) {
	var obj = $(obj);
	var inputs = obj.parent().siblings('div').find('input');

	$.each(inputs,function (index,obj) {
		$(obj).val('');
    })
}