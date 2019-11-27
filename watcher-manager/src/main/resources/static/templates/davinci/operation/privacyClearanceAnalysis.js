Template.privacyClearanceAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#privacyClearTab").addClass('active');
    $('#privacyClearanceAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234013D6517771BA27CBED44EDED104E142EF9F39AD5E33ED9263324A34CFBA4EA03EA17B463BFBD197E4F702246C52B5E960B2A61355A235625968FC7D51AA20A6E960BCC6DC462A1A5630A0F40040F6494543419A59BADDBEF1AF47E27705A851E0A55574D0E07A14BAF96770D15C4778F49DA0F899E61062DEE311A57DFF4570999232E52125C781A2253E593314356199558EF7F63EABC7EC56FA17F72B9FA106B3EACD80B08A575517D7AFA3C2E14041963D39FEF695DCFC15DCC2A05DD34D3805F6209A560873000314E055645E2ECD&type=dashboard"
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