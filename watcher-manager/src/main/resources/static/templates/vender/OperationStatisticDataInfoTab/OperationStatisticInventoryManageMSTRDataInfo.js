/**
 * Created by hsh on 2016/5/13.
 */

Template.OperationStatisticInventoryManageMSTRDataInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#OperationStatisticDataInfoTab').addClass('active');
    $('#OperationStatisticInventoryManageMSTRDataInfo').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var query = {
        "accountType": 'aijihui',
        "project":"Prod"
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project='+query.project+'&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=52EBAB5243A1A09E3852249AB6EB3FC5&hiddensections=header,path,footer,dockLeft&mstrSmgr=' + data;
        $('#mainIFrame').attr('src',url );
    });

};