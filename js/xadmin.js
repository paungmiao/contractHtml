window.userInfo = JSON.parse(window.sessionStorage.getItem('userInfo'));
let audit_server='http://xjcloud-audit.xjcloud.wlq.pbc.gov:8666/audit-api/socket/'
$(document).ready(function () {
    let tokenKey = 'Authorization';
    let Authorization = window.sessionStorage.getItem(tokenKey)
    Authorization = Authorization?Authorization: getCookie(tokenKey)
    if (!Authorization || Authorization == '' || Authorization == undefined) {
        location.href="login.html"
    }
    setJwtToken(Authorization);
    if(getCookie(tokenKey)){
        $(".x-admin-sm .page-content").eq(0).css("position",'');
        $(".x-admin-sm .page-content").eq(0).css("top",'');
        $(".x-admin-sm .page-content").eq(0).css("left",'0px');
        $(".x-admin-sm .left-nav").remove();
        $(".x-admin-sm ul.layui-tab-title").remove();
        initUserInfo();
    }
})

function setJwtToken(token){
    window.sessionStorage.setItem(TOKEN_KEY,token);
}

function initUserInfo(){
    $.ajax({
        url: '/audit-api/login/user/info',
        type: 'get',
        async: false,
        headers: {
            Authorization: window.sessionStorage.getItem(TOKEN_KEY)
        },
        success: function (res) {

            if (res.code == 0) {
                let userInfo = res.data|{}
                window.sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
                console.log(userInfo['username'])
                return true;
            }
        }
    })
}

let roleIdList = userInfo.roleIdList;
let rPermissionList;
$.get('/audit-api/login/getPermission?roleIds='+roleIdList.join(","),{},function (res) {
    if(res.code==0){
        rPermissionList = res.data;
        $.each(res.data,function(i,v){
            $("." + v).removeClass("layui-hide");
        })
    }
});
function reloadPermission(){
    if(rPermissionList){
        $.each(rPermissionList,function(i,v){
            $("." + v).removeClass("layui-hide");
        })
    }
}


