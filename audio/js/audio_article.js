
var page =1,allPages = 1;
var columnId;
//初始加载项
$(function () {
    //导航激活项
    $(".navManu li").removeClass("navActive");
    $(".navManu li").eq(5).addClass("navActive");
    //从页面地址获取栏目ID
    var windowHref = window.location.href;
    columnId = windowHref.split("&&columnId=")[1];
    //栏目详情
    var datas_lanmu = {"columnId":columnId};
    audio_lanmu(datas_lanmu,function (data) {
        var title = data.data.title;
        var columnImg = IMGURL + data.data.columnImg;
        var backimg = "background-image: url('"+columnImg+"')";
        var introduction = data.data.introduction;
        $(".music_img").attr("style",backimg);
        $(".music_right h2").text(title);
        $(".music_right p").text(introduction);
        //超出字数添加省略号
        overHide("list_introduce",180);
        //面包屑
        $(".crumbs li:last span").text(title);
    });
    //栏目列表
    var datas_remen = {"page":1,"columnId":columnId,"limit":9};
    audio_remen(datas_remen,function (data) {
        allPages = Math.ceil(data.data.count/data.data.limit);
        lanmulist(data);
    });
    //其它栏目
    var datas_others = {"page":1,"limit":4,"isOther":true,"columnId":columnId};
    audio_others(datas_others,function (data) {
        var html = "";
        var length = data.data.data.length;
        for(var i=0;i<length;i++){
            var title = data.data.data[i].title;
            var columnId = data.data.data[i].id;
            var columnImg = IMGURL + data.data.data[i].columnImg;
            var backimg = "background-image: url('"+columnImg+"')";
            var href = "./audio_article.html?&&columnId="+columnId;
            $(".lanmu_other li").eq(i).find(".imgcover").attr({"href":href,"title":title,"style":backimg});
            $(".lanmu_other li").eq(i).find("p a").attr({"href":href,"title":title});
            $(".lanmu_other li").eq(i).find("p a").text(title);
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
                    var datas_remen = {"page":page,"columnId":columnId,"limit":9};
                    audio_remen(datas_remen,function (data) {
                        lanmulist(data);
                    });
                }
                break;
            case 1:
                if(page>1){
                    page = page - 1;
                    var datas_remen = {"page":page,"columnId":columnId,"limit":9};
                    audio_remen(datas_remen,function (data) {
                        lanmulist(data);
                    });
                }else {
                    var text = "已经是第一页了！";
                    layers(text);
                }
                break;
            case 2:
                if(page<allPages){
                    page = page + 1;
                    var datas_remen = {"page":page,"columnId":columnId,"limit":9};
                    audio_remen(datas_remen,function (data) {
                        lanmulist(data);
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
                    var datas_remen = {"page":page,"columnId":columnId,"limit":9};
                    audio_remen(datas_remen,function (data) {
                        lanmulist(data);
                    });
                }
                break;
        }
    })
});

//栏目列表渲染
function lanmulist(data) {
    $(window).scrollTop(0);
    var html = "";
    var length = data.data.data.length;
    for(var i=0;i<length;i++){
        var title = data.data.data[i].title;
        var id = data.data.data[i].id;
        var imgUrl = IMGURL + data.data.data[i].imgUrl;
        var backimg = "background-image: url('"+imgUrl+"')";
        var mediaType = data.data.data[i].mediaType;//格式：1音频或2视频
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
    $(".lanmu_left ul").html(html);
}