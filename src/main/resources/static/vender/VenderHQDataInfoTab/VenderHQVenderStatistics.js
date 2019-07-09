/**
 * Created by Howard on 2016/9/28.
 */
Template.VenderHQVenderStatistics.rendered = function () {

    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderHQDataInfoTab').addClass('active');
    $('#VenderHQVenderStatistics').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var dateGap = -14;
    var startDateTrade='2016-09-01';
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);

    var tempEndDate = endDate;
    var tempStartDate = startDate;

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
            '置空': [eval(new Date('2016-09-01')),moment().subtract(1, 'days').toDate()],
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

    $(".startDateSelectLabel").html(startDate + "~" + endDate);
    $('.marketingStartDatePicker').daterangepicker(datePickerOptions, pickStartDateRangeCallback);

    //成交时间
    var datePickerOptionsTrade = {
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
            '置空': [eval(new Date('2016-09-01')),moment().subtract(1, 'days').toDate()],
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

    $(".endDateSelectLabel").html(startDateTrade + "~" + endDate);
    $('.marketingEndDatePicker').daterangepicker(datePickerOptionsTrade, pickEndDateRangeCallback);

    //获取权限省份城市
    var permissionArea = getPermissionArea();
    permissionArea.done(function (ele) {
        controlFilter=getVenderCityPermission(ele.controlName);

        renderFilterOptions();
    });

    function getPermissionArea() {
        //clean parameters
        var dfd = $.Deferred();
        var accountId = Meteor.user().profile.name;
        requestURL(dataService + "/Vender/getProvinceNameJsonByAccountId", {"accountId": accountId}).done(function (ret) {
            dfd.resolve(ret)
        });
        return dfd.promise()
    }

    //////////////权限///////////////////
    $('#query').click(function () {
        var filter = getSelectedFilter();
        rendertable1(filter);
        getFilteredOrderStatistics(filter);
        var dt1 = $('.startDateSelectLabel').text().replace(/ /g, "").split("~");
        var stDate = dt1[0];
        var eDate = dt1[1];
        //if(tempStartDate!=stDate|tempEndDate!=eDate) {
        //    tempStartDate=stDate;
        //    tempEndDate=eDate;
        //    var filter = getSelectedFilter2();
        //    //rendertable(filter);
        //}
    });

};

    var controlFilter={};

    function pickStartDateRangeCallback(start, end, label) {
        console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
        var sdt = start.format('YYYY-MM-DD');
        var edt = end.format('YYYY-MM-DD');
        $('.startDateSelectLabel').html(sdt + "~" + edt);
    }

    function pickEndDateRangeCallback(start, end, label) {
        console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
        var sdt = start.format('YYYY-MM-DD');
        var edt = end.format('YYYY-MM-DD');
        $('.endDateSelectLabel').html(sdt + "~" + edt);
    }

    function renderOptions(sel, data) {
        $(sel).empty();
        data.forEach(function (ele) {
            $(sel).append("<option value='" + ele + "'>" + ele + "</option>")
        });
    }

    function getFilterOptions() {       //筛选字段
        var dfd = $.Deferred();
        requestURL(dataService + "/Vender/getOrderFilterOptions", controlFilter).done(function (ret) {
            dfd.resolve(ret)
        });
        return dfd.promise()
    }

    function renderFilterOptions() {
        var promise = getFilterOptions();
        promise.done(function (data) {
            //renderOptions(".weekly",data.weekStats);
            //renderOptions(".areaName",data.areaNameStats);
            $("#city").attr("multiple", "multiple");
            $("#province").attr("multiple", "multiple");
            $("#trader").attr("multiple", "multiple");
            $("#client").attr("multiple", "multiple");
            $("#subAccount").attr("multiple", "multiple");
            $('#orderStatus').attr('multiple', 'multiple');
            $('#orderType').attr('multiple', 'multiple');
            $('#shop_name').attr('multiple', 'multiple')
            renderOptions('#orderStatus', data.order_status);
            renderOptions('#orderType', data.order_type_name);
            renderOptions("#city", data.city_name);
            renderOptions("#province", data.province_name);
            renderOptions("#trader", data.order_operator_name);
            renderOptions("#client", data.corporate_name);
            renderOptions("#subAccount", data.vender_name);
            renderOptions('#shop_name', data.shop_name);
            // $('#city').multipleSelect({
            //         placeholder: "全部",
            //        //selectAllText:"全部",
            //          // theme:"bootstrap",
            //         selectAll: false
            //      })
            $('#orderStatus').select2({
                theme: 'bootstrap',
                placeholder: '全部',
                selectAll: false
            })
            $('#orderType').select2({
                theme: 'bootstrap',
                placeholder: '全部',
                selectAll: false
            })

            $('#city').select2({
                placeholder: "全部",
                //selectAllText:"全部",
                theme: "bootstrap",
                selectAll: false
            })
            $('#province').select2({
                placeholder: "全部",
                //selectAllText:"全部",
                theme: "bootstrap",
                selectAll: false
            })
            $('#trader').select2({
                placeholder: "全部",
                //selectAllText:"全部",
                theme: "bootstrap",
                selectAll: false
            })
            $('#client').select2({
                placeholder: "全部",
                //selectAllText:"全部",
                theme: "bootstrap",
                selectAll: false
            })
            $('#subAccount').select2({
                placeholder: "全部",
                //selectAllText:"全部",
                theme: "bootstrap",
                selectAll: false
            })
            $('#shop_name').select2({
                placeholder: "全部",
                theme: "bootstrap",
                selectAll: false
            })

            var filter = getSelectedFilter()
            rendertable1(filter);
            getFilteredOrderStatistics(filter);
            //var filter2 = getSelectedFilter2();
            //rendertable(filter2);
        })
    }

    function getFilteredOrderData(filter) {     //订单表格
        var query = _.clone(filter);
        query = cleanParams(query)
        var dfd = $.Deferred();
        requestURLPost(dataService + "/Vender/getLimitFilteredOrderStats", query).done(function (ret) {
            dfd.resolve(ret);
        });
        return dfd.promise()
    }

    function getFilteredOrderStatistics(filter) {       //订单统计
        var query = _.clone(filter);
        var dfd = $.Deferred();
        $("#VenderStatsChart").hide();
        $("#loading").show();
        requestURL(dataService + "/Vender/getFilteredAggregateData", query).done(function (ret) {
            $("#VenderStatsChart").show();
            $("#loading").hide();
            dfd.resolve(ret)
            renderLinecharts(ret)
        });
        return dfd.promise();

    }

    function ExportCSV(filter) {        //订单导出
        var query = _.clone(filter);
        $("#wholePage").mask({'label': "请等待，文件正在导出..."});
        requestURL(dataService + "/Vender/exportVenderOrderData", query).done(function (obj) {
            $("#wholePage").unmask();
            var url = Meteor.settings.public.downloadService.baseUrl + obj.fileName;
            var link = document.createElement("a");
            link.href = url;
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
    }


    function rendertable1(filter) {
        var ajaxQuery = _.clone(filter)
        $('#AijihuiDataTable').bootstrapTable('destroy').bootstrapTable({
            pagination: true,
            sidePagination: 'server',
            ajax: function (params) {
                var ajaxParams = $.extend(ajaxQuery, params.data);
                getFilteredOrderData(ajaxParams).done(function (data) {
                    var newData=[];
                    var finalData={};
                    var i=0;
                    data.rows.forEach(function(e){
                        var tempData={};
                        tempData.order_create_date= e.order_create_date;
                        tempData.order_status= e.order_status;
                        tempData.order_settlement_status= e.order_settlement_status;
                        tempData.order_type_name= e.order_type_name;
                        tempData.order_operator_name= e.order_operator_name;
                        tempData.city_name= e.city_name;
                        tempData.shop_name= e.shop_name;
                        tempData.vender_name= e.vender_name;
                        tempData.order_key= e.order_key;
                        tempData.corporate_name= e.corporate_name;
                        tempData.area_agent_name= e.area_agent_name;
                        tempData.order_mobile= e.order_mobile;
                        tempData.order_product= e.order_product;
                        tempData.invoice_no= e.invoice_no;
                        tempData.order_imei= e.order_imei;
                        tempData.order_validate= e.order_validate;
                        tempData.order_submit_price= e.order_submit_price;
                        tempData.order_deal_price= e.order_deal_price;
                        tempData.order_diff_price= e.order_submit_price-e.order_deal_price;
                        var tempValue= e.province_name.split("#");
                        tempData.province_name= tempValue[0];
                        tempData.ka_fee_num= tempValue[1];
                        tempData.performance_fee_num= tempValue[2];
                        tempData.parent_vender_bonus_num= tempValue[3];
                        tempData.vender_bonus_num= tempValue[4];
                        tempData.vender_order_last_operate_date= tempValue[5];
                        tempData.is_remitted_flag= tempValue[6];
                        tempData.vender_order_deal_price_num= tempValue[7];
                        tempData.remittedNum= tempValue[8];
                        tempData.newBrand= tempValue[9];
                        tempData.newImei= tempValue[10];
                        //tempData.goldenNum= tempValue[11];
                        //tempData.midNum= tempValue[12];
                        tempData.vender_key= tempValue[11];
                        tempData.vender_group_key= tempValue[12];
                        tempData.vender_parent_key= tempValue[13];
                        tempData.vender_province_name= tempValue[14];
                        tempData.vender_city_name= tempValue[15];
                        tempData.trade_key= tempValue[16];
                        tempData.group_owner_bonus= tempValue[17];
                        tempData.agent_bonus_amount_num= tempValue[18];
                        newData[i]=tempData;
                        i++;
                    })
                    finalData.rows=newData;
                    finalData.total=data.total;
                    params.success(finalData);
                })
            },
            sortName: "order_create_date",
            sortOrder: "desc",
            singleSelect: true,
            cdataExport: "cdataExport",
            columns: [{
                field: 'order_create_date',
                title: '订单创建日期',
                sortable: true
            }, {
                field: 'province_name',
                title: '订单产生的省份',
                sortable: true
            }, {
                field: 'city_name',
                title: '订单产生的城市',
                sortable: true
            }, {
                field: 'shop_name',
                title: '门店',
                sortable: true
            },{
                field: 'vender_group_key',
                title: '门店id',
                sortable: true
            }, {
                field: 'order_operator_name',
                title: '业务员',
                sortable: true
            }, {
                field: 'vender_name',
                title: '子账户',
                sortable: true
            },{
                field: 'vender_key',
                title: '子账户id',
                sortable: true
            }, {
                field: 'corporate_name',
                title: '总账户',
                sortable: true
            },{
                field: 'vender_parent_key',
                title: '总账户id',
                sortable: true
            },{
                field: 'vender_province_name',
                title: '总账户所在的省份',
                sortable: true
            }, {
                field: 'vender_city_name',
                title: '总账户所在的城市',
                sortable: true
            },  {
                field: 'area_agent_name',
                title: '代理商',
                sortable: true
            }, {
                field: 'order_type_name',
                title: '订单类型',
                sortable: true
            }, {
                field: 'order_status',
                title: '订单状态',
                sortable: true
            }, {
                field: 'order_submit_price',
                title: '订单提交价',
                sortable: true
            }, {
                field: 'ka_fee_num',
                title: '旧机价',
                sortable: true
            }, {
                field: 'performance_fee_num',
                title: '履约金',
                sortable: true
            },  {
                field: 'order_deal_price',
                title: '成交价',
                sortable: true
            },  {
                field: 'order_diff_price',
                title: '订单差异金额',
                sortable: true
            }, {
                field: 'vender_order_deal_price_num',
                title: '质检后价格',
                sortable: true
            },{
                field: 'parent_vender_bonus_num',
                title: '商家服务费',
                sortable: true
            }, {
                field: 'vender_bonus_num',
                title: '店员服务费',
                sortable: true
            }, {
                field: 'group_owner_bonus',
                title: '店长服务费',
                sortable: true
            },{
                field: 'agent_bonus_amount_num',
                title: '代理商服务费',
                sortable: true
            },{
                field: 'order_validate',
                title: '验货状态',
                sortable: true
            }, {
                field: 'vender_order_last_operate_date',
                title: '成交时间',
                sortable: true
            },{
                field: 'is_remitted_flag',
                title: '是否特殊豁免',
                sortable: true
            },{
                field: 'remittedNum',
                title: '特殊豁免金额',
                sortable: true
            },{
                field: 'order_imei',
                title: '订单IMEI号',
                sortable: true
            }, {
                field: 'order_product',
                title: '订单产品',
                sortable: true
            }, {
                field: 'order_key',
                title: '订单号',
                sortable: true
            }, {
                field: 'invoice_no',
                title: '发货单号',
                sortable: true
            }, {
                field: 'newBrand',
                title: '以旧换新型号',
                sortable: true
            }, {
                field: 'newImei',
                title: '以旧换新串号',
                sortable: true
            }, {
                field: 'trade_key',
                title: '订单key',
                sortable: true,
                visible:false
            }, {
                field: '#',
                title: '更多信息',
                sortable: true,
                formatter: function (value, row, index) {
                    return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/VenderStatisticsCollectInfoModal/" + row.order_key + "/" + row.trade_key +"'>详细信息</a>"
                }
            }
            //    , {
            //    field: 'goldenNum',
            //    title: '金蛋金额',
            //    sortable: true
            //},
                // {
            //    field: 'midNum',
            //    title: '午夜狂欢金额',
            //    sortable: true
            //}
            ]

        });
        $("#cdataExport").click(function () {
            var filter = getSelectedFilter()
            ExportCSV(filter)
        })

    }

    function renderLinecharts(data) {
        var pricedata = [];
        var timedata = [];
        var cntdata = [];
        var submitData=[];
        data.forEach(function (e) {
            pricedata.push(e.deal_num);
            timedata.push(e.order_create_date);
            cntdata.push(e.submit_cnt);
            submitData.push(e.submit_num);
        });

        var option = {
            title: {
                text: '爱机汇总计金额趋势图',
                x: 'center',
                padding: [0, 0, 0, 50]
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['总计提交金额','总计成交金额', '总计单量'],
                padding: [25, 0, 0, 0]
            },
            xAxis: [{
                type: 'category',
                data: timedata
            }],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}元'
                    }
                },
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}单'
                    }
                }
            ],
            series: [
                {
                    name: '总计成交金额',
                    type: 'line',
                    yAxisIndex: 0,
                    data: pricedata,
                    smooth: true,
                    smoothMonotone: 'x'
                },
                {
                    name: '总计提交金额',
                    type: 'line',
                    yAxisIndex: 0,
                    data: submitData,
                    smooth: true,
                    smoothMonotone: 'x'
                },
                {
                    name: '总计单量',
                    type: "line",
                    yAxisIndex: 1,
                    data: cntdata,
                    smooth: true,
                    smoothMonotone: 'x'
                }
            ]
        };
        var LineChart = echarts.init(document.getElementById('VenderStatsChart'));
        LineChart.setOption(option);
        window.addEventListener('resize', LineChart.resize)


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

    function getSelectedFilter() {
        var dt = $('.startDateSelectLabel').text().replace(/ /g, "").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
        var dtTrade = $('.endDateSelectLabel').text().replace(/ /g, "").split("~");
        var startDateTrade = dtTrade[0];
        var endDateTrade = dtTrade[1];
        var areaAgent=$('#areaAgent').val();
        if(areaAgent==""){
            areaAgent="all"
        }
        var endDateAll=startDate+"/"+endDate+"/"+startDateTrade+"/"+endDateTrade+"/"+areaAgent;
        var order_status = $('#orderStatus').val();
        var order_type_name = $('#orderType').val();
        var city_name = $('#city').val();
        var province_name = $('#province').val();
        var order_operator_name = $('#trader').val();
        var corporate_name = $('#client').val();
        var vender_name = $('#subAccount').val();
        var shop_name = $('#shop_name').val();
        var is_active_shop = $('#is_active_shop').prop('checked');
        if (is_active_shop == true) {
            is_active_shop = ['1']
        } else {
            is_active_shop = ['0', '1']
        }
        var order_key = [$('#orderID').val()];
        if (order_key[0] == "") {
            order_key = null;
        }
        var order_mobile = [$('#order_mobile').val()];
        if (order_mobile[0] == "") {
            order_mobile = null;
        }
        var order_imei = [$('#order_imei').val()];
        if (order_imei[0] == "") {
            order_imei = null;
        }
        var invoice_no = [$('#invoice_no').val()];
        if (invoice_no[0] == "") {
            invoice_no = null;
        }
        var filter = {
            'endDateAll': endDateAll,
            'order_status': order_status,
            'order_type_name': order_type_name,
            'city_name': city_name,
            'province_name': province_name,
            'order_operator_name': order_operator_name,
            'corporate_name': corporate_name,
            'vender_name': vender_name,
            'shop_name': shop_name,
            'order_key': order_key,
            'order_mobile': order_mobile,
            'order_imei': order_imei,
            'invoice_no': invoice_no,
            'is_active_shop': is_active_shop
        }
        filter= $.extend(filter,controlFilter);
        return cleanParams(filter)

    }