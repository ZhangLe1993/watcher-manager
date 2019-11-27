Template.BasicDataOfXiaoAiGoods.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#repeatCheckTab').addClass('active');
    $('#BasicDataOfXiaoAiGoods').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340177047AA5730981B2EED17D64D8BB8D1094D64A9C640D705F15F5ECC0C389235D2B58D49C545F1C0847817C7A6A6C8641B2A61355A235625968FC7D51AA20A6E960023B8BD81DC058C287ACA602E15FC343419A59BADDBEF1AF47E27705A851E0082330FCB5F8DCAF31ED3F082AB43E31BDEE7604113DEA5B2CDAF3C033289C98680711DC9D85B8311995E4AD875B44B09502532F71B46106F245BED383B174CAF3BBFC84619D187147A2FF6AF93D2FA74010A040D2F063C8490BC58792E4F2606DFA9DEDCF70983A918E5C487563A131&type=dashboard"
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