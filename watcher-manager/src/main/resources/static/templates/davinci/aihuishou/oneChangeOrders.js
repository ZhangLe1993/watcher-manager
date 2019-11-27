Template.oneChangeOrders.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#specialTab').addClass('active');
    $('#oneChangeOrders').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340167CC7FA8865B4AFBA6C3FBA477478FB5FF1C77F7722ED8F95E8EF5C61B6D285C9DC7737565CF41207D16525B453DA5FEE43B8C25177532ED344D673F546810BE2E2165D0B26C52CD43EB39EFF05E7D6AD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6BF66D8AE6B74FAEB41F13DDC2AF9DD3205E1699BBCC89A5D25111F131449F95B9A8A00515E4E85A293E30575D11D61A452FF9D9573B198B6D72ABE6035F0A4312D6E4C14EC955991F0008FFBE6EFF8D293FEA4245E3A08BC2001299B2ED9C0705&type=dashboard"
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