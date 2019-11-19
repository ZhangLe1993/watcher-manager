Template.popYM.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#CompetitonPriceTab').addClass('active');
    $('#popYM').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401AC59E772613FF96EB4515310EF3DF12A79E63C66BC3C87D945E722F2EC6EDB3D25141BB6A89B9D9441B1A9534756259AE43B8C25177532ED344D673F546810BE6489C6AC786C8A80B3155741EAB57FC3D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B36FD87D568BB1257E18CC2BB752A5082636CB28C2EB3F89711650DA932910B821A2B75EDF0ED3C3B968C4CE93FAB320B79A550BFF62C02A730185563F44C12C242E263E94920A61B2D3C68E8CCDEA86640B30F373ACA1BDF288473BD0D1D49CA&type=dashboard"
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