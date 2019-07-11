Template.AATreasureOpenMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#AABaoOpenTab').addClass('active');
    $('#AATreasureOpenMSTR').addClass('active');
    if(isMobile()){
        $('.sidebar-toggle').click();
    }
    var query = {
        "accountType": "3rd",
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=50EF9AF247EF6EA11AF3E682E7E45AE6&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        //console.log(url)
        $('#mainIFrame').attr('src',url );
    });
};