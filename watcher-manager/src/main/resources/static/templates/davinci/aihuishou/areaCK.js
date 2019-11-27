Template.areaCK.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#deliverAnalysisTab').addClass('active');
    $('#areaCK').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234010F2DA3681C3F43520C1E0C4E0AAA2DC60C069E0F732DCCCC83F45DFB7EAA9292E1839047ACF8250A76E8B94784E3F021E43B8C25177532ED344D673F546810BE58A171810BBA3B156F7AD026938F7545D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B080034FA806DDB3FC806E05BD8D76C90505432AE33C1B1196685D6052390A48277BD7EE56533E8821587936CA8955A6D712B20E74E86CEF44F4CC598EC018A99A1248F9C048792CB171630B9798AF7FF798DE0557197E3A3366AE33CF2F269B8&type=dashboard"
        + "&_t=" + (new Date()).getTime();

    $("#frame_davinci").attr("src",url);

    $("#frame_davinci").load(function() {
        setTimeout(function() {
            var frame = document.getElementById("frame_davinci").contentWindow;
            var message = {parentOrigin:window.origin,msg:"收到请回复"};
            frame.postMessage(JSON.stringify(message), davinci);
            console.log('发送成功');
        },2000);
        window.addEventListener("message", receiveMessage, false);
    });
};

function receiveMessage(event) {
    console.log(event.origin);
    if (event.origin !== davinci){
        return;
    }
    console.log("子页面有消息回来了");
    console.log(event);
    $("#frame_davinci").attr("height",accAdd(accMul(event.data,1),300) + 'px');
    window.removeEventListener("message", receiveMessage, false);
}