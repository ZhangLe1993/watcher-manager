Template.venderSansungAreaInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderSansungDataserviceTab').addClass('active');
    $('#venderSansungAreaInfo').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var dateGap = -30;
    var minDate = "2016-09-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);

    $(".dateSelectLabel").html(startDate + "~" + endDate);
    $('.webTrafficFunnelDate').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate,false), pickWebTrafficFunnelDateRangeCallback);

    renderPage();

    //$(".search").click(function(){
    //    renderPage();
    //})

};

var startDateEmbed, endDateEmbed;

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
    renderPage();
}

function getSelectedFilter() {

    dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    startDate = dt[0];
    endDate = dt[1];
    startDateEmbed = startDate;
    endDateEmbed = endDate;
    var filter = {};
    filter.account_key = Meteor.user().profile.name;
    filter.startDate = startDate;
    filter.endDate = endDate;

    return cleanParams(filter);
}

function renderPage() {
    //var dateGap = -15;
    var tempJson = {};
    tempJson.submitNum = 0;
    tempJson.submitCnt = 0;
    tempJson.newCnt = 0;
    tempJson.tradeCnt = 0;
    tempJson.tradeNum = 0;
    var filter = getSelectedFilter();
    $("#tablee").hide();
    $("#loading2").show();
    var promise = getSansuangCollectInfoByAccountkey(filter);
    promise.done(function (ret) {
        $("#tablee").show();
        $("#loading2").hide();

        ret.forEach(function (e) {
            tempJson.submitNum += e.submitNum;
            tempJson.submitCnt += e.submitCnt;
            tempJson.newCnt += e.newCnt;
            tempJson.tradeCnt += e.tradeCnt;
            tempJson.tradeNum += e.tradeNum;
        })
        renderGroupTable(ret, '#tablee',tempJson);
    });
}

//门店
function renderGroupTable(data, tableName,tempJson) {
    var b = "<a class='cus_modal'  data-fancybox-type='iframe' href='/thirdpartydataservice/venderSansungOrderInfo/all/"+startDateEmbed+"/"+endDateEmbed+"'>详细信息</a>"
    var fixRow = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >合计</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >'+tempJson.submitNum+'</td>","<td style="">'+tempJson.submitCnt+'</td>", "<td  style=""    >'+tempJson.newCnt+'</td>", "<td  style=""    >'+tempJson.tradeCnt+'</td>", "<td  style=""    >'+tempJson.tradeNum+'</td>", "<td  style="">'+b+'</td>"'
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        fixRow:fixRow,
        data: data,
        columns: [{
            field: 'sansung_area',
            title: '支社',
            sortable: true
        }, {
            field: 'sansung_office',
            title: '办事处',
            sortable: true
        }, {
            field: 'sansung_city',
            title: '城市',
            sortable: true
        }, {
            field: 'sansung_group_name',
            title: '专卖店',
            sortable: true
        }, {
            field: 'submitNum',
            title: '回收金额',
            sortable: true
        }, {
            field: 'submitCnt',
            title: '回收台数',
            sortable: true
        }, {
            field: 'newCnt',
            title: '以旧换新数量',
            sortable: true
        }, {
            field: 'tradeCnt',
            title: '成交台数',
            sortable: true
        }, {
            field: 'tradeNum',
            title: '成交金额',
            sortable: true
        }, {
            field: '#',
            title: '操作',
            sortable: true,
            formatter: function (value, row, index) {
                return "<a class='cus_modal'  data-fancybox-type='iframe' href='/thirdpartydataservice/venderSansungOrderInfo/" + row.sansung_group_name + "/" + startDateEmbed + "/" + endDateEmbed + "'>详细信息</a>"
            }
        }]
    });
}

function getSansuangCollectInfoByAccountkey(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender2/getSansuangCollectInfoByAccountkey", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}



