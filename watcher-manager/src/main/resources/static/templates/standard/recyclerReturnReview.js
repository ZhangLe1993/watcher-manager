Template.recyclerReturnReview.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#standardTab').addClass('active');
    $('#recyclerReturnReviewTab').addClass('active');
    $('#reviewerIndex').addClass('active');
    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    // 获取已激活的标签页的名称
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var activeTab = e.target.hash;
        renderPage(activeTab);
    });

    //审核人员审核退货量
    var updateReturnReviewerStats = function (){
        requestURL(dataService + "/standard/getReturnReviewer", {}).done(function (data) {
            var returnStatsArrays={
                reviewerNames:[],
                auditSuccess:[],
                auditFail:[]
            };

            data.sort(function(a,b){
                return (parseInt(a.audit_success)+ parseInt(a.audit_fail))-(parseInt(b.audit_success)+ parseInt(b.audit_fail))
            }).forEach(function (e) {
                returnStatsArrays.reviewerNames.push(e.name + " ("+ e.operationName +") " + accAdd(e.audit_success,e.audit_fail) + "  ");
                returnStatsArrays.auditSuccess.push(e.audit_success);
                returnStatsArrays.auditFail.push(e.audit_fail);
                });
            drawReturnReviewerChart(returnStatsArrays);
        })

    };

    //默认加载退货审核人员审核数据
    renderPage("#reviewerIndex");

    var drawReturnReviewerChart=function(data){
        var option = {
                    title: {
                        text: '',   //退货审核人员审核实时数据
                        subtextStyle: {
                            color: '#333',
                            fontStyle: 'normal',
                            fontWeight: 'bold'
                        }
                    },
                    dataZoom: [
                        {
                            type: 'slider',
                            start: 80,
                            end: 100,
                            yAxisIndex: [0]
                        }
                    ],
                    animation: false,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: [ '拒退量', '同意退货量']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    yAxis: [
                        {
                            type: 'category',
                            axisTick: {show: true},
                            data: data.reviewerNames,
                            axisLabel: {
                                interval: 0
                            }
                        }
                    ],
                    series: [
                        {
                            name: '同意退货量',
                            type: 'bar',
                            stack: '总量',
                            itemStyle: {
                                normal: {
                                    label: {show: true, position: 'inside'}
                                }
                            },
                            data: data.auditSuccess
                        },
                        {
                            name: '拒退量',
                            type: 'bar',
                            stack: '总量',
                            itemStyle: {
                                normal: {
                                    label: {show: true}
                                }
                            },
                            data: data.auditFail
                        }
                    ]
                };
        var returnReviewerStatsChart=echarts.init(document.getElementById('returnReviewerStatsChart'));
        returnReviewerStatsChart.setOption(option);
        window.addEventListener('resize', returnReviewerStatsChart.resize)
    };

    //根据id激活标签页
    function renderPage(activeTab){
        switch(activeTab) {
            case '#reviewerIndex':      //退货审核
                updateReturnReviewerStats();
                break;
            case '#returnIndex':        //退货指标
                updateReturnStats();
                break;
            case '#realtimeReturnIndex':        //退货指标
                updateRealTimeReturnStats();
                break;
            case '#recyclerReturnIndex':        //退货指标
                updateRecyclerReturnStats();
                break;
            default:
                break;
        }
    }

    //退货量数据
    var updateReturnStats=function (){
        requestURL(dataService+"/standard/getUnTransferReceiveData",{}).done(function(result){
            $(".default0").html("0");
            _.each(result,function(value, key){
                $("#nTransferReceiveCnt"+key).html(value.length);
                $("#nTransferReceiveCnt"+key).parent().click(function(){
                    customModal("已接收未移交量",_.map(value,function(ele){return {"unreceivedNo": ele};}),[{
                        field:'unreceivedNo',
                        title:'订单号',
                        sortable:true
                    }]);
                });
            })
        });

        requestURL(dataService+"/standard/getUnreceivedReturnData",{}).done(function(result){
            $(".default1").html("0");
            _.each(result,function(value, key){
                    $("#unreceivedReturnCnt"+key).html(value.length);
                    $("#unreceivedReturnCnt"+key).parent().click(function(){
                        customModal("待退货审核接收量",_.map(value,function(ele){return {"unreceivedNo": ele};}),[{
                            field:'unreceivedNo',
                            title:'订单号',
                            sortable:true
                        }]);
                    });
                })


         });
        requestURL(dataService+"/standard/getReceivedReturnData",{}).done(function(result){
                $(".default2").html("0");
                _.each(result,function(value, key){
                    $("#receivedReturnCnt" + key).html(value.length);
                    $("#receivedReturnCnt" + key).parent().click(function(){
                        customModal("待退货审核量",_.map(value, function(ele){return {"receivedId": ele};}),[{
                            field: 'receivedId',
                            title: '订单号',
                            sortable:true
                        }]);
                    });
                });
         });
        requestURL(dataService+"/standard/getUntransferReturnData",{}).done(function(result){
                $(".default3").html("0");
                _.each(result,function(value, key){
                    $('#untransferReturnCnt' + key).html(value.length);
                    $("#untransferReturnCnt" + key).parent().click(function(){
                        customModal("已退货审核未移交量",_.map(value, function(ele){return {"untransferId": ele};}),[{
                            field: 'untransferId',
                            title: '订单号',
                            sortable:true
                        }])
                    });
                })
         });

        requestURL(dataService+"/standard/getWaitReturnQualityData",{}).done(function(result){
            $(".default4").html("0");
            _.each(result,function(value, key){
                $('#waitReturnQualityCnt' + key).html(value.length);
                $("#waitReturnQualityCnt" + key).parent().click(function(){
                    customModal("待退货质检量",_.map(value, function(ele){return {"untransferId": ele};}),[{
                        field: 'untransferId',
                        title: '订单号',
                        sortable:true
                    }])
                });
            })
        })
    };

    //退货量数据
    var updateRealTimeReturnStats=function (){
        requestURL(dataService+"/standard/getUnTransferReceiveRealTimeData",{}).done(function(result){
            $(".default0").html("0");
            _.each(result,function(value, key){
                $("#nTransferReceiveRealTimeCnt"+key).html(value.length);
                $("#nTransferReceiveRealTimeCnt"+key).parent().click(function(){
                    customModal("已接收未移交量",_.map(value,function(ele){return {"unreceivedNo": ele};}),[{
                        field:'unreceivedNo',
                        title:'订单号',
                        sortable:true
                    }]);
                });
            })
        });

        requestURL(dataService+"/standard/getUnreceivedReturnRealTimeData",{}).done(function(result){
            $(".default1").html("0");
            _.each(result,function(value, key){
                $("#unreceivedReturnRealTimeCnt"+key).html(value.length);
                $("#unreceivedReturnRealTimeCnt"+key).parent().click(function(){
                    customModal("待退货审核接收量",_.map(value,function(ele){return {"unreceivedNo": ele};}),[{
                        field:'unreceivedNo',
                        title:'订单号',
                        sortable:true
                    }]);
                });
            })


        });
        requestURL(dataService+"/standard/getReceivedReturnRealTimeData",{}).done(function(result){
            $(".default2").html("0");
            _.each(result,function(value, key){
                $("#receivedReturnRealTimeCnt" + key).html(value.length);
                $("#receivedReturnRealTimeCnt" + key).parent().click(function(){
                    customModal("待退货审核量",_.map(value, function(ele){return {"receivedId": ele};}),[{
                        field: 'receivedId',
                        title: '订单号',
                        sortable:true
                    }]);
                });
            });
        });
        requestURL(dataService+"/standard/getUntransferReturnRealTimeData",{}).done(function(result){
            $(".default3").html("0");
            _.each(result,function(value, key){
                $('#untransferReturnRealTimeCnt' + key).html(value.length);
                $("#untransferReturnRealTimeCnt" + key).parent().click(function(){
                    customModal("已退货审核未移交量",_.map(value, function(ele){return {"untransferId": ele};}),[{
                        field: 'untransferId',
                        title: '订单号',
                        sortable:true
                    }])
                });
            })
        });

        requestURL(dataService+"/standard/getWaitReturnQualityRealTimeData",{}).done(function(result){
            $(".default4").html("0");
            _.each(result,function(value, key){
                $('#waitReturnQualityRealTimeCnt' + key).html(value.length);
                $("#waitReturnQualityRealTimeCnt" + key).parent().click(function(){
                    customModal("待退货质检量",_.map(value, function(ele){return {"untransferId": ele};}),[{
                        field: 'untransferId',
                        title: '订单号',
                        sortable:true
                    }])
                });
            })
        })
    };

    var updateRecyclerReturnStats=function (){
        var date0 = new Date().getNewDate(-3);
        var date1 = new Date().getNewDate(-2);
        var date2 = new Date().getNewDate(-1);
        var date3 = new Date().getNewDate(0);
        $("#date0").parent().find("p:first").find("span").html(date0);
        $("#date1").parent().find("p").find("span").html(date1);
        $("#date2").parent().find("p").find("span").html(date2);
        $("#date3").parent().find("p").find("span").html(date3);

        requestURL(dataService+"/standard/getApplyReturnData",{}).done(function(result){
            $(".defaultx").html("0");
            _.each(result,function(value, key){
                switch(key){
                    case date0:
                        $("#date0").html(value.length);
                        $("#date0").parent().click(function(){
                            customModal("商家已申请未接收数量",value,[
                                {
                                    field:'product_no',
                                    title:'订单号',
                                    sortable:true
                                },
                                {
                                    field:'recycler_id',
                                    title:'省份',
                                    sortable:true
                                }]);
                        });
                        break;
                    case date1:
                        $("#date1").html(value.length);
                        $("#date1").parent().click(function(){
                            customModal("商家已申请未接收数量",value,[
                                {
                                    field:'product_no',
                                    title:'订单号',
                                    sortable:true
                                },
                                {
                                    field:'recycler_id',
                                    title:'省份',
                                    sortable:true
                                }]);
                        });
                        break;
                    case date2:
                        $("#date2").html(value.length);
                        $("#date2").parent().click(function(){
                            customModal("商家已申请未接收数量",value,[
                                {
                                    field:'product_no',
                                    title:'订单号',
                                    sortable:true
                                },
                                {
                                    field:'recycler_id',
                                    title:'省份',
                                    sortable:true
                                }]);
                        });
                        break;
                    case date3:
                        $("#date3").html(value.length);
                        $("#date3").parent().click(function(){
                            customModal("商家已申请未接收数量",value,[
                                {
                                    field:'product_no',
                                    title:'订单号',
                                    sortable:true
                                },
                                {
                                    field:'recycler_id',
                                    title:'省份',
                                    sortable:true
                                }]);
                        });
                        break;
                }
            })
        });
    };

    //自定义弹出层
    function customModal(title,data,colums){
           $("#myModal").on('show.bs.modal', function () {
               $("#myModalLabel").text(title);
               $("#modalContent").bootstrapTable('destroy').bootstrapTable({
                   exportDataType: 'all',
                   data:data,
                   columns: colums
               });
           });
           $("#myModal").modal()
       }

};

