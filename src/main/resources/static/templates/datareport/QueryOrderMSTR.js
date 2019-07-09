Template.QueryOrderMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#datareport').addClass('active');
    $('#queryOrder').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    var query = {
        "accountType": 'other',
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        //var url = mstrHost + '/microstrategy/servlet/mstrWeb?Server=IZ23DQH4PI3Z&Project=Aihuishou&port=0&evt=4001&src=mstrWeb.4001&visMode=0&reportID=7C18842C40C8850B2DAB4183201AD54F&reportViewMode=1&hiddensections=header,path,footer&mstrSmgr=' + data;
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=AA4556BF49C53E36F2A9FBB813009727&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;

        $('#mainIFrame').attr('src',url );
    });
};