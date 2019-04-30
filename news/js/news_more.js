

var allPages=1,page=1;
$(function () {
    //导航激活项
    $(".navManu li").removeClass("navActive");
    $(".navManu li").eq(3).addClass("navActive");
    //列表
    var datas = { "page": 1, "limit": 16 };
    wisdomYoungPioneers_huiduihui(datas,function (data) {
        //尾页
        allPages = Math.ceil(data.data.count/data.data.limit);
        wdh_data(data);
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
                    var datas = { "page": 1, "limit": 16 };
                    wisdomYoungPioneers_huiduihui(datas,function (data) {
                        wdh_data(data);
                    });
                }
                break;
            case 1:
                if(page>1){
                    page = page - 1;
                    var datas = { "page": page, "limit": 16 };
                    wisdomYoungPioneers_huiduihui(datas,function (data) {
                        wdh_data(data);
                    });
                }else {
                    var text = "已经是第一页了！";
                    layers(text);
                }
                break;
            case 2:
                if(page<allPages){
                    page = page + 1;
                    var datas = { "page": page, "limit": 16 };
                    wisdomYoungPioneers_huiduihui(datas,function (data) {
                        wdh_data(data);
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
                    var datas = { "page": page, "limit": 16 };
                    wisdomYoungPioneers_huiduihui(datas,function (data) {
                        wdh_data(data);
                    });
                }
                break;
        }
    })
});

function wdh_data(data) {
    var length = data.data.data.length;
    var html = "";
    for(var i =0;i<length;i++){
        var title = data.data.data[i].title;
        var prizeInfo = data.data.data[i].prizeInfo;
        var imgUrl = data.data.data[i].imgUrl;
        var backimg = "background-image: url('"+imgUrl+"')";
        var microTeamId = data.data.data[i].microTeamId;
        var href = "../news/news_video.html?&&microTeamId="+microTeamId;
        html += '<li>' +
            '                <div>' +
            '                    <div class="duiHui_img imgcover" style="'+backimg+'">' +
            '                        <a href="'+href+'" title="'+title+'" class="imgpop">' +
            '                            <img src="../audio/img/play.png">' +
            '                        </a>' +
            '                    </div>' +
            '                    <a href="'+href+'" title="'+title+'"><p>'+title+'</p></a>' +
            '                    <span>'+prizeInfo+'</span>' +
            '                </div>' +
            '            </li>';
    }
    $(".duiHui_ul").html(html);
}