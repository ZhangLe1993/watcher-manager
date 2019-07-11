Template.LiangpinMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#liangpin').addClass('active');
    $('#LiangpinMSTRTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    var query = {
        "accountType": 0
    };

    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project=Aihuishou&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=30B1362244478174214C2D9E963BAF74&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });
};