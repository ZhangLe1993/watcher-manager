Template.mdyysc.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#deliverAnalysisTab').addClass('active');
    $('#qaTab').addClass('active');
    $('#mdyysc').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401D8BDCDCF3A79FEB993A903EC804622179CC4E434651187A3D71F73F91C2C1BE4E1839047ACF8250A76E8B94784E3F021E43B8C25177532ED344D673F546810BE19E2FB91B6473033D04A0354DE5F4C85D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B2D7683CA126A244ECF1BBD1CCA3634E5A27F6C719A2347060C4091C054B4BC4CADB4A0F87A9FAF8A11C626AF3CCB19C14A10D4A1824F6C42EE878D375B5CD85D737C27A927B867824269B839B239AF75B6595061F231BD109D77D5FDBDA41698&type=dashboard"
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