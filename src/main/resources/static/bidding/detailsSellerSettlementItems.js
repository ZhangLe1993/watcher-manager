Template.detailsSellerSettlementItems.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#empowermentTab').addClass('active');
    $('#sellerAnalysis').addClass('active');
    $('#detailsSellerSettlementItems').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url = "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401D5DDF809522C564D17517228EF7D1A5742A7D7F366D00FEC8739C5F0A50E944F2B58D49C545F1C0847817C7A6A6C8641B2A61355A235625968FC7D51AA20A6E9135758E680F651ABF2FB405073E0FA7F43419A59BADDBEF1AF47E27705A851E0B5E88970C4B8037D8FD2A18E8E7DF576C34C77B061AA7E6121C03EE35E3965A7121744886FEF5DF35554779A47A9650E5ACE632D47927B47CAA38292A5D1B7CA2FCC08693F033BBF68AD221E65EEC2C48762F1F52003772C51CBEBD68390A76BD99AFA2F9D4F716FCD21D7B18428F89A&type=dashboard"
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