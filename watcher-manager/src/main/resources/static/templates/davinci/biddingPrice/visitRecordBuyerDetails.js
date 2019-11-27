Template.visitRecordBuyerDetails.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#empowermentTab').addClass('active');
    $('#buyerAnalysis').addClass('active');
    $('#visitRecordBuyerDetails').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340177754D3AAA17AD32E1B1F73FD096CC333DD2C2FBDDC4AF6794A5D794B204AB517B9C9C1A15A48969FBAE99DFF4B40BCFE43B8C25177532ED344D673F546810BEADE354EC759687741EBCA7CA520768B1D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6BBC56EF92A3840B7342673F86978573DF8104808BDA957E54010782E50C32E6C6C6FDA4F2987B6259FBE615F8A5B92CB7D5357A51E42199A2AE291EF79A8A204451A7F705CADFA25745E88F675A0D4D29DFC89174D58890DBF43ADDA906A7B7D5&type=dashboard"
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