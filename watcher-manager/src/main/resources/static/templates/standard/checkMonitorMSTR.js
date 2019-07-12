Template.checkMonitorMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#standardTab').addClass('active');
    $('#checkMonitorTab').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    // var flag = this.data.flag;
    var query = {
        "accountType": 'standard',
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=6A29EFEB4EFF9E098FED5BBCBFF4F94A&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });
};