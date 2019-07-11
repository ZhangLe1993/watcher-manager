Template.ZhiMaTradeMonitor.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#BDTab').addClass('active');
    $('#ZhiMaTradeMonitor').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    $("#type").change(function(){
        updateZhiMaTradeStats()
    })

    var updateZhiMaTradeStats = function () {
        var query = {
            sourceType:$("#type").val()
        }
        if(["48","4801"].contains(query.sourceType)){
            $("div.jd").show()
            requestURL(dataService + "/bd/getXiaoBaiPassCnt",query).done(function (data) {
                $('#xiaobai').html(data.cur);
                $('#prexiaobai').html('昨日同时间：' + data.pre);
            })
            requestURL(dataService + "/bd/getAhsRiskControlInfo", query).done(function (data) {
                $('#ahspass').html(data.pass);
                $('#preahspass').html('昨日同时间：' + data.per_pass);
                $('#ahsrate').html(data.rate+"%");
                $('#preahsrate').html('昨日同时间：' + data.per_rate+"%");
                $('#ahsreject').html(data.reject);
                $('#preahsreject').html('昨日同时间：' + data.per_reject);
            })
            requestURL(dataService + "/bd/getWithholdCnt", query).done(function (data) {
             $('#withhold').html(data.cnt);
             $('#prewithhold').html('昨日同时间：' + data.per_cnt);
             })
        }else{
            $("div.jd").hide()
        }

        requestURL(dataService + "/bd/creditRecycleStatsToday", query).done(function (data) {
            $('#creditRecycleCount').html(data.creditRecycleCount);
            $('#creditRecycleAmount').html('￥' + data.creditRecycleAmount.toLocaleString());
        });
        requestURL(dataService + "/bd/creditRecyclePrePayStatsToday", query).done(function (data) {
            $('#prePayCount').html(data.prePayCount);
            $('#prePayAmount').html('￥' + data.prePayAmount.toLocaleString());
        });
        requestURL(dataService + "/bd/creditRecycleDealStatsToday", query).done(function (data) {
            $('#creditRecycleDealCount').html(data.creditRecycleDealCount);
            $('#creditRecycleDealAmount').html('￥' + data.creditRecycleDealAmount.toLocaleString());
        });
        requestURL(dataService + "/bd/creditRecycleStatsYesterday", query).done(function (data) {
            $('#creditRecycleCountYesterday').html('昨日同时间：' + data.creditRecycleCountYesterday);
            $('#creditRecycleAmountYesterday').html('昨日同时间：' + '￥' + data.creditRecycleAmountYesterday.toLocaleString());
        });
        requestURL(dataService + "/bd/creditRecyclePrePayStatsYesterday", query).done(function (data) {
            $('#prePayCountYesterday').html('昨日同时间：' + data.prePayCountYesterday);
            $('#prePayAmountYesterday').html('昨日同时间：' + '￥' + data.prePayAmountYesterday.toLocaleString());
        });
        requestURL(dataService + "/bd/creditRecycleDealStatsYesterday", query).done(function (data) {
            $('#creditRecycleDealCountYesterday').html('昨日同时间：' + data.creditRecycleDealCountYesterday);
            $('#creditRecycleDealAmountYesterday').html('昨日同时间：' + '￥' + data.creditRecycleDealAmountYesterday.toLocaleString());
        });
        /*requestURL(dataService + "/bd/creditRecycleWaitReceiptStatsHistory", query).done(function (data) {
            $('#prePayCountTotal').html(data.prePayCountTotal);
            $('#prePayAmountTotal').html('￥' + data.prePayAmountTotal.toLocaleString());
        });*/
        requestURL(dataService + "/bd/creditRecycleFailStatsHistory", query).done(function (data) {
            $('#failChargebackCount').html(data.failChargebackCount);
            $('#failChargebackAmount').html('￥' + data.failChargebackAmount.toLocaleString());
        });

        requestURL(dataService + "/bd/getFailChargebackDetail", query).done(function (data) {
            $("#table").bootstrapTable('destroy').bootstrapTable({
                exportDataType: 'all',
                data: data,
                //columns:columns
            })

        })

    };

    updateZhiMaTradeStats();

    //setInterval(updateZhiMaTradeStats, 65000);

};

