Template.PriceMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#pricemonitor').addClass('active');
    $('#PriceMSTRTab').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
        $(".icon-toggle").click()
    }
    // var flag = this.data.flag;
    var query = {
        "accountType": 'profit',
        "project":"Prod"
    };

    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=4E34E5FE11E4E31A044F0080EF15A9E1&mstrSmgr=' + data;
        //$('#mainIFrame').attr('width',"150" );
        $('#mainIFrame').attr('src',url );
    });
};