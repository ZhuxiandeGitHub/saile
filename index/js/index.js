
var li_width;//轮播图2的li标签宽度
//初始加载项
$(function () {
    //导航激活项
    $(".navManu li").removeClass("navActive");
    $(".navManu li").eq(0).addClass("navActive");
    $(".navManu a").attr({"target":"_blank","rel":"noopener norefferrer"});
    $(".footer_part1 a").attr({"target":"_blank","rel":"noopener norefferrer"});
    $(".loginDiv a").attr({"target":"_blank","rel":"noopener norefferrer"});
    //动态
    var datas_news = {"page":1,"isShowIntroduce":false,"type":5,"limit":1};
    index_news(datas_news,function (data) {
        var orders = $(".news ul").eq(0).find("li");
        news(data,orders);
    });
    //最新活动
    var datas_news = {"page":1,"isShowIntroduce":false,"type":6,"limit":2};
    index_news(datas_news,function (data) {
        var orders = $(".news ul").eq(1).find("li");
        news(data,orders);
    });
   //轮播图
    var count = 0;
    var picNum = 0;
    index_banner(function (data) {
        var length = data.data.length;
        count = length;
        var html = "";
        for(var i=0;i<length;i++){
            var imgUrl = IMGURL + data.data[i].img;
            var title = data.data[i].title;
            var hrefUrl = data.data[i].url;
            html += '<a href="'+hrefUrl+'" class="imgcover jtback" data-img="'+imgUrl+'" title="'+title+'" target="_blank" rel="noopener norefferrer"></a>';
        }
        $("#banner_list").html(html);
        //加载第一张轮播图
        var firstImg = IMGURL + data.data[0].img;
        var backimg = "background-image: url('"+firstImg+"')";
        $("#banner_list a").eq(0).attr({"style":backimg,"isloaded":true});
        $("#banner_list a").eq(0).show();
        //左
        $("#banner_ul .bcLeft").click(function() {
            picNum = picNum -1;
            if(picNum>-1){
                if($("#banner_list .imgcover").eq(picNum).attr("isloaded")!="true"){
                    var imgUrl = $("#banner_list a").eq(picNum).attr("data-img");
                    var backimg = "background-image: url('"+imgUrl+"')";
                    $("#banner_list .imgcover").eq(picNum).attr({"style":backimg,"isloaded":true});
                }
                $("#banner_list a").filter(":visible").fadeOut(500).parent().children().eq(picNum).fadeIn(1000);
            }else {
                picNum = count-1;
                if($("#banner_list .imgcover").eq(picNum).attr("isloaded")!="true"){
                    var imgUrl = $("#banner_list a").eq(picNum).attr("data-img");
                    var backimg = "background-image: url('"+imgUrl+"')";
                    $("#banner_list .imgcover").eq(picNum).attr({"style":backimg,"isloaded":true});
                }
                $("#banner_list a").filter(":visible").fadeOut(500).parent().children().eq(picNum).fadeIn(1000);
            }
        });
        //右
        $("#banner_ul .bcRight").click(function() {
            picNum = picNum +1;
            if(picNum<count){
                if($("#banner_list .imgcover").eq(picNum).attr("isloaded")!="true"){
                    var imgUrl = $("#banner_list a").eq(picNum).attr("data-img");
                    var backimg = "background-image: url('"+imgUrl+"')";
                    $("#banner_list .imgcover").eq(picNum).attr({"style":backimg,"isloaded":true});
                }
                $("#banner_list a").filter(":visible").fadeOut(500).parent().children().eq(picNum).fadeIn(1000);
            }else {
                picNum = 0;
                $("#banner_list a").filter(":visible").fadeOut(500).parent().children().eq(picNum).fadeIn(1000);
            }
        });
        //控制器
        var t = setInterval(autoPlay,4000);
        //鼠标覆盖控制器，停止轮播
        $(".banControl").find("span").hover(function () {
            $(this).addClass("spanOn");
            clearInterval(t)
        },function () {
            t = setInterval(autoPlay,4000);
            $(this).removeClass("spanOn");
        });
        //鼠标覆盖轮播图片，停止轮播
        $("#banner_list").find("a").hover(function () {
            clearInterval(t)
        },function () {
            t = setInterval(autoPlay,4000);
        });
        function autoPlay() {
            $("#banner_ul .bcRight").click()
        }
    });
});

