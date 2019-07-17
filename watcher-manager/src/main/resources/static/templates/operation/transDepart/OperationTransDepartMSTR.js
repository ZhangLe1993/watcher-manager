Template.OperationTransDepartMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operation').addClass('active');
    $('#operationTransDepartTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    // var flag = this.data.flag;
    var flag = Template.source;

    var folderId = ""
    switch (flag) {
        case "BD":
            folderId = "71EA9E1F45E8AB3D6F7088B43A3BFED6"
            break
        case "Aijihui":
            folderId = "C1A77B4449ACD8916599D587E83D453C"
            break
        case "self":
            folderId = "F34046C5485C522AFD8C1789F32F0B57"
            break
        case "bigOperation":
            folderId = "BA826EE64A20B5FA69F56B909274FD32"
            break
    }
    var query = {
        "accountType": 'oc',
        "project":"Prod",
    };


    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID='+folderId+'&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });

};