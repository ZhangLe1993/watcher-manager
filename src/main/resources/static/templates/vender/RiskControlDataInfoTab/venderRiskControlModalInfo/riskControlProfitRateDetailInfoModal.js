Template.riskControlProfitRateDetailInfoModal.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#RiskPermissionControl').addClass('active');
    $('#riskControlTopTwentyProfitRateInfo').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }



    vender_parent_name.push(Template.currentData().vender_parent_name);
    vender_group_name.push(Template.currentData().vender_group_name);
    startDate=Template.currentData().startDate;
    endDate=Template.currentData().endDate;
    type=Template.currentData().type;

    renderPageVender();

    };

var filter={},vender_parent_name=[],vender_group_name=[],startDate,endDate,type;


function getSelectedFilter(dateType, $this) {

    filter.startDate=startDate;
    filter.endDate=endDate;
    filter.vender_parent_name=vender_parent_name;
    filter.vender_group_name=vender_group_name;

    return cleanParams(filter);
}

function renderPageVender() {
    var filter=getSelectedFilter();

    if(type=="总账户") {
        $("#etableGroupDown").hide();

        $("#tableVenderDown").hide();
        $("#loadingVenderDown").show();

        var promise = getRiskControlProfitVenderStatistic(filter);
        promise.done(function (ret) {

            $("#tableVenderDown").show();
            $("#loadingVenderDown").hide();

            //renderTable
            renderTableVender(ret, '#tableeVender');
        });
    }else if(type=="门店") {

        $("#etableVenderDown").hide();

        $("#tableGroupDown").hide();
        $("#loadingGroupDown").show();

        var promise = getRiskControlProfitLostVenderGroupInfoStatistic(filter);
        promise.done(function (ret) {
            $("#tableGroupDown").show();
            $("#loadingGroupDown").hide();

            //renderTable
            renderTableVender(ret, '#tableeGroup');
        });
    }

}


//day
function renderTableVender(data,tableName) {
    if(tableName=="#tableeGroup"){
        $('#tableGroupDown').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: data,
            columns:[{
                field:'vender_parent_id',
                title:'门店名称',
                sortable:true
            },{
                field:'vender_parent_name',
                title:'客户名称',
                sortable:true
            },{
                field:'level',
                title:'客户属性',
                sortable:true
            },{
                field:'profit',
                title:'亏损金额(元)',
                sortable:true
            },{
                field:'iphone_submit',
                title:'出货金额',
                sortable:true
            },{
                field:'profitRate',
                title:'毛利率',
                sortable:true
            },{
                field:'submitCnt',
                title:'提交订单数(台)',
                sortable:true
            },{
                field:'orderNumPerCustomer',
                title:'提交金额(元)',
                sortable:true
            }]
        });
    }else if(tableName=="#tableeVender"){
        var tableJson = [];
        var i = 0;
        data.forEach(function (e) {
            if (i < 20) {
                var json = {};
                json.vender_parent_name = e.date;
                json.profit = e.cnt;
                json.cancelCnt = e.cancelCnt;
                json.cancelNum = e.cancelNum;
                json.riskCnt = e.riskCnt + "%";
                json.cancelRiskCnt = e.cancelRiskCnt;
                json.riskNum = e.riskNum;
                json.num = e.num;
                i++;
                tableJson.push(json);
            }
        })
        $('#tableVenderDown').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: tableJson,
            columns:[{
                field:'vender_parent_name',
                title:'总账户',
                sortable:true
            },{
                field:'cancelCnt',
                title:'客户属性',
                sortable:true
            },{
                field:'profit',
                title:'亏损金额(元)',
                sortable:true
            },{
                field:'cancelNum',
                title:'出货金额',
                sortable:true
            },{
                field:'riskCnt',
                title:'毛利率',
                sortable:true
            },{
                field:'cancelRiskCnt',
                title:'提交订单量',
                sortable:true
            },{
                field:'riskNum',
                title:'提交订单金额',
                sortable:true
            },{
                field:'num',
                title:'是否调整为维修类客户',
                sortable:true
            }]
        });
    }
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
function getRiskControlProfitVenderStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlProfitVenderStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//风控--获取累计亏损门店统计信息Top20
function getRiskControlProfitLostVenderGroupInfoStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlProfitLostVenderGroupInfoStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}