//延迟加载项
$(function () {
    //2秒后获取微队会、少先队数据
   setTimeout(function () {
       //微队会
       if($(".duiHui").attr('isLoaded')!="true"){
           $(".duiHui").attr('isLoaded',true);
           var datas_wdh = {"page":1,"limit":4,"sortBy":2};
           index_weiduihui(datas_wdh,function (data) {
               wdh(data);
           });
       }
       //少先队
       if($(".youthsDiv").attr('isLoaded')!="true"){
           $(".youthsDiv").attr('isLoaded',true);
           var datas_sxd = {"page":1,"limit":6,"isShowIntroduce":false,"type":4,"sortBy":2};
           console.log("datas_sxd:"+JSON.stringify(datas_sxd));
           index_shaoxiandui(datas_sxd,function (data) {
               sxd(data);
           });
       }
   },2000);
   //3秒后获取轮播图2数据
   setTimeout(function () {
       //轮播图2
       if($(".bigpicPop").attr('isLoaded')!="true"){
           $(".bigpicPop").attr('isLoaded',true);
           index_ydBanner(function (data) {
               $(".bigpicPop").attr('isLoaded',true);
               //渲染列表图片和标题
               var length = data.data.length;
               var html ="",html_word="";
               for(var i =0;i<length;i++){
                   var stagesCover = data.data[i].stagesCover;
                   var backimg = "background-image: url('"+stagesCover+"')";
                   var periodicalId = data.data[i].periodicalId;
                   var title = data.data[i].title;
                   var introduce = data.data[i].introduce;
                   html += '<li data-content-id="'+periodicalId+'"><span class="imgcover jtback" style="'+backimg+'" title="'+introduce+'"></span></li>';
                   html_word += '<li><span>'+title+'</span></li>';
               }
               $(".banner2 .bigPicshow ul").html(html);
               $(".banner2_words ul ").html(html_word);
               //计算li宽度
               var seeDiv_width = $(".bigPicshow").width();
               li_width = seeDiv_width / 7;
               var ul_height = 220/192*li_width;
               $(".bigPicshow ul,.bigPicshow,.bigLeft,.bigRight").css("height",ul_height);
               $(".bigPicshow li").css("width",li_width);
               $(".banner2_words").css("width",seeDiv_width);
               $(".banner2_words li").css("width",li_width);
               //阅读信息初始化
               var ydinfo_id = $(".bigPicshow li").eq(3).attr("data-content-id");
               ydInfo(ydinfo_id);
           });
       }
   },3000);
   //4秒后获取剩余所有数据
    setTimeout(function () {
        //征稿信息
        if($("#zhenggao").attr('isLoaded')!="true"){
            $("#zhenggao").attr('isLoaded',true);
            writing_zhenggao_list(function (data) {
                zhenggao_datas(data);
            });
        }
        //赛乐写手
        if($(".writer_right").attr('isLoaded')!="true"){
            $(".writer_right").attr('isLoaded',true);
            var datas_xieshou = {"limit":8};
            index_xieshou(datas_xieshou,function (data) {
                xieshou_data(data)
            });
        }
        //用稿通知
        if($(".notice").attr('isLoaded')!="true"){
            $(".notice").attr('isLoaded',true);
            var datas2 = {"page":1,"status":5,"isShowContent":false,"limit":4,"periodicalId":0};
            writing_lists(datas2,function (data) {
                tongzhi_datas(data);
            });
        }
        //少儿视听
        if($(".child_part").attr('isLoaded')!="true"){
            $(".child_part").attr('isLoaded',true);
            var datas = {"limit":8,"sortBy":2};
            audio_jingxuan(datas,function (data) {
                jingxuan_data(data);
            });
        }
    },4000);
});

