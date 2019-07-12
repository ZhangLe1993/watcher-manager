Template.CustomerServiceMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#CustomerServiceTab').addClass('active');
    $('#CustomerServiceMSTRTab').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    // var flag = this.data.flag;
    var query = {
        "accountType": 'customer',
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=EAB8114611E4E809093B0080EFC59092&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });
};