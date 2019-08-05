Template.optTransDepartMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#CompetitonPriceTab').addClass('active');            //tab 高亮效果
    $('#optTransDepartMSTRTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var flag = this.data.flag;
    var folderId="";
    switch(flag){
        case "opt":
            folderId="8FFE955E11E85CA53DCC0080EFD5CC3D"
            break
    }

    var query = {
        "accountType": 'quote',
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=' + folderId + '&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });
};

