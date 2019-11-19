Template.frontAuditMonitor.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#frontAuditTab").addClass('active');
    $('#frontAuditMonitor').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234013D64DF8BE433CF8F83AB121CEB3C1DF4C1E7A1D19289DDB0C5BCAE5D9A68AF2467499F6C6ADED9FAF693F9FBE5A1A45EB2A61355A235625968FC7D51AA20A6E974D6F74B478744F6F35B602D6ABC783543419A59BADDBEF1AF47E27705A851E04846059D188850CA91185A082DD2CB990C55A738AFA1C3D25414CCA9508F2CE2EEFE8783D2671ABFB9EB26089901F99D2C4B9513C6806E0CFF3178596078A0BE30A8CDEE42F2048B4E6065643EEABE0216F351AC6822ED2B0C0ECB80AB281D9A767F85F598C5927ED3A46EA1DDB74917&type=dashboard"
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