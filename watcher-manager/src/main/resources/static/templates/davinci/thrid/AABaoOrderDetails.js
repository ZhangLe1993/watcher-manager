Template.AABaoOrderDetails.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#AABaoOpenTab').addClass('active');
    $('#AABaoOrderDetails').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401B32F81866D771743301C27124EED76EEAE6107EF7B2E21511DC43BB4CBCA79033E1EF9D0FFC94F97D3A01EAB3FF2323FE43B8C25177532ED344D673F546810BEC2BA9459C516C020EC9A1EC7E83DAE5FD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B60474079A227E4A8EA7CD382E34A62001F6362E225A3D1C5C0DD554D4DC40D1595B424440F4576F502CDFACE65D8EB20D0208BB8094088C1D3D500305FACF894C7D00A5381D170F22EDF8E3E4DD31D9F59BA9856CBFC522AFE70BA23B55FA5AF&type=dashboard"
        + "&_t=" + (new Date()).getTime();

    $("#frame_davinci").attr("src", url);

    $("#frame_davinci").load(function() {
        setTimeout(function() {
            var frame = document.getElementById("frame_davinci").contentWindow;
            var message = {parentOrigin:window.origin,msg:"收到请回复"};
            frame.postMessage(JSON.stringify(message), davinci);
            console.log('发送成功');
        }, 2000);
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