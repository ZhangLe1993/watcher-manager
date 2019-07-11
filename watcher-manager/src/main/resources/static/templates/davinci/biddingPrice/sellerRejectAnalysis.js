Template.sellerRejectAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#empowermentTab').addClass('active');
    $('#sellerAnalysis').addClass('active');
    $('#sellerRejectAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401C1CB9EDDCC032999FF09352FC2A696C626E9EC36E1A9EF74C385875EEE9B243D418CC52D5D84386828CE1A7BEA6B9EADE43B8C25177532ED344D673F546810BE3DB44595CD5149F345B7580318FEF881D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6BCC062AA67A54564C6F4D941071718C106C0CE3F38EA01EA201CDAF46D16D31902EF5C7A5DAE0C7068E29A25787A6E94C060EB02490691F43C9895530EC59242F94FA5CB268D9273C370F8F4FA70CDF36220DC1617E286A286221106ED9F5C2A9&type=dashboard"
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