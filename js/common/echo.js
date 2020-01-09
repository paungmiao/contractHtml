//回显表单
function initForm(data,elem,formId){
	for(var key in data ){
	   var obj=elem.find('"#'+data.key+'"');
		if(obj!=null||obj!=''||obj!=undefined){
			
		elem.find('"#'+data.key+'"').val(data[key]);
		}
	}
		
}