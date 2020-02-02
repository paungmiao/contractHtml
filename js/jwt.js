/**
 * @author Quanlijian
 * @update-author paungmiao@163.com
 * jwt有关
 */
const HOST_URL = "http://127.0.0.1:8081/";
const TOKEN_KEY = "jwtToken";

/**
 * 将服务器返回的token存储在本地
 * @param token
 */
function setJwtToken(token){
	window.sessionStorage.setItem(TOKEN_KEY,token);
}
/**
 * 获取本地的token
 * @returns token
 */
function getJwtToken(){
	return window.sessionStorage.getItem(TOKEN_KEY);
}
/**
 * 移除token
 */	
function removeJwtToken() {
	 window.sessionStorage.removeItem(TOKEN_KEY);
}
/**
 * 创建带Token  Header的请求头、
 * @returns
 */
function createAuthorizationTokenHeader(){
	let token=getJwtToken();
	
	if(token){
		return {'Authorization':token}
	}else{
		return {};
	}
}
	