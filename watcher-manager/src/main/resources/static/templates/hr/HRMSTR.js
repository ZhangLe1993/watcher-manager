Template.HRMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#HRTab').addClass('active');
    $('#HRMSTRTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    // var flag = this.data.flag;
    var query = {
        "accountType": 'other',
        "project":"Prod"
    };
    var hiddensections="&hiddensections=header,path,footer,dockLeft";
    /*if(flag=="0"){
        hiddensections+=",dockLeft"
    }*/
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=7597B4BA11E50B321A540080EFD514AC'+hiddensections+'&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });
};

mstrHost = Meteor.settings.public.mstrService.baseUrl;