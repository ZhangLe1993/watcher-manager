Template.shopInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#priceTab').addClass('active');
    $("#pythonTab").addClass('active');
    $('#shopInfo').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234014FADC999452346BE5F665B732542E50A49F539A2EDF799AC160C66D3280FB2DA6D9C2BC2A3FBC58828E0BFC8F8488E4DE43B8C25177532ED344D673F546810BEA311014E975BF33D1084E455692D7423D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B280FF711D27509B02353373510F40796C860D6D0CDA9D2B25BECEABD15C14CD712345EF02E2F68FB0643FA56652EA7BDE39CC3AA35744EB9C53E813DFEDA9B7EBF95453AD7832CD95CC2D9703B85B80B57CE81DF7D50DB5625B8FC1776DA7230&type=dashboard"
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