let auditEnum = {
    1002: {
        agree: 1003,
        reject: 1004,
    },
    1003: {
        agree: 1005,
        reject: 1004,
    },
    1004: {
        agree: 1005
    },
    1005: {
        agree: 1006,
    },
    1006: {
        agree: 1008,
        reject: 1007,
        form: 'completePlan' //完善整改信息表单
    },
    1007: {
        agree: 1006,
    },
    1008: {
        agree: 1009, //根据延期字段判断，为空则1009 否则 1014（延期申请）
        reject: 1014, //延期申请
        form: 'delayForm' //延期申请表单
    },
    1009: {
        agree: 1017,
    },
    1017: {
        agree: 1010,
        reject: 1008
    },
    1010: {
        agree: 1011,
        reject: 1008
    },
    1011: {
        agree: 1013
    },
    1014:{
        agree: 1015,
        reject: 1008
    },
    1015:{
        agree: 1016,
        reject: 1008
    },
    1016:{
        agree: 1009,
        reject: 1008
    }


}
function getCookie(name) {
    var dc = document.cookie;
    var prefix = name + "=";
    var begin = dc.indexOf("; " + prefix);
    if (begin == -1) {
        begin = dc.indexOf(prefix);
        if (begin != 0) return null;
    } else {
        begin += 2;
    }
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
        end = dc.length;
    }
    return unescape(dc.substring(begin + prefix.length, end));
}
function deleteCookie(name, path, domain) {
    if (getCookie(name)) {
        document.cookie = name + "=" +
            ((path) ? "; path=" + path : "") +
            ((domain) ? "; domain=" + domain : "") +
            "; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
}

function getDeptParent(id) {
    var parentId = '0';
    $.ajax({
        async:false,
        url:"/audit-api/common/depts/"+id,
        headers:{'Authorization':Authorization},
        type:'get',
        success:function (res) {
            if(res && res.code==0){
                parentId = res.data.parentId;
            }
        }
    })
    return parentId;
}

function clearStorage(){
    deleteCookie('tab_list');
    window.sessionStorage.clear();
}
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

function getDeadCount(){
    $.get('/audit-api/planManage/deadcount/'+userInfo.userId,{},function (res) {
        if(res.code==0){
            $("#deadCount").html(res.data);
        }
    })
}

function openAuditDetail(bizKey,bizName,taskId,auditStatus,opinionStatus,type){
    top.layer.open({
        type: 2,
        area: ['80%', '80%'],
        fix: false, //不固定
        maxmin: true,
        shadeClose: true,
        shade: 0.4,
        title: bizName+'审计项目详情',
        content: '../system/auditDeatil.html?bizKey='+bizKey+'&bizName='+bizName+'&taskId='+taskId+'&auditStatus='+auditStatus+'&opinionStatus='+opinionStatus+'&type='+type,
        success: function (layero, index) {
            //窗口加载成功刷新frame
        },
        cancel: function () {
            //关闭窗口之后刷新frame
            // location.replace(location.href);
        },
        end: function () {
            //窗口销毁之后刷新frame
            // location.replace(location.href);
        }
    });
}


$(function () {

    if(userInfo){
        openSocket()
        getDeadCount();
    }
    //加载弹出层
    layui.use(['form','element'],
    function() {
        layer = layui.layer;
        element = layui.element;

        //tab 右键事件
        $(".layui-tab-title").on('contextmenu', 'li', function(event) {
            var tab_left = $(this).position().left;
            var left = $(this).position().top;
            this_index = $(this).attr('lay-id');
            $('#tab_right').css({'left':tab_left+50}).show();
            $('#tab_show').show();
            return false;
        });

        $('.page-content,#tab_show,.container,.left-nav').click(function(event) {
            $('#tab_right').hide();
            $('#tab_show').hide();
        });

        $('#tab_right').on('click', 'dd', function(event) {

            if(getCookie('tab_list')){
                var tab_list = getCookie('tab_list').split(',');
            }else{
                var tab_list = [];
            }

            var type = $(this).attr('data-type');

            if(type=='this'){

                tab.tabDelete(this_index);

                var index = -1;

                for (var i in tab_list) {
                    if(tab_list[i]==(this_index-1)){
                        index = i;
                    }
                 } 
                if (index > -1) { 
                    tab_list.splice(index, 1); 
                }

                setCookie('tab_list',tab_list);
            }
            if(type=='all'){

                for (var i in tab_list) {
                   tab.tabDelete(Number(tab_list[i])+1); 
                }

                setCookie('tab_list',[]);
            }

            if(type=='other'){

                for (var i in tab_list) {
                    if(tab_list[i]!=(this_index-1)){
                        tab.tabDelete(Number(tab_list[i])+1); 
                    }
                }

                setCookie('tab_list',[this_index-1]);
            }
            // alert(this_index);
            $('#tab_right').hide();
        });

        // tab 双击事件
        $(".layui-tab-title").on('dblclick', 'li', function(event) {
            var id = $(this).attr('lay-id');
            tab.tabDelete(id);

            if(getCookie('tab_list')){
                tab_list = getCookie('tab_list').split(',');
            }else{
                tab_list = [];
            }


            var index = -1;

            for (var i in tab_list) {
                if(tab_list[i]==(id-1)){
                    index = i;
                }
             } 


            if (index > -1) { 
                tab_list.splice(index, 1); 
            }

            setCookie('tab_list',tab_list);
            return false;
        });

        // tab 删除事件
        element.on('tabDelete(xbs_tab)', function(data){
            var id  = $(this).parent().attr('lay-id')-1;

            if(getCookie('tab_list')){
                tab_list = getCookie('tab_list').split(',');
            }else{
                tab_list = [];
            }


            var index = -1;

            for (var i in tab_list) {
                if(tab_list[i]==id){
                    index = i;
                }
             } 


            if (index > -1) { 
                tab_list.splice(index, 1); 
            }

            setCookie('tab_list',tab_list);

        });

        if(getCookie('tab_list')){
            tab_list = getCookie('tab_list').split(',');

            for (var i in tab_list) {
                 $('.left-nav #nav li').eq(tab_list[i]).click();
            }
         }
    });

    //触发事件
  var tab = {
        tabAdd: function(title,url,id){
          //新增一个Tab项
          element.tabAdd('xbs_tab', {
            title: title 
            ,content: '<iframe tab-id="'+id+'" frameborder="0" src="'+url+'" scrolling="yes" class="x-iframe"></iframe>'
            ,id: id
          })
        }
        ,tabDelete: function(othis){
          //删除指定Tab项
          element.tabDelete('xbs_tab', othis); //删除：“商品管理”
          
           
          // othis.addClass('layui-btn-disabled');
        }
        ,tabChange: function(id){
          //切换到指定Tab项
          element.tabChange('xbs_tab', id); //切换到：用户管理
        }
      };


    tableCheck = {
        init:function  () {
            $(".x-admin .layui-form-checkbox").click(function(event) {
                if($(this).hasClass('layui-form-checked')){
                    $(this).removeClass('layui-form-checked');
                    if($(this).hasClass('header')){
                        $(".x-admin .layui-form-checkbox").removeClass('layui-form-checked');
                    }
                }else{
                    $(this).addClass('layui-form-checked');
                    if($(this).hasClass('header')){
                        $(".x-admin .layui-form-checkbox").addClass('layui-form-checked');
                    }
                }
                
            });
        },
        getData:function  () {
            var obj = $(".x-admin .layui-form-checked").not('.header');
            var arr=[];
            obj.each(function(index, el) {
                arr.push(obj.eq(index).attr('data-id'));
            });
            return arr;
        }
    }

    // 开启表格多选
    tableCheck.init();
      

    $('.container .left_open i').click(function(event) {
        if($('.left-nav').css('left')=='0px'){
            $('.left-nav').animate({left: '-221px'}, 100);
            $('.page-content').animate({left: '0px'}, 100);
            $('.page-content-bg').hide();
        }else{
            $('.left-nav').animate({left: '0px'}, 100);
            $('.page-content').animate({left: '221px'}, 100);
            if($(window).width()<768){
                $('.page-content-bg').show();
            }
        }

    });

    $('.page-content-bg').click(function(event) {
        $('.left-nav').animate({left: '-221px'}, 100);
        $('.page-content').animate({left: '0px'}, 100);
        $(this).hide();
    });

    

    $('.layui-tab-close').click(function(event) {
        $('.layui-tab-title li').eq(0).find('i').remove();
    });

   $("tbody.x-cate tr[fid!='0']").hide();
    // 栏目多级显示效果
    $('.x-show').click(function () {
        if($(this).attr('status')=='true'){
            $(this).html('&#xe625;'); 
            $(this).attr('status','false');
            cateId = $(this).parents('tr').attr('cate-id');
            $("tbody tr[fid="+cateId+"]").show();
       }else{
            cateIds = [];
            $(this).html('&#xe623;');
            $(this).attr('status','true');
            cateId = $(this).parents('tr').attr('cate-id');
            getCateId(cateId);
            for (var i in cateIds) {
                $("tbody tr[cate-id="+cateIds[i]+"]").hide().find('.x-show').html('&#xe623;').attr('status','true');
            }
       }
    })

    //左侧菜单效果
    
    $('.left-nav #nav').on('click', 'li', function(event) {

        var index = $('.left-nav #nav li').index($(this));

        if($(this).children('.sub-menu').length){
            if($(this).hasClass('open')){

                if($(this).parent().hasClass('sub-menu')){
                    deleteCookie('left_menu_son');
                }else{
                    deleteCookie('left_menu_father');
                }

                $(this).removeClass('open');
                $(this).find('.nav_right').html('&#xe697;');
                $(this).children('.sub-menu').stop().slideUp();
                $(this).siblings().children('.sub-menu').slideUp();
            }else{
                

                if($(this).parent().hasClass('sub-menu')){
                    setCookie('left_menu_son',index);
                }else{
                    setCookie('left_menu_father',index);
                }

                $(this).addClass('open');
                $(this).children('a').find('.nav_right').html('&#xe6a6;');
                $(this).children('.sub-menu').stop().slideDown();
                $(this).siblings().children('.sub-menu').stop().slideUp();
                $(this).siblings().find('.nav_right').html('&#xe697;');
                $(this).siblings().removeClass('open');
            }
        }else{

            var url = $(this).children('a').attr('_href');
            var title = $(this).find('cite').html();
            // var index  = $('.left-nav #nav li').index($(this));

            var is_refresh = $(this).attr('date-refresh')?true:false; 

            for (var i = 0; i <$('.x-iframe').length; i++) {
                if($('.x-iframe').eq(i).attr('tab-id')==index+1){
                    tab.tabChange(index+1);
                    event.stopPropagation();

                    if(is_refresh)
                        $('.x-iframe').eq(i).attr("src",$('.x-iframe').eq(i).attr('src'));

                    return;
                }
            };
            
            if(getCookie('tab_list')){
                tab_list = getCookie('tab_list').split(',');
            }else{
                tab_list = [];
            }

            var is_exist = false;

            for (var i in tab_list) {
                if(tab_list[i]==index)
                    is_exist = true;
            }

            if(!is_exist){
                tab_list.push(index);
            }
            // 缓存菜单西南西
            setCookie('tab_list',tab_list);

            tab.tabAdd(title,url,index+1);
            tab.tabChange(index+1);
        }
        
        event.stopPropagation();
         
    })

    //左侧菜单记忆功能
    if(getCookie('left_menu_father')!=null){
        $('.left-nav #nav li').eq(getCookie('left_menu_father')).click();
    }

    if(getCookie('left_menu_son')!=null){
        $('.left-nav #nav li').eq(getCookie('left_menu_son')).click();
    }
     
     
     
    
})
var cateIds = [];
function getCateId(cateId) {
    
    $("tbody tr[fid="+cateId+"]").each(function(index, el) {
        id = $(el).attr('cate-id');
        cateIds.push(id);
        getCateId(id);
    });
}

/*弹出层*/
/*
    参数解释：
    title   标题
    url     请求的url
    id      需要操作的数据id
    w       弹出层宽度（缺省调默认值）
    h       弹出层高度（缺省调默认值）
*/
function x_admin_show(title,url,w,h){
    if (title == null || title == '') {
        title=false;
    };
    if (url == null || url == '') {
        url="404.html";
    };
    if (w == null || w == '') {
        w=($(window).width()*0.9);
    };
    if (h == null || h == '') {
        h=($(window).height() - 50);
    };
    layer.open({
        type: 2,
        area: [w+'px', h +'px'],
        fix: false, //不固定
        maxmin: true,
        shadeClose: true,
        shade:0.4,
        title: title,
        content: url,
        success: function(){
          //窗口加载成功刷新frame
          // location.replace(location.href);
        },
        cancel:function(){
          //关闭窗口之后刷新frame
          // location.replace(location.href);
        },
        end:function(){
          //窗口销毁之后刷新frame
          // location.replace(location.href);
        }
    });
}

/*关闭弹出框口*/
function x_admin_close(){
    var index = parent.layer.getFrameIndex(window.name);
    parent.layer.close(index);
}

function x_admin_father_reload(){
    
    parent.location.reload();
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null)
        context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}

