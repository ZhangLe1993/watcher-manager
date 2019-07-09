Template.PermissionControlCollectInfoModal.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderPermissionControl').addClass('active');
    $('#PermissionControlCollectInfoModal').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var vender_parent_name, vender_parent_key, startDate, endDate;

    vender_parent_name=Template.currentData().vender_parent_name;
    vender_parent_key = Template.currentData().vender_parent_key;
    startDate = Template.currentData().startDate;
    endDate = Template.currentData().endDate;

    renderPageVender(vender_parent_name, vender_parent_key, startDate, endDate);

};


function getSelectedFilter(vender_parent_name, vender_parent_key, startDate, endDate) {

    var filter = {}
    filter.startDate = startDate;
    filter.endDate = endDate;
    filter.vender_parent_name = vender_parent_name;
    filter.vender_parent_key = vender_parent_key;

    return cleanParams(filter);
}

function renderPageVender(vender_parent_name, vender_parent_key, startDate, endDate) {
    var filter = getSelectedFilter(vender_parent_name, vender_parent_key, startDate, endDate);

    $("#tableVenderDown").hide();
    $("#loadingVenderDown").show();

    var promise = getVenderPermissionControlVenderCollectDetailInfo(filter);
    promise.done(function (ret) {

        $("#tableVenderDown").show();
        $("#loadingVenderDown").hide();

        //renderTable
        renderTableVender(ret, '#tableVenderDown', vender_parent_name);
    });
}


//day
function renderTableVender(data, tableName, vender_parent_name) {
    data.forEach(function (e) {
        e.vender_parent_name = vender_parent_name
    })
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data: data,
        columns: [{
            field: 'vender_parent_name',
            title: '客户名称',
            sortable: true
        },{
            field: 'vender_parent_key',
            title: '客户id',
            sortable: true
        }, {
            field: 'inspection_tolerate_num',
            title: '本段时间小微容忍金额',
            sortable: true
        }, {
            field: 'special_remitted_num',
            title: '特殊豁免金额',
            sortable: true
        }, {
            field: 'special_num',
            title: '特殊补款金额',
            sortable: true
        }, {
            field: 'golden_egg',
            title: '砸金蛋金额',
            sortable: true
        }, {
            field: 'tradeNumAll',
            title: '午夜狂欢金额',
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
function getVenderPermissionControlVenderCollectDetailInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getVenderPermissionControlVenderCollectDetailInfo", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}