//滚动加载项
$(function () {
    var clock;
    $(window).on("scroll", function(){
        if (clock) {
            clearTimeout(clock);
        }
        clock = setTimeout(function(){
            var scrollH = $(window).scrollTop(),
                winH = $(window).height(),
                top_duihui = $(".duiHui").offset().top,
                top_youthsDiv = $(".youthsDiv").offset().top,
                top_bigpicPop = $(".bigpicPop").offset().top,
                top_xieshou = $(".writer_right").offset().top,
                top_zhenggao = $("#zhenggao").offset().top,
                top_notice = $(".notice").offset().top,
                top_child_part = $(".child_part").offset().top;
            //微队会
            if(top_duihui < 1.5*winH + scrollH && $(".duiHui").attr('isLoaded')!="true"){
                $(".duiHui").attr('isLoaded',true);
                var datas_wdh = {"page":1,"limit":4,"sortBy":2};
                index_weiduihui(datas_wdh,function (data) {
                    wdh(data);
                });
            }
            //少先队
            if(top_youthsDiv < 1.5*winH + scrollH && $(".youthsDiv").attr('isLoaded')!="true"){
                $(".youthsDiv").attr('isLoaded',true);
                var datas_sxd = {"page":1,"limit":6,"isShowIntroduce":false,"type":4,"sortBy":2};
                index_shaoxiandui(datas_sxd,function (data) {
                    sxd(data);
                });
            }
            //轮播图2
            if(top_bigpicPop < 1.5*winH + scrollH && $(".bigpicPop").attr('isLoaded')!="true"){
                $(".bigpicPop").attr('isLoaded',true);
                index_ydBanner(function (data) {
                    //渲染列表图片和标题
                    var length = data.data.length;
                    var html ="",html_word="";
                    for(var i =0;i<length;i++){
                        var stagesCover = data.data[i].stagesCover;
                        var backimg = "background-image: url('"+stagesCover+"')";
                        var periodicalId = data.data[i].periodicalId;
                        var title = data.data[i].title;
                        var introduce = data.data[i].introduce;
                        html += '<li data-content-id="'+periodicalId+'"><span class="imgcover jtback" style="'+backimg+'" title="'+introduce+'"></span></li>';
                        html_word += '<li><span>'+title+'</span></li>';
                    }
                    $(".banner2 .bigPicshow ul").html(html);
                    $(".banner2_words ul ").html(html_word);
                    //计算li宽度
                    var seeDiv_width = $(".bigPicshow").width();
                    li_width = seeDiv_width / 7;
                    var ul_height = 220/192*li_width;
                    $(".bigPicshow ul,.bigPicshow,.bigLeft,.bigRight").css("height",ul_height);
                    $(".bigPicshow li").css("width",li_width);
                    $(".banner2_words").css("width",seeDiv_width);
                    $(".banner2_words li").css("width",li_width);
                    //阅读信息初始化
                    var ydinfo_id = $(".bigPicshow li").eq(3).attr("data-content-id");
                    ydInfo(ydinfo_id);
                });
            }
            //征稿信息
            if(top_zhenggao < 1.5*winH + scrollH && $("#zhenggao").attr('isLoaded')!="true"){
                $("#zhenggao").attr('isLoaded',true);
                writing_zhenggao_list(function (data) {
                    zhenggao_datas(data);
                });
            }
            //赛乐写手
            if(top_xieshou < 1.5*winH + scrollH && $(".writer_right").attr('isLoaded')!="true"){
                $(".writer_right").attr('isLoaded',true);
                var datas_xieshou = {"limit":8};
                index_xieshou(datas_xieshou,function (data) {
                    xieshou_data(data)
                });
            }
            //用稿通知
            if(top_notice < 1.5*winH + scrollH && $(".notice").attr('isLoaded')!="true"){
                $(".notice").attr('isLoaded',true);
                var datas2 = {"page":1,"status":5,"isShowContent":false,"limit":4,"periodicalId":0};
                writing_lists(datas2,function (data) {
                    tongzhi_datas(data);
                });
            }
            //少儿视听
            if(top_child_part < 1.5*winH + scrollH && $(".child_part").attr('isLoaded')!="true"){
                $(".child_part").attr('isLoaded',true);
                var datas = {"limit":8,"sortBy":2};
                audio_jingxuan(datas,function (data) {
                    jingxuan_data(data);
                });
            }
        }, 200);
    });
});

