Template.rqcAnalysisDetection.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#randomCheckTab").addClass('active');
    $('#rqcAnalysisDetection').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234014B30F2A550E797B55DEBB0569D7486B5AF845334857617561073DD2AF05F9D312C34C1379FDF10850848755AEAF21761E43B8C25177532ED344D673F546810BEC3C77B94BD85A38329723C18406DFCF0D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B3E93591487ABFCC49E7314A3FB1F0216287D3FCEB291E32E7FBBB309E9A3F5B9B0C1544826A7BDAD4689044BD3C18DFE6B066C6D6CE9430420AA6787BACBF1E5677E2302FBCB29F10EBB2F25AF28E1EBCFBEB58F1D3F5EB2850F7860D416EBD6&type=dashboard"
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