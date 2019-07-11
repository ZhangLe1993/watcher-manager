Template.littleLoveGoodMarkting.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#channelSideTab').addClass('active');
    $('#littleLoveGood').addClass('active');
    $('#littleLoveGoodMarkting').addClass('active');
    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var query = {
        "accountType": "channel",
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=5669674E41EEB5897AD486A179908BD0&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        console.log(url);
        $('#mainIFrame').attr('src',url );
    });
};
