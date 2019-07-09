Template.returnLossAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#rejectGoodsTab").addClass('active');
    $("#recyclerRejectGoodsTab").addClass('active');
    $('#returnLossAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234014406A27047955AA84F879D7952DAACFDE1C1DE1979A50563ABD306D29FA53BFB8CD6C5ADF4D589E2274987588553E3AAB2A61355A235625968FC7D51AA20A6E9BA7B43CF8F934D59B02F88CF56BF5F2043419A59BADDBEF1AF47E27705A851E0267C9AE5D521EE114AA85102C29FC4B63E13DB50A95C6867E91B674864B7C66941AE02D79A74BCDD05ADE5AE468E0CC46616A7A020A423081E21F1B0A23E8A21D03EECD8782E623265CE56D33E8CDA4A970698F07AAA89CD95E0E5B7DC84C23941B43C9175BF258538DA5E0221C599ED&type=dashboard"
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