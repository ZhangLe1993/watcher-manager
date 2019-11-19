Template.qualityCheckErrorsArea.rendered = function () {
    $('.navi-tab').removeClass('active');
    // this.autorun(function () {
    //     var source = Template.currentData().source;
    //     switch(source){
    //         case 1:
    //             $('#district').addClass('active');
    //             $('#qualityCheckErrorsArea').addClass('active');
    //             break;
    //         case 2:
    //             $('#operationPlatformTab').addClass('active');
    //             $('#qualityCheckTab').addClass('active');
    //             $('#qualityCheckErrors').addClass('active');
    //             break;
    //     }
    // });

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340126D296525B1E90F2B8F4D09635D6EE6F42F17D9C7CB9500D0EF89517BE3637186217A386851B741EAC68DBA02B3DEE7FB2A61355A235625968FC7D51AA20A6E9F39BC866E3BEDE989015B590F1DCCC3A43419A59BADDBEF1AF47E27705A851E055D46F5A6F10BFC57FBF2BFBC8B02B06736731E40B9EF2F7DEE10779948CD7832F4C23AAA764ADFDFF2714267436D4B2B3172BF4480BAF54F6B255ADCC2D78DF3095202EC52EE1D8A782D7E7E325A43C0185D832E00E480B6B1B7639D4C717683723C57127D1FDD331FAC745C9DFA5CC&type=dashboard"
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