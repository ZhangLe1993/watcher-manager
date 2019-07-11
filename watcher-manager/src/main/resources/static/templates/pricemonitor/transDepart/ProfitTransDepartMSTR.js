Template.ProfitTransDepartMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#pricemonitor').addClass('active');
    $('#ProfitTransDepartTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var flag = this.data.flag;
    $("#ProfitTransDepart"+flag+"Tab").addClass('active');
    var folderId = ""
    switch (flag) {
        case "bigOperation":
            folderId = "9B45D9674DC8FBE8FAA9C9B3FE7A3B37"
            break
        case "BD":
            folderId="90872A9C11E82E45B9810080EFD50E8F"
            break
        case "self":
            folderId="9E1077FE11E82E45B9810080EF652F92"
            break
    }
    var query = {
        "accountType": 'profit',
        "project":"Prod",
    };


    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID='+folderId+'&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });

};