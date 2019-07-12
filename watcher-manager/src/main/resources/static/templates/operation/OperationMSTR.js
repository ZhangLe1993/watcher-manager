Template.OperationMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operation').addClass('active');
    $('#OperationDataTab').addClass('active');
    $('#OperationMSTRTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    // var flag = this.data.flag;

    var query = {
        "accountType": 'oc',
        "project":"Prod",
    };


    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=3D24672411E4F47910AD0080EF85095A&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });

};