Template.VenderPermissionInspectionMistakeDataInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderPermissionProvinceControl').addClass('active');
    $('#VenderPermissionInspectionMistakeDataInfo').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var dateGap = -13;
    var minWeekDate = "2016-07-03";
    var minMonthDate = "2016-07-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var startWeekDate = moment().weekday(-7).format("YYYY-MM-DD")
    var endWeekDate = moment().weekday(-1).format("YYYY-MM-DD")
    if (startWeekDate < minWeekDate) {
        startWeekDate = minWeekDate;
    }
    var startMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    var endMonthDate = moment().subtract(0, 'month').startOf('month').format("YYYY-MM-DD");
    if (startMonthDate < minMonthDate) {
        startMonthDate = minMonthDate;
    }
    var transformDate = function (date) {
        var dateStrArray = date.split('-');
        return dateStrArray[1] + '/' + dateStrArray[2] + '/' + dateStrArray[0]
    };

    var datePickerOptions = {
        "showDropdowns": true,
        //"alwaysShowCalendars": true,
        //"singleDatePicker": true,
        "autoApply": true,
        "alwaysShowCalendars": false,
        "startDate": transformDate(startDate),
        "endDate": transformDate(endDate),
        "minDate": transformDate("2016-09-01"),
        "maxDate": transformDate(endDate),
        "locale": {
            "format": "MM/DD/YYYY",
            "separator": " - ",
            "applyLabel": "确认",
            "cancelLabel": "取消",
            "fromLabel": "从",
            "toLabel": "至",
            "customRangeLabel": "自定义",
            "daysOfWeek": [
                "日",
                "一",
                "二",
                "三",
                "四",
                "五",
                "六"
            ],
            "monthNames": [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
            ],
            "firstDay": 0
        },
        "ranges": {
            '昨天': [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()],
            '最近7天': [moment().subtract(7, 'days').toDate(), moment().toDate()],
            '最近15天': [moment().subtract(15, 'days').toDate(), moment().toDate()],
            '最近30天': [moment().subtract(30, 'days').toDate(), moment().toDate()],
            '本周': [moment().startOf('week').toDate(), moment().endOf('week').toDate()],
            '上周': [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()],
            '本月': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
            '上个月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '今年': [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').toDate(), moment().subtract(1, 'year').endOf('year').toDate()]
        }
    };

    $(".dateSelectLabel").html(startDate + "~" + endDate);
    $('.webTrafficFunnelDate').daterangepicker(datePickerOptions, pickWebTrafficFunnelDateRangeCallback);

    $(".webTrafficFunnelDate").show();

    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    startDateEmbed=startDate;
    endDateEmbed=endDate;
    filter.startDate=startDate;
    filter.endDate=endDate;
    filter.status="part";
    renderPageDay(filter);
    };

var filter={},startDateEmbed,endDateEmbed;

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
    filter.startDate=sdt;
    filter.endDate=edt;
    startDateEmbed=sdt;
    endDateEmbed=edt;
    filter.status="part";
    renderPageDay(filter);
}

function renderPageDay(filter) {
    //var dateGap = -15;
    $("#tablea").hide();
    $("#tableb").hide();
    $("#tablec").hide();
    $("#loading1").hide();
    $("#loading2").hide();
    $("#loading3").hide();
    var promise = getRiskControlVenderMistakePartStatistic(filter);
    promise.done(function (ret) {
        $("#tablea").show();
        $("#tableb").show();
        $("#tablec").show();
        $("#loading1").hide();
        $("#loading2").hide();
        $("#loading3").hide();

        //renderTable
        renderTable(ret,'vender');
    });

    $("#tabled").hide();
    $("#tablee").hide();
    $("#tablef").hide();
    $("#loading4").hide();
    $("#loading5").hide();
    $("#loading6").hide();
    var promise = getRiskControlGroupMistakePartStatistic(filter);
    promise.done(function (ret) {
        $("#tabled").show();
        $("#tablee").show();
        $("#tablef").show();
        $("#loading4").hide();
        $("#loading5").hide();
        $("#loading6").hide();

        //day
        renderTable(ret,'group');
    });

}

