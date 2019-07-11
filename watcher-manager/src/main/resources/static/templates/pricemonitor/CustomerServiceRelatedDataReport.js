Template.CustomerServiceRelatedDataReport.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#channelSideTab').addClass('active');
    $('#CustomerServiceRelatedDataReport').addClass('active');
    if(isMobile()){
        $('.sidebar-toggle').click();
    }
    var query = {
        "accountType": "channel",
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=D85DE17011E8CC7545880080EF950713&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        console.log(url);
        $('#mainIFrame').attr('src',url );
    });
};