//点击轮播图2的图片列表
$(".bigPicshow").on("click","li",function () {
    //阅读信息
    var ydinfo_id = $(this).attr("data-content-id");
    ydInfo(ydinfo_id);
    //滚动
    var li_index = $(this).index();
    if(li_index>3){
        $(".bigPicshow ul").animate({"left":-li_width*(li_index-3)},function () {
            for(var i=0;i<li_index-3;i++){
                var aa = $(".bigPicshow ul li").first().prop("outerHTML");
                $(".bigPicshow ul").append(aa);
                $(".bigPicshow ul li").first().remove();
            }
            $(".bigPicshow ul").css({"left":0});
        });
        $(".banner2_words ul").animate({"left":-li_width*(li_index-3)},function () {
            for(var i=0;i<li_index-3;i++){
                var aa = $(".banner2_words ul li").first().prop("outerHTML");
                $(".banner2_words ul").append(aa);
                $(".banner2_words ul li").first().remove();
            }
            $(".banner2_words ul").css({"left":0});
        });
    }else if(li_index<3){
        $(".bigPicshow ul").animate({"left":li_width*(3-li_index)},function () {
            //刊物详情
            for(var i=0;i<3-li_index;i++){
                var aa = $(".bigPicshow ul li").last().prop("outerHTML");
                $(".bigPicshow ul li:first").before(aa);
                $(".bigPicshow ul li").last().remove();
            }
            $(".bigPicshow ul").css({"left":0});
        });
        $(".banner2_words ul").animate({"left":li_width},function () {
            for(var i=0;i<3-li_index;i++){
                var aa = $(".banner2_words ul li").last().prop("outerHTML");
                $(".banner2_words ul li:first").before(aa);
                $(".banner2_words ul li").last().remove();
            }
            $(".banner2_words ul").css({"left":0});
        });
    }
});
//点击轮播图2的左右箭头
$(function() {
    //左
    $(".bigLeft span").click(function() {
        //阅读信息
        var ydinfo_id = $(".bigPicshow li").eq(4).attr("data-content-id");console.log(ydinfo_id);
        ydInfo(ydinfo_id);
        //滚动
        $(".bigPicshow ul").animate({"left":-li_width},function () {
            var aa = $(".bigPicshow ul li").eq(0).prop("outerHTML");
            $(".bigPicshow ul").append(aa);
            $(".bigPicshow ul li").eq(0).remove();
            $(".bigPicshow ul").css({"left":0});
        });
        $(".banner2_words ul").animate({"left":-li_width},function () {
            var aa = $(".banner2_words ul li").eq(0).prop("outerHTML");
            $(".banner2_words ul").append(aa);
            $(".banner2_words ul li").eq(0).remove();
            $(".banner2_words ul").css({"left":0});
        });
    });
    //右
    $(".bigRight span").click(function() {
        //阅读信息
        var ydinfo_id = $(".bigPicshow li").eq(2).attr("data-content-id");console.log(ydinfo_id);
        ydInfo(ydinfo_id);
        //滚动
        $(".bigPicshow ul").animate({"left":li_width},function () {
            var aa = $(".bigPicshow ul li").last().prop("outerHTML");
            $(".bigPicshow ul li:first").before(aa);
            $(".bigPicshow ul li").last().remove();
            $(".bigPicshow ul").css({"left":0});
        });
        $(".banner2_words ul").animate({"left":li_width},function () {
            var aa = $(".banner2_words ul li").last().prop("outerHTML");
            $(".banner2_words ul li:first").before(aa);
            $(".banner2_words ul li").last().remove();
            $(".banner2_words ul").css({"left":0});
        });
    });
    //定时器
    // var t = setInterval(autoPlay,4000);
    // $(".bigpicShang span,.bigPicshow span,.banner2_words span,.banner2_details").hover(function () {
    //     clearInterval(t)
    // },function () {
    //     t = setInterval(autoPlay,4000);
    // });
    // function autoPlay() {
    //     $(".bigLeft span").click();
    // }
});

