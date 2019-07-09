Template.padRejectDetail.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#rejectGoodsTab").addClass('active');
    $("#userFrontRejectGoodsTab").addClass('active');
    $('#padRejectDetail').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234011A798D68E06196F2DCD29D0E9022DC9F54C1CBF62F65BB6E211B1B0F7B5C571BDDAFC8BED4087B320231EFC43CD4C1F5B2A61355A235625968FC7D51AA20A6E9567B762E0447961D3150269D398AD97943419A59BADDBEF1AF47E27705A851E0A55574D0E07A14BAF96770D15C4778F44B029A1E750EF519191941334E08D6943C5CFBF14D610DE4F24DD8D5CA1F039B5BA01C33D1E93B084C95338111B7504DE6FDE2474AC5112B6CC42EB32E58AC64604C6A0E1DAC581E26A2F04134AE6AE1A6EFCA6D8794E704DF76AF65B901FA87&type=dashboard"
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