Template.VenderTransDepartMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#CustomerServiceTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var flag = this.data.flag;
    $("#operationTransDepart"+flag+"Tab").addClass('active');
    var folderId = ""
    switch (flag) {
        case "bigOperation":
            folderId = "57E321CD4F1EFBF1FAA270A136DA05AB"
            break
    }
    var query = {
        "accountType": 'aijihui',
        "project":"Prod",
    };


    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID='+folderId+'&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });

};