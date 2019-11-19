Template.recyclingPerformanceAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#deliverAnalysisTab').addClass('active');
    $('#recyclingPerformanceAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401E4F7E03159F93492AEFCEBF0195E0905BF28D4C1CD14155C7B61D803C5A5D3713C1A0EB6443A5A665E2B8EDBC890DE78E43B8C25177532ED344D673F546810BEF76337CD578733A6F11320098C1DE701D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B6B5A16CC84E01800AB333E55638F805E4F4D76EB0E16DC1AEB7B1EAEB4DA21AFBACE36693BB699F793502F8EFFB95A8146D52A5A20E6400F8709BF57A10AD026392337061495646E357B672AF544FD6258B49D59E8C34873D47F56752933E791&type=dashboard"
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