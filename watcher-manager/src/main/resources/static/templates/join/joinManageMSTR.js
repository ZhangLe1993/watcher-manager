Template.joinManageMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#joinProjectTab').addClass('active');
    $('#joinManageTab').addClass('active');
    if(isMobile()){
        $('.sidebar-toggle').click();
    }
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    var query = {
        "accountType": "join",
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=6B648F364D5307F13968F8B5D651C1F3&mstrSmgr=' + data;
        //console.log(url)
        $('#mainIFrame').attr('src',url );
    });
};