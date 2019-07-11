Template.ExceptionTradeNoDetail.rendered = function () {
    var operationCenter = Template.currentData().operationCenter;
    var dataType = Template.currentData().dataType;
    var timeType = Template.currentData().timeType;
    var title = $('#title');
    var table = $('#table');

    var columnName = $('#columnName');

    var overTimeDesc = "已超时";

    if (timeType == "aboutToOverTime") {
        overTimeDesc = "快超时";
    }

    var query = {
        "dataType": dataType,
        "operationCenter": operationCenter,
        "timeType": timeType
    };

    requestURL(dataService + "/operationCenter/getExceptionDetailStats", query).done(function (data) {
        renderTable(data);
    });

    switch (dataType) {
        case "Receipt":
            title.html(overTimeDesc + "物流单号");
            columnName.html("物流单号");
            break;
        case "FirstInspection":
            title.html(overTimeDesc + "订单号");
            break;
        case "ReInspection":
            title.html(overTimeDesc + "订单号");
            break;
        case "Transfer":
            title.html(overTimeDesc + "订单号");
            break;
        case "Retrieve":
            title.html(overTimeDesc + "订单号");
            break;
        default:
            break;
    }

    var renderTable = function (data) {
        $('#table').bootstrapTable('destroy').bootstrapTable({
            search: true,
            exportDataType: 'all',
            data: data
        });
    };

};

