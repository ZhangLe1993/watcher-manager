Template.manageDataMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#managereport').addClass('active');
    $('#manageDataMSTRTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var query = {
        "accountType": 1,
        "Project":"Aihuishou"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project=Aihuishou&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=CE8424BE11E800D07D520080EFF52151&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });
};
