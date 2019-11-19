Template.distributionSellerCompletion.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#empowermentTab').addClass('active');
    $('#sellerAnalysis').addClass('active');
    $('#distributionSellerCompletion').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401108375B2B85DCC784DF8CCD571F41117FB4AE8557435D6630A1F100182EA8E696140802B6224A1B506F46DEEFEC2F861E43B8C25177532ED344D673F546810BE0D42467B0D56788D480A5DD916563D4AD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B758C9B0C98093124545246C1808F67B9056E9DD99D58CC03D90DC69D67C4F763690738BC9169E5227BBCC2DD67E07AA5C1B34658AEACF6382FEF0E5EA48E1058A9DB0757DF303CAEDB773C64F8AF43C840CD16ABA9AD8096201FCEA6046AB286&type=dashboard"
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