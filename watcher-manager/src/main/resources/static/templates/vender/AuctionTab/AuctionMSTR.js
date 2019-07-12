Template.AuctionMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    //$('#CompetitonPriceTab').addClass('active');            //tab 高亮效果
    $('#VenderTab').addClass('active');
    $('#AuctionTab').addClass('active');                    //tab 高亮效果
    $('#AuctionMSTR').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var flag = this.data.flag;
    var folderId="";
    switch(flag){
        case "mstr":
            folderId="D582803E11E85F31D5F50080EF252493"
            break
    }

    var query = {
        "accountType": 'seller',
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project +'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=' + folderId + '&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });
};

