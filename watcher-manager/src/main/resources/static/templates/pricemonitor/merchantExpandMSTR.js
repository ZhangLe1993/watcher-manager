Template.merchantExpandMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#channelSideTab').addClass('active');
    $('#merchantExpandMSTR').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    // var flag = this.data.flag;
    var flag = window.sessionStorage.getItem('flag');
    var folderId="";
    switch(flag){
        case "0":
            folderId="FEDBDEB811E862EBFC200080EF7520FC"
            break
        case "buyer":
            folderId="FEDBDEB811E862EBFC200080EF7520FC"
            break
    }

    var query = {
        "accountType": "channel",
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+ query.project +'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=' + folderId + '&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });
};

