Template.walletBalanceRedemption.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#FinanceTab').addClass('active');
    $("#financeAihuishouTab").addClass('active');
    $('#walletBalanceRedemption').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401C7A337E38284CE00EA533DCBD2F1E405ADC0CB286B262B0F2800158DF4282F1D3E1EF9D0FFC94F97D3A01EAB3FF2323FE43B8C25177532ED344D673F546810BE18C89E00B0B97196F98DD77201B2150AD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B21715ED4EDCF1FE2BF6B3C4AC4093A3AFF808CA86BB06762B5BBEB424814CEA76269F9C00D2C2C09CC0DBB9AE390B30D54C246037F22F921C5D1E0F7ACEBCC43F20BD7E2F46654054740CF1A7995730363EA29D4E55E3A622F15416AEAFDB5E8&type=dashboard"
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