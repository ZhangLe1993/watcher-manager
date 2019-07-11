Template.VenderProfitProfitDetailMSTRDataInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderProfitDataInfoTab').addClass('active');
    $('#VenderProfitProfitDetailMSTRDataInfo').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var query = {
        "accountType": 'aijihui',
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        //var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project=Aihuishou&port=0&evt=4001&src=mstrWeb.4001&visMode=0&reportID=C3EFBE1B4229DAA6255F2D89EF377B65&reportViewMode=1&hiddensections=header,path,footer&mstrSmgr=' + data;
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=CC279DEE11E6B14A3EF40080EFB58649&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });

};