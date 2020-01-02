Template.ReverseExpressCount.rendered = function () {
    var listJ = Template.list;
    console.log(listJ);
    var OperationCenter = listJ[0];
    function updateStats(query) {
        requestURL(dataService + "/operationCenter/realTimeStats", query).done(function (ret) {
            $('#JDReverseExpressCount').html(ret.JDReverseExpressCount);
            $('#YTReverseExpressCount').html(ret.YTReverseExpressCount);
            $('#SFReverseExpressCount').html(ret.SFReverseExpressCount);
        })
    }
    var date = moment().format('YYYY-MM-DD');
    var query = {
        "date":date,
        "operationCenter":OperationCenter
    };
    updateStats(query);
};