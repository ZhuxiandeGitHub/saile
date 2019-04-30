
var saile_username="",
    saile_password="",
    openid = "",
    gender = "",
    channel = "",
    qqName = "",
    qqImg = "";
$(function () {
    //去除导航激活项
    $(".navManu li").removeClass("navActive");
    // 计算窗口高度
    var login_height = window.innerHeight-60;
    $(".login_back").css("height",login_height);
    //从缓存获得用户账号密码
    localStorage.getItem("saile_username")==undefined ? saile_username="" : saile_username=localStorage.getItem("saile_username");
    localStorage.getItem("saile_password")==undefined ? saile_password="" : saile_password=localStorage.getItem("saile_password");
    $(".user_li input").val(saile_username);
    $(".mima_li input").val(saile_password);
    //从页面地址获取qq信息
    var hrefs = decodeURI(window.location.href);
    openid = hrefs.split("openid=")[1].split("&nickname=")[0];
    gender = hrefs.split("&gender=")[1].split("&qqimg=")[0];
    channel = hrefs.split("&channel=")[1];
    qqName = hrefs.split("&nickname=")[1].split("&gender=")[0];
    qqImg = hrefs.split("&qqimg=")[1].split("&channel=")[0];
    $(".qq_Div img").attr("src",qqImg);
    $(".qq_Div p").text(qqName);
    //保存qq信息，用于注册页面
    var qq_data = {
        "openid":openid,
        "gender":gender,
        "qqimg":qqImg,
        "channel":channel,
        "nickname":qqName,
        "username":"",
        "password":"",
        "phone":""
    };
    sessionStorage.setItem("qq_data",JSON.stringify(qq_data));
});

//绑定
$(function () {
    $("#translate").click(function () {
        saile_username = $(".user_li input").val();
        saile_password = $(".mima_li input").val();
        if($.trim(saile_username)==""){
            $(".user_li span").show();
            setTimeout(function () {
                $(".user_li span").fadeOut();
            },1000)
        }
        if($.trim(saile_password)==""){
            $(".mima_li span").show();
            setTimeout(function () {
                $(".mima_li span").fadeOut();
            },1000)
        }
        if(saile_username!=""&&saile_password!=""){
            var datas = {
                "openid":openid,
                "gender":gender,
                "qqimg":qqImg,
                "channel":channel,
                "username":saile_username,
                "password":saile_password,
                "nickname":qqName
            };
            login_bangding(datas,function (data) {
                if(data.data==null){
                    layers(data.message);
                }else {
                    //保存token
                    localStorage.setItem("saile_token",JSON.stringify(data.data));
                    layers("绑定成功");
                    setTimeout(function () {
                        location.href = "../index/index.html";
                    },2000);
                }
            })
        }
    })
});
