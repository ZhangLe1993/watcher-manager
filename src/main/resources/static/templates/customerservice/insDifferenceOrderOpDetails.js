Template.insDifferenceOrderOpDetails.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#CustomerServiceTab').addClass('active');
    $('#newCustomerServiceMSTRTab').addClass('active');
    $('#insDifferenceOrderOpDetails').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var url = "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234013D126B50449D4FDB056CBAE401C837898855A1CBE099D0DF14703957BEE76BEC48BE6D0F1741943710A2739126A261C6B2A61355A235625968FC7D51AA20A6E93F0653A63A1D2FAD80DF49530AEC3A2643419A59BADDBEF1AF47E27705A851E0649DC95944907E40826FD60B28D64DBB4069634A83F606B6293C18653970790A6191F378F0E16DF4ADB0B2F35AC78607E80BBA1A6BCFCD7F9A0DC606195318952DB67901AADDE84C52E81A16C7C914E813C2EB69D596B74A0575561A82B6FC16DF9E8E64E1041D5012C766FE4D0A5846&type=dashboard"
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