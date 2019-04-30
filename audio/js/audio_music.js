
var columnId = "",mediaUrl="";
//初始加载项
$(function () {
    //导航激活项
    $(".navManu li").removeClass("navActive");
    $(".navManu li").eq(5).addClass("navActive");
    //从页面地址获取视频ID
    var windowHref = window.location.href;
    var mediaId = windowHref.split("&&mediaId=")[1];
    //音频
    var datas_videos = {"mediaId":mediaId};
    audio_videos(datas_videos,function (data) {
        var title = data.data.title;
        columnId = data.data.columnId;
        var imgUrl = IMGURL + data.data.imgUrl;
        var backimg = "background-image: url('"+imgUrl+"')";
        var introduce = data.data.introduce;
        mediaUrl = IMGURL + data.data.mediaUrl;
        $(".audio_img").attr("style",backimg);
        $(".music_img").attr("style",backimg);
        $(".crumbs li:last span").text(title);
        $(".music_right h2").text(title);
        $(".music_p").text(introduce);
        //超出字数添加省略号
        overHide("list_introduce",180);
        //相关推荐
        var datas_remen = {"page":1,"columnId":columnId,"limit":4};
        audio_remen(datas_remen,function (data) {
            var orders = $("#music_tuijian ul");
            var datanums = data.data.data;
            data_about(orders,datanums);
        });
    });
    //猜你喜欢
    var datas_jingxuan = {"limit":8};
    audio_jingxuan(datas_jingxuan,function (data) {
        var orders = $("#music_xihuan li");
        var datanums = data.data;
        data_list(orders,datanums);
    });
});

//延迟加载项
$(function () {
    setTimeout(function () {
        //加载音频
        $("audio").attr("src",mediaUrl);
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

//播放\关闭
$(function () {
    $("#music_play").click(function () {
        $(".music_audio").show();
        var player = $("#music_player")[0]; /*jquery对象转换成js对象*/
        if (player.paused){ /*如果已经暂停*/
            player.play(); /*播放*/
        }else {
            player.pause();
            /*暂停*/
        }
    });
    $(".close_audio").click(function () {
        $(".music_audio").fadeOut();
        var player = $("#music_player")[0];
        player.pause();
    });
});

//相关推荐渲染
function data_about(orders,datanums) {
    var html = "";
    var length = datanums.length;
    for(var i=0;i<length;i++){
        var title = datanums[i].title;
        var id = datanums[i].id;
        var imgUrl = IMGURL + datanums[i].imgUrl;
        var backimg = "background-image: url('"+imgUrl+"')";
        var mediaType = datanums[i].mediaType;//格式：1音频或2视频
        var href = "",player = "";
        if(mediaType==1){
            href = "audio_music.html?&&mediaId="+id;
            player = "./img/music.png";
        }else if(mediaType==2){
            href = "audio_video.html?&&mediaId="+id;
            player = "./img/play.png";
        }
        html += '<li><div class="imgcover" style="'+backimg+'">' +
            '                        <a href="'+href+'" class="imgpop" title="'+title+'">' +
            '                            <img src="'+player+'">' +
            '                        </a>' +
            '                    </div>' +
            '                    <p><a href="'+href+'" title="'+title+'">'+title+'</a></p></li>';
    }
    orders.html(html);
}

//猜你喜欢渲染
function data_list(orders,datanums) {
    var html = "";
    var length = datanums.length;
    for(var i=0;i<length;i++){
        var title = datanums[i].title;
        var id = datanums[i].id;
        var imgUrl = IMGURL + datanums[i].imgUrl;
        var backimg = "background-image: url('"+imgUrl+"')";
        var mediaType = datanums[i].mediaType;//格式：1音频或2视频
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