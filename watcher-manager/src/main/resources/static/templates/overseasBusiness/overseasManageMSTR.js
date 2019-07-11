Template.overseasManageMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#OverseasBusinessUnitTab').addClass('active');
    $('#overseasManageMSTR').addClass('active');
    if(isMobile()){
        $('.sidebar-toggle').click();
    }
    var query = {
        "accountType": "oversea",
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=283D131345750A3504E2F099D6DE3CC1&mstrSmgr=' + data;
        //console.log(url)
        $('#mainIFrame').attr('src',url );
    });
};