Template.pageFlowFunnelForNewMachine.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#flowAnalysisTab').addClass('active');
    $('#conversionAnalysis').addClass('active');
    $('#pageFlowFunnelForNewMachine').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340190FC69068A7746C260D6AE8BBC7AFA091818D48F0B109370E812036586047408611ED935FDBE1122952CC5E71DC82E26B2A61355A235625968FC7D51AA20A6E94E1257E1E6208631770405E6E8C57D2B43419A59BADDBEF1AF47E27705A851E0D1BAB8CA4CD0AE25E7A5DA0BB713CDCAD1073D21187DB9217F6DB887C14078FF1A3C5EA803FAC9498F63720C2C848BE81B4EB4F8FF36F2ACCA87E719973578E5374133844DB370CC3110B44159E60E10692FF5A89E5E86344B131D5ED132B1DE2DC9C6FA726FBDD494373C56E1927399&type=dashboard"
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