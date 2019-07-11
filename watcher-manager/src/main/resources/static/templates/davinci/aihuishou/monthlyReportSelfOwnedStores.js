Template.monthlyReportSelfOwnedStores.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#deliverAnalysisTab').addClass('active');
    $('#monthlyReportSelfOwnedStores').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234012D17B76F21342BD00168BE493FED9CCD5AFD97AC088B91CC521D330C9BA2DC28682A65E06370632B470ED6C2AD26587AE43B8C25177532ED344D673F546810BE81082C7D2648C82E87141B504EC91096D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B1292A013EDB272527A5845AF4B08504C5007FB149167167745DEF4CDA1E4953F0A2F1868C9FB999A0EF8521489D49E269FD1A883CB1FE08D89CFCAB1514E2D812C4B7EF0BEB39F488BFF752C9BE3662627757A6BC5FB4830E240A260E1367B26&type=dashboard"
        + "&_t=" + (new Date()).getTime();

    $("#frame_davinci").attr("src",url);

    $("#frame_davinci").load(function() {
        setTimeout(function() {
            var frame = document.getElementById("frame_davinci").contentWindow;
            var message = {parentOrigin:window.origin,msg:"收到请回复"};
            frame.postMessage(JSON.stringify(message), davinci);
            console.log('发送成功');
        },2000);
        window.addEventListener("message", receiveMessage, false);
    });
};

function receiveMessage(event) {
    console.log(event.origin);
    if (event.origin !== davinci){
        return;
    }
    console.log("子页面有消息回来了");
    console.log(event);
    $("#frame_davinci").attr("height",accAdd(accMul(event.data,1),300) + 'px');
    window.removeEventListener("message", receiveMessage, false);
}