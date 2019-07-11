Template.xhjPersonMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#AzpTab').addClass('active');
    $('#xhjPersonMSTR').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var query = {
        "accountType": 0
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        //var url = mstrHost + '/microstrategy/servlet/mstrWeb?Server=IZ23DQH4PI3Z&Project=Aihuishou&port=0&evt=4001&src=mstrWeb.4001&visMode=0&reportID=1175964643B613C04FED7E87C77DF5EA&reportViewMode=1&hiddensections=header,path,footer&mstrSmgr=' + data;
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project=Aihuishou&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=CDA72B864E3894B3C6B9F584870CE011&hiddensections=header,path,footer&mstrSmgr=' + data;

        $('#mainIFrame').attr('src',url );
    });

};