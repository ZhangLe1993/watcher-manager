Template.SkynetRealTimeObLog.rendered = function () {

    var endDate = moment().format('YYYY-MM-DDTHH:mm:ss');
    var startDate = moment().subtract(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss')

    $('.dateSelectLabel').html("不限时间");
    var datePickerOptions = {
        "showDropdowns": true,
        "timePicker": true,
        "timePicker24Hour": true,
        "autoApply": true,
        "alwaysShowCalendars": true,
        "startDate": startDate,
        "endDate": endDate,
        "locale": {
            "format": "YYYY/MM/DDTHH:mm:ss",
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
            '不限时间':"",
            '最近半小时': [moment().subtract(30, 'minutes').toDate(), moment().toDate()],
            '最近1小时': [moment().subtract(1, 'hours').toDate(), moment().toDate()],
            '最近2小时': [moment().subtract(2, 'hours').toDate(), moment().toDate()],
            '最近6小时': [moment().subtract(6, 'hours').toDate(), moment().toDate()],
            '最近24小时': [moment().subtract(1, 'days').toDate(), moment().toDate()],
            '最近7天': [moment().subtract(7, 'days').toDate(), moment().toDate()],
            '本周': [moment().startOf('week').toDate(), moment().endOf('week').toDate()],
            '本月': [moment().startOf('month').toDate(), moment().endOf('month').toDate()]
        }
    };

    var pickDateTimeRangeCallback = function (start, end, label) {

        startDate = start.format('YYYY-MM-DDTHH:mm:ss')
        endDate = end.format('YYYY-MM-DDTHH:mm:ss');

        //$('.dateSelectLabel').html(startDate + " ~ " + endDate);
        if (label=="不限时间") {
            $('.dateSelectLabel').html(label);
        } else {
            $('.dateSelectLabel').html(startDate + " ~ " + endDate);
        }
    };

    $('.webTrafficFunnelDate').daterangepicker(datePickerOptions, pickDateTimeRangeCallback);


    $(".search").click(function () {
        var orderNumber = $.trim($(".orderNumber").val());
        var date= $.trim($(".dateSelectLabel").text());
        //console.log(date);
        //if (orderNumber != "") {
            var query = {
                "orderNumber": orderNumber,
                "start": date

            }

            requestURL(dataService + "/skynet/skynetRealTimeObLog", query).done(function (data) {
                //;
                renderTable(data);
            })

        //}
    })


}


function renderTable(data) {

    $("#table").bootstrapTable("destroy").bootstrapTable({

        exportDataType: 'all',
        pagination: true,
        search:true,
        //fixRow: fixRow2,
        data: data,
        columns:[
            {
                field:"visitDateTime",
                title:"时间"
            },
            {
                field:"system",
                title:"系统"

            },{
                field:"ip",
                title:"IP"

            },{
                field:"userId",
                title:"用户ID"

            },{
                field:"userName",
                title:"用户名"

            },{
                field:"tradeNo",
                title:"订单号"
            },{
                field:"dispatchBillNo",
                title:"取货单号"
            },{
                field:"url",
                title:"URL"
            }
        ]

    })


}