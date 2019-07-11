Template.VenderStatisticsCollectInfoModal.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderPermissionControl').addClass('active');
    $('#VenderStatisticsCollectInfoModal').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var trade_cd, trade_key;

    trade_cd=Template.currentData().trade_cd;
    trade_key = Template.currentData().trade_key;

    renderPageVender(trade_cd, trade_key);

};


function getSelectedFilter(trade_cd, trade_key) {

    var filter = {}
    filter.trade_cd = trade_cd;
    filter.trade_key = trade_key;

    return cleanParams(filter);
}

function renderPageVender(trade_cd, trade_key) {
    var filter = getSelectedFilter(trade_cd, trade_key);

    $("#tableVenderDown").hide();
    $("#loadingVenderDown").show();

    var promise = getOrderStatsEmbedData(filter);
    promise.done(function (ret) {

        $("#tableVenderDown").show();
        $("#loadingVenderDown").hide();

        //renderTable
        renderTableVender(ret, '#tableVenderDown',trade_cd);
    });
}


//day
function renderTableVender(data, tableName,trade_cd) {
    data.forEach(function(e){
        e.trade_cd=trade_cd;
    })
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data: data,
        columns: [{
            field: 'trade_cd',
            title: '订单号',
            sortable: true
        },{
            field: 'goldenNum',
            title: '砸金蛋金额',
            sortable: true
        }, {
            field: 'midNum',
            title: '午夜狂欢金额',
            sortable: true
        }, {
            field: 'parent_ded_points',
            title: '母账户使用的积分',
            sortable: true
        }, {
            field: 'group_ded_points',
            title: '门店使用积分',
            sortable: true
        }, {
            field: 'parent_add_points',
            title: '母账户获得的积分',
            sortable: true
        }, {
            field: 'group_add_points',
            title: ' 订单获得的积分',
            sortable: true
        }]
    });
}

function cleanParams(filter) {
    //clean parameters
    var query = _.clone(filter);
    for (var key in query) {
        if (!query[key] && key != "offset") {
            delete query[key]
        }
    }
    return query
}


//风控--获取每日累计失误率统计信息Top10
function getOrderStatsEmbedData(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getOrderStatsEmbedData", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}




