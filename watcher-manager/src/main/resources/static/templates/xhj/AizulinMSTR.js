Template.AizulinMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#AzpTab').addClass('active');
    $('#AizulinMSTRTab').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var query = {
        "accountType": 'other',
        "project":"Prod"
    };

    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=9949F0A242E6AD4D48230B87B5B24D92&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });

};