Template.optskulevelMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#pricemonitor').addClass('active');
    $('#optskulevelMSTRTab').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }
    var query = {
        "accountType": 'quote',
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=4474C26F41D10B4BB1C3EEB882C490C9&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });
};