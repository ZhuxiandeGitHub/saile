
//初始加载项
$(function () {
    //导航激活项
    $(".navManu li").removeClass("navActive");
    $(".navManu li").eq(5).addClass("navActive");
    //为你精选
    var datas = {"limit":5,"sortBy":1};
    audio_jingxuan(datas,function (data) {
        jingxuan_data(data);
    });
    //热门推荐
    var datas_remen = {"page":1,"columnId":0,"sortBy":2};
    audio_remen(datas_remen,function (data) {
        var datanum = data.data.data;
        var orders = $(".Rright_cont li");
        list_data1(datanum,orders);
    });
    //绘本花园、新作文教室
    audio_huiben(function (data) {
        //栏目1
        var title1 = data.data[0].title;
        var id1 = data.data[0].id;
        //栏目1名称
        $("#lanmu1_title .title_name").text(title1);
        $("#lanmu1_title a").attr("href","./audio_article.html?&&columnId="+id1);
        //栏目1列表
        var datanum1 = data.data[0].mediaList;
        var orders1 = $("#lanmu1_count li");
        list_data1(datanum1,orders1);
        //栏目2
        var title2 = data.data[1].title;
        var id2 = data.data[1].id;
        //栏目2名称
        $("#lanmu2_title .title_name").text(title2);
        $("#lanmu2_title a").attr("href","./audio_article.html?&&columnId="+id2);
        //栏目2列表
        var datanum2 = data.data[1].mediaList;
        var orders2 = $("#lanmu2_count li");
        list_data1(datanum2,orders2);
    });
});

//延迟加载项
$(function () {
    setTimeout(function () {
        //精品栏目
        if($(".jingpin").attr('isLoaded')!="true"){
            $(".jingpin").attr('isLoaded', true);
            jingpin();
        }
    },2000)
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
                top_jingpin = $(".jingpin").offset().top;
            //精品栏目
            if(top_jingpin < 1.5*winH + scrollH && $(".jingpin").attr('isLoaded')!="true"){
                $(".jingpin").attr('isLoaded', true);
                jingpin();
            }
        }, 200);
    });
});

//换一批
$(function () {
    $(".recommend_left .title_more").click(function () {
        var datas = {"limit":5,"sortBy":0};
        audio_jingxuan(datas,function (data) {
            jingxuan_data(data);
        });
    });
});

//精品栏目渲染
function jingpin() {
    var datas_others = {"page":1,"limit":5};
    audio_others(datas_others,function (data) {
        var html = "";
        var length = data.data.data.length;
        for(var i=0;i<length;i++){
            var title = data.data.data[i].title;
            var columnId = data.data.data[i].id;
            var columnImg = IMGURL + data.data.data[i].columnImg;
            var backimg = "background-image: url('"+columnImg+"')";
            var href = "./audio_article.html?&&columnId="+columnId;
            $(".jingpin_div li").eq(i).find(".imgcover").attr({"href":href,"title":title,"style":backimg});
            $(".jingpin_div li").eq(i).find("p a").attr({"href":href,"title":title});
            $(".jingpin_div li").eq(i).find("p a").text(title);
        }
    });
}

//精选渲染
function jingxuan_data(data) {
    var title1 = data.data[0].title;
    var id1 = data.data[0].id;
    var imgUrl1 = IMGURL + data.data[0].imgUrl;
    var backimg1 = "background-image: url('"+imgUrl1+"')";
    var mediaType1 = data.data[0].mediaType;//格式：1音频或2视频
    var href1 = "",player1 = "";
    if(mediaType1==1){
        href1 = "audio_music.html?&&mediaId="+id1;
        player1 = "./img/music.png";
    }else if(mediaType1==2){
        href1 = "audio_video.html?&&mediaId="+id1;
        player1 = "./img/play.png";
    }
    $(".Rleft_cont_left .imgcover").attr("style",backimg1);
    $(".Rleft_cont_left .imgpop").attr({"href":href1,"title":title1});
    $(".Rleft_cont_left img").attr("src",player1);
    $(".Rleft_cont_left p a").attr({"href":href1,"title":title1});
    $(".Rleft_cont_left p a").text(title1);
    var length = data.data.length;
    for(var i=1;i<length;i++){
        var title = data.data[i].title;
        var id = data.data[i].id;
        var imgUrl = IMGURL + data.data[i].imgUrl;
        var backimg = "background-image: url('"+imgUrl+"')";
        var mediaType = data.data[i].mediaType;//格式：1音频或2视频
        var href = "",player = "";
        if(mediaType==1){
            href = "audio_music.html?&&mediaId="+id;
            player = "./img/music.png";
        }else if(mediaType==2){
            href = "audio_video.html?&&mediaId="+id;
            player = "./img/play.png";
        }
        $(".Rleft_cont_right li").eq(i-1).find(".imgcover").attr("style",backimg);
        $(".Rleft_cont_right li").eq(i-1).find(".imgpop").attr({"href":href,"title":title});
        $(".Rleft_cont_right li").eq(i-1).find("img").attr("src",player);
        $(".Rleft_cont_right li").eq(i-1).find("p a").attr({"href":href,"title":title});
        $(".Rleft_cont_right li").eq(i-1).find("p a").text(title);
    }
}

//列表渲染
function list_data1(datanum,orders) {
    var length = datanum.length;
    for(var i=0;i<length;i++){
        var title = datanum[i].title;
        var id = datanum[i].id;
        var imgUrl = IMGURL + datanum[i].imgUrl;
        var backimg = "background-image: url('"+imgUrl+"')";
        var mediaType = datanum[i].mediaType;//格式：1音频或2视频
        var href = "",player = "";
        if(mediaType==1){
            href = "audio_music.html?&&mediaId="+id;
            player = "./img/music.png";
        }else if(mediaType==2){
            href = "audio_video.html?&&mediaId="+id;
            player = "./img/play.png";
        }
        orders.eq(i).find(".imgcover").attr("style",backimg);
        orders.eq(i).find(".imgpop").attr({"href":href,"title":title});
        orders.eq(i).find("img").attr("src",player);
        orders.eq(i).find("p a").attr({"href":href,"title":title});
        orders.eq(i).find("p a").text(title);
    }
}