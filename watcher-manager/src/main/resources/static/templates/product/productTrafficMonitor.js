var flag = 0;
Template.productTrafficMonitor.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#productTab').addClass('active');
    $('#productTraffic').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var dateGap = -14;
    var minDate = "2016-07-01";
    var minWeekDate = "2016-07-03";
    var minMonthDate = "2016-07-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var startWeekDate = moment().weekday(-14).format("YYYY-MM-DD");
    var endWeekDate = moment().startOf('week').format("YYYY-MM-DD");
    if(startWeekDate<minWeekDate){
        startWeekDate = minWeekDate;
    }
    var startMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    var endMonthDate = moment().startOf('month').format("YYYY-MM-DD");
    if(startMonthDate<minMonthDate){
        startMonthDate = minMonthDate;
    }

    $(".weekly").hide();
    $(".monthly").hide();

    renderFilterOptions();
    //$(".endDateSelectLabel").html(endDate);
    $(".startDateSelectLabel").html(startDate+"~"+endDate);
    $('.productStartDatePicker').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate,false), pickStartDateRangeCallback);
    $(".startWeekDateSelectLabel").html(startWeekDate+"~"+endWeekDate);
    $('.productWeeklyStartDatePicker').daterangepicker(weekDatePickerOptionsFunc(startWeekDate,endWeekDate,minWeekDate,false), pickStartWeekDateRangeCallback);
    $(".startMonthDateSelectLabel").html(startMonthDate+"~"+endMonthDate);
    $('.productMonthlyStartDatePicker').daterangepicker(monthDatePickerOptionsFunc(startMonthDate,endMonthDate,minMonthDate,false), pickStartMonthDateRangeCallback);
    renderPage({"startDate":startDate,"endDate":endDate});

    $("#searchD").click(function(){       
        flag=0;
        var dateType =$(this).parent().parent().find(".dateType").val();
        var filter = getSelectedFilter(dateType,$(this));
        renderPage(filter);
    });

    $("#searchM").click(function(){
        flag=1;
        var dateType =$(this).parent().parent().find(".dateType").val();
        var filter = getSelectedFilter(dateType,$(this));
        renderPage(filter);
    });

    $(".dateType").on('change',function(){
        var dateType =$(this).val();
        var filter = getSelectedFilter(dateType,$(this));
        renderPage(filter);
    });

};


function getSelectedFilter(dateType,$this){
    var endDate = "";
    var startDate = "";
    var dt = "";
    if(dateType=="daily"){
        $(".daily").show();
        $(".weekly").hide();
        $(".monthly").hide();
        dt = $('.desktop-only .startDateSelectLabel').text().replace(/ /g,"").split("~");
        startDate = dt[0];
        endDate = dt[1];

    }else if(dateType=="weekly"){
        $(".daily").hide();
        $(".monthly").hide();
        $(".weekly").show();
        dt = $('.desktop-only .startWeekDateSelectLabel').text().replace(/ /g,"").split("~");
        startDate = dt[0];
        endDate = dt[1];

    }else if(dateType=="monthly"){
        $(".daily").hide();
        $(".monthly").show();
        $(".weekly").hide();
        dt = $('.desktop-only .startMonthDateSelectLabel').text().replace(/ /g,"").split("~");
        startDate = dt[0];
        endDate = dt[1];

    }
    var channel = $this.parent().parent().find(".channel").val();
    var channel_second = $this.parent().parent().find(".channel_second").val();
    var cityName = $this.parent().parent().find(".city").val();
    var tradetype = $this.parent().parent().find(".tradetype").val();
    var platform = $this.parent().parent().find(".platform").val();
    var areaName = $this.parent().parent().find(".areaName").val();
    var source=getAutocompleteMultipleSelectedFilter($this.parent().parent().find(".source").val());
    var medium=getAutocompleteMultipleSelectedFilter($this.parent().parent().find(".medium").val());
    var campaign=getAutocompleteMultipleSelectedFilter($this.parent().parent().find(".campaign").val());
    var filter = {
        "dateType":dateType,
        "startDate":startDate,
        "endDate":endDate,
        "channel":channel,
        "channel_second":channel_second,
        "cityName":cityName,
        "tradetype":tradetype,
        "platform":platform,
        "areaName":areaName,
        "source":source,
        "medium":medium,
        "campaign":campaign
    };
    return cleanParams(filter);
}


