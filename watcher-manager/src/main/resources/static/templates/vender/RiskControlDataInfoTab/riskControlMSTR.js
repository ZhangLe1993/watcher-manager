Template.riskControlMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#RiskControlDataInfoTab').addClass('active');
    $('#riskControlMSTRTab').addClass('active');
    var folderId='DEA044B84CE3CB44540A309B145D79D9'
    var query = {
            "accountType": 'aijihui',
            "project":"Prod",
    };

    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=' + folderId + '&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;

        $('#mainIFrame').attr('src',url );
    });

};