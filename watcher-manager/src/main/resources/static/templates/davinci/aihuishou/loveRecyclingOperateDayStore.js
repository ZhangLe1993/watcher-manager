Template.loveRecyclingOperateDayStore.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#ahsOverviewTab').addClass('active');
    $('#loveRecyclingOperateDayStore').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401AA983CCA6675923EE47E580C54DA519DE3D23719A4894A3C2F44DE6602DF893CE1839047ACF8250A76E8B94784E3F021E43B8C25177532ED344D673F546810BE6F9C46BCBA00A6A8303F7BF9C684802DD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B8D68CC8444C4FD1626D5825A6845D6C4C7D838CD1E131E0CBCD3C7351ED7BDC1F321EA0F4F4E11B5D1D876708DFF2A8B61A737E53351B91CFBE76DF84EC031CED7CA58EEF3AA66B93B5A82A8B1BFF56FFF56BA88331C3EF3D5849C8CF04B5606&type=dashboard"
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