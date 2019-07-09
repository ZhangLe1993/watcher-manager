Template.riskControlLossOrderDataInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#RiskControlDataInfoTab').addClass('active');
    $('#riskControlLossOrderDataInfo').addClass('active');

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

    var datePickerOptionsS = {
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
            '最近14天': [moment().subtract(14, 'days').toDate(), moment().toDate()],
            '最近30天': [moment().subtract(30, 'days').toDate(), moment().toDate()],
            '本周': [moment().startOf('week').toDate(), moment().endOf('week').toDate()],
            '上周': [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()],
            '本月': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
            '上个月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '今年': [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').toDate(), moment().subtract(1, 'year').endOf('year').toDate()]
        }
    };

    $(".dateSelectLabel2").html(startDate + "~" + endDate);
    $('.webTrafficFunnelDate2').daterangepicker(datePickerOptionsS, pickWebTrafficFunnelDateRangeCallbackS);

    $('.webTrafficFunnelDate3').daterangepicker({
        "showDropdowns": true,
        "alwaysShowCalendars": true,
        "singleDatePicker": true,
        "autoApply": true,
        "minDate": transformDate("2017-02-18"),
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
            "firstDay": 1
        }
    }, pickWebTrafficFunnelDateRangeCallback3);

    $('.webTrafficFunnelDate3').html(endDate);


    $(".webTrafficFunnelDate").show();
    $(".webTrafficFunnelDate2").show();
    $(".webTrafficFunnelDate3").show();

    var dt = $('.desktop-only  .dateSelectLabel2').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    startDateEmbed=startDate;
    endDateEmbed=endDate;
    filter.startDate=startDate;
    filter.endDate=endDate;
    //renderPageVender(filter);

    var dt = $('.webTrafficFunnelDate3').html();
    var date = dt;
    filter.date=date;
    filter.status="all";
    renderPageSystem(filter);
    };

var filter={},startDateEmbed,endDateEmbed;

function pickWebTrafficFunnelDateRangeCallbackS(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel2').html(sdt + "~" + edt);
    startDateEmbed=sdt;
    endDateEmbed=edt;
    filter.startDate=sdt;
    filter.endDate=edt;
    filter.status="all";
    renderPageVender(filter);
}

function pickWebTrafficFunnelDateRangeCallback3(start, end, label) {
    $('.webTrafficFunnelDate3').html(start.format('YYYY-MM-DD'));
    filter.date=start.format('YYYY-MM-DD');
    filter.status="all";
    renderPageSystem(filter);
}

function getSelectedFilter(dateType, $this) {
    if (dateType == "daily") {
        var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    } else if (dateType == "weekly") {
        var dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g, "").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    } else {
        var dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g, "").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    }

    filter.startDate=startDate;
    filter.endDate=endDate;

    return cleanParams(filter);
}

function renderPageVender(filter) {
    $("#tableVenderDown").hide();
    $("#loadingVenderDown").show();

    var promise = getRiskControlProfitVenderStatistic(filter);
    promise.done(function (ret) {

        $("#tableVenderDown").show();
        $("#loadingVenderDown").hide();

        //renderTable
        renderTableVender(ret,'#tableeVender');
    });

    $("#tableGroupDown").hide();
    $("#loadingGroupDown").show();

    var promise = getRiskControlProfitLostVenderGroupInfoStatistic(filter);
    promise.done(function (ret) {
        $("#tableGroupDown").show();
        $("#loadingGroupDown").hide();

        //renderTable
        renderTableVender(ret,'#tableeGroup');
    });

    $("#dataTableTolenrateVenderDown").hide();
    $("#loadingTolenrateVenderDown").show();

    var promise = getRiskControlProfitLostVenderEmbedDetailInfoStatistic(filter);
    promise.done(function (ret) {
        $("#dataTableTolenrateVenderDown").show();
        $("#loadingTolenrateVenderDown").hide();

        //renderTable
        renderTableVender(ret,'#tolenrateVenderDown');
    });

    $("#dataTableTolenrateGroupDown").hide();
    $("#loadingTolenrateGroupDown").show();

    var promise = getRiskControlProfitLostVenderGroupEmbedDetailInfoStatistic(filter);
    promise.done(function (ret) {
        $("#dataTableTolenrateGroupDown").show();
        $("#loadingTolenrateGroupDown").hide();

        //renderTable
        renderTableVender(ret,'#tolenrateGroupDown');
    });

}

