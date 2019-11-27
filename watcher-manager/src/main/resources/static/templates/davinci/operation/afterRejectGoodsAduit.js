Template.afterRejectGoodsAduit.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#rejectGoodsTab").addClass('active');
    $("#recyclerRejectGoodsTab").addClass('active');
    $('#afterRejectGoodsAduit').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401ECA4807A5023614F6AFE453AE507F4AED00E9F8B6C0B2E59195173157F3C8056CB59D6C52FB0F7EE6919BB9649B7EAE5B2A61355A235625968FC7D51AA20A6E927BC9DACA2120AB097A660918E27D98F43419A59BADDBEF1AF47E27705A851E0727D8BD0328FD940DD6EB2BEB77F13BE4310C095709FE4E8B65D29F9D4B1234F7E6C081EF2748D65C679681452E0C8FDF43F13C1B1DA032F57002A3EE163A19A3A7D8BDCA253F73EA71F9AD901CF0CCCFE82607055D527C0A8CAF7A9F7736282165991B3DCED34F68B63508939D4DF49&type=dashboard"
        + "&_t=" + (new Date()).getTime();

    $("#frame_davinci").attr("src",url);

    $("#frame_davinci").load(function() {
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