Template.privacyDumpDetails.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#supplyChainTab').addClass('active');
    $('#privacyDumpDetails').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340105E2A80F95D4FFE6C871CB662BAF678976CBAECAE4A02A5F0D13FB9A51616CBF25141BB6A89B9D9441B1A9534756259AE43B8C25177532ED344D673F546810BED06C854EAF0B8956210A516D024F623CD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6BD18829FB4910C0A9B2D32C57692E896EF7547F3FC9AA0986C43083EAC435A76270273D15C72B99E16FF4AD9053A518B6F762EBDD6651C6E43D888A3D7239FA1305A7392F1A67FAA6D2B4CAA8B80636477E68EFB263C145D1630519DD919BE76D&type=dashboard"
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
    if (event.origin !== davinci){
        return;
    }
    console.log("子页面有消息回来了");
    console.log(event);
    $("#frame_davinci").attr("height",accAdd(accMul(event.data,1),300) + 'px');
    window.removeEventListener("message", receiveMessage, false);
}