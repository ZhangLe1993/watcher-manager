Template.littleLoveGoodFinance.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#channelSideTab').addClass('active');
    $('#littleLoveGood').addClass('active');
    $('#littleLoveGoodFinance').addClass('active');
    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var query = {
        "accountType": "channel",
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=30EE039F435D6246337E1492B04DD141&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        console.log(url);
        $('#mainIFrame').attr('src',url );
    });
};
