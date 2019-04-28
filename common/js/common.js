
//API
//var URL = "http://47.92.217.62";//本地测试地址
//var URL = "http://47.110.251.41";//新服务器测试地址
//var PORT ='8771';//端口号
//var APIURL = URL + ":" + PORT;
var IMGURL = "";//图片地址
//var USERURL = URL + ":" + PORT + "/user";//个人中心

var APIURL = "http://www.saile.cc/saile";
var USERURL = APIURL +"/user";//个人中心

$(function () {
    //移除静态填充色
    $(".jtback").removeClass("jtback");
    $(".jtbai").removeClass("jtbai");
    //加载头部尾部菜单
    head_nav();
    footer_part1();
    //加载弹出层
    var popHtml = "<div class='popErro'>" +
        "<div class='juzhong'><span></span></div>" +
        "</div>";
    $("body").append(popHtml);
    //判断登录
    var saile_token = localStorage.getItem("saile_token");
    var userData = JSON.parse(sessionStorage.getItem("userData"));
    if(saile_token!=null){//token非空，表示有登录记录
        if(userData!=null){//缓存里面 有 用户信息，用userData渲染
            userInfos(userData);
        }else {//缓存里面 无 用户信息，用token换取信息
            var datas_getUser = {"token":saile_token};
            login_getUser(datas_getUser,function (data) {
                userInfos(data);
                sessionStorage.setItem("userData",JSON.stringify(data));//临时保存信息
            });
        }
    }else {
        //显示登录、注册按钮
        $(".login").show();
        $(".logined").hide();
    }
    //关闭用户操作下拉框
    $(".user_work").hover(function () {

    },function () {
        $(".user_work").fadeOut();
        $(".myNews span").hide();
    });
});

//用户信息渲染
function userInfos(data) {
    //显示用户按钮
    $(".logined").show();
    $(".login").hide();
    var userImg = data.data.img;
    var userName = data.data.nickname;
    var mesNumber = data.data.message;//我的消息数量
    //html
    var htmlLoged = '<div class="user_work">' +
        '                <img src="../common/img/sanjiao.png">' +
        '                <ul>' +
        '<li><a href="../personalCenter/center_index.html">个人中心</a></li>' +
        '                    <li class="myNews"><a href="../personalCenter/center_myMsg.html">我的消息</a><span>'+mesNumber+'</span></li>' +
        '                    <li><a href="javascript:void(0);" onclick="shopping()">购物车</a></li>' +
        '                    <li><a href="javascript:void(0);" onclick="changeUser()">切换账户</a></li>' +
        '                    <li><a href="javascript:void(0);" onclick="logOff()">注销</a></li>' +
        '</ul>' +
        '            </div>' +
        '            <a href="javascript:void(0);" onclick="userImgClick()" class="user_img" >' +
        '                <img src="'+userImg+'">' +
        '                <span class="user_name">'+userName+'</span>' +
        '            </a>' +
        '            <a href="../personalCenter/center_contribute.html" class="contribute background_color" >' +
        '                <span>一键投稿</span>' +
        '            </a>';
    $(".logined").html(htmlLoged);
    if(mesNumber>0){
        $(".myNews span").show();
    }else {
        $(".myNews span").hide();
    }
}

//点击头像
function userImgClick() {
    //下拉框
    $(".user_work").toggle();
    //获取我的消息数
    var saile_token = localStorage.getItem("saile_token");
    var datas = {"token":saile_token};
    userMessage(datas,function (data) {
        var mesNumber = data.data;//我的消息数量
        if(mesNumber>0){
            $(".myNews span").text(mesNumber);//消息数
            $(".myNews span").show();
        }else {
            $(".myNews span").hide();
        }
    });
}

//购物车
function shopping() {
    layers('模块开发中，敬请期待！');
}

//注销
function logOff() {
    var saile_token = localStorage.getItem("saile_token");
    login_signOut(saile_token,function (data) {
        if(data.data==true){
            //清除缓存，token,用户信息
            localStorage.removeItem("saile_token");
            sessionStorage.removeItem("userData");
            location.reload();
        }else{
            var text = "注销失败！";
            layers(text);
        }
    });
}

//切换用户
function changeUser() {
    var saile_token = localStorage.getItem("saile_token");
    login_signOut(saile_token,function (data) {
        if(data.data==true){
            //清除缓存，token,用户信息
            localStorage.removeItem("saile_token");
            sessionStorage.removeItem("userData");
            //返回登录页
            location.href="../login/login.html";
        }else{
            var text = "切换失败！";
            layers(text);
        }
    });
}

