//设置缓存
function set_cache(key,value){
if(key=='') return false;
window.localStorage.setItem(key, value);
}

//读取缓存
function get_cache(key){
return window.localStorage.getItem(key);
}

//删除缓存
function remove_cache(key){
window.localStorage.removeItem(key);
}