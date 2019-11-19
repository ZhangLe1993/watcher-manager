Template.aijihuiActionOperationOverView.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aijihuiTab').addClass('active');
    $('#aijihuiActionOperationTab').addClass('active');
    $('#aijihuiActionOperationOverView').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234016EA79012A76762AED19FAE4503EBF2C95722CC672D4F7A7023EE17E21B4D5B11DDAFC8BED4087B320231EFC43CD4C1F5B2A61355A235625968FC7D51AA20A6E9ED055109308913E72F91AC60B2B7A8AF43419A59BADDBEF1AF47E27705A851E09793C66B09104ADAF8B181A92D2B60B983E49C14A93F9AB46A21C5666121AA3127165CD329B524CA8ABD145A1D49D164364E5FBC708E0419528FF03856F0D7E30E390E137374C5FDE53F510F6A9E755050F5A5D5A1350EA8F897923FDDA0567854FFB70116A1D5DC56D0EFDA2F19C704&type=dashboard"
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