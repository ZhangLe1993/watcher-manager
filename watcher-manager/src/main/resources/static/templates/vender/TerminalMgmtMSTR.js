Template.TerminalMgmtMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#TerminalMgmtTab').addClass('active');

    var query = {
        "accountType": "aijihui",
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+ query.project+ '&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=46612C8E11E8A1CB7AD20080EFD551DF&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });

};