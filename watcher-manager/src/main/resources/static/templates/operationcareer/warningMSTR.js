Template.warningMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationcareer').addClass('active');
   // $('#odDataWarning').addClass('active');
    $('#warngingMSTRTab').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var query = {
        "accountType": 0
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project=Aihuishou&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=704DDC654DBF1470D031DABCBEC0F056&hiddensections=header,path,footer&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });
};