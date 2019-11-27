Template.popStoreAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#repeatCheckTab').addClass('active');
    $('#popStoreAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234010EFA1A871FD9F117DF8D244D575B0EC4884D5FE0F3A19CB5A392EC7E1EC158AE4B4B45C11D596463A619170D2CD2AFE5B2A61355A235625968FC7D51AA20A6E93625A2C47A6C05C1C2ECA6929C56E6F543419A59BADDBEF1AF47E27705A851E007582A0CE6D396DB0487898DF4B4FCB37C2228C99EEE761DDEB1D3590D4FA87E73F95C0A0089BA1B85C6EFCA927868FE442522C142A4764ABEB94C08C95B8EC5B82C78C5F78B7605195BBED8C66CDE35C20F65CBA3D74DAF336ADC459516D0BD4E17A540CD7AB94699C9965EB1A9C993&type=dashboard"
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