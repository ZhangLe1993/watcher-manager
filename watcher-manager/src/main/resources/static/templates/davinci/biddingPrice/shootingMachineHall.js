Template.shootingMachineHall.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#biddingPlatformTab').addClass('active');
    $('#liveTab').addClass('active');
    $('#shootingMachineHall').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340148B784FDDFC9B327E96D3240FB7D148CF0F14BEF40E262BF18BF475612A6F579560E1B127905E37A8FEA98A6876BC011E43B8C25177532ED344D673F546810BEEDA54805F23A7581C9C974AB3691EC35D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B4BC03B74FE6E72E293B489395F8F2A6DEB8EFAC4AFDA4BF77D2F9C61C1B9A85D89929C4C580765595F952B29DE9EB3C845199CC7E2B50722997D14E8E89BA82E18B3D7DC9628B8443671B3213A5A8DCDDD9E5388278DBE3F7D59ADF4382A3D9A&type=dashboard"
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