function renderPage(filter){
    //var dateGap = -15;
    $("#chartContent").hide();
    $("#loading").show();
    var promise = getAggregateWebTrafficData(filter);
    promise.done(function(ret){
        $("#chartContent").show();
        $("#loading").hide();
        var obj = getCalcDataByDate(ret);
        var retObj = {
            "uv":[],
            "inquiry_uv":[],
            "inquiry_success_uv":[],
            "trade_method_uv":[],
            "payment_method_uv":[],
            "submit_success_uv":[],
            "submit_success_cnt":[],
            "inquiry_uv_rate":[],
            "inquiry_success_uv_rate":[],
            "trade_method_uv_rate":[],
            "payment_method_uv_rate":[],
            "submit_success_uv_rate":[],
            "submit_success_cnt_rate":[],
            "submit_success_trade_method_rate":[],
            "shop_recycle_uv":[]
            // "recycle_method_uv":[]
        };
        if(obj.series.uv.length>0){
            retObj.uv = obj.series.uv[obj.series.uv.length-1]
        }
        if(obj.series.inquiry_uv.length>0){
            retObj.inquiry_uv = obj.series.inquiry_uv[obj.series.inquiry_uv.length-1]
        }
        if(obj.series.inquiry_success_uv.length>0){
            retObj.inquiry_success_uv = obj.series.inquiry_success_uv[obj.series.inquiry_success_uv.length-1]
        }
        if(obj.series.trade_method_uv.length>0){
            retObj.trade_method_uv = obj.series.trade_method_uv[obj.series.trade_method_uv.length-1]
        }
        if(obj.series.payment_method_uv.length>0){
            retObj.payment_method_uv = obj.series.payment_method_uv[obj.series.payment_method_uv.length-1]
        }
        if(obj.series.submit_success_uv.length>0){
            retObj.submit_success_uv = obj.series.submit_success_uv[obj.series.submit_success_uv.length-1]
        }
        if(obj.series.submit_success_cnt.length>0){
            retObj.submit_success_cnt = obj.series.submit_success_cnt[obj.series.submit_success_cnt.length-1]
        }
        if(obj.series.inquiry_uv_rate.length>0){
            retObj.inquiry_uv_rate = obj.series.inquiry_uv_rate[obj.series.inquiry_uv_rate.length-1]
        }
        if(obj.series.inquiry_success_uv_rate.length>0){
            retObj.inquiry_success_uv_rate = obj.series.inquiry_success_uv_rate[obj.series.inquiry_success_uv_rate.length-1]
        }
        if(obj.series.trade_method_uv_rate.length>0){
            retObj.trade_method_uv_rate = obj.series.trade_method_uv_rate[obj.series.trade_method_uv_rate.length-1]
        }
        if(obj.series.payment_method_uv_rate.length>0){
            retObj.payment_method_uv_rate = obj.series.payment_method_uv_rate[obj.series.payment_method_uv_rate.length-1]
        }
        if(obj.series.submit_success_uv_rate.length>0){
            retObj.submit_success_uv_rate = obj.series.submit_success_uv_rate[obj.series.submit_success_uv_rate.length-1]
        }
        if(obj.series.submit_success_cnt_rate.length>0){
            retObj.submit_success_cnt_rate = obj.series.submit_success_cnt_rate[obj.series.submit_success_cnt_rate.length-1]
        }
        if(obj.series.submit_success_trade_method_rate.length>0){
            retObj.submit_success_trade_method_rate = obj.series.submit_success_trade_method_rate[obj.series.submit_success_trade_method_rate.length-1]
        }
        // if(obj.series.recycle_method_uv.length>0){
        //     retObj.recycle_method_uv = obj.series.recycle_method_uv[obj.series.recycle_method_uv.length-1]
        // }
        if(obj.series.shop_recycle_uv.length>0){
            retObj.shop_recycle_uv = obj.series.shop_recycle_uv[obj.series.shop_recycle_uv.length-1]
        }
        var lastDate = "";
        if(obj.dateList.length>0){
            lastDate = obj.dateList[obj.dateList.length-1]
        }
        drawDailyTrafficFunnelChart(lastDate,retObj);
        drawDailyTrafficStackChart(obj);
        //drawDailyProductUVTrend(obj);
        //renderTable
        renderTable(filter,obj);

    });

}



