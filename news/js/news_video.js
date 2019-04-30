
var columnId = "",mediaUrl="";
var microTeamId;
//初始加载项
$(function () {
    //导航激活项
    $(".navManu li").removeClass("navActive");
    //从页面地址获取视频ID
    var windowHref = window.location.href;
    microTeamId = windowHref.split("&&microTeamId=")[1];
    //视频
    var datas_videos = {"microTeamId":microTeamId};
    news_video(datas_videos,function (data) {
        var title = data.data.title;
        $("head title").text(title+"-赛乐视频页");
        var prizeInfo = data.data.prizeInfo;
        columnId = data.data.columnId;
        var createTime = data.data.createTime.split(" ")[0]+"上传";
        mediaUrl = IMGURL + data.data.mediaUrl;
        var imgUrl = IMGURL + data.data.imgUrl;
        var backimg = "background-image: url('"+imgUrl+"')";
        $(".video_left video").attr("style",backimg);
        $(".crumbs li:last span").text(title);
        var phtml = title+"<span>"+createTime+"</span>";
        $(".video_left p").html(phtml);
        $(".video_left").children("span").text(prizeInfo);
        //相关推荐
        var datas_remen = {"page":1,"sortBy":3,"limit":3,"microTeamId":microTeamId};
        index_weiduihui(datas_remen,function (data) {
            var orders = $("#tuijian ul");
            var datanums = data.data.data;
            data_about(orders,datanums);
        });
    });
    //猜你喜欢
    var datas_jingxuan = {"limit":8,"sortBy":4,"page":1};
    index_weiduihui(datas_jingxuan,function (data) {
        var orders = $("#cainixihuan li");
        var datanums = data.data.data;
        data_list(orders,datanums);
    });
});

//延迟加载项
$(function () {
    setTimeout(function () {
        //加载视频
        $(".video_left video").attr("src",mediaUrl);
    },1000);
    setTimeout(function () {
        //热门文章
        if($("#remenwenzhang").attr('isLoaded')!="true"){
            $("#remenwenzhang").attr('isLoaded', true);
            var datas3 = {"page": 1, "isSortByHits":true,"isShowContent":false,"limit":6};
            writing_lists(datas3,function (data) {
                remenwz(data)
            });
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
                top_remenwz = $("#remenwenzhang").offset().top;
            //热门文章
            if(top_remenwz < 1.5*winH + scrollH && $("#remenwenzhang").attr('isLoaded')!="true"){
                $("#remenwenzhang").attr('isLoaded', true);
                var datas3 = {"page": 1, "isSortByHits":true,"isShowContent":false,"limit":6};
                writing_lists(datas3,function (data) {
                    remenwz(data)
                });
            }
        }, 100);
    });
});

//相关推荐渲染
function data_about(orders,datanums) {
    var html = "";
    var length = datanums.length;
    for(var i=0;i<length;i++){
        var title = datanums[i].title;
        var id = datanums[i].microTeamId;
        var imgUrl = IMGURL + datanums[i].imgUrl;
        var backimg = "background-image: url('"+imgUrl+"')";
        var href = "../news/news_video.html?&&microTeamId="+id,player = "../audio/img/play.png";
        html += '<li><div class="imgcover" style="'+backimg+'">' +
            '                        <a href="'+href+'" class="imgpop" title="'+title+'">' +
            '                            <img src="'+player+'">' +
            '                        </a>' +
            '                    </div>' +
            '                    <p><a href="'+href+'" title="'+title+'">'+title+'</a></p></li>';
    }
    orders.html(html);
}

//热门文章渲染
function remenwz(data) {
    var length = data.data.data.length;
    for(var i=0;i<length;i++){
        var title = data.data.data[i].title;
        var img = IMGURL + data.data.data[i].img;
        var backimg = "background-image: url('"+img+"')";
        var id = data.data.data[i].id;
        var href = "../writing/writing_details.html?&&compositionId="+id;
        $("#remenwenzhang li").eq(i).find(".imgcover").attr({"href":href,"title":title,"style":backimg});
        $("#remenwenzhang li").eq(i).find("p a").attr({"href":href,"title":title});
        $("#remenwenzhang li").eq(i).find("p a").text(title);
    }

}

//猜你喜欢渲染
function data_list(orders,datanums) {
    var html = "";
    var length = datanums.length;
    for(var i=0;i<length;i++){
        var title = datanums[i].title;
        var id = datanums[i].microTeamId;
        var imgUrl = IMGURL + datanums[i].imgUrl;
        var backimg = "background-image: url('"+imgUrl+"')";
        var href = "../news/news_video.html?&&microTeamId="+id,player = "../audio/img/play.png";
        orders.eq(i).find(".imgcover").attr("style",backimg);
        orders.eq(i).find(".imgpop").attr({"href":href,"title":title});
        orders.eq(i).find("img").attr("src",player);
        orders.eq(i).find("p a").attr({"href":href,"title":title});
        orders.eq(i).find("p a").text(title);
    }
}