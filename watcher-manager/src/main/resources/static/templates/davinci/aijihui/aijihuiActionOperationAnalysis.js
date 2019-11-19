Template.aijihuiActionOperationAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aijihuiTab').addClass('active');
    $('#aijihuiActionOperationTab').addClass('active');
    $('#aijihuiActionOperationAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234010A112AF37D60CC354A8314A5384C7CCBF5A2818B79727D2F3FEABAA0E587DD1512C890B31D9A9257D3AF736FD0DB6411B2A61355A235625968FC7D51AA20A6E96CC861712F66FE62AADE00C0854DB78D43419A59BADDBEF1AF47E27705A851E09793C66B09104ADAF8B181A92D2B60B9AC6E9C343E82F729C91837B61A2E925543D26C710541B32B3C494EDB8B4A3A77FB48719DE238E3A29BA271FE75D419D1EA2E04CA5EA6B7A4C575183548EC1DB6B591E70E769809B58B9984D8F47814B5260576FF0EF1832A88234BD4546C0D76&type=dashboard"
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