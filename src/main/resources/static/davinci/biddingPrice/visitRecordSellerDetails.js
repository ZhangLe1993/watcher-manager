Template.visitRecordSellerDetails.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#empowermentTab').addClass('active');
    $('#sellerAnalysis').addClass('active');
    $('#visitRecordSellerDetails').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401C93E1976F2EE8FF7470558097687679FB9DFCDA2C8AF7731020D754A3AB89FEA418CC52D5D84386828CE1A7BEA6B9EADE43B8C25177532ED344D673F546810BE2B82862E4E8F3D25F614D816A37026ECD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6BA71059403E6B608C464CF3AF8B416F9711C6524DF60EF819EA6E814882413DD13C6E125E5421CD4751871A2845092EF8C1E45C531066C02182D99304D1FA3C4EFEED52F03FECE7D78EB9F4E3A2FDC496F81EE22A9D2FB20D36EC0C268A729034&type=dashboard"
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