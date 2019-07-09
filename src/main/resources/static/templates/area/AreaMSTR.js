Template.AreaMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#district').addClass('active');
    $('#AreaMSTRTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var flag = this.data.flag;
    var query = {
        "accountType": 'area',
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=FBBCBC8011E5EF5619C30080EFD564DF&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });
};