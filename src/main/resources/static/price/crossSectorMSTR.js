Template.crossSectorMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#priceTab').addClass('active');
    $('#crossSectorTab').addClass('active');
    if(isMobile()){
        $('.sidebar-toggle').click();
    }
    var query = {
        "accountType": "price",
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=3410FE7A11E8DD07D9530080EF35D23B&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        //console.log(url)
        $('#mainIFrame').attr('src',url);
    });
};