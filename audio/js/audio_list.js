
var page =1,allPages = 1;
//初始加载项
$(function () {
    //导航激活项
    $(".navManu li").removeClass("navActive");
    $(".navManu li").eq(5).addClass("navActive");
    //列表
    var datas_others = {"page":1,"limit":12};
    audio_others(datas_others,function (data) {
        allPages = Math.ceil(data.data.count/data.data.limit);
        datas_list(data);
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
                    var datas_others = {"page":page,"limit":12};
                    audio_others(datas_others,function (data) {
                        datas_list(data);
                    });
                }
                break;
            case 1:
                if(page>1){
                    page = page - 1;
                    var datas_others = {"page":page,"limit":12};
                    audio_others(datas_others,function (data) {
                        datas_list(data);
                    });
                }else {
                    var text = "已经是第一页了！";
                    layers(text);
                }
                break;
            case 2:
                if(page<allPages){
                    page = page + 1;
                    var datas_others = {"page":page,"limit":12};
                    audio_others(datas_others,function (data) {
                        datas_list(data);
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
                    var datas_others = {"page":page,"limit":12};
                    audio_others(datas_others,function (data) {
                        datas_list(data);
                    });
                }
                break;
        }
    })
});

function datas_list(data) {
    $(window).scrollTop(0);
    var html = "";
    var length = data.data.data.length;
    for(var i=0;i<length;i++){
        var title = data.data.data[i].title;
        var columnId = data.data.data[i].id;
        var columnImg = IMGURL + data.data.data[i].columnImg;
        var backimg = "background-image: url('"+columnImg+"')";
        var href = "./audio_article.html?&&columnId="+columnId;
        html += '<li>' +
            '                    <a href="'+href+'" title="'+title+'" class="imgcover" style="'+backimg+'"></a>' +
            '                    <p><a href="'+href+'">'+title+'</a></p>' +
            '                </li>';
    }
    $(".audio_ul ul").html(html);
}