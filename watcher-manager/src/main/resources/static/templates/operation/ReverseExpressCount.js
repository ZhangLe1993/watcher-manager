/**
 * Created by Howard on 2016/12/1.
 */
Template.reverseExpressCount.rendered = function () {
    var OperationCenter = Template.currentData().OperationCenter;
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