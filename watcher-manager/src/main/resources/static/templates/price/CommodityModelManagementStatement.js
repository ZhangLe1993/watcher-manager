Template.CommodityModelManagementStatement.rendered = function () {
    $('.navi-tab').removeClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var source = Template.source;
    switch (source) {
        case "standard":
            $('#standardTab').addClass('active');
            $('#StandardTransDepartTab').addClass('active');
            $('#CommodityModelManagementStatement').addClass('active');
            break;
        case "price":
            $('#priceTab').addClass('active');
            $('#priceCommodityModelManagementStatement').addClass('active');
            break;
        case "competition":
            $('#CompetitonPriceTab').addClass('active');
            $('#competitionCommodityModelManagementStatement').addClass('active');
            break;
        case "pricemonitor":
            $('#operationPlatformTab').addClass('active');
            $("#standardSystemTab").addClass('active');
            $('#pricemonitorCommodityModelManagementStatement').addClass('active');
            break;
        default:
            break;
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340102FF16D4382DB923BB6F9FA54E6CA81ECF3DDFE92EE55086624472D2EDCAAF95DAF0D5B1D7D4CEC8541D9BE6E5223845B2A61355A235625968FC7D51AA20A6E9D65F63650E50765CB97B8E9D5D6BFBBB43419A59BADDBEF1AF47E27705A851E0D1BAB8CA4CD0AE25E7A5DA0BB713CDCA3FE3093065EFA74CE14E45EECE1F46C478DC06BD09341807E588E7DD98889C002AB6D0C5E8B6F93C28B14A1C9A72851CF83ED0A722B490188B40FD3FEA17774794F056271B5C4A65734AD8BD1343FADE6075229CFFEE7CFDC515165FA8F6EC22&type=dashboard"
        + "&_t=" + (new Date()).getTime();

    $("#frame_davinci").attr("src",url);

    $("#frame_davinci").load(function(){
        setTimeout(function(){
            var frame = document.getElementById("frame_davinci").contentWindow;
            var message = {parentOrigin:window.origin,msg:"收到请回复"};
            frame.postMessage(JSON.stringify(message), davinci);
            console.log('发送成功');
        },2000);
        window.addEventListener("message", receiveMessage, false);
    });
};

function receiveMessage(event)
{
    console.log(event.origin);
    if (event.origin !== davinci){
        return;
    }
    console.log("子页面有消息回来了");
    console.log(event);
    $("#frame_davinci").attr("height",accAdd(accMul(event.data,1),300) + 'px');
    window.removeEventListener("message", receiveMessage, false);
}