Template.ycfx.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#receiveGoodsTab").addClass('active');
    $('#ycfx').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var url = "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401D57AC4DBA914582EC932AA1415C304E1DB56A1E345AC223D5F6B8AEC6C12B2654B4B45C11D596463A619170D2CD2AFE5B2A61355A235625968FC7D51AA20A6E9E8E53285213AFD08EB218AADF732F1F043419A59BADDBEF1AF47E27705A851E0D0D5C6F967E6B24B84BCFC063DD89AE20A7B529B6D9ED18DB234DC234584AEBD6BFD6AD9A40B34A87F7F75DA1B697B66F95FB4ABAECF5639DCFA85B12396C682F200B3672D55FC6C5623E2751B776C220ADF989DD8B6859D264F795BDD7B2C02ED9F5783E0FE16AD1EAE26DE41D3B333&type=dashboard"
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