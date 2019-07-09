Template.mtaMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#MTATab').addClass('active');
    $('#MTAMSTRTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var folderId="A22396C611E8624A8F3E0080EF55CBBD";

    var query = {
        "accountType": 'mta',
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+ query.project +'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=' + folderId + '&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });
};

mstrHost = Meteor.settings.public.mstrService.baseUrl;