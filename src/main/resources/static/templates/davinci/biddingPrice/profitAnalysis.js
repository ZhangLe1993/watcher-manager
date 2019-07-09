Template.profitAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#biddingPlatformTab').addClass('active');
    $('#profitAnalysisTab').addClass('active');
    $('#profitAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401476BADB0D19FD58A92D56D7D97B4A06B0E193F95DAC366558F0D5B1DDCDA835E5095FE1A204CDDB4F28DF17556AB36CFE43B8C25177532ED344D673F546810BEAF40E8317C7EB3CC4647F7DAF90C47ACD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6BC9CC1ADF888ED11EEBF5910E6C039B7B75A49F882F7EF07A7B7CF6A2FD285C16C74394FB7919F2B93437180E2516307C115F133D29D814F3D584C1A1FCC573A361595C8E0A1912AD3AFF455C0A0535A0FBB34ADDA35517BE3EA0EEB713F4D958&type=dashboard"
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