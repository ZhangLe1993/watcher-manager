Template.VenderHQVenderOrderStatisticsIframe.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderHQDataInfoTab').addClass('active');
    $('#VenderHQVenderOrderStatisticsIframe').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var url =  '/vender/VenderOrderStatistics/aihuishouBiClairAll/all';
    //var url =  '/vender/VenderOrderStatistics/3106/成都联创杭瑞科技有限公司';
    //var url='http://192.168.31.248:3000/vender/VenderOrderStatistics/aihuishouBiClairAll/all';
    $('#mainIFrame').attr('src',url );
};