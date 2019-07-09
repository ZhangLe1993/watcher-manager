Template.overseasOPCMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#OverseasBusinessUnitTab').addClass('active');
    $('#overseasOPC').addClass('active');
    $('#overseasOPCMSTR').addClass('active');
    if(isMobile()){
        $('.sidebar-toggle').click();
    }
    var query = {
        "accountType": "oversea",
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=FF6345BE11E8D2869DA10080EF2520CD&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        //console.log(url)
        $('#mainIFrame').attr('src',url );
    });
};