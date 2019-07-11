Template.LiangpinSaleReturnMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#liangpin').addClass('active');
    $('#LiangpinSaleReturnMSTRTab').addClass('active');
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
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project=Aihuishou&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=DDA9E09811E7095D0EBA0080EF05012B&hiddensections=header,path,footer&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });
};