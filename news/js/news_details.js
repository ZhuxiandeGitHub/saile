
var newsType,ntn;
//初始加载项
$(function () {
    //导航激活项
    $(".navManu li").removeClass("navActive");
    //从页面地址获取视频ID
    var windowHref = window.location.href;
    var dynamicId = windowHref.split("&&dynamicId=")[1].split("&&newsType=")[0];
    newsType = windowHref.split("&&newsType=")[1];
    var hrefs = "../news/news_list.html?&&newsType="+newsType;
    $(".crumbs li").eq(1).find("a").attr("href",hrefs);
    if(newsType==5){
        $(".crumbs li").eq(1).find("a").text("动态");
        $(".newsTypeName").text("最新活动");
        ntn = 6;
    }else if(newsType==6){
        $(".crumbs li").eq(1).find("a").text("最新活动");
        $(".newsTypeName").text("动态");
        ntn = 5;
    }
    //新闻内容
    var datas_news = {"dynamicId":dynamicId};
    news_detail(datas_news,function (data) {
        var title = data.data.title;
        $("head title").text(title+"-赛乐网-赛乐资讯详情页");
        $(".crumbs li").eq(2).find(".color_hui").text(title);
        var createTime = data.data.createTime.split(" ")[0];
        var source = data.data.source;
        var content = data.data.content;
        $(".lc_left h1").text(title);
        $(".detail_span span").text(createTime+" 来源："+source);
        $(".detail_cont").html(content);
    });
    //推荐
    var datas_tuijian = {"page":1,"isShowIntroduce":false,"type":ntn,"limit":5};
    index_news(datas_tuijian,function (data) {
        var length = data.data.data.length;
        for(var i=0;i<length;i++){
            var title = data.data.data[i].title;
            var dynamicId = data.data.data[i].dynamicId;
            var href = "../news/news_details.html?&&dynamicId="+dynamicId+"&&newsType="+ntn;
            $(".remlist li").eq(i).find("a").attr({"title":title,"href":href});
            $(".remlist li").eq(i).find("a").text(title);
        }
    });
    //少儿视听
    var datas = {"limit":4,"sortBy":1};
    audio_jingxuan(datas,function (data) {
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
            $(".seshiting li").eq(i).find(".imgcover").attr("style",backimg);
            $(".seshiting li").eq(i).find("img").attr("src",player);
            $(".seshiting li").eq(i).find("a").attr({"href":href,"title":title});
            $(".seshiting li").eq(i).find("p a").text(title);
        }
    });
});