//投稿
$(function () {
   $("#tougao").click(function () {
       var userData = JSON.parse(sessionStorage.getItem("userData"));
       if(userData!=null){
           window.open("../personalCenter/center_contribute.html");
       }else {
           layers("请先登录！");
       }
   })
});

//赛乐写手渲染
function xieshou_data(data) {
    var length1 = data.data.pioneerWriter.length;
    for(var i=0;i<length1;i++){
        var nickname = data.data.pioneerWriter[i].nickname;
        var id = data.data.pioneerWriter[i].id;
        var img = data.data.pioneerWriter[i].img;
        var backimg = "background-image: url('"+img+"')";
        var href = "../personalCenter/personal-main.html?userId="+id;
        var schoolTitle = data.data.pioneerWriter[i].schoolTitle;
        $(".van_writer li").eq(i).find("span").text(schoolTitle);
        $(".van_writer li").eq(i).find("p a").text(nickname);
        $(".van_writer li").eq(i).find("a").attr({"href":href,"title":nickname});
        $(".van_writer li").eq(i).find(".writer_head a").attr({"style":backimg});
    }
    var length2 = data.data.youngWriters.length;
    for(var i=0;i<length2;i++){
        var nickname = data.data.youngWriters[i].nickname;
        var id = data.data.youngWriters[i].id;
        var img = data.data.youngWriters[i].img;
        var backimg = "background-image: url('"+img+"')";
        var href = "../personalCenter/personal-main.html?userId="+id;
        var schoolTitle = data.data.youngWriters[i].schoolTitle;
        $(".saile_writer li").eq(i).find("span").text(schoolTitle);
        $(".saile_writer li").eq(i).find("p a").text(nickname);
        $(".saile_writer li").eq(i).find("a").attr({"href":href,"title":nickname});
        $(".saile_writer li").eq(i).find(".writer_head a").attr({"style":backimg});
    }
}
//少儿视听
function jingxuan_data(data) {
    var cp_img = $(".child_part").attr("data-img");
    var cp_back = "background-image: url('"+cp_img+"')";
    $(".child_part").attr("style",cp_back);
    var length = data.data.length;
    for(var i=0;i<length;i++){
        var title = data.data[i].title;
        var id = data.data[i].id;
        var imgUrl = IMGURL + data.data[i].imgUrl;
        var backimg = "background-image: url('"+imgUrl+"')";
        var mediaType = data.data[i].mediaType;//格式：1音频或2视频
        var href = "",player = "";
        if(mediaType==1){
            href = "../audio/audio_music.html?&&mediaId="+id;
            player = "../audio/img/music.png";
        }else if(mediaType==2){
            href = "../audio/audio_video.html?&&mediaId="+id;
            player = "../audio/img/play.png";
        }
        $(".child_div li").eq(i).find(".imgcover").attr("style",backimg);
        $(".child_div li").eq(i).find(".imgpop").attr({"href":href,"title":title});
        $(".child_div li").eq(i).find("img").attr("src",player);
        $(".child_div li").eq(i).find("p a").attr({"href":href,"title":title});
        $(".child_div li").eq(i).find("p a").text(title);
    }
}
//用稿通知渲染
function tongzhi_datas(data) {
    var length = data.data.data.length;
    var html = "";
    for(var i=0;i<length;i++) {
        var title = data.data.data[i].title;
        var author = data.data.data[i].author;
        var periodicalName = data.data.data[i].periodicalName;
        var id = data.data.data[i].id;
        var href = "../writing/writing_details.html?&&compositionId=" + id;
        $(".notice_right li").eq(i).find("a").attr({"href": href, "title": title});
        $(".notice_right li").eq(i).find(".notice_works").text(title);
        $(".notice_right li").eq(i).find(".notice_author").html("作者：<span>" + author + "</span>");
        $(".notice_right li").eq(i).find(".notice_edition").text(periodicalName);
    }
}
//征稿信息渲染
function zhenggao_datas(data) {
    var length = data.data.length;
    for(var i=0;i<length;i++){
        var title = data.data[i].title;
        var periodicalId = data.data[i].periodicalId;
        var introduce = data.data[i].introduce;
        var hrefs = "../writing/writing_notice.html?&&periodicalId="+periodicalId;
        $(".draft_list li").eq(i).find("a").attr({"title":title,"href":hrefs});
        $(".draft_list li").eq(i).find("p").html("<span class='draft_yuan'></span>"+title+introduce);
    }
    var imgurl = $(".writer_left").attr("data-img");
    var backimg = "background-image: url('"+imgurl+"')";
    $(".writer_left").attr("style",backimg);
    $("#zhenggao .jtbai").removeClass("jtbai");
    $("#zhenggao").removeClass("jtback");
}
//阅读信息渲染
function ydInfo(ydinfo_id) {
    var datas_ydInfo = {"periodicalId":ydinfo_id};
    index_ydInfo(datas_ydInfo,function (data) {
        //左边
        var outTitle = data.data.title;
        var introduce = data.data.introduce;
        var stagesCover = data.data.stagesCover;
        var backimg = "background-image: url('"+stagesCover+"')";
        var qqgroup = data.data.qqgroup;
        var periodicalId = data.data.periodicalId;
        //iscollection是否征稿 1:是 2：否
        var iscollection = data.data.iscollection;
        if(iscollection==2){
            $("#tougao").hide();
        }else {
            $("#tougao").show();
        }
        var href = "../reading/columnlist.html?periodicalId="+periodicalId+"&lanwumz="+outTitle;
        $(".banner2_details .ba2left_det h2").text(outTitle);
        $(".banner2_details .ba2left_det .ba2left_p").text(introduce);
        //超出字数隐藏添加省略号
        overHide("ba2left_p",140);
        $(".banner2_details .ba2left_det .ba2left_span").text("投稿QQ群："+qqgroup);
        $(".banner2_details .ba2left_img").attr({"title":outTitle,"style":backimg,"href":href});
        $(".ba2left_h2").attr("href",href);
        //右边
        var outLength = data.data.columnConsultList.length;
        if(outLength==1){
            $(".ba2right_part1 div").eq(1).hide();
            $(".ba2right_part1 div").eq(0).css("height","100%");
            var lanmuTitle = data.data.columnConsultList[0].periodicalColumnTitle;
            var columnId = data.data.columnConsultList[0].columnId;
            var outhref = "../reading/folkways.html?columnId="+columnId+"&lanwumz="+outTitle+"&columnmz="+lanmuTitle;
            $(".ba2right_part1 a").attr({"href":outhref});
            $(".banner2_details .ba2right_p").text(lanmuTitle);
            var innerLength = data.data.columnConsultList[0].consultList.length;
            for(var i =0;i<innerLength;i++){
                var innerTitle = data.data.columnConsultList[0].consultList[i].title;
                var innerImg = data.data.columnConsultList[0].consultList[i].img;
                var backimg = "background-image: url('"+innerImg+"')";
                var consultId = data.data.columnConsultList[0].consultList[i].consultId;
                var href = "../reading/folkwaydetails.html?consultId="+consultId+"&title="+innerTitle;
                $(".ba2right_part2 li").eq(i).find("p").text(innerTitle);
                $(".ba2right_part2 li").eq(i).find("a").attr({"title":innerTitle,"style":backimg,"href":href});
            }
        }
        if(outLength==2){
            $(".ba2right_part1 div").eq(1).show();
            $(".ba2right_part1 div").eq(0).css("height","50%");
            for(var j=0;j<outLength;j++){
                var lanmuTitle = data.data.columnConsultList[j].periodicalColumnTitle;
                var columnId = data.data.columnConsultList[j].columnId;
                var outhref = "../reading/folkways.html?columnId="+columnId+"&lanwumz="+outTitle+"&columnmz="+lanmuTitle;
                $(".ba2right_part1 a").eq(j).attr({"href":outhref});
                $(".banner2_details .ba2right_p").eq(j).text(lanmuTitle);
                var innerLength = data.data.columnConsultList[j].consultList.length;
                for(var i =0;i<innerLength;i++){
                    var innerTitle = data.data.columnConsultList[j].consultList[i].title;
                    var innerImg = data.data.columnConsultList[j].consultList[i].img;
                    var backimg = "background-image: url('"+innerImg+"')";
                    var consultId = data.data.columnConsultList[0].consultList[i].consultId;
                    var href = "../reading/folkwaydetails.html?consultId="+consultId+"&title="+innerTitle;
                    $(".ba2right_part2 li").eq(i+j*2).find("p").text(innerTitle);
                    $(".ba2right_part2 li").eq(i+j*2).find("a").attr({"title":innerTitle,"style":backimg,"href":href});
                }
            }
        }
    });
}
//少先队
function sxd(data) {
    var yh_outdiv = $(".youths_outdiv").attr("data-img");
    var yh_back = "background-image: url('"+yh_outdiv+"')";
    $(".youths_outdiv").attr("style",yh_back);
    var length = data.data.data.length;
    $.each($(".youths_num"), function(m,val){
    	var i = (val.innerHTML-1);
    	if(data.data.data[i]!=null){
	    	var title = data.data.data[i].title;
	        var school = data.data.data[i].school;
	        var dynamicId = data.data.data[i].dynamicId;
	        var href = "../wisdomYoungPioneers/youngPioneerDetails.html?dynamicId="+dynamicId+"&type=4";
	        $(".youths li").eq(m).find("a").attr({"title":title,"href":href});
	        $(".youths li").eq(m).find(".youths_title").text(title);
	        $(".youths li").eq(m).find(".youths_school").text(school);
    	}
    });
//  for(var i=0;i<length;i++){
//      var title = data.data.data[i].title;
//      var school = data.data.data[i].school;
//      var dynamicId = data.data.data[i].dynamicId;
//      var href = "../wisdomYoungPioneers/youngPioneerDetails.html?dynamicId="+dynamicId+"&type=4";
//      $(".youths li").eq(i).find("a").attr({"title":title,"href":href});
//      $(".youths li").eq(i).find(".youths_title").text(title);
//      $(".youths li").eq(i).find(".youths_school").text(school);
//  }
}
//微队会渲染
function wdh(data) {
    var length = data.data.data.length;
    for(var i=0;i<length;i++){
        var title = data.data.data[i].title;
        var prizeInfo = data.data.data[i].prizeInfo;
        var imgUrl = IMGURL +data.data.data[i].imgUrl;
        var backimg = "background-image: url('"+imgUrl+"')";
        var microTeamId = data.data.data[i].microTeamId;
        var href = "../news/news_video.html?&&microTeamId="+microTeamId;
        $(".duiHui_ul li").eq(i).find(".duiHui_img").attr("style",backimg);
        $(".duiHui_ul li").eq(i).find("a").attr({"title":title,"href":href});
        $(".duiHui_ul li").eq(i).find("p").text(title);
        $(".duiHui_ul li").eq(i).find("span").text(prizeInfo);
    }
}
//动态渲染
function news(data,orders) {
    var length = data.data.data.length;
    for(var i=0;i<length;i++){
        var title = data.data.data[i].title;
        var icon = IMGURL + data.data.data[i].icon;
        var type = data.data.data[i].type;
        var dynamicId = data.data.data[i].dynamicId;
        var href = "../news/news_details.html?&&dynamicId="+dynamicId+"&&newsType="+type;
        var backimg = "background-image: url('"+icon+"')";
        orders.eq(i).find("p").text(title);
        orders.eq(i).find("a").attr({"title":title,"href":href});
        orders.eq(i).find(".news_img").attr("style",backimg);
    }
}
