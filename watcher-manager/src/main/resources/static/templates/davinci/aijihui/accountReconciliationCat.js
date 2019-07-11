Template.accountReconciliationCat.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aijihuiTab').addClass('active');
    $('#financesTab').addClass('active');
    $('#accountReconciliationCat').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401D8653EA3F14374BF39C9ACB6DF3613C7D06F10E2AF839567A6B00AF07F276E2ACB59D6C52FB0F7EE6919BB9649B7EAE5B2A61355A235625968FC7D51AA20A6E9116F4142EB8EC7661A0E685135E7DC3943419A59BADDBEF1AF47E27705A851E0B396D290FFF904D45454C7BD342C3E9CF64E9DF47D2FDD34EB0BA1A7761128AADA2C4B96FE748D2EC8E94F2150BB6526D7E0DD68B80E5A99B04637C4BF54A7719721CA4DC73CB217DD70340E236C2E5D13EE0FD107E52C57303A36C5F683C4BBE914448335EB3E56770D1E802E62A40D&type=dashboard"
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