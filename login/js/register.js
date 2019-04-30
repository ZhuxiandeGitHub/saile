
var saile_username="",saile_password="",phone="";
var checkPhone = /^1(3|4|5|7|8)\d{9}$/;
var regApi = window.location.href.split("regApi=")[1];
$(function () {
    //去除导航激活项
    $(".navManu li").removeClass("navActive");
    // 计算窗口高度
    var login_height = window.innerHeight-60;
    $(".login_back").css("height",login_height);
});

$(function () {
    //手机号验证
    $(".phone_li input").change(function () {
        phone = $(this).val();
        if(checkPhone.test(phone)!=true){
            $(this).val("");
            $(".phone_li span").show();
            setTimeout(function(){
                $(".phone_li span").fadeOut();
            }, 2000);
        }
    });
    //密码验证
    $(".mima_li input").change(function () {
        saile_password = $(this).val();
        var $accRegular = /^(?![^a-zA-Z]+$)(?!\D+$).{6,16}/;
        if (!$accRegular.test(saile_password)) {
            $(this).val("");
            $(".mima_li span").show();
            setTimeout(function(){
                $(".mima_li span").fadeOut();
            }, 2000);
        }
    });
});

//发送短信
$(function () {
    $(".getYZM").click(function () {
        if(checkPhone.test(phone)==true&&$(this).attr("disabled")!="disabled"){
            //避免重复发送
            $(this).attr("disabled","disabled");
            $(".identify").addClass("login_hui");
            var getYZM_data = {"phone":phone,"verbal":"申请注册"};
            login_sends(getYZM_data,function (data) {
                layers(data.data);
            });
            setTimeout(function () {
                $(".getYZM").removeAttr("disabled");
                $(".identify").removeClass("login_hui");
            },60000);
        }else if(checkPhone.test(phone)!=true){
            $(".phone_li span").show();
            setTimeout(function () {
                $(".phone_li span").fadeOut();
            },1000)
        }
    });
});

//注册
$(function () {
    $("#regist_button").click(function () {
        saile_username = $(".user_li input").val();
        saile_password = $(".mima_li input").val();
        phone = $(".phone_li input").val();
        var checkBox = $(".agreement input").prop("checked");
        var code = $(".identify input").val();
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
        if($.trim(code)==""){
            $(".identify span").show();
            setTimeout(function () {
                $(".identify span").fadeOut();
            },1000)
        }
        if(checkPhone.test(phone)!=true){
            $(".phone_li span").show();
            setTimeout(function () {
                //$(".phone_li span").fadeOut();
            },1000)
        }
        if(checkBox!=true){
            $(".agreement span").css("color","#ab0204");
            setTimeout(function () {
                $(".agreement span").css("color","#333333");
            },1000)
        }
        if($.trim(saile_username)!=""&&$.trim(saile_password)!=""&&checkPhone.test(phone)==true&&checkBox==true&&$.trim(code)!=""){
            if(regApi==1){
                var datas_zhuce = {"username":saile_username,"password":saile_password,"phone":phone,"code":code,"verbal":"申请注册"};
                login_zhuce(datas_zhuce,function (data) {
                    if(data.data==null){
                        layers(data.message);
                    }else{
                        //保存token
                        localStorage.setItem("saile_token",data.data);
                        //跳转主页
                        location.href = "../index/index.html";
                    }
                });
            }else {
                var qq_data = JSON.parse(sessionStorage.getItem("qq_data"));
                qq_data.username = saile_username;
                qq_data.password = saile_password;
                qq_data.phone = phone;
                qq_data.code = code;
                qq_data.verbal = "申请注册";
                login_qqRegist(qq_data,function (data) {
                    if(data.data==null){
                        layers(data.message);
                    }else{
                        //保存token
                        localStorage.setItem("saile_token",JSON.stringify(data.data));
                        //跳转主页
                        location.href = "../index/index.html";
                    }
                })
            }
        }
    });

});



