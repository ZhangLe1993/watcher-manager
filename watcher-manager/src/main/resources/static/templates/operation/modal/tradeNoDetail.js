Template.tradeNoDetail.rendered = function () {
    var operationCenter = Template.currentData().operationCenter;
    var dataType = Template.currentData().dataType;
    var date = new Date().format("yyyy-MM-dd");
    var title = $('#title');
    var table = $('#table');
    var warehouseTitle = $('#warehouseTitle');
    var warehouseTable = $('#warehouseTable');

    var query = {
        "date": date,
        "operationCenter": operationCenter
    };

    switch (dataType) {
        case "待退货":
            title.html("当日15:00前待退货订单号");
            warehouseTable.addClass('hide');
            requestURL(dataService + "/operationCenter/getReturnDetailStats", query).done(function (data) {
                renderTable(data.preReturnStats);

            });
            break;
        case "回收商退货中待退货接收":
            title.html("回收商退货中待退货接收");
            warehouseTable.addClass('hide');
            query.dataType = "preReturnReceiveCount";
            requestURL(dataService + "/operationCenter/getReturningDetailStats", query).done(function (data) {
                renderTable(data);

            });
            break;
        case "回收商退货中待移交复检":
            title.html("回收商退货中待移交复检");
            warehouseTable.addClass('hide');
            query.dataType = "preReCheckCount";
            requestURL(dataService + "/operationCenter/getReturningDetailStats", query).done(function (data) {
                renderTable(data);

            });
            break;
        case "贴标未移交":
            title.html("当日贴标未移交订单号");
            warehouseTable.addClass('hide');
            requestURL(dataService + "/operationCenter/getReceiptNotTransferDetail", query).done(function (data) {
                renderTable(data);

            });
            break;
        case "验货移交收货未接收":
            title.html("当日验货移交收货(问密码)未接收订单号");
            warehouseTable.addClass('hide');
            requestURL(dataService + "/operationCenter/getAskNotReceiveDetail", query).done(function (data) {
                renderTable(data);

            });
            break;
        case "验货后未移交":
            title.html("当日验货后未移交订单号");
            warehouseTable.addClass('hide');
            requestURL(dataService + "/operationCenter/getInspectedNotTransferDetail", query).done(function (data) {
                renderTable(data);

            });
            break;
        case "贴标移交验货未接收":
            title.html("当日贴标移交验货未接收订单号");
            warehouseTable.addClass('hide');
            requestURL(dataService + "/operationCenter/getReceiptInspectionNotReceiveDetail", query).done(function (data) {
                renderTable(data);

            });
            break;
        case "待拣货":
            warehouseTitle.html("当日待拣货订单号");
            table.addClass('hide');
            query.status = 301;
            requestURL(dataService + "/operationCenter/getWarehouseOutDailyClearDetail", query).done(function (data) {
                renderWarehouseTable(data);

            });
            break;
        case "待核对":
            warehouseTitle.html("当日待核对订单号");
            table.addClass('hide');
            query.status = 305;
            requestURL(dataService + "/operationCenter/getWarehouseOutDailyClearDetail", query).done(function (data) {
                renderWarehouseTable(data);

            });
            break;
        case "待出库":
            warehouseTitle.html("当日待出库订单号");
            table.addClass('hide');
            query.status = 201;
            requestURL(dataService + "/operationCenter/getWarehouseOutDailyClearDetail", query).done(function (data) {
                renderWarehouseTable(data);

            });
            break;
        case "待退货已接收":
            title.html("当日待退货（退货已接收）订单号");
            warehouseTable.addClass('hide');
            requestURL(dataService + "/operationCenter/getRetrieveDailyClearDetail", query).done(function (data) {
                renderTable(data);
            });
            break;
        case "订单转收货":
            title.html("当日订单转收货订单号");
            warehouseTable.addClass('hide');
            requestURL(dataService + "/operationCenter/getTransferReceiptOrderNoInfo", query).done(function (data) {
                renderTable(data);

            });
            break;
        default:
            break;
    }


    var renderTable = function (data) {
        var tradeNos = [];
        data.forEach(function (e) {
            tradeNos.push({tradeNo: e});
        });
        $('#table').bootstrapTable('destroy').bootstrapTable({
            search: true,
            exportDataType: 'all',
            data: tradeNos
        });
    };

    var renderWarehouseTable = function (data) {
        $('#warehouseTable').bootstrapTable('destroy').bootstrapTable({
            search: true,
            exportDataType: 'all',
            data: data
        });
    }
};

