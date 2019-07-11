Template.riskControlVenderParentGroupDetailTradeNoInfoModal.rendered = function () {

    vender_parent_name.push(Template.currentData().vender_parent_name);
    vender_group_name.push(Template.currentData().vender_group_name);
    startDate=Template.currentData().startDate;
    endDate=Template.currentData().endDate;
    type=Template.currentData().type;
    var tempType=Template.currentData().mistakeType;
    if(tempType=='拆修'){
        mistakeType.push("主板维修/多处拆修")
        mistakeType.push("屏幕维修")
    }else if(tempType=='老化'){
        mistakeType.push("色斑/漏液/错乱/严重老化")
    }else {
        mistakeType.push(Template.currentData().mistakeType);
    }

    renderPageDay();

    };

var filter={},vender_parent_name=[],vender_group_name=[],startDate,endDate,type,mistakeType=[];

function getSelectedFilter() {
    filter.startDate=startDate;
    filter.endDate=endDate;
    filter.vender_parent_name=vender_parent_name;
    filter.vender_group_name=vender_group_name;
    filter.type_name=mistakeType;

    return cleanParams(filter);
}

function renderPageDay() {
    //var dateGap = -15;
    var filter=getSelectedFilter();
    if(type=="总账户") {
        $("#table").hide();
        $("#loading").hide();
        var promise = getRiskControlProfitLostVenderEmbedDetailInfoStatistic(filter);
        promise.done(function (ret) {
            $("#table").show();
            $("#loading").hide();

            //renderTable
            renderTable(ret, 'venderTable');
        });
    }else if(type=="门店"){
        $("#table").hide();
        $("#loading").hide();
        var promise = getRiskControlProfitLostVenderGroupEmbedDetailInfoStatistic(filter);
        promise.done(function (ret) {
            $("#table").show();
            $("#loading").hide();

            //renderTable
            renderTable(ret, 'groupTable');
        });
    }else if(type=="申请退货"){
        $("#table").hide();
        $("#loading").hide();
        var promise = getRiskControlReturnOrdernoStatistic(filter);
        promise.done(function (ret) {
            $("#table").show();
            $("#loading").hide();

            //renderTable
            renderTable(ret, 'returnTable');
        });
    }

}

//消费者红包分析
function renderTable(data,tableName) {

    if(tableName=="venderTable") {
        $('#dataTable').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: data,
            columns: [{
                field: 'vender_parent_name',
                title: '订单号',
                sortable: true
            },{
                field:'#',
                title:'操作',
                sortable:true,
                formatter:function(value,row,index){
                    return "<a class='cus_modal'  data-fancybox-type='iframe' href='http://vender.aihuishou.com/Order/Detail?orderNo="+row.vender_parent_name+"'>详细信息</a>"
                }
            }
            ]
        });
    }else if(tableName=="groupTable"){
        $('#dataTable').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: data,
            columns: [{
                field: 'vender_parent_name',
                title: '订单号',
                sortable: true
            },{
                field:'#',
                title:'操作',
                sortable:true,
                formatter:function(value,row,index){
                    return "<a class='cus_modal'  data-fancybox-type='iframe' href='http://vender.aihuishou.com/Order/Detail?orderNo="+row.vender_parent_name+"'>详细信息</a>"
                }
            }
            ]
        });
    }else if(tableName=="returnTable"){
        $('#dataTable').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: data,
            columns: [{
                field: 'date',
                title: '订单号',
                sortable: true
            },{
                field:'#',
                title:'操作',
                sortable:true,
                formatter:function(value,row,index){
                    return "<a class='cus_modal'  data-fancybox-type='iframe' href='http://vender.aihuishou.com/Order/Detail?orderNo="+row.date+"'>详细信息</a>"
                }
            }
            ]
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

//风控--总账户详细信息
function getRiskControlProfitLostVenderEmbedDetailInfoStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlVenderMistakeAgingPartTradeNoStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//风控--门店详细信息
function getRiskControlProfitLostVenderGroupEmbedDetailInfoStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlGroupMistakeAgingPartTradeNoStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//风控--APP申请退货订单详细信息
function getRiskControlReturnOrdernoStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlReturnOrdernoStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}



