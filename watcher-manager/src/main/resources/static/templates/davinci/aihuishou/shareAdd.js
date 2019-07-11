Template.shareAdd.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#actionOperationTab').addClass('active');
    $('#shareAdd').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401679C61CB8E03E856F6F25C9AA76697B8276D04B5D466E03B5EFDDE374F043DFFE1839047ACF8250A76E8B94784E3F021E43B8C25177532ED344D673F546810BE6A8B38A6E69E6ED320918927A82EE45BD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B4B8F61108D67F082C31DBBF0814D116563D2D944CAFF16E94FA313008DB3747081EC27998F991A52628045E83C24CBCB8A2D5B97B478C5E94E9087839DE7A6A858F05106E7A71AEA9E87B0707362276359DB646147F458AE7CCB3532DCAE0795&type=dashboard"
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