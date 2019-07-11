Template.AreaCoreMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#district').addClass('active');
    $('#AreaCoreMSTRTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var query = {
        "accountType": 'area',
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=0C86CB8011E7256D41500080EFE5BCE8&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });
};