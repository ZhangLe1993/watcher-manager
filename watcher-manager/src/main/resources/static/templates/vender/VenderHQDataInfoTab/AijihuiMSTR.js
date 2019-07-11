Template.AijihuiMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderHQDataInfoTab').addClass('active');
    $('#AijihuiMSTR').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var flag = this.data.flag;
    var query = {
        "accountType": 'aijihui',
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=CF94E2D84FB3C45E5E4C359FDCB841AF&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });

};