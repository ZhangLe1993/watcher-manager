Template.VenderFinaceCashAmountDataInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
     $('#VenderTab').addClass('active');
     $('#VenderFinaceDataInfoTab').addClass('active');
     $('#VenderFinaceCashAmountDataInfo').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    $('#dt').html(new Date().getNewDate(-1));
    var updateStats = function (query) {
        requestURL(dataService + "/Vender/getVenderCashAmount", query).done(function (data) {
            $('#cashAmount').html("￥"+data.toFixed(2));
        });
    };

    var date = new Date().format("yyyy-MM-dd");

    var query = {
    };

    updateStats(query);
};