//头部菜单
function head_nav() {
    var headhtml = '<li>' +
        '                <a href="../index/index.html">首页</a>' +
        '            </li>' +
        '            <li>' +
        '                <a href="../reading/reading.html">阅读</a>' +
        '            </li>' +
        '            <li>' +
        '                <a href="../writing/writing_index.html">写作</a>' +
        '            </li>' +
        '            <li>' +
        '            <a href="../wisdomYoungPioneers/wisdomYoungPioneers.html" class="font_color">智慧少先队</a>' +
        '            </li>' +
        '            <li>' +
        '                <a href="../activity/activity.html">赛事活动</a>' +
        '            </li>' +
        '            <li class="navActive">' +
        '                <a href="../audio/audio_index.html">视听</a>' +
        '            </li>' +
        '            <li>' +
        '                <a href="../shoppingmall/mallIndex.html">商城</a>' +
        '            </li>';
    $(".navManu ul").html(headhtml);
}

//底部菜单，由后台输出数据，把footer存于session，避免重复请求
function footer_part1() {
    $(".footer_left li").eq(0).find("span").text("© 2006-2019 saile.cc，all rights reserved");
    if(sessionStorage.getItem("footer_part1")==undefined){
        abouts_list(function (data) {
            var length = data.data.length;
            var part1 = "";
            for(var i =0;i<length;i++){
                var title = data.data[i].title;
                var id = data.data[i].id;
                var hrefs = "../about/about_index.html?&&aboutId="+id;
                part1+='<span><a href="'+hrefs+'">'+title+'</a></span>';
            }
            var htmlxx = "<div style='width:1200px;margin:0 auto;'>"+part1+"</div>";
            $(".footer_part1").html(htmlxx);
            sessionStorage.setItem("footer_part1",htmlxx);
        });
    }else {
        $(".footer_part1").html(sessionStorage.getItem("footer_part1"));
    }
}

//超出字数添加省略号
function overHide(targetName,maxnum) {
    $('.'+targetName).each(function(){
        //字数
        if($(this).text().length>maxnum){
            //截取字符串
            $(this).text($(this).text().substring(0,maxnum));
            //多余的用省略号显示
            $(this).html($(this).html()+'...');
        }
    });
}

//提示弹出层
function layers(text) {
    $(".juzhong span").text(text);
    $(".popErro").fadeIn();
    setTimeout(function(){$(".popErro").fadeOut();}, 1000);
}

//懒加载
var lazyLoad = (function(){
    var clock;
    function init(){
        $(window).on("scroll", function(){
            if (clock) {
                clearTimeout(clock);
            }
            clock = setTimeout(function(){
                checkShow();
            }, 100);
        });
        checkShow();
    }

    function checkShow(){
        $("body").find(".imglazy").each(function(){
            var $cur =$(this);
            if($cur.attr('isLoaded')){
                return;
            }
            if(shouldShow($cur)){
                showImg($cur);
            }
        })
    }
    function shouldShow($node){
        var scrollH = $(document).scrollTop(),
            winH = $(window).innerHeight(),
            top = $node.offset().top;
        if(top < 1.5*winH + scrollH ){
            return true;
        }else{
            return false;
        }
    }
    function showImg($node){
        $node.css('background-image', 'url("'+$node.attr("data-img")+'")');
        $node.attr('isLoaded', true);
    }
    return {
        init: init
    }
})();

//接口地址---------------------------------------------------
//-----------------------------------------------------------
//底部菜单接口(关于)
function abouts_list(callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/public/about/getAll",
        type: "get",
        dataType: "json",
        success: function (data) {
            callback(data);
        }
    });
}

//赛乐社区接口
function abouts_info(aboutId,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/public/about/getById",
        type: "get",
        dataType: "json",
        data:{"aboutId":aboutId},
        success: function (data) {
            callback(data);
        }
    });
}

