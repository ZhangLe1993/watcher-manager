Template.helpSellBaoRecycleOrders.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#specialTab').addClass('active');
    $('#helpSellBaoRecycleOrders').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340106D99EA96CE20671364287DF68711CD1174D673F13353B0B26F110C9F074484B682A65E06370632B470ED6C2AD26587AE43B8C25177532ED344D673F546810BE2A042F811BF07996B866ED5DA77BAC36D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B807B3ECC644BD1ADD88B1DD9B12EC38390BD363F866C8C8CE3E6EC7C4626AEC6FF9E03B8F01BEAD75436CD96FED6CB18D2A05A94FF5859BE0B0975A43FA5C84BCD6DA059C27A27520E9CAAE1946E23C001856C869508506F6598739C4B396FCC&type=dashboard"
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