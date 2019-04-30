
var page =1,allPages=1;
var newsType,ntn ;
//初始加载项
$(function () {
    //导航激活项
    $(".navManu li").removeClass("navActive");
    //从页面地址获取视频ID
    var windowHref = window.location.href;
    newsType = windowHref.split("&&newsType=")[1];
    if(newsType==5){
        $(".crumbs li").eq(1).find(".color_hui").text("动态");
        $(".newsTypeName").text("最新活动");
        ntn = 6;
    }else if(newsType==6){
        $(".crumbs li").eq(1).find(".color_hui").text("最新活动");
        $(".newsTypeName").text("动态");
        ntn = 5;
    }
    //列表
    var datas_news = {"page":1,"isShowIntroduce":true,"type":newsType,"limit":6};
    index_news(datas_news,function (data) {
        //尾页
        allPages = Math.ceil(data.data.count/data.data.limit);
        list_data(data);
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

//翻页
$(function () {
    $(".writing_list_pages button").click(function () {
        var buttonNum = $(this).index();
        switch (buttonNum){
            case 0:
                if(page==1){
                    var text = "已经是第一页了！";
                    layers(text);
                }else{
                    page = 1;
                    var datas_news = {"page":1,"isShowIntroduce":true,"type":newsType,"limit":6};
                    index_news(datas_news,function (data) {
                        list_data(data);
                    });
                }
                break;
            case 1:
                if(page>1){
                    page = page - 1;
                    var datas_news = {"page":page,"isShowIntroduce":true,"type":newsType,"limit":6};
                    index_news(datas_news,function (data) {
                        list_data(data);
                    });
                }else {
                    var text = "已经是第一页了！";
                    layers(text);
                }
                break;
            case 2:
                if(page<allPages){
                    page = page + 1;
                    var datas_news = {"page":page,"isShowIntroduce":true,"type":newsType,"limit":6};
                    index_news(datas_news,function (data) {
                        list_data(data);
                    });
                }else {
                    var text = "已经是最后一页了！";
                    layers(text);
                }
                break;
            case 3:
                if(page==allPages){
                    var text = "已经是最后一页了！";
                    layers(text);
                }else {
                    page = allPages;
                    var datas_news = {"page":page,"isShowIntroduce":true,"type":newsType,"limit":6};
                    index_news(datas_news,function (data) {
                        list_data(data);
                    });
                }
                break;
        }
    })
});

//列表渲染
function list_data(data) {
    $(window).scrollTop(0);
    var length = data.data.data.length;
    var html = "";
    for(var i=0;i<length;i++){
        var title = data.data.data[i].title;
        var createTime = data.data.data[i].createTime.split(" ")[0];
        var source = data.data.data[i].source;
        var introduce = data.data.data[i].introduce;
        var icon = data.data.data[i].icon;
        var backimg = "background-image: url('"+icon+"')";
        var dynamicId = data.data.data[i].dynamicId;
        var href = "../news/news_details.html?&&dynamicId="+dynamicId+"&&newsType="+newsType;
        html += '<li>' +
            '                    <div class="lc_img">' +
            '                        <a href="'+href+'" title="'+title+'" class="imgcover" style="'+backimg+'"></a>' +
            '                    </div>' +
            '                    <div class="lc_info">' +
            '                        <a href="'+href+'" title="'+title+'"><h3>'+title+'</h3></a>' +
            '                        <span>'+createTime+" 来源："+source+'</span>' +
            '                        <div class="lcp">'+introduce+'</div>' +
            '                    </div>' +
            '                </li>';
    }
    $(".lc_left ul").html(html);
    overHide("lc_info .lcp",75);
}