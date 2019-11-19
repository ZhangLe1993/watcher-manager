Template.revenueExpenditure.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aijihuiTab').addClass('active');
    $('#financesTab').addClass('active');
    $('#revenueExpenditure').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234014E8B04581A9CB6A7503EC7BF878FE9224E2029432943D9F4F73E62D20A98E0546CAEF206C4A297541BB02514FBD0A325E43B8C25177532ED344D673F546810BE76D090844012E987D480F202F193DEE0D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B8864920A45DA7BA9FE50E88A3E73488AD32D69FE903A6B49DA60256C6628990765106C9AB3DE520C405B9289FE333F57DA49761C1C19DB15EBFFDFA8B82BB54EE759A201E7C98A39E0AECDA46DE5B1C17ABD024BBDD9624299B0E6402C3192BC&type=dashboard"
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