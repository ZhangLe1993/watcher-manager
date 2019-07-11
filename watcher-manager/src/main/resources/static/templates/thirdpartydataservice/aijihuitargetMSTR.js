Template.aijihuitargetMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#TPDataserviceTab').addClass('active');
    $('#aijihuitargetMSTRTab').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var query = {
        "accountType": 'finance',
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        //var url = mstrHost + '/microstrategy/servlet/mstrWeb?Server=IZ23DQH4PI3Z&Project=Aihuishou&port=0&evt=4001&src=mstrWeb.4001&visMode=0&reportID=0760EA1C43CDAA627DA77DACDFB64D22&reportViewMode=1&hiddensections=header,path,footer&mstrSmgr=' + data;
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=DEA33C6811E9097B9A750080EF65F4EB&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });

};