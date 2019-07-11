Template.VenderMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderMSTRTab').addClass('active');

    var query = {
        "accountType": 0,
        "project":"Aijihui"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project=Aijihui&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=943A47EF4C65895DB75540B5DB299687&hiddensections=header,path,footer&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });

};