//写作部分接口-----------------------------------------
//文章栏目列表，栏目详情，阅读栏目类型列表
function writing_lanmu(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/public/type/show/get",
        type: "get",
        dataType: "json",
        data:datas,
        async:false,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//用稿通知、优秀作文推荐、最近原创投稿、写作列表页、相关文章、近期发表
function writing_lists(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/composition/composition/getByPage",
        type: "get",
        dataType: "json",
        data: datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//文章详情
function writing_details(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/composition/composition/show/getById",
        type: "get",
        dataType: "json",
        data: datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//征稿列表
function writing_zhenggao_list(callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/composition/periodical/collection/list",
        type: "get",
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//征稿信息
function writing_zhenggao_info(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/composition/periodical/collection/info",
        type: "get",
        dataType: "json",
        data: datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//阅读部分接口-----------------------------------------
//优秀传统列表、好书阅读列表
function reading_lists(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/book/book/show/getByPage",
        type: "get",
        data: datas,
        dataType: "json",
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + datas.saile_token
        },
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//小说目录
function reading_mulu(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/book/book/catalog/show/getByBookId",
        type: "get",
        data: datas,
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//小说信息
function reading_bookInfo(datas,token,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/book/book/show/getById",
        type: "get",
        data: datas,
        dataType: "json",
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + token
        },
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
//小说收藏
function reading_shoucang(datas, token, callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/user/bookCollection/save",
        type: "post",
        data: datas,
        dataType: "json",
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + token
        },
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//章节内容
function reading_count(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/book/book/content/show/getByCatalogId",
        type: "get",
        data: datas,
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//reading.html刊物列表
function reading_kanwu(callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/composition/periodical/show/list/get",
        type: "get",
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//视频2
function news_video(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/young/microTeam/show/getById",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//微队会
function index_weiduihui(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/young/microTeam/show/getByPage",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

// wisdomYoungPioneers.html轮播图 少先队知识 少先队活动课课例 少先队动态
function wisdomYoungPioneers_lunbo(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/young/dynamic/show/getByPage",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
// wisdomYoungPioneers.html徽队会展示
function wisdomYoungPioneers_huiduihui(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/young/microTeam/show/getByPage",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

// wisdomYoungPioneers.html底部
function wisdomYoungPioneers_dibu(callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/public/goods/show/recommend/list/get",
        type: "get",
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

// youngPioneerDynamic.html 热门推荐
function youngPioneerDynamic_remen(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/young/dynamic/show/getByPage",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
// youngPioneerDynamic.html 智慧队课
function youngPioneerDynamic_zhihuii(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/young/microTeam/show/getByPage",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
// youngPioneerDetails.html 正文
function youngPioneerDetails_init(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/young/dynamic/show/getById",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

// youngPioneerDetails.html 热门推荐
function youngPioneerDetails_remen(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/young/dynamic/show/getByPage",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

// folkways.html 第一部分
function folkways_diyi(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/composition/periodical/column/show/info/get",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

// columnlist.html 第一部分刊物
function columnlist_kanwu(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/composition/periodical/show/info/get",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

// columnlist.html 第一部分刊物
function columnlist_tuijian(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/composition/periodical/column/show/other/get",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

// folkways.html 下面分页
function folkways_fenye(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/book/consult/show/getByPage",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

// folkwaydetails.html 页面展示
function folkwaydetails_zhanshi(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/book/consult/show/getById",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//reading.html精读刊物
function reading_jingdu(callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/book/consult/column/show/recommend",
        type: "get",
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//赛事接口------------------------------------------------
//赛事活动
function saishi_list(callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/public/match/show/recommend/list",
        type: "get",
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//视听接口-------------------------------------------------
//视听_为你精选
function audio_jingxuan(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/media/media/show/selected/list/get",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//视听_热门推荐、栏目详情页列表
function audio_remen(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/media/media/show/getByPage",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//视听_视频
function audio_videos(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/media/media/show/getById",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//视听_栏目介绍
function audio_lanmu(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/media/media/show/column/getById",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//视听_栏目列表，其它栏目
function audio_others(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/media/media/sort/column/getByPage",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//视听_绘本花园、新作文教室
function audio_huiben(callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/media/media/show/recommend/column/media/get",
        type: "get",
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//主页接口--------------------------------------
//轮播图
function index_banner(callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/public/about/banner/get",
        //url: "http://47.92.217.62:8771/public/about/getAll",
        type: "get",
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//动态，type 5：首页动态, 6：最新活动
function index_news(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/public/about/dynamic/getByPage",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//微队会
function index_weiduihui(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/young/microTeam/show/getByPage",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//阅读轮播图
function index_ydBanner(callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/composition/periodical/show/list/getAll",
        type: "get",
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//阅读信息
function index_ydInfo(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/composition/periodical/show/home/info/get",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//少先队
function index_shaoxiandui(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/young/dynamic/show/getByPage",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//写手
function index_xieshou(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/user/user/show/youngWritersAndPioneerWriter",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//新闻详情
function news_detail(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/public/about/dynamic/getById",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//视频2
function news_video(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/young/microTeam/show/getById",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//登录注册---------------------------------------------
//登录
function login_denglu(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/user/user/login",
        type: "post",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//注册
function login_zhuce(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/user/user/register",
        type: "post",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//退出登录
function login_signOut(saile_token,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/user/user/logOut",
        type: "post",
        dataType: "json",
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + saile_token
        },
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//我的消息
function userMessage(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/user/user/message/getAll",
        type: "get",
        dataType: "json",
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + datas.token
        },
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else {
                layers("系统错误！")
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//获取用户信息
function login_getUser(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/user/user/loginUser",
        type: "get",
        dataType: "json",
        data:datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + datas.token
        },
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else if(data.code==401){
                localStorage.removeItem("saile_token");
            }else {
                layers("系统错误！")
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//账户绑定
function login_bangding(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/user/qq/qqBinding",
        type: "post",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//qq注册
function login_qqRegist(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/user/qq/qqRegister",
        type: "post",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//发送短信
function login_sends(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/user/sms/send",
        type: "post",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//找回密码
function login_findMima(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/user/user/retrievePassword",
        type: "post",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}


//智慧少先队---------------------------------------------
// wisdomYoungPioneers.html轮播图 少先队知识 少先队活动课课例 少先队动态
function wisdomYoungPioneers_lunbo(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/young/dynamic/show/getByPage",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
// wisdomYoungPioneers.html徽队会展示
function wisdomYoungPioneers_huiduihui(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/young/microTeam/show/getByPage",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

// wisdomYoungPioneers.html底部
function wisdomYoungPioneers_dibu(callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/public/goods/show/recommend/list/get",
        type: "get",
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

// youngPioneerDynamic.html 热门推荐
function youngPioneerDynamic_remen(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/young/dynamic/show/getByPage",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
// youngPioneerDynamic.html 智慧队课
function youngPioneerDynamic_zhihuii(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/young/microTeam/show/getByPage",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
// youngPioneerDetails.html 正文
function youngPioneerDetails_init(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/young/dynamic/show/getById",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

// youngPioneerDetails.html 热门推荐
function youngPioneerDetails_remen(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/young/dynamic/show/getByPage",
        type: "get",
        dataType: "json",
        data:datas,
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

//个人中心-------------------------------------------------------
//获取用户信息
function center_getUser(datas,callback) {
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/user/user/loginUser",
        type: "get",
        dataType: "json",
        data:datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + datas.token
        },
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else if(data.code==401){
                window.location.href="../login/login.html";
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、获取个人信息  */
function center_info(datas,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/user/show/getById",
        type: "get",
        data:datas,
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、修改个人信息*/
function center_infoSave(datas,userToken,callback){
    console.log(datas);
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/user/update/userInfo",
        type: "post",
        data:datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                console.log(test);
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、获取默认头像*/
function center_getDefaultIcon(userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/headImg/show/getAll",
        type: "get",
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、投稿信息管理*/
function center_getDraftInfo(userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/userDraftInfo/show/getById",
        type: "get",
//      data:datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
//      async:false,
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、保存投稿信息、userDraftInfo/save*/
function center_saveDraftInfo(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/userDraftInfo/save",
        type: "post",
        data:datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
//      async:false,
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、一键投稿、 composition/save*/
function center_saveComposition(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/composition/save",
        type: "post",
        data:datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        async:false,
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、获取刊物、 composition/save*/
function center_periodicalGetAll(callback){
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/composition/periodical/show/list/getAll",
        type: "get",
	data: {isNeedCollection : true},
        async:false,
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、文章类型、 composition/save*/
function center_articleType(callback){
    jQuery.support.cors = true;
$.ajax({
        url: APIURL + "/public/type/show/get",
        type: "get",
        async:false,
        data:{resource:"1"},
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、 我的作文composition/save*/
function center_getArticle(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/composition/getByPage",
        type: "get",
        async:false,
        data:datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、 我的作文 编辑操作	composition/delete	*/
function center_articleEdit(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/composition/getById",
        type: "get",
        async:false,
        data:datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、 我的作文 删除操作	composition/delete	*/
function center_articleDelect(datas,userToken,callback){
    console.log(datas);
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/composition/delete",
        type: "post",
        async:false,
        data:datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、 我的作文 申请操作	composition/delete	*/
function center_articleApply(datas,userToken,callback){
    console.log(datas);
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/composition/applyCredential",
        type: "post",
        async:false,
        data:datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

/*个人中心、 我的收藏 	composition/delete	*/
function center_bookCollection(datas,userToken,callback){
    console.log(datas);
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/bookCollection/getByPage",
        type: "get",
        async:false,
        data:datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

/*个人中心、 我的证书 	manuscript/getByPage	*/
function center_certificate(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/manuscript/getByPage",
        type: "get",
        async:false,
        data:datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

/*个人主页、 最近访客 	visit/show/getVisit	*/
function person_visit(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/visit/show/getVisit",
        type: "get",
        async:false,
        data:datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人主页、 最近访客、访问别人 */
function person_toVisit(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/visit/save",
        type: "post",
        async:false,
        data:datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人主页、 他的写作 	composition/visit/getByPage	*/
function articleGetByPage(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/composition/visit/getByPage",
        type: "get",
        async:false,
        data:datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、 账户余额 	userProperty/show/getById	*/
function center_userProperty(userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/userProperty/show/getById",
        type: "get",
        async:false,
//      data:datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、 提现 	userProperty/show/getById	*/
function center_payWithdrawRequest(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/payWithdrawRequest/save",
        type: "post",
        async:false,
        data:datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、 显示银行信息 	userProperty/show/getById	*/
function center_UserBankcard(userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/PayUserBankcard/getById",
        type: "get",
        async:false,
//      data:datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if(data.code==200){
                callback(data);
            }else{
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}

/*个人中心、提现记录*/
function center_getPayWithdraw(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/payWithdrawRequest/getByPage",
        type: "get",
        async: false,
        data: datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                callback(data);
            } else {
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、发送短信*/
function center_sendMsg(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/sms/sendByLogin",
        type: "post",
        async: false,
        data: datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                callback(data);
            } else {
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、修改密码*/
function center_changePwdSave(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/user/update/password",
        type: "post",
        async: false,
        data: datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                callback(data);
            } else {
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、退出重新登陆*/
function center_relogin(){
    layer.msg("稍后将退出，请重新登陆");
    setTimeout(function(){
        window.location.href="../login/login.html";
    },2000);
}
/*个人中心、获取手机号*/
function center_getUserPhone(userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/user/loginPhone",
        type: "get",
        async: false,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                callback(data);
            } else {
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、获取旧手机验证码*/
function center_getOldPhoneCode(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/sms/sendByLogin",
        type: "post",
        async: false,
        data: datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                callback(data);
            } else {
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、验证旧手机验证码*/
function center_OldPhoneCodeNext(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/sms/verify",
        type: "post",
        async: false,
        data: datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                callback(data);
            } else {
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、获取新手机验证码*/
function center_getPhoneCode(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/sms/send",
        type: "post",
        async: false,
        data: datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                callback(data);
            } else {
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、绑定新手机号*/
function center_updatePhone(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/user/update/phone",
        type: "post",
        async: false,
        data: datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                callback(data);
            } else {
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、获取全部消息*/
function center_getAllMsg(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/userMessage/getByPage",
        type: "get",
        async: false,
        data: datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                callback(data);
            } else {
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、获取单条详细消息*/
function center_getOneMsg(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/userMessage/getById",
        type: "get",
        async: false,
        data: datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                callback(data);
            } else {
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、获取单条详细消息*/
function center_deleteOneMsg(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/userMessage/delete",
        type: "post",
        async: false,
        data: datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                callback(data);
            } else {
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function () {
            var text = "服务器错误！";
            layers(text);
        }
    });
}
/*个人中心、已阅*/
function center_MsgIsRead(datas,userToken,callback){
    jQuery.support.cors = true;
$.ajax({
        url: USERURL + "/userMessage/isRead",
        type: "post",
        async: false,
        data: datas,
        headers: {
            Accept: "application/json; charset=utf-8",
            Authorization: "" + userToken
        },
        dataType: "json",
        success: function (data) {
            if (data.code == 200) {
                callback(data);
            } else {
                var text = "系统错误！";
                layers(text);
            }
        },
        error: function (){
            var text = "服务器错误！";
            layers(text);
        }
    });
}