//
function renderTable(data,tableName) {
    if(tableName=="vender"){
        var bootstrap=[];
        var mainBoardRepair=[];
        var inlet=[];
        data.forEach(function(e){
            var bootstrapJson={};
            var mainBoardRepairJson={};
            var inletJson={};
            if(e.inspectionType=="bootstrap"){
                bootstrapJson.vender_business_mode= e.vender_business_mode;
                bootstrapJson.profit= e.profit;
                //bootstrapJson.vender_group_name= e.vender_group_name;
                bootstrapJson.vender_parent_name= e.vender_parent_name;
                bootstrapJson.typeCnt= e.typeCnt;
                bootstrapJson.level= e.level;
                //bootstrapJson.riskType= e.riskType;
                bootstrapJson.cntRate= ((e.typeCnt/ e.Cnt)*100).toFixed(2)+"%";
                bootstrapJson.profitRate= ((e.profit/ e.vender_item_quotation_price_num)*100).toFixed(2)+"%";
                bootstrap.push(bootstrapJson);
            }else if(e.inspectionType=="mainBoardRepair"){
                mainBoardRepairJson.vender_business_mode= e.vender_business_mode;
                mainBoardRepairJson.profit= e.profit;
                //bootstrapJson.vender_group_name= e.vender_group_name;
                mainBoardRepairJson.vender_parent_name= e.vender_parent_name;
                mainBoardRepairJson.typeCnt= e.typeCnt;
                mainBoardRepairJson.level= e.level;
                //bootstrapJson.riskType= e.riskType;
                mainBoardRepairJson.cntRate= ((e.typeCnt/ e.Cnt)*100).toFixed(2)+"%";
                mainBoardRepairJson.profitRate= ((e.profit/ e.vender_item_quotation_price_num)*100).toFixed(2)+"%";
                mainBoardRepair.push(mainBoardRepairJson);
            }else if(e.inspectionType=="inlet"){
                inletJson.vender_business_mode= e.vender_business_mode;
                inletJson.profit= e.profit;
                //bootstrapJson.vender_group_name= e.vender_group_name;
                inletJson.vender_parent_name= e.vender_parent_name;
                inletJson.typeCnt= e.typeCnt;
                inletJson.level= e.level;
                //bootstrapJson.riskType= e.riskType;
                inletJson.cntRate= ((e.typeCnt/ e.Cnt)*100).toFixed(2)+"%";
                inletJson.profitRate= ((e.profit/ e.vender_item_quotation_price_num)*100).toFixed(2)+"%";
                inlet.push(inletJson);
            }
        })
        $("#tablea").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data:bootstrap,
            columns:[
                {
                    field:'vender_parent_name',
                    title:'总账户',
                    sortable:true
                },{
                    field:'level',
                    title:'客户属性',
                    sortable:true
                },{
                    field:'vender_business_mode',
                    title:'是否调整为维修客户',
                    sortable:true
                },{
                    field:'typeCnt',
                    title:'炸弹机数量',
                    sortable:true
                },{
                    field:'cntRate',
                    title:'占比',
                    sortable:true
                },{
                    field:'profit',
                    title:'门店毛利额',
                    sortable:true
                },{
                    field:'profitRate',
                    title:'门店毛利率',
                    sortable:true
                }
                //,{
                //    field:'#',
                //    title:'操作',
                //    sortable:true,
                //    formatter:function(value,row,index){
                //        return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/riskControlVenderParentGroupDetailTradeNoInfoModal/"+row.vender_parent_name+"/总账户/"+startDateEmbed+"/"+endDateEmbed+"/总账户/无法正常开机'>详细信息</a>"
                //    }
                //}
            ]
        });
        $("#tableb").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data:mainBoardRepair,
            columns:[
                {
                    field:'vender_parent_name',
                    title:'总账户',
                    sortable:true
                },{
                    field:'level',
                    title:'客户属性',
                    sortable:true
                },{
                    field:'vender_business_mode',
                    title:'是否调整为维修客户',
                    sortable:true
                },{
                    field:'typeCnt',
                    title:'拆修数量',
                    sortable:true
                },{
                    field:'cntRate',
                    title:'占比',
                    sortable:true
                },{
                    field:'profit',
                    title:'门店毛利额',
                    sortable:true
                },{
                    field:'profitRate',
                    title:'门店毛利率',
                    sortable:true
                }
                //,{
                //    field:'#',
                //    title:'操作',
                //    sortable:true,
                //    formatter:function(value,row,index){
                //        return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/riskControlVenderParentGroupDetailTradeNoInfoModal/"+row.vender_parent_name+"/总账户/"+startDateEmbed+"/"+endDateEmbed+"/总账户/拆修'>详细信息</a>"
                //    }
                //}
            ]
        });
        $("#tablec").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data:inlet,
            columns:[
                {
                    field:'vender_parent_name',
                    title:'总账户',
                    sortable:true
                },{
                    field:'level',
                    title:'客户属性',
                    sortable:true
                },{
                    field:'vender_business_mode',
                    title:'是否调整为维修客户',
                    sortable:true
                },{
                    field:'typeCnt',
                    title:'进水数量',
                    sortable:true
                },{
                    field:'cntRate',
                    title:'占比',
                    sortable:true
                },{
                    field:'profit',
                    title:'门店毛利额',
                    sortable:true
                },{
                    field:'profitRate',
                    title:'门店毛利率',
                    sortable:true
                }
                //,{
                //    field:'#',
                //    title:'操作',
                //    sortable:true,
                //    formatter:function(value,row,index){
                //        return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/riskControlVenderParentGroupDetailTradeNoInfoModal/"+row.vender_parent_name+"/总账户/"+startDateEmbed+"/"+endDateEmbed+"/总账户/机身进水或受潮'>详细信息</a>"
                //    }
                //}
            ]
        });
    }else if(tableName=="group"){
        var bootstrap=[];
        var mainBoardRepair=[];
        var inlet=[];
        data.forEach(function(e){
            var bootstrapJson={};
            var mainBoardRepairJson={};
            var inletJson={};
            if(e.inspectionType=="bootstrap"){
                bootstrapJson.vender_business_mode= e.vender_business_mode;
                bootstrapJson.profit= e.profit;
                bootstrapJson.vender_group_name= e.vender_group_name;
                bootstrapJson.vender_parent_name= e.vender_parent_name;
                bootstrapJson.typeCnt= e.typeCnt;
                bootstrapJson.level= e.level;
                bootstrapJson.riskType= e.riskType;
                bootstrapJson.cntRate= ((e.typeCnt/ e.Cnt)*100).toFixed(2)+"%";
                bootstrapJson.profitRate= ((e.profit/ e.vender_item_quotation_price_num)*100).toFixed(2)+"%";
                bootstrap.push(bootstrapJson);
            }else if(e.inspectionType=="mainBoardRepair"){
                mainBoardRepairJson.vender_business_mode= e.vender_business_mode;
                mainBoardRepairJson.profit= e.profit;
                mainBoardRepairJson.vender_group_name= e.vender_group_name;
                mainBoardRepairJson.vender_parent_name= e.vender_parent_name;
                mainBoardRepairJson.typeCnt= e.typeCnt;
                mainBoardRepairJson.level= e.level;
                mainBoardRepairJson.riskType= e.riskType;
                mainBoardRepairJson.cntRate= ((e.typeCnt/ e.Cnt)*100).toFixed(2)+"%";
                mainBoardRepairJson.profitRate= ((e.profit/ e.vender_item_quotation_price_num)*100).toFixed(2)+"%";
                mainBoardRepair.push(mainBoardRepairJson);
            }else if(e.inspectionType=="inlet"){
                inletJson.vender_business_mode= e.vender_business_mode;
                inletJson.profit= e.profit;
                inletJson.vender_group_name= e.vender_group_name;
                inletJson.vender_parent_name= e.vender_parent_name;
                inletJson.typeCnt= e.typeCnt;
                inletJson.level= e.level;
                inletJson.riskType= e.riskType;
                inletJson.cntRate= ((e.typeCnt/ e.Cnt)*100).toFixed(2)+"%";
                inletJson.profitRate= ((e.profit/ e.vender_item_quotation_price_num)*100).toFixed(2)+"%";
                inlet.push(inletJson);
            }
        })
        $("#tabled").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data:bootstrap,
            columns:[
                {
                field:'vender_group_name',
                title:'门店',
                sortable:true
            },{
                field:'vender_parent_name',
                title:'总账户',
                sortable:true
            },{
                field:'level',
                title:'客户属性',
                sortable:true
            },{
                field:'vender_business_mode',
                title:'是否调整为维修客户',
                sortable:true
            },{
                field:'typeCnt',
                title:'炸弹机数量',
                sortable:true
            },{
                field:'cntRate',
                title:'占比',
                sortable:true
            },{
                field:'profit',
                title:'门店毛利额',
                sortable:true
            },{
                field:'profitRate',
                title:'门店毛利率',
                sortable:true
            },{
                    field:'riskType',
                    title:'是否进入履约金模式',
                    sortable:true
            }
            //    ,{
            //    field:'#',
            //    title:'操作',
            //    sortable:true,
            //    formatter:function(value,row,index){
            //        return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/riskControlVenderParentGroupDetailTradeNoInfoModal/"+row.vender_parent_name+"/"+row.vender_group_name+"/"+startDateEmbed+"/"+endDateEmbed+"/门店/无法正常开机'>详细信息</a>"
            //    }
            //}
            ]
        });
        $("#tablee").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data:mainBoardRepair,
            columns:[
                {
                    field:'vender_group_name',
                    title:'门店',
                    sortable:true
                },{
                    field:'vender_parent_name',
                    title:'总账户',
                    sortable:true
                },{
                    field:'level',
                    title:'客户属性',
                    sortable:true
                },{
                    field:'vender_business_mode',
                    title:'是否调整为维修客户',
                    sortable:true
                },{
                    field:'typeCnt',
                    title:'拆修数量',
                    sortable:true
                },{
                    field:'cntRate',
                    title:'占比',
                    sortable:true
                },{
                    field:'profit',
                    title:'门店毛利额',
                    sortable:true
                },{
                    field:'profitRate',
                    title:'门店毛利率',
                    sortable:true
                },{
                    field:'riskType',
                    title:'是否进入履约金模式',
                    sortable:true
                }
                //,{
                //    field:'#',
                //    title:'操作',
                //    sortable:true,
                //    formatter:function(value,row,index){
                //        return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/riskControlVenderParentGroupDetailTradeNoInfoModal/"+row.vender_parent_name+"/"+row.vender_group_name+"/"+startDateEmbed+"/"+endDateEmbed+"/门店/拆修'>详细信息</a>"
                //    }
                //}
            ]
        });
        $("#tablef").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data:inlet,
            columns:[
                {
                    field:'vender_group_name',
                    title:'门店',
                    sortable:true
                },{
                    field:'vender_parent_name',
                    title:'总账户',
                    sortable:true
                },{
                    field:'level',
                    title:'客户属性',
                    sortable:true
                },{
                    field:'vender_business_mode',
                    title:'是否调整为维修客户',
                    sortable:true
                },{
                    field:'typeCnt',
                    title:'进水数量',
                    sortable:true
                },{
                    field:'cntRate',
                    title:'占比',
                    sortable:true
                },{
                    field:'profit',
                    title:'门店毛利额',
                    sortable:true
                },{
                    field:'profitRate',
                    title:'门店毛利率',
                    sortable:true
                },{
                    field:'riskType',
                    title:'是否进入履约金模式',
                    sortable:true
                }
                //,{
                //    field:'#',
                //    title:'操作',
                //    sortable:true,
                //    formatter:function(value,row,index){
                //        return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/riskControlVenderParentGroupDetailTradeNoInfoModal/"+row.vender_parent_name+"/"+row.vender_group_name+"/"+startDateEmbed+"/"+endDateEmbed+"/门店/机身进水或受潮'>详细信息</a>"
                //    }
                //}
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

//风控--获取累计总账户质检失误统计信息
function getRiskControlVenderMistakePartStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlVenderMistakePartStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//风控--获取累计门店质检失误统计信息
function getRiskControlGroupMistakePartStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlGroupMistakePartStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}




