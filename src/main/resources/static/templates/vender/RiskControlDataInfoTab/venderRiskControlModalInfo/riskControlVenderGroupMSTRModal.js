Template.riskControlVenderGroupMSTRModal.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#AijihuiMSTRTab').addClass('active');

    var query = {
        "accountType": 0,
        "project":"Aijihui"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project=Aijihui&port=0&evt=4001&src=mstrWeb.4001&visMode=0&reportID=D7A66A6D4AE543F6654866973A17968E&reportViewMode=1&hiddensections=header,path,footer&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });

};