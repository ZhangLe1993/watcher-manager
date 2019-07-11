Template.sellerLadBillAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#empowermentTab').addClass('active');
    $('#sellerAnalysis').addClass('active');
    $('#sellerLadBillAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401326F8400AEB9B4B40800513B996E29313D578460E74AC23E5DEBF17506A284885095FE1A204CDDB4F28DF17556AB36CFE43B8C25177532ED344D673F546810BEFDF3107F27A730C88E3000BF3EED0494D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B42350AC12B9F12691A4F2B648F5F2E9D8EF1EED3B465E57C2D82396B9BDE37901EC981005C075DFD60BB338750E7E0E9BBB34F10192040879FFDBE314E3755749D6E0CEA7DF4748D1B61905020318546F430C6AE38A597EBA34BFDD8AEB07508&type=dashboard"
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