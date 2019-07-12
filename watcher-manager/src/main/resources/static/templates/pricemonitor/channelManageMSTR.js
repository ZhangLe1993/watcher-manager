Template.channelManageMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#channelSideTab').addClass('active');
    $('#channelManageMSTR').addClass('active');
    if(isMobile()){
        $('.sidebar-toggle').click();
    }
    // var flag = this.data.flag;
    var query = {
        "accountType": "channel",
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=7349BE1E11E7C9DBAFE30080EF3531F2&mstrSmgr=' + data;
        console.log(url)
        $('#mainIFrame').attr('src',url );
    });
};