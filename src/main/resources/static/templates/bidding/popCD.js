Template.popCD.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#empowermentTab').addClass('active');
    $('#sellerAnalysis').addClass('active');
    $('#popCD').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url = "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401CD9DB4E3541438A3CC0B83BDCEE35C830038986416E1CEB7AC2BB30C11E367D4F8C320AF70CFB294FFE0A9AFC47BF611E43B8C25177532ED344D673F546810BED59D8730D787A1A8F29E2E43E9DD14A2D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B311C8E4BFC92335B64C526F205BFC5125DAF96E6510F01A1740E270661EF245F8657ED5759C09531ADDCF947EB12E2C674054B102795AF9533F7350017C42314AA31D15A30937D3CA7138083A0A9104CD39F87ADE882F1E08C0EC5091563CEEF&type=dashboard"
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