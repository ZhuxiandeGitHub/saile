
var saile_username="",saile_password="",phone="";
var checkPhone = /^1(3|4|5|7|8)\d{9}$/;
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
   var mima1,mima2;
    //密码验证
    $(".mima1 input").change(function () {
        mima1 = $(this).val();
        var $accRegular = /^[a-zA-Z]{1}\w{5,15}$/;
        if (!$accRegular.test(mima1)) {
            $(this).val("");
            $(".mima1 span").show();
            setTimeout(function(){
                $(".mima1 span").fadeOut();
            }, 2000);
        }
    });
    $(".mima2 input").change(function () {
        mima2 = $(this).val();
        if(mima1!=mima2){
            layers("输入的密码前后不一致！");
        }
    });
});

//发送短信，获取验证码
$(function () {
    $(".getYZM").click(function () {
        if(checkPhone.test(phone)==true&&$(this).attr("disabled")!="disabled"){
            //避免重复发送
            $(this).attr("disabled","disabled");
            $(".identify").addClass("login_hui");
            var getYZM_data = {"phone":phone,"verbal":"找回密码"};
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

//找回密码
$(function () {
    $("#findMima").click(function () {
        var code = $(".identify input").val();
        var mima1 = $(".mima1 input").val();
        var mima2 = $(".mima2 input").val();
        //密码1
        if($.trim(mima1)==""){
            $(".mima1 span").show();
            setTimeout(function () {
                $(".mima1 span").fadeOut();
            },1000)
        }
        //密码2
        if($.trim(mima2)==""){
            $(".mima2 span").show();
            setTimeout(function () {
                $(".mima2 span").fadeOut();
            },1000)
        }
        //前后密码一致
        if(mima1!=mima2){
            layers("输入的密码前后不一致！");
        }
        //验证码
        if($.trim(code)==""){
            $(".identify span").show();
            setTimeout(function () {
                $(".identify span").fadeOut();
            },1000)
        }
        //手机号
        if(checkPhone.test(phone)!=true){
            $(".phone_li span").show();
            setTimeout(function () {
                $(".phone_li span").fadeOut();
            },1000)
        }
        if(checkPhone.test(phone)==true&&$.trim(code)!=""&&$.trim(mima1)!=""&&$.trim(mima2)!=""&&mima1==mima2){
            var findMima_data = {"phone":phone,"verbal":"找回密码","password":mima2,"code":code};
            login_findMima(findMima_data,function (data) {
                if(data.data==true){
                    location.href = "../login/login.html";
                }else {
                    layers(data.message);
                }
            });
        }

    });
});

//登录
$(function () {
   $("#login_button").click(function () {
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
       if($.trim(saile_username)!=""&&$.trim(saile_password)!=""){
           var datas_denglu = {"username":saile_username,"password":saile_password};
           login_denglu(datas_denglu,function (data) {
              if(data.data==null){
                   var text = "登录失败，账号或密码错误！";
                   layers(text);
               }else{
                  layers("登录成功！");
                   //是否记住密码,保存用户信息
                   var checkBox = $(".login_tips input").prop("checked");
                   if(checkBox==true){
                       localStorage.setItem("saile_username",saile_username);
                       localStorage.setItem("saile_password",saile_password);
                   }
                   //保存token
                   localStorage.setItem("saile_token",data.data.token);
                   //跳转主页
                  setTimeout(function () {
                      location.href = "../index/index.html";
                  },1000);
               }
           });
       }
   }) 
});




