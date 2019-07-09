Template.priceManageMSTR.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#priceTab').addClass('active');
    $('#priceManageTab').addClass('active');
    if(isMobile()){
        $('.sidebar-toggle').click();
    }
    var query = {
        "accountType": "price",
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=0E480FF411E8DB2B95E90080EF55378F&mstrSmgr=' + data;
        //console.log(url)
        $('#mainIFrame').attr('src',url );
    });
};