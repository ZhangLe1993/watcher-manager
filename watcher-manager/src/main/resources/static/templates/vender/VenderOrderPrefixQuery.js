Template.VenderOrderPrefixQuery.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderOrderPrefixQueryTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var renderDataTable = function (dataSet) {
        var table = $('#VenderOrderPrefixQueryTable');

        table.bootstrapTable('destroy').bootstrapTable({
            data: dataSet,
            pagination: true,
            pageSize: 'All',
            search: true,
            singleSelect: true
        });
    };

    var updateStats = function () {

        $('#query').unbind('click');

        $('#loading').show();
        $('#VenderOrderPrefixQueryTable').hide();

        var query = {
            tradePrefix: $('#orderID').val()
        };

        requestURL(dataService + "/Vender/VenderOrderPrefixQuery", query).done(function (data) {
            renderDataTable(data);
            $('#query').click(function () {
                updateStats();
            });
            if (data.length == 0) {
                alert("未查询到数据！！！");
            }
            $('#VenderOrderPrefixQueryTable').show();
            $('#loading').hide();
        });

    };

    var updateImeiStats = function () {
        $('#queryImei').unbind('click');
        $('#loading').show();
        $('#VenderOrderPrefixQueryTable').hide();
        var query = {
            imeiPrefix: $('#imeiID').val()
        };

        requestURL(dataService + "/Vender/VenderImeiPrefixQuery", query).done(function (data) {
            renderDataTable(data);
            $('#queryImei').click(function () {
                updateImeiStats();
            });
            if (data.length == 0) {
                alert("未查询到数据！！！");
            }
            $('#loading').hide();
            $('#VenderOrderPrefixQueryTable').show();
        });

    };

    $('#query').click(function () {
        updateStats();
    });

    $('#queryImei').click(function () {
        updateImeiStats();
    });

    $('#loading').hide();

};