var socket;
function openSocket() {
    if(typeof(WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
    }else{
        console.log("您的浏览器支持WebSocket");
        //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
        //等同于socket = new WebSocket("ws://localhost:8888/xxxx/im/25");
        //var socketUrl="${request.contextPath}/im/"+$("#userId").val();
        var socketUrl=audit_server+userInfo.userId;
        socketUrl=socketUrl.replace("https","ws").replace("http","ws");
        console.log(socketUrl);
        if(socket!=null){
            socket.close();
            socket=null;
        }
        socket = new WebSocket(socketUrl);
        //打开事件
        socket.onopen = function() {
            console.log("websocket已打开");
            //socket.send("这是来自客户端的消息" + location.href + new Date());
        };
        //获得消息事件
        socket.onmessage = function(msg) {
            console.log(msg.data);
            //发现消息进入    开始处理前端触发逻辑
        };
        //关闭事件
        socket.onclose = function() {
            console.log("websocket已关闭");
        };
        //发生了错误事件
        socket.onerror = function() {
            console.log("websocket发生了错误");
        }
    }
}
function sendMessage() {
    if(typeof(WebSocket) == "undefined") {
        console.log("您的浏览器不支持WebSocket");
    }else {
        console.log("您的浏览器支持WebSocket");
        console.log('{"toUserId":"'+$("#toUserId").val()+'","contentText":"'+$("#contentText").val()+'"}');
        socket.send('{"toUserId":"'+$("#toUserId").val()+'","contentText":"'+$("#contentText").val()+'"}');
    }
}

