Template.StandardTransDepartMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#standardTab').addClass('active');
    $('#StandardTransDepartTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    // var flag = this.data.flag;
    var flag = Template.source;
    var folderId = ""
    switch (flag) {
        case "bigOperation":
            folderId = "41026DDF4261FCADF57A26B2A6DDA33D"
            break
        case "BD":
            folderId="DA87410D4D1A687EB2D89DBE48AAA6DA"
            break
        case "self":
            folderId="29B5559B494F269D914CA19B38C66DEE"
            break
        case "Aijihui":
            folderId="75EC049C45816B2482264F966BB30813"
            break
    }
    var query = {
        "accountType": 'standard',
        "project":"Prod",
    };


    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID='+folderId+'&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });

};