function renderPageSystem(filter) {
    $("#tableIosDown").hide();
    $("#loadingIosDown").show();

    $("#tableAndroidDown").hide();
    $("#loadingAndroidDown").show();

    var promise = getRiskControlProfitOrderAppleStatistic(filter);
    promise.done(function (ret) {
        $("#tableIosDown").show();
        $("#loadingIosDown").hide();

        //renderTable
        renderTableSystem(ret,'tableIos');
    });

    var promise = getRiskControlProfitOrderAndroidStatistic(filter);
    promise.done(function (ret) {

        $("#tableAndroidDown").show();
        $("#loadingAndroidDown").hide();

        //renderTable
        renderTableSystem(ret,'tableAndroid');
    });

}

//每日累计重大失误率
function renderTable(data,tableName) {
    data.forEach(function(e){
        e.cnt= ((e.cnt))+"%"
    });
    data=data.reverse();
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:data
    });
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
            },{
                field:'vender_business_mode',
                title:'是否调整为维修类客户',
                sortable:true
            },{
                field:'android_submit',
                title:'是否调整为履约金模式',
                sortable:true
            },{
                field:'#',
                title:'操作',
                sortable:true,
                formatter:function(value,row,index){

                    //var val=value.replace(/\//g,"%2F")
                    //val=val.replace(/\?/g,"%3F")
                    //return "<a class='cus_modal' data-fancybox-type='iframe' href='/product/pageViewModal/"+val+"/"+row.idsite+"/"+area+"/"+city+"'>"+value+"</a>"
                    return "<a class='cus_modal'   data-fancybox-type='iframe' href='/vender/riskControlVenderParentGroupDetailInfoModal/"+row.vender_parent_name+"/"+row.vender_parent_id+"/"+startDateEmbed+"/"+endDateEmbed+"/门店'>详细信息</a>"
                }
            }]
        });
    }else if(tableName=="#tableeVender"){
        var tableJson = [];
        var i = 0;
        data.forEach(function (e) {
            //if (i < 20) {
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
            //}
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
            },{
                field:'#',
                title:'操作',
                sortable:true,
                formatter:function(value,row,index){

                    //var val=value.replace(/\//g,"%2F")
                    //val=val.replace(/\?/g,"%3F")
                    //return "<a class='cus_modal' data-fancybox-type='iframe' href='/product/pageViewModal/"+val+"/"+row.idsite+"/"+area+"/"+city+"'>"+value+"</a>"
                    return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/riskControlVenderParentGroupDetailInfoModal/"+row.vender_parent_name+"/总账户/"+startDateEmbed+"/"+endDateEmbed+"/总账户'>详细信息</a>"
                }
            }]
        });

    }else if(tableName=="#tolenrateVenderDown"){
            data.forEach(function (e) {
                e.mistakeCnt=eval(e.repairCnt)+ eval(e.inletCnt)+ eval(e.bootstrapCnt);
                e.mistakeRate= ((e.mistakeCnt/ eval(e.Cnt))*100).toFixed(2)+"%";
                e.tolerateRate=((eval(e.inspection_tolerate_num)/ eval(e.vender_item_quotation_price_num))*100).toFixed(2)+"%";
                e.specialNum= eval(e.special_remitted_num)+ eval(e.special_num);
                e.specialRate=(((e.specialNum)/ eval(e.vender_item_quotation_price_num))*100).toFixed(2)+"%";
                e.goldenEggBonusNum= (eval(e.golden_egg_num)+ eval(e.bonus_num)).toFixed(2);
                e.goldenEggBonusRate=((e.goldenEggBonusNum/ eval(e.vender_item_quotation_price_num))*100).toFixed(2)+"%";
            })

                $('#dataTableTolenrateVenderDown').bootstrapTable('destroy').bootstrapTable({
                    exportDataType: 'all',
                    data: data,
                    columns: [{
                        field: 'vender_parent_name',
                        title: '总账户名称',
                        sortable: true
                    },{
                        field: 'level',
                        title: '客户属性',
                        sortable: true
                    }, {
                        field: 'mistakeCnt',
                        title: '拆修进水炸弹机',
                        sortable: true,
                    }, {
                        field: 'mistakeRate',
                        title: '拆修进水炸弹机与验货订单比值',
                        sortable: true
                    }, {
                        field: 'inspection_tolerate_num',
                        title: '小微容忍金额',
                        sortable: true
                    }, {
                        field: 'tolerateRate',
                        title: '小微容忍金额与出货金额比值',
                        sortable: true
                    }, {
                        field: 'specialNum',
                        title: '特殊豁免+特殊补款金额',
                        sortable: true
                    }, {
                        field: 'specialRate',
                        title: '特殊豁免+特殊补款金额与出货价格比值',
                        sortable: true
                    }, {
                        field: 'goldenEggBonusNum',
                        title: '金蛋+红包金额',
                        sortable: true
                    }, {
                        field: 'goldenEggBonusRate',
                        title: '金蛋+红包金额与出货价格比值',
                        sortable: true
                    },{
                        field: 'vender_business_mode',
                        title: '是否调整为维修类客户',
                        sortable: true
                    },{
                        field:'#',
                        title:'操作',
                        sortable:true,
                        formatter:function(value,row,index){
                            return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/riskControlProfitRateDetailInfoModal/"+row.vender_parent_name+"/总账户/"+startDateEmbed+"/"+endDateEmbed+"/总账户'>详细信息</a>"
                        }
                    }]
                });
    }else if(tableName=="#tolenrateGroupDown"){
        data.forEach(function (e) {
            e.mistakeCnt=eval(e.repairCnt)+ eval(e.inletCnt)+ eval(e.bootstrapCnt);
            e.mistakeRate= ((e.mistakeCnt/ eval(e.Cnt))*100).toFixed(2)+"%";
            e.tolerateRate=((eval(e.inspection_tolerate_num)/ eval(e.vender_item_quotation_price_num))*100).toFixed(2)+"%";
            e.specialNum= eval(e.special_remitted_num)+ eval(e.special_num);
            e.specialRate=(((e.specialNum)/ eval(e.vender_item_quotation_price_num))*100).toFixed(2)+"%";
            e.goldenEggBonusNum= (eval(e.golden_egg_num)+ eval(e.bonus_num)).toFixed(2);
            e.goldenEggBonusRate=((e.goldenEggBonusNum/ eval(e.vender_item_quotation_price_num))*100).toFixed(2)+"%";
        })

            $('#dataTableTolenrateGroupDown').bootstrapTable('destroy').bootstrapTable({
                exportDataType: 'all',
                data: data,
                columns: [{
                    field: 'vender_group_name',
                    title: '门店名称',
                    sortable: true
                },{
                    field: 'vender_parent_name',
                    title: '总账户名称',
                    sortable: true
                },{
                    field: 'level',
                    title: '客户属性',
                    sortable: true
                }, {
                    field: 'mistakeCnt',
                    title: '拆修进水炸弹机',
                    sortable: true,
                }, {
                    field: 'mistakeRate',
                    title: '拆修进水炸弹机与验货订单比值',
                    sortable: true
                }, {
                    field: 'inspection_tolerate_num',
                    title: '小微容忍金额',
                    sortable: true
                }, {
                    field: 'tolerateRate',
                    title: '小微容忍金额与出货金额比值',
                    sortable: true
                }, {
                    field: 'specialNum',
                    title: '特殊豁免+特殊补款金额',
                    sortable: true
                }, {
                    field: 'specialRate',
                    title: '特殊豁免+特殊补款金额与出货价格比值',
                    sortable: true
                }, {
                    field: 'goldenEggBonusNum',
                    title: '金蛋+红包金额',
                    sortable: true
                }, {
                    field: 'goldenEggBonusRate',
                    title: '金蛋+红包金额与出货价格比值',
                    sortable: true
                },{
                    field: 'vender_business_mode',
                    title: '是否调整为维修类客户',
                    sortable: true
                },{
                    field: 'riskType',
                    title: '是否调整为履约金模式',
                    sortable: true
                },{
                    field:'#',
                    title:'操作',
                    sortable:true,
                    formatter:function(value,row,index){
                        return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/riskControlProfitRateDetailInfoModal/"+row.vender_parent_name+"/"+row.vender_group_name+"/"+startDateEmbed+"/"+endDateEmbed+"/门店'>详细信息</a>"
                    }
                }]
            });
        }
}

