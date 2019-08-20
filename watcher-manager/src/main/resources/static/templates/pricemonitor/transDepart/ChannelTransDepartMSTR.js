Template.ChannelTransDepartMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#channelSideTab').addClass('active');
    $('#ChannelTransDepartTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    // var flag = this.data.flag;
    var flag = "bigOperation";
    var accountType=0;
    $("#ChannelTransDepart"+flag+"Tab").addClass('active');
    var folderId = ""
    switch (flag) {
        case "bigOperation":
            folderId = "6FA2ACFD47FFCAA4B8493E9AEB720666"
            accountType='channel'
            break
    }
    var query = {
        "accountType": accountType,
        "project":"Prod",
    };


    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID='+folderId+'&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });

};