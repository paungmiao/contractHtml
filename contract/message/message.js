var messageUser;
        $(function() {
            layui.use(['upload','form','layer'], function() {
                var form = layui.form;

alert(userInfo.userId)
                                let value = [{
                                    "msg": "这里是内容",
                                    "time": "2019-12-12",

                                    "id": "1"
                                }]

                                var html =''
                                for(var i in value){


                                    html+= '<div id="' + value[i].id + '" class="toggleNew">' +
                                        '<div class="circle"></div>' +
                                        '<span class="msgItem">项目延期通知</span>' +
                                        '<div class="toggle" id="' + value[i].id + '">' +
                                        '<span class="msgTime">' + value[i].time + '</span>' +
                                        '<img src="../img/clickTwo.png">' +
                                        '<label style="display: none">展开</label>' +
                                        '</div>' +
                                        '<div class="spread">' + value[i].msg + '</div>' +
                                        '<hr></div>'

                                }



                                $("#content").append(html);

                            //先追加HTML再进行操作
                            for (var i in value){
                                if (value[i].status == 0){
                                    $("#"+ value[i].id +"").children(".circle").css("background","#FF0000");
                                }else {
                                    $("#"+ value[i].id +"").children(".circle").css("background","#999");
                                }
                            }
                            msgToggle();

                //div层的收缩展开
                function msgToggle() {
                    var btn = $('.toggleNew');
                    var _this = this;
                    btn.click(function () {
                        //更改已读未读状态值
                        var read = $(this).children(".circle");
                        read.css("background","#999")


                        // var spread = $(this).children(".spread");
                        // spread.slideToggle();
                        // var text = $(this).find(".toggle").children("label").text();
                        // if (text == "展开") {
                        //     $(this).find(".toggle").children("label").html("收缩");
                        //     $(this).find(".toggle").addClass("isIn");
                        //     $(this).find(".toggle").children().css("color","black");//颜色
                        //     $(this).find(".toggle").children("img").attr("src", "../img/click.png");//图案
                        //     $(this).find(".toggle").prev(".msgItem").css("color", "black");//标题颜色
                        //     $(this).find(".toggle").parent().css("background", "white");//背景色
                        //     $(this).siblings().find(".isIn").click()
                        //
                        // } else if (text == "收缩") {
                        //     $(this).find(".toggle").children("label").html("展开");
                        //     $(this).find(".toggle").removeClass("isIn");
                        //     $(this).find(".toggle").children("img").attr("src", "../img/clickTwo.png");
                        //     $(this).find(".toggle").children().css("color","rgba(153,153,153,1)");
                        //     $(this).find(".toggle").prev(".msgItem").css("color", "rgba(153,153,153,1)");
                        //     $(this).find(".toggle").parent().css("background", "none");
                        // }
                        // //更改已读未读状态值
                        // var read = $(this).children(".circle");


                        var spread = $(this).children(".spread");
                        spread.slideToggle();
                        var toggleDom =  $(this).find(".toggle");
                        var text = toggleDom.children("label").text();
                        if (text == "展开") {
                            toggleDom.children("label").html("收缩");
                            toggleDom.children("img").attr("src", "../img/click.png");//图案
                            $(this).siblings(".down").click();
                            $(this).removeClass("open").addClass("down")
                        } else if (text == "收缩") {
                            toggleDom.children("label").html("展开");
                            toggleDom.children("img").attr("src", "../img/clickTwo.png");
                            $(this).removeClass("down").addClass("open")
                        }


                    })
                }

            });
        });