function renderTable(filter,objAll){

    var obj = objAll.total;
    var fixRow = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总数</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >'+obj.uv+'</td>","<td style="">'+obj.shop_recycle_uv+'</td>", "<td  style=""    >'+obj.inquiry_uv+'</td>", "<td  style=""    >'+obj.inquiry_uv_rate+'%</td>", "<td  style=""    >'+obj.inquiry_success_uv+'</td>", "<td  style=""    >'+obj.inquiry_success_uv_rate+'%</td>","<td  style=""    >'+obj.inquiry_success_inquiry_rate+'%</td>", "<td  style=""    >'+obj.trade_method_uv+'</td>", "<td  style=""    >'+obj.trade_method_uv_rate+'%</td>","<td  style=""    >'+obj.trade_method_inquiry_success_rate+'%</td>", "<td  style=""    >'+obj.payment_method_uv+'</td>", "<td  style=""    >'+obj.payment_method_uv_rate+'%</td>","<td  style=""    >'+obj.payment_method_trade_method_rate+'%</td>", "<td  style=""    >'+obj.submit_success_uv+'</td>","<td  style=""    >'+obj.submit_success_uv_rate+'%</td>", "<td  style=""    >'+obj.submit_success_trade_method_rate+'%</td>", "<td  style=""    >'+obj.submit_success_cnt+'</td>", "<td  style=""    >'+obj.submit_success_cnt_rate+'%</td>"'
    var ajaxQuery = _.clone(filter);
    $('#productWebTrafficDataTable').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        pagination: true,
        sidePagination: 'server',
        ajax:function(params){
            var ajaxParams = $.extend(ajaxQuery,params.data);
            //$("#ctable").hide();
            getProductWebTraffic(ajaxParams).done(function(data){
                //$("#ctable").show();
                params.success(data)
            });
        },
        fixRow:fixRow,
        cdataExport:"cdataExport",
        columns: [{
            field: 'date',
            title: '日期',
            sortable:true
        }, {
            field: 'areaName',
            title: '区域',
            sortable:true
        }, {
            field: 'cityName',
            title: '城市',
            sortable:true
        }, {
            field: 'platform',
            title: '平台',
            sortable:true
        }, {
            field: 'channel',
            title: '渠道',
            sortable:true
        }, {
            field: 'channel_second',
            title: '细分渠道',
            sortable:true
        },{
            field: 'source',
            title: 'source',
            sortable:true
        }, {
            field: 'medium',
            title: 'medium',
            sortable:true
        }, {
            field: 'campaign',
            title: 'campaign',
            sortable:true
        }, {
            field: 'uv',
            title: '总访客数',
            sortable:true},
        // },{
        //     field:'recycle_method_uv',
        //     title:'回收方式访客数',
        //     sortable:true
        // },{
            {field:'shop_recycle_uv',
            title:'门店回收访客数',
            sortable:true
        },{
            field: 'inquiry_uv',
            title: '询价访客数',
            sortable:true
        }, {
            field: 'inquiry_uv_rate',
            title: '询价转化率',
            sortable:false,
            formatter:function(value,row,index){
                if(row.uv==0){
                    return "0.00%"
                }
                return ((row.inquiry_uv/row.uv)*100).toFixed(2)+"%"
            }
        }, {
            field: 'inquiry_success_uv',
            title: '询价完成访客数',
            sortable:true
        }, {
            field: 'inquiry_success_uv_rate',
            title: '询价完成转化率',
            sortable:false,
            formatter:function(value,row,index){
                if(row.uv==0){
                    return "0.00%"
                }
                return ((row.inquiry_success_uv/row.uv)*100).toFixed(2)+"%"
            }
        },{
                field: 'inquiry_success_inquiry_rate',
                title: '询价完成率',
                sortable:false,
                formatter:function(value,row,index){
                    if(row.inquiry_uv==0){
                        return "0.00%"
                    }
                    return ((row.inquiry_success_uv/row.inquiry_uv)*100).toFixed(2)+"%"
                }
            }, {
            field: 'trade_method_uv',
            title: '选择回收方式访客数',
            sortable:true
        }, {
            field: 'trade_method_uv_rate',
            title: '选择回收方式转化率',
            sortable:false,
            formatter:function(value,row,index){
                if(row.uv==0){
                    return "0.00%"
                }
                return ((row.trade_method_uv/row.uv)*100).toFixed(2)+"%"
            }
        }, {
                field: 'trade_method_inquiry_success_rate',
                title: '选择回收方式率',
                sortable:false,
                formatter:function(value,row,index){
                    if(row.inquiry_success_uv==0){
                        return "0.00%"
                    }
                    return ((row.trade_method_uv/row.inquiry_success_uv)*100).toFixed(2)+"%"
                }
            },  {
            field: 'payment_method_uv',
            title: '选择支付方式访客数',
            sortable:true
        }, {
            field: 'payment_method_uv_rate',
            title: '选择支付方式转化率',
            sortable:false,
            formatter:function(value,row,index){
                if(row.uv==0){
                    return "0.00%"
                }
                return ((row.payment_method_uv/row.uv)*100).toFixed(2)+"%"
            }
        },{
                field: 'payment_method_trade_method_rate',
                title: '选择支付方式率',
                sortable:false,
                formatter:function(value,row,index){
                    if(row.trade_method_uv==0){
                        return "0.00%"
                    }
                    return ((row.payment_method_uv/row.trade_method_uv)*100).toFixed(2)+"%"
                }
            }, {
            field: 'submit_success_uv',
            title: '提交成功访客数',
            sortable:true
        },{
            field: 'submit_success_uv_rate',
            title: '提交成功转化率',
            sortable:false,
            formatter:function(value,row,index){
                if(row.uv==0){
                    return "0.00%"
                }
                return ((row.submit_success_uv/row.uv)*100).toFixed(2)+"%"
            }
        }, {
                field: 'submit_success_trade_method_rate',
                title: '提交成功率',
                sortable:false,
                formatter:function(value,row,index){
                    if(row.trade_method_uv==0){
                        return "0.00%"
                    }
                    return ((row.submit_success_uv/row.trade_method_uv)*100).toFixed(2)+"%"
                }
            },{
                field: 'submit_success_cnt',
                title: '提交成功订单数',
                sortable:true
            }, {
                field: 'submit_success_cnt_rate',
                title: '订单转化率',
                sortable:false,
                formatter:function(value,row,index){
                    if(row.uv==0){
                        return "0.00%"
                    }
                    return ((row.submit_success_cnt/row.uv)*100).toFixed(2)+"%"
                }
            }],
    });
    $("#cdataExport").click(function(){
        var query = _.clone(filter);
        var sdt = moment(query.startDate);
        var edt = moment(query.endDate);
        var dflag = sdt.add(1,'month')<=edt;
        if(dflag){
            alert("导出文件最长间隔时间为1个月");
            return;
        }


        $("#wholePage").mask({'label':"请等待，文件正在导出..."});
        var flag = query["dateType"];
        delete query["dateType"];
        if(flag=="daily" || !flag){
            requestURL(dataService+"/webTraffic/exportDailyProductWebTrafficData",query).done(function(obj){
                $("#wholePage").unmask();
                var url = Meteor.settings.public.downloadService.baseUrl+obj.fileName;
                var link = document.createElement("a");
                link.href = url;
                link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }else if(flag=="weekly"){
            requestURL(dataService+"/webTraffic/exportWeeklyProductWebTrafficData",query).done(function(obj){
                $("#wholePage").unmask();
                var url = Meteor.settings.public.downloadService.baseUrl+obj.fileName;
                var link = document.createElement("a");
                link.href = url;
                link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }else if(flag=="monthly"){
            requestURL(dataService+"/webTraffic/exportMonthlyProductWebTrafficData",query).done(function(obj){
                $("#wholePage").unmask();
                var url = Meteor.settings.public.downloadService.baseUrl+obj.fileName;
                var link = document.createElement("a");
                link.href = url;
                link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }
    });

    //综合日报
    var dateList= objAll.dateList;
    var series = objAll.series;
    var tableJson = [];
    var collectInfo={};
    collectInfo.uv=0;
    collectInfo.inquiry_uv=0;
    collectInfo.inquiry_success_uv=0;
    collectInfo.trade_method_uv=0;
    collectInfo.payment_method_uv=0;
    collectInfo.submit_success_uv=0;
    collectInfo.submit_success_cnt=0;
    collectInfo.shop_recycle_uv=0;

    for(var i= 0,len=dateList.length;i<len;i++){
        collectInfo.uv+=series.uv[i];
        collectInfo.inquiry_uv+=series.inquiry_uv[i];
        collectInfo.inquiry_success_uv+=series.inquiry_success_uv[i];
        collectInfo.trade_method_uv+=series.trade_method_uv[i];
        collectInfo.payment_method_uv+=series.payment_method_uv[i];
        collectInfo.submit_success_uv+=series.submit_success_uv[i];
        collectInfo.submit_success_cnt+=series.submit_success_cnt[i];
        collectInfo.shop_recycle_uv+=series.shop_recycle_uv[i];
        var tmp = {
            "date":dateList[i],
            "uv":series.uv[i],
            "inquiry_uv":series.inquiry_uv[i],
            "inquiry_success_uv":series.inquiry_success_uv[i],
            "trade_method_uv":series.trade_method_uv[i],
            "payment_method_uv":series.payment_method_uv[i],
            "submit_success_uv":series.submit_success_uv[i],
            "submit_success_cnt":series.submit_success_cnt[i],
            "inquiry_uv_rate":series.inquiry_uv_rate[i]+"%",
            "inquiry_success_uv_rate":((series.inquiry_success_uv[i]/series.inquiry_uv[i])*100).toFixed(2)+"%",
            "trade_method_uv_rate":((series.trade_method_uv[i]/series.inquiry_success_uv[i])*100).toFixed(2)+"%",
            "payment_method_uv_rate":((series.payment_method_uv[i]/series.inquiry_success_uv[i])*100).toFixed(2)+"%",
            "submit_success_uv_rate":((series.submit_success_uv[i]/series.trade_method_uv[i])*100).toFixed(2)+"%",
            "submit_success_trade_method_rate":((series.submit_success_uv[i]/series.uv[i])*100).toFixed(2)+"%",
            "submit_success_cnt_rate":series.submit_success_cnt_rate[i]+"%",
            "shop_recycle_uv":series.shop_recycle_uv[i]
        };
        tableJson.push(tmp);
        collectInfo.inquiry_uv_rate=((collectInfo.inquiry_uv/collectInfo.uv)*100).toFixed(2)+"%"
        collectInfo.inquiry_success_uv_rate=((collectInfo.inquiry_success_uv/collectInfo.inquiry_uv)*100).toFixed(2)+"%"
        collectInfo.trade_method_uv_rate=((collectInfo.trade_method_uv/collectInfo.inquiry_success_uv)*100).toFixed(2)+"%"
        collectInfo.payment_method_uv_rate=((collectInfo.payment_method_uv/collectInfo.trade_method_uv)*100).toFixed(2)+"%"
        collectInfo.submit_success_uv_rate=((collectInfo.submit_success_uv/collectInfo.payment_method_uv)*100).toFixed(2)+"%"
        collectInfo.submit_success_trade_method_rate=((collectInfo.submit_success_uv/collectInfo.trade_method_uv)*100).toFixed(2)+"%"
        collectInfo.submit_success_uv_rate=((collectInfo.submit_success_uv/collectInfo.uv)*100).toFixed(2)+"%"
        collectInfo.submit_success_cnt_rate=((collectInfo.submit_success_cnt/collectInfo.uv)*100).toFixed(2)+"%"
    }

    var fixRow2 = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总数</td>", "<td  style=""    >'+collectInfo.uv+'</td>", "<td  style=""    >'+collectInfo.inquiry_uv+'</td>", "<td  style=""    >'+collectInfo.inquiry_uv_rate+'</td>","<td  style=""    >'+collectInfo.inquiry_success_uv+'</td>","<td  style=""    >'+collectInfo.inquiry_success_uv_rate+'</td>","<td  style=""    >'+collectInfo.trade_method_uv+'</td>","<td  style=""    >'+collectInfo.trade_method_uv_rate+'</td>", "<td  style=""    >'+collectInfo.submit_success_uv+'</td>", "<td  style=""    >'+collectInfo.submit_success_trade_method_rate+'</td>","<td  style=""    >'+collectInfo.submit_success_uv_rate+'</td>", "<td  style=""    >'+collectInfo.submit_success_cnt+'</td>", "<td  style=""    >'+collectInfo.submit_success_cnt_rate+'</td>", "</tr>"'

    $('#productSummaryWebTrafficDataTable').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        //pagination: true,
        fixRow:fixRow2,
        data:tableJson,
        columns: [{
            field: 'date',
            title: '日期',
            sortable:true
        }, {
            field: 'uv',
            title: '总访客数',
            sortable:true
        }, {
            field: 'inquiry_uv',
            title: '询价访客数',
            sortable:true
        }, {
            field: 'inquiry_uv_rate',
            title: '询价转化率',
            sortable:true
        }, {
            field: 'inquiry_success_uv',
            title: '询价完成访客数',
            sortable:true
        }, {
            field: 'inquiry_success_uv_rate',
            title: '询价完成率',
            sortable:true
        }, {
            field: 'trade_method_uv',
            title: '选择回收方式访客数',
            sortable:true
        }, {
            field: 'trade_method_uv_rate',
            title: '选择回收方式率',
            sortable:true
        },{
            field: 'submit_success_uv',
            title: '提交成功访客数',
            sortable:true
        }, {
            field: 'submit_success_uv_rate',
            title: '提交成功率',
            sortable:true
        }, {
            field: 'submit_success_trade_method_rate',
            title: '提交成功转化率',
            sortable:true
        }, {
            field: 'submit_success_cnt',
            title: '提交成功订单数',
            sortable:true
        }, {
            field: 'submit_success_cnt_rate',
            title: '订单转化率',
            sortable:true
        }],
    });

}


function getFilterOptions(){
    var dfd = $.Deferred();
    requestURL(dataService+"/webTraffic/getProductFilterOptions",{}).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function renderFilterOptions(){
    var promise = getFilterOptions();
    promise.done(function(data){
        //
        //renderOptions(".weekly",data.weekStats);
        //renderOptions(".areaName",data.areaNameStats);
        $(".city").attr("multiple","multiple");
        $(".tradetype").attr("multiple","multiple");
        $(".platform").attr("multiple","multiple");
        $(".channel").attr("multiple","multiple");
        $(".channel_second").attr("multiple","multiple");
        //$(".source").attr("multiple","multiple");
        //$(".medium").attr("multiple","multiple");
        //$(".campaign").attr("multiple","multiple");
        $(".areaName").attr("multiple","multiple");
        renderOptions(".city",data.cityName);
        renderOptions(".tradetype",data.tradetype);
        renderOptions(".platform",data.platform);
        renderOptions(".channel",data.channel);
        renderOptions(".channel_second",data.channel_second);
        //renderOptions(".source",data.source);
        //renderOptions(".medium",data.medium);
        //renderOptions(".campaign",data.campaign);
        renderOptions(".areaName",["华北大区","华东大区","华南大区","华西大区","华中大区","其它"]);

        $(".areaName").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false
        });

        $(".city").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".tradetype").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".platform").multipleSelect({
            placeholder: "全部",
            selectAllText:"全部",
            width: 150,
            selectAll: true
        });
        $(".channel").multipleSelect({
            placeholder: "全部",
            selectAllText:"全部",
            width: 150,
            selectAll: true
        });
        $(".channel_second").multipleSelect({
            placeholder: "全部",
            selectAllText:"全部",
            width: 150,
            selectAll: true
        });
        autocompleteMultiple('.source',data.source);
        autocompleteMultiple('.medium',data.medium);
        autocompleteMultiple('.campaign',data.campaign);
        //$(".source").multipleSelect({
        //    placeholder: "全部",
        //    //selectAllText:"全部",
        //    width: 150,
        //    selectAll: false,
        //    filter: true
        //});
        //$(".medium").multipleSelect({
        //    placeholder: "全部",
        //    //selectAllText:"全部",
        //    width: 150,
        //    selectAll: false,
        //    filter: true
        //});
        //$(".campaign").multipleSelect({
        //    placeholder: "全部",
        //    //selectAllText:"全部",
        //    width: 150,
        //    selectAll: false,
        //    filter: true
        //})

    })
}

