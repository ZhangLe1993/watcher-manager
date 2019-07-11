/**
 * Created by hsh on 2016/5/13.
 */
Template.riskControlVenderQualityErrorAnalysisModal.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#riskControlVenderQualityErrorAnalysisModal').addClass('active');

    vender_parent_name.push(Template.currentData().vender_parent_name);
    vender_group_name.push(Template.currentData().vender_group_name);
    startDate=Template.currentData().startDate;
    endDate=Template.currentData().endDate;
    type=Template.currentData().type;

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    //数据初始化加载
    renderPage();
};

var filter={},vender_parent_name=[],vender_group_name=[],startDate,endDate,type;

function getSelectedFilter() {
    if(type=="总账户"||type=="总账户part") {
        filter.startDate = startDate;
        filter.endDate = endDate;
        filter.vender_parent_name = vender_parent_name;
    }else if(type=="门店"||type=="门店part"){
        filter.startDate = startDate;
        filter.endDate = endDate;
        filter.vender_parent_name = vender_parent_name;
        filter.vender_group_name = vender_group_name;
    }
    return cleanParams(filter);
}

function cleanParams(filter){
    //clean parameters
    var query = _.clone(filter);
    for(var key in query){
        if(!query[key]&&key!="offset"){
            delete query[key]
        }
    }
    return query
}

function renderPage(){
    //var dateGap = -15;
    $("#chartContent").hide();
    $("#loading").show();
    var filter=getSelectedFilter();
    var promise = getAggregateWebTrafficData(filter);
    promise.done(function(ret){
        $("#chartContent").show();
        $("#loading").hide();

        renderTable("#BussinessDataTable",ret);

    });

}

function getAggregateWebTrafficData(filter){
    //clean parameters
    var query = _.clone(filter);
//    var flag = query["dateType"];
    var flag = $(".dateType").val();
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    var url="";
    if(type=="总账户"||type=="总账户part") {
        url=dataService+"/Vender/getRiskControlVenderQualityErrorAnalysis";
    }else if(type=="门店"||type=="门店part"){
        url=dataService+"/Vender/getRiskControlGroupQualityErrorAnalysis";
    }
    requestURL(url,query).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function renderTable(tableName,data) {
    data.forEach(function(e){
        var dataSet=e.venderAll.split(",");
        e.vender_group_name= dataSet[0];
        e.vender_name= dataSet[1];
        e.mistakeCnt= dataSet[2];
        e.venderType= dataSet[3]
    })
    if(type=="总账户") {
        $(".table2").hide();
        $("#BussinessDataTable").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: data,
            columns: [{
                field: 'vender_group_name',
                title: '总账户名称',
                sortable: true
            }]
        });
    }else if(type=="门店"){
        $(".table2").hide();
        $("#BussinessDataTable").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: data,
            columns: [{
                field: 'vender_group_name',
                title: '门店名称',
                sortable: true
            }]
        });
    }else if(type=="总账户part"){
        $(".table1").hide();
        data.forEach(function(e){
            e.repair= (eval(e.mainBoardRepair.split("%")[0])+ eval(e.screenRepair.split("%")[0])).toFixed(2)+"%";
        })
        $("#BussinessDataTablePart").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: data,
            columns: [{
                field: 'vender_group_name',
                title: '总账户名称',
                sortable: true
            }]
        });
    }else if(type=="门店part"){
        $(".table1").hide();
        data.forEach(function(e){
            e.repair= (eval(e.mainBoardRepair.split("%")[0])+ eval(e.screenRepair.split("%")[0])).toFixed(2)+"%";
        })
        $("#BussinessDataTablePart").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: data,
            columns: [{
                field: 'vender_group_name',
                title: '门店名称',
                sortable: true
            }]
        });
    }
}