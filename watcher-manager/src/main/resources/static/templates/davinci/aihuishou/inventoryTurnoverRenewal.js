Template.inventoryTurnoverRenewal.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#stockAnalysisTab').addClass('active');
    $('#inventoryTurnoverRenewal').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340186D1114B4EE2474E996793534D05AFE6422B5643924AEDEE7562C1DF7901B19BFF62B0E13E4E131B64CA91D60ACD32E2B2A61355A235625968FC7D51AA20A6E955A22AB68BDAEF65C50AF1F9FA6C107A43419A59BADDBEF1AF47E27705A851E0F1188036FA7DFF89DFCCF962785A3F78E8632F8D7F884CA842CFC9697CD1BCF9B9047BC19BCE433655E4EC532BC8325D93A7B5D295E61336A732216C664BB087B1818BF51E41931FE4125E1D9EB424C07A571AA4637553F12D456FA44E3E569238CB87EE6EEAE9B34D35468CFF4AE399&type=dashboard"
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

function receiveMessage(event) {
    console.log(event.origin);
    if (event.origin !== davinci){
        return;
    }
    console.log("子页面有消息回来了");
    console.log(event);
    $("#frame_davinci").attr("height",accAdd(accMul(event.data,1),300) + 'px');
    window.removeEventListener("message", receiveMessage, false);
}