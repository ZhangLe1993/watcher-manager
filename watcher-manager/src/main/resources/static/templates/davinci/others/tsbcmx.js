Template.tsbcmx.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#FinanceTab').addClass('active');
    $("#financeAihuishouTab").addClass('active');
    $('#tsbcmx').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234016EFF4363348E3CDA6111C35C3CC951549CC4E434651187A3D71F73F91C2C1BE4B739C3E041F6C5492CC7B3BAEA158494B2A61355A235625968FC7D51AA20A6E900C5D4A8FA26C4372C1C4BDCCAD727E943419A59BADDBEF1AF47E27705A851E04C35EE9FAE380059730C24DBBCFA1258BA562B7B927B9C11C0EC29A9730C8EA51228F617901139D0A046021A19D227ADC302B35543BA5F41CEC2C84782865CF791771257E2AFED71E5C00BA8F3FAD6D6D34585E1C3619B5DBF43B6B042E3050C0C0AF28E2D63777F1D8765CB456EAF4C&type=dashboard"
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