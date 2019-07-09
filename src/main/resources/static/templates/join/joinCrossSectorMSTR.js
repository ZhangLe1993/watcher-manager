Template.joinCrossSectorMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#joinProjectTab').addClass('active');
    $('#joinCrossSectorTab').addClass('active');
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
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=678FFAD411E8E8754CFE0080EF157D67&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        //console.log(url)
        $('#mainIFrame').attr('src',url);
    });
};