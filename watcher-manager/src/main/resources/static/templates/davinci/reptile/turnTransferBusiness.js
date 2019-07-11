Template.turnTransferBusiness.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#priceTab').addClass('active');
    $("#pythonTab").addClass('active');
    $('#turnTransferBusiness').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340144AE19EB4B052AF661BDEB080B26D5AF332006D1EDD04B985F719D59F05E5C396140802B6224A1B506F46DEEFEC2F861E43B8C25177532ED344D673F546810BE6C950083F1E2EDF7BF12DA860E36A00BD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6BEC8229302B2CB22290950CC2323B55161DC84AB6ED6B2E41247D9F6DE635C2E7F36A55635B4E7B6FAEFDA17FA6EBBB2B29636970967ADB4176ABA0AE95C997B5917EFFBF06082F192286D9FCE08D291F92C19D5C5A290210041393315423D153&type=dashboard"
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
    if (event.origin !== davinci) {
        return;
    }
    console.log("子页面有消息回来了");
    console.log(event);
    $("#frame_davinci").attr("height",accAdd(accMul(event.data,1),300) + 'px');
    window.removeEventListener("message", receiveMessage, false);
}