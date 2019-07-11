Template.VenderParentStatisticVenderHistoryOrderMSTRDataInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderParentStatisticDataInfoTab').addClass('active');
    $('#VenderParentStatisticVenderHistoryOrderMSTRDataInfo').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var query = {
        "accountType": 'aijihui',
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        //var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project=Aihuishou&port=0&evt=4001&src=mstrWeb.4001&visMode=0&reportID=8C0886714853587596FF81BD32B69C7C&reportViewMode=1&hiddensections=header,path,footer&mstrSmgr=' + data;
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=46ED6BC640B8C604D34A328482D15C27&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });

};