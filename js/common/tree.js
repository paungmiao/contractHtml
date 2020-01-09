


/**
 * 获取所有勾选被勾选的节点集合
 * @param id ztree的容器id
 */
function getZtreeAllCheck(id) {
    var treeObj = $.fn.zTree.getZTreeObj(id);
    var nodes = treeObj.getChangeCheckedNodes();
        return nodes;
}

/**
 * 将获取所有被勾选节点id或name
 * 将其转为字符串并,分隔；
 * @param id ztree容器id
 * @param params 所要获取的参数
 */
function getAllCheckByStr(id,params) {

    var str="";
    var nodes = getZtreeAllCheck(id);

    for (var i = 0; i <nodes.length ; i++) {
        if (params=='id'){
            if (nodes[i].id==undefined||nodes[i].id==null||nodes[i].id==''){
                layer.msg("节点信息无法获取");
                break;
            }
            str+=nodes[i].id+',';
            if (i==nodes.length-1){
                str+=nodes[i].id;
            }
        } else if (params=='name'){
            if (nodes[i].name==undefined||nodes[i].name==null||nodes[i].name==''){
                layer.msg("节点信息无法获取");
                break;
            }
            if (i==nodes.length-1){
                str+=nodes[i].id;
            }else {
                str+=nodes[i].id+',';
            }


        }else {
            layer.msg("无法获取"+params+"的信息");
            break;
        }
    }

    return str;
}



function showzTree(url,id,nodeId,parantNodeId,check_url) {
    var zTreeObj; //树形组件

    //zTree配置
    var setting = {
        // 开启异步加载
        async: {
            enable: true, //开启异步加载功能，若异步则必写
            type: 'get',
            url: url, //url路径 返回json数据
            headers: createAuthorizationTokenHeader(), //请求头
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            } //返回的数据类型
        },
        data: {
            keep: {
                leaf: true,
                parent: true,
            },
            key: {
                name: 'name'
            },
            simpleData: {
                enable: true,
                idKey: nodeId,
                pIdKey:parantNodeId,
                rootPid: 0
            }
        },
        check:{
            enable:true,
            chkStyle:"checkbox",
            chkboxType: { "Y": "p", "N": "s" }

        }
        ,
        callback: {
            onClick: zTreeOnClick
            ,onAsyncSuccess: zTreeOnAsyncSuccess
        },
        /* 		 edit:{
                     enable:true,
                     showRemoveBtn: true,
                     showRenameBtn: true
                 }, */
        view: {
            fontCss: {
                color: 'red'
            }
        }
    };

    $(document).ready(function() {
        zTreeObj = $.fn.zTree.init($(id), setting);
    });

    function zTreeOnAsyncSuccess(event, treeId, treeNode, msg) {
        
        if (check_url){
            $.ajax({
                mothed:'get'
                ,url:check_url
                ,success:function(res) {
                    if (res.data){
                        var ids = res.data.split(',');
                        var node = zTreeObj.getNodes();
                        var nodes = zTreeObj.transformToArray(node);
                        for (var i = 0; i <nodes.length ; i++) {
                            for (var j = 0; j <ids.length ; j++) {
                                if(nodes[i].id==ids[j]){
                                    zTreeObj.checkNode(nodes[i],true,true);
                                    zTreeObj.expandNode(nodes[i],true);
                                }
                            }
                        }
                    }
                }
            });
            return true;
        }

        return false;

    }

    function zTreeOnClick(event, treeId, treeNode) {
        //节点点击事件，treenode节点的数据对象
        // $("#institution").val(treeNode.iname);
        //$("#insId").val(treeNode.id);
    }

}