function renderOptions(sel,data){
    $(sel).empty();
    if(data!=undefined){
        data.forEach(function(ele){
            $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
        });
    }
}

function pickStartDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.startDateSelectLabel').html(sdt+"~"+edt);
}
function pickStartWeekDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.startWeekDateSelectLabel').html(sdt+"~"+edt);
}
function pickStartMonthDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.startMonthDateSelectLabel').html(sdt+"~"+edt);
}



function  getProductWebTraffic(filter){
    //clean parameters
    //var query = cleanParams(filter);
    //only get one day important!!!
    var query = cleanParams(_.clone(filter));
    //query.startDate = query.endDate;
    var flag = query["dateType"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if(flag=="daily" || !flag){
        requestURL(dataService+"/webTraffic/getDailyProductWebTrafficData",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="weekly"){
        requestURL(dataService+"/webTraffic/getWeeklyProductWebTrafficData",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="monthly"){
        requestURL(dataService+"/webTraffic/getMonthlyProductWebTrafficData",query).done(function(ret){
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
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

function getAggregateWebTrafficData(filter){
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if(flag=="daily" || !flag){
        requestURL(dataService+"/webTraffic/getDailyAggregateProductWebTrafficData",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="weekly"){
        requestURL(dataService+"/webTraffic/getWeeklyAggregateProductWebTrafficData",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="monthly"){
        requestURL(dataService+"/webTraffic/getMonthlyAggregateProductWebTrafficData",query).done(function(ret){
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//获取总的计算数据
function getCalcData(data){
    var uv= 0;
    var inquiry_uv =0;
    var inquiry_success_uv = 0;
    var trade_method_uv = 0;
    var payment_method_uv = 0;
    var submit_success_uv = 0;
    var submit_success_cnt = 0;
    var recycle_method_uv = 0;
    var shop_recycle_uv = 0;
    data.forEach(function (e) {
        uv += e.uv;
        inquiry_uv += e.inquiry_uv;
        inquiry_success_uv += e.inquiry_success_uv;
        trade_method_uv += e.trade_method_uv+e.recycle_method_uv;
        payment_method_uv += e.payment_method_uv;
        submit_success_uv += e.submit_success_uv;
        submit_success_cnt += e.submit_success_cnt;
        recycle_method_uv += e.recycle_method_uv;
        shop_recycle_uv += e.shop_recycle_uv;
    });
    var inquiry_uv_rate = ((inquiry_uv/uv)*100).toFixed(2);//询价转换率
    var inquiry_success_uv_rate = ((inquiry_success_uv/uv)*100).toFixed(2);
    var inquiry_success_inquiry_rate = ((inquiry_success_uv/inquiry_uv)*100).toFixed(2);
    var trade_method_uv_rate = ((trade_method_uv/uv)*100).toFixed(2);
    var trade_method_inquiry_success_rate = ((trade_method_uv/inquiry_success_uv)*100).toFixed(2);
    var payment_method_uv_rate = ((payment_method_uv/uv)*100).toFixed(2);
    var payment_method_trade_method_rate=((payment_method_uv/trade_method_uv)*100).toFixed(2);
    var submit_success_uv_rate = ((submit_success_uv/uv)*100).toFixed(2);
    var submit_success_cnt_rate = ((submit_success_cnt/uv)*100).toFixed(2);
    var submit_success_trade_method_rate = ((submit_success_uv/trade_method_uv)*100).toFixed(2);

    return {
        "uv":uv,
        "inquiry_uv":inquiry_uv,
        "inquiry_success_uv":inquiry_success_uv,
        "trade_method_uv":trade_method_uv,
        "payment_method_uv":payment_method_uv,
        "submit_success_uv":submit_success_uv,
        "submit_success_cnt":submit_success_cnt,
        "inquiry_uv_rate":inquiry_uv_rate,
        "inquiry_success_uv_rate":inquiry_success_uv_rate,
        "inquiry_success_inquiry_rate":inquiry_success_inquiry_rate,
        "trade_method_uv_rate":trade_method_uv_rate,
        "trade_method_inquiry_success_rate":trade_method_inquiry_success_rate,
        "payment_method_uv_rate":payment_method_uv_rate,
        "payment_method_trade_method_rate":payment_method_trade_method_rate,
        "submit_success_uv_rate":submit_success_uv_rate,
        "submit_success_cnt_rate":submit_success_cnt_rate,
        "submit_success_trade_method_rate":submit_success_trade_method_rate,
        "shop_recycle_uv":shop_recycle_uv,
        "recycle_method_uv":recycle_method_uv
    }
}
//根据日期获取总的数据
function  getCalcDataByDate(data){
    var dataDict = _.groupBy(data,function(obj){return obj.date});
    var total = {};
    var dateList =[];
    var series = {
        uv:[],
        inquiry_uv:[],
        inquiry_success_uv:[],
        trade_method_uv:[],
        payment_method_uv:[],
        submit_success_uv:[],
        submit_success_cnt:[],
        inquiry_uv_rate:[],
        inquiry_success_uv_rate:[],
        inquiry_success_inquiry_rate:[],
        trade_method_uv_rate:[],
        trade_method_inquiry_success_rate:[],
        payment_method_uv_rate:[],
        payment_method_trade_method_rate:[],
        submit_success_uv_rate:[],
        submit_success_cnt_rate:[],
        submit_success_trade_method_rate:[],
        recycle_method_uv:[],
        shop_recycle_uv:[]
    };
    for(var key in dataDict){
        dateList.push(key);
        var obj = getCalcData(dataDict[key]);
        series.uv.push(obj.uv);
        series.inquiry_uv.push(obj.inquiry_uv);
        series.inquiry_success_uv.push(obj.inquiry_success_uv);
        series.trade_method_uv.push(obj.trade_method_uv);
        series.payment_method_uv.push(obj.payment_method_uv);
        series.submit_success_uv.push(obj.submit_success_uv);
        series.submit_success_cnt.push(obj.submit_success_cnt);
        series.inquiry_uv_rate.push(obj.inquiry_uv_rate);
        series.inquiry_success_uv_rate.push(obj.inquiry_success_uv_rate);
        series.inquiry_success_inquiry_rate.push(obj.inquiry_success_inquiry_rate);
        series.trade_method_uv_rate.push(obj.trade_method_uv_rate);
        series.trade_method_inquiry_success_rate.push(obj.trade_method_inquiry_success_rate);
        series.payment_method_uv_rate.push(obj.payment_method_uv_rate);
        series.payment_method_trade_method_rate.push(obj.payment_method_trade_method_rate);
        series.submit_success_uv_rate.push(obj.submit_success_uv_rate);
        series.submit_success_cnt_rate.push(obj.submit_success_cnt_rate);
        series.submit_success_trade_method_rate.push(obj.submit_success_trade_method_rate);
        series.recycle_method_uv.push(obj.recycle_method_uv);
        series.shop_recycle_uv.push(obj.shop_recycle_uv);
    }

    total.uv = series.uv.sum();
    total.inquiry_uv = series.inquiry_uv.sum();
    total.inquiry_success_uv = series.inquiry_success_uv.sum();
    total.trade_method_uv = series.trade_method_uv.sum();
    total.payment_method_uv = series.payment_method_uv.sum();
    total.submit_success_uv = series.submit_success_uv.sum();
    total.submit_success_cnt = series.submit_success_cnt.sum();
    total.recycle_method_uv = series.recycle_method_uv.sum();
    total.shop_recycle_uv =series.shop_recycle_uv.sum();
    total.inquiry_uv_rate = ((total.inquiry_uv/total.uv)*100).toFixed(2);
    total.inquiry_success_uv_rate = ((total.inquiry_success_uv/total.uv)*100).toFixed(2);
    total.inquiry_success_inquiry_rate = ((total.inquiry_success_uv/total.inquiry_uv)*100).toFixed(2);
    total.trade_method_uv_rate = ((total.trade_method_uv/total.uv)*100).toFixed(2);
    total.trade_method_inquiry_success_rate = ((total.trade_method_uv/total.inquiry_success_uv)*100).toFixed(2);
    total.submit_success_uv_rate = ((total.submit_success_uv/total.uv)*100).toFixed(2);
    total.submit_success_cnt_rate = ((total.submit_success_cnt/total.uv)*100).toFixed(2);
    if(total.trade_method_uv==0){
        total.submit_success_trade_method_rate="0.00"
    }else {
        total.submit_success_trade_method_rate = ((total.submit_success_uv / total.trade_method_uv) * 100).toFixed(2);
    }
    total.payment_method_uv_rate = ((total.payment_method_uv/total.uv)*100).toFixed(2);
    total.payment_method_trade_method_rate = ((total.payment_method_uv/total.trade_method_uv)*100).toFixed(2);
    return {"dateList":dateList,"series":series,"total":total}
}


function drawDailyTrafficFunnelChart(date,obj) {

    var dateType =$(".dateType").val(),date2;
    if(dateType=="daily"){
        date2=date;
    }else if(dateType=="weekly"){
        date2=date+"~"+(new Date(date).getNewDate(6));
    }else if(dateType=="monthly"){
        date2=date+"~"+(new moment(date).endOf('month').format('YYYY-MM-DD'));
    }
    var subtext="";
    var yAxis = ['总访客数',
        "询价转化率:"+obj.inquiry_uv_rate + '%\n询价访客数',
        "询价完成率:"+((obj.inquiry_success_uv/obj.inquiry_uv)*100).toFixed(2) + '%\n询价完成访客数',
        "选择回收方式率:"+((obj.trade_method_uv/obj.inquiry_success_uv)*100).toFixed(2) + '%\n选择回收方式访客数',
        "提交成功率:"+((obj.submit_success_uv/obj.trade_method_uv)*100).toFixed(2) + '%\n提交成功访客数',
        "提交成功转化率:"+obj.submit_success_uv_rate + '%\n提交成功访客数','门店回收访客数'].reverse();

    var $plat = $(".platform").val();
    if(flag==0){
        if(($plat && !($plat.indexOf("官网")>-1))){
            subtext="选择支付方式访客数:"+obj.payment_method_uv
        }
    }else{
        $plat=$("#platformM").val();
        if(($plat && !($plat.indexOf("官网")>-1))){
            subtext="选择支付方式访客数:"+obj.payment_method_uv
        }
    }
    var option = {
        title: {
            text: '产品流量('+date2+")",
            x: "center",
            subtext:subtext
            // subtext:"test"
            //y: "bottom"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            show: false,
            left: '3%',
            right: '4%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'value', show: false
            }
        ],
        yAxis: [
            {
                type: 'category',
                data: yAxis,
                splitLine: {
                    show: true
                }
            }
        ],
        series: [
            {
                name: '访问量',
                type: 'bar',
                itemStyle: {normal: {color: '#568FC8', label: {show: true, position: 'right', color: '#568FC8'}}},
                data: [obj.uv,obj.inquiry_uv,obj.inquiry_success_uv,obj.trade_method_uv,obj.submit_success_uv,obj.submit_success_uv,obj.shop_recycle_uv].reverse()
            }
        ]
    };
    var dailyTrafficFunnelChart = echarts.init(document.getElementById('dailyTrafficFunnelChart'));
    dailyTrafficFunnelChart.setOption(option,true);

    setTimeout(function (){
        window.addEventListener('resize',function () {
            dailyTrafficFunnelChart.resize();
        })
    },50)
}

function drawDailyTrafficStackChart(obj){

    var option = {
        title: {
            text: '折线图堆叠',
            x:"center",
            padding:[0,0,0,50]
            //y:"bottom"
        },
        tooltip: {
            trigger: 'axis',
            formatter:function(params,ticket,callback){
                var str = (params[1]?params[1]:params[0]).name + '<br/>';
                params.forEach(function(obj){
                    if(obj.seriesName.indexOf("率")>-1){
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    }else if(obj.seriesName.indexOf("全选")>-1){
                        str+='数据如下：'+'<br/>'
                    }else{
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }
                });
                return str;
            }
        },
        legend: {
            data:[{name:'全选',icon: 'circle'},'总访客数','门店回收访客数','询价访客数','询价完成访客数','选择回收方式访客数','选择支付方式访客数','提交成功访客数','提交成功订单数','询价转化率','询价完成转化率','询价完成率','选择回收方式转化率','选择回收方式率','选择支付方式转化率','选择支付方式率','提交成功转化率','提交成功率','订单转化率'],
            padding: [30,0,0,0],
            selected:{
                "全选":true
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            top:'20%',
            containLabel: true
        },
        toolbox: {
            feature: {
                /*saveAsImage: {}*/
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: obj.dateList
        },
        yAxis: [
            {
                type: 'value'
            },
            {
                type: 'value',
                axisLabel: {
                    formatter: function (value, index) {
                        if (value == 0) {
                            return value
                        }
                        return value+"%"
                    }
                }
            }
        ],
        series: [
            {
                name:'全选',
                type:'line',
                data:[]
            },
            {
                name:'总访客数',
                type:'line',
                data:obj.series.uv
            },
            {
                name:'门店回收访客数',
                type:'line',
                data:obj.series.shop_recycle_uv
            },
            {
                name:'询价访客数',
                type:'line',
                data:obj.series.inquiry_uv
            },
            {
                name:'询价完成访客数',
                type:'line',
                data:obj.series.inquiry_success_uv
            },
            {
                name:'选择回收方式访客数',
                type:'line',
                data:obj.series.trade_method_uv
            },
            {
                name:'选择支付方式访客数',
                type:'line',
                data:obj.series.payment_method_uv
            },
            {
                name:'提交成功访客数',
                type:'line',
                data:obj.series.submit_success_uv
            },
            {
                name:'提交成功订单数',
                type:'line',
                data:obj.series.submit_success_cnt
            },
            {
                name:'询价转化率',
                type:'line',
                yAxisIndex: 1,
                data:obj.series.inquiry_uv_rate
            },

            {
                name:'询价完成率',
                type:'line',
                yAxisIndex: 1,
                data:obj.series.inquiry_success_inquiry_rate
            },
            {
                name:'选择回收方式率',
                type:'line',
                yAxisIndex: 1,
                data:obj.series.trade_method_inquiry_success_rate
            },
            {
                name:'选择支付方式率',
                type:'line',
                yAxisIndex: 1,
                data:obj.series.payment_method_trade_method_rate
            },
            {
                name:'提交成功转化率',
                type:'line',
                yAxisIndex: 1,
                data:obj.series.submit_success_uv_rate
            },
            {
                name:'提交成功率',
                type:'line',
                yAxisIndex: 1,
                data:obj.series.submit_success_trade_method_rate
            },
            {
                name:'订单转化率',
                type:'line',
                yAxisIndex: 1,
                data:obj.series.submit_success_cnt_rate
            }
        ]
    };
    var dailyTrafficStackChart = echarts.init(document.getElementById('dailyTrafficStackChart'));
    dailyTrafficStackChart.setOption(option,true);
    setTimeout(function (){
        window.addEventListener('resize',function () {
            dailyTrafficStackChart.resize();
        })
    },200)

    dailyTrafficStackChart.on('legendselectchanged',function(params){
        var all=params.selected;
        var key = params.name;
        option.legend.selected={};
        if(key=='全选'&&params.selected[key]==true){
            for(var a in all){
                all[a]=true;
            }
        }else if(key=='全选'&&params.selected[key]==false)
        {
            for(var a in all){
                all[a]=false;
            }
        }
        option.legend.selected=all;
        dailyTrafficStackChart.setOption(option);
    });

}

