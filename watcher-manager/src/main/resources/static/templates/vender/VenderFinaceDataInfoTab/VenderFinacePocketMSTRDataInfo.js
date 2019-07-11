Template.VenderFinacePocketMSTRDataInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderFinaceDataInfoTab').addClass('active');
    $('#VenderFinacePocketMSTRDataInfo').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var query = {
        "accountType": 'aijihui',
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=50C15C3C11E71A7F2F870080EFE54B62&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });

};