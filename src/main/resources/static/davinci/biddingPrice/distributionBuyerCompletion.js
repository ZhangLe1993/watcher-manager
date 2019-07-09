Template.distributionBuyerCompletion.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#empowermentTab').addClass('active');
    $('#buyerAnalysis').addClass('active');
    $('#distributionBuyerCompletion').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234016FF959803926EE27270E46C26368395A7F7989BA120899E4A7DCD5B374882E185095FE1A204CDDB4F28DF17556AB36CFE43B8C25177532ED344D673F546810BE5BBD290CE58B9AFB96DA954E422B456FD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6BDFC315A40BE5F1E3CBA5668F4A72485671F0919C98927366D27D1819422738AF1B6F867BD2D1440CA2AC6C65366F7718ECD02A7C9DAA7B9AB97075388FFF0B403532437F897F3AAFCC2B53B990CA1D8146C8670AA844024FC525E57A37F180F5&type=dashboard"
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