//product
function renderTableSystem(data,tableName) {
    var tableJson=[];
    var i=0;
    data.forEach(function(e){
        //if(i<21) {
            var json={};
            json.cnt = e.cnt;
            json.cancelCnt= e.cancelCnt;
            json.num = e.num;
            json.cancelNum= e.cancelNum;
            json.riskCnt= e.riskCnt;
            i++;
            tableJson.push(json);
        //}
    })

    var tableJson=[];
    var i=0;
    data.forEach(function(e){
        //if(i>=(data.length-20)) {
            var json={};
            json.cnt = e.cnt;
            json.cancelCnt= e.cancelCnt;
            json.num = e.num;
            json.cancelNum= e.cancelNum;
            json.riskCnt= e.riskCnt;
            i++;
            tableJson.push(json);
        //}else{
        //    i++;
        //}
    })
    //tableJson=tableJson.reverse();
    if(tableName=='tableIos')
    {
        $('#tableIosDown').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data:tableJson,
            columns:[{
                field:'cnt',
                title:'订单号',
                sortable:true
            },{
                field:'cancelCnt',
                title:'产品名称',
                sortable:true
            },{
                field:'num',
                title:'子账户',
                sortable:true
            },{
                field:'cancelNum',
                title:'所属总账户',
                sortable:true
            },{
                field:'riskCnt',
                title:'亏损金额(元)',
                sortable:true
            },{
                field:'#',
                title:'操作',
                sortable:true,
                formatter:function(value,row,index){

                    //var val=value.replace(/\//g,"%2F")
                    //val=val.replace(/\?/g,"%3F")
                    //return "<a class='cus_modal' data-fancybox-type='iframe' href='/product/pageViewModal/"+val+"/"+row.idsite+"/"+area+"/"+city+"'>"+value+"</a>"
                    return "<a class='cus_modal'  data-fancybox-type='iframe' href='http://vender.aihuishou.com/Order/Detail?orderNo="+row.cnt+"'>详细信息</a>"
                }
            }]
        });
    }else{
        $('#tableAndroidDown').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data:tableJson,
            columns:[{
                field:'cnt',
                title:'订单号',
                sortable:true
            },{
                field:'cancelCnt',
                title:'产品名称',
                sortable:true
            },{
                field:'num',
                title:'子账户',
                sortable:true
            },{
                field:'cancelNum',
                title:'所属总账户',
                sortable:true
            },{
                field:'riskCnt',
                title:'亏损金额(元)',
                sortable:true
            },{
                field:'#',
                title:'操作',
                sortable:true,
                formatter:function(value,row,index){

                    //var val=value.replace(/\//g,"%2F")
                    //val=val.replace(/\?/g,"%3F")
                    //return "<a class='cus_modal' data-fancybox-type='iframe' href='/product/pageViewModal/"+val+"/"+row.idsite+"/"+area+"/"+city+"'>"+value+"</a>"
                    return "<a class='cus_modal'  data-fancybox-type='iframe' href='http://vender.aihuishou.com/Order/Detail?orderNo="+row.cnt+"'>详细信息</a>"
                }
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

//风控--获取苹果top10订单利润统计信息
function getRiskControlProfitOrderAppleStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlProfitOrderAppleStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//风控--获取安卓top10订单利润统计信息
function getRiskControlProfitOrderAndroidStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlProfitOrderAndroidStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//风控--总账户小微容忍信息
function getRiskControlProfitLostVenderEmbedDetailInfoStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlProfitLostVenderEmbedDetailInfoStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//风控--门店小微容忍详细信息
function getRiskControlProfitLostVenderGroupEmbedDetailInfoStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlProfitLostVenderGroupEmbedDetailInfoStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}


//$.fancybox.open([{
//    "type":"iframe",
//    "href":"/BaiduMapDistribution/"+params.name+"/"+params.data.value[2]+"/"+todaynow+"/"+lastnow+"/"+params.value[0]+"/"+params.value[1]
//}],{
//    maxWidth: 1300,
//    maxHeight: 200,
//    fitToView: false,
//    width: '100%',
//    height: '100%',
//    autoSize: false,
//    closeClick: false,
//    closeBtn: true,
//    openEffect: 'elastic',
//    closeEffect: 'elastic'
//})


