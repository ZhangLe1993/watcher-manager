
Template.alirealtimeOPTB2BSupplyInfo.rendered = function () {/*B2B代拍大屏数据*/
    $('.navi-tab').removeClass('active');
    $('#pjtrtSideTab').addClass('active');
    $('#pjtBigScreen').addClass('active');
    $('#alirealtimeOPTB2BSupplyInfo').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    $("#mainIFrame").css("height",window.innerHeight)

};
