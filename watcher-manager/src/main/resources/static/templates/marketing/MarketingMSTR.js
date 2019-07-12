Template.MarketingMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#MarketingTab').addClass('active');
    $('#MarketingMSTRTab').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    // var flag = this.data.flag;
    var query = {
        "accountType": 'market',
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=6212A29411E4EA380AE10080EF850F92&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });
};