Template.RiskMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#RiskTab').addClass('active');
    $('#RiskMSTRTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    // var flag = this.data.flag;
    var query = {
        "accountType": 'risk',
        "project":"Prod"
    };

    var hiddensections=""//"&hiddensections=header,path,footer,dockLeft";
    /*if(flag=="0"){
        hiddensections+=",dockLeft"
    }*/
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=E730D2C011E605DF14200080EF15E4AB'+hiddensections+'&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });

};