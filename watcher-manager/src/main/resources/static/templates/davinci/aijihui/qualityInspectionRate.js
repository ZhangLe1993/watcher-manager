Template.qualityInspectionRate.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#qualityAnalysisTab').addClass('active');
    $('#qualityInspectionRate').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234013562BAB486790220BB42DDA00F78FA83A40A53BA769A8EA773DF596CD21B23B73C1A0EB6443A5A665E2B8EDBC890DE78E43B8C25177532ED344D673F546810BE2EB9D0834A7F53E1337589EF811BECB0D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B876677F75D573D7DF2041E3EC560289FB278373831492326E2443BDC0AAA570C750AE0A2038AADB847D0C0CFD61612FDC400C522FCDD2E6EBD806C8B542394F1275BC00EFD8ADB8A205C77C93636AF2B55F3F7696C0F76DABF9E62A5836B6EA6&type=dashboard"
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