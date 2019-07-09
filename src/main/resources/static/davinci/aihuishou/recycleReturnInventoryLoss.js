Template.recycleReturnInventoryLoss.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#rejectGoodsStockTab').addClass('active');
    $('#recycleReturnInventoryLoss').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401C8E86D430BE0310AFEA2F10B6744AB519E9948F11302E601F697D1A2D38E40F46217A386851B741EAC68DBA02B3DEE7FB2A61355A235625968FC7D51AA20A6E90D54733A2FA329F0974B4C30E718987043419A59BADDBEF1AF47E27705A851E0B396D290FFF904D45454C7BD342C3E9C75150A46D46FEEF2328B8D9F41C79A26D8041B779124F21D156C5352F6A7F2B3DAECE91073C750D40102506027CC0562E92ECBAABA6E925BFC1E3B36917C6C224C904BEE0363E0F6D10B0FDC57A7614000994E606FC5B75DC05D0CED95D43A90&type=dashboard"
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