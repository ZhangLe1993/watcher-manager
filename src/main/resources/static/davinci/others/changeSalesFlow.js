Template.changeSalesFlow.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#FinanceTab').addClass('active');
    $("#financeAihuishouTab").addClass('active');
    $('#changeSalesFlow').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340115691D4F2B3E46E53060DAF6D6F61B1D2196AE89C0FB91A5018E19158131E22AA08C8AAFE3BE7FA998C249B1986E15F7E43B8C25177532ED344D673F546810BE0594A73D6CD91B05482E63AE2483D6F3D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B2C0AE15A483B15585441D45E976554CEC3AACA6BEF598492D4CEE10E14B117422C6D96012732691952A4B0EAE55967B4348DA08532DE2D77DE1E0EA2C6BA87221CAC732A1487366A8E446BD650527CA8F6CF01D10A38F406FD89BFE5E1C139EF&type=dashboard"
        + "&_t=" + (new Date()).getTime();

    $("#frame_davinci").attr("src",url);

    $("#frame_davinci").load(function() {
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
    if (event.origin !== davinci) {
        return;
    }
    console.log("子页面有消息回来了");
    console.log(event);
    $("#frame_davinci").attr("height",accAdd(accMul(event.data,1),300) + 'px');
    window.removeEventListener("message", receiveMessage, false);
}