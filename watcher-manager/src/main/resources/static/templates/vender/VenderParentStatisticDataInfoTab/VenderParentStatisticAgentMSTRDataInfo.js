Template.VenderParentStatisticAgentMSTRDataInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderParentStatisticDataInfoTab').addClass('active');
    $('#VenderParentStatisticAgentMSTRDataInfo').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var query = {
        "accountType": 'aijihui',
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        //var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project=Aihuishou&port=0&evt=4001&src=mstrWeb.4001&visMode=0&reportID=2F83E81942792BF8F30CEF9ECB7098AF&reportViewMode=1&hiddensections=header,path,footer&mstrSmgr=' + data;
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=3BA3DC9B4B4F56A87C36CF915D8E32D3&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });

};