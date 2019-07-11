Template.returnAuditsMonitor.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#rejectGoodsTab").addClass('active');
    $("#recyclerRejectGoodsTab").addClass('active');
    $('#returnAuditsMonitor').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401FB872C4074CE438716A553C4105CCB025AFB6A9BF9789D3E108CC374344AC37B6217A386851B741EAC68DBA02B3DEE7FB2A61355A235625968FC7D51AA20A6E97D187E5AF39034AECBFCA666858F6CBE43419A59BADDBEF1AF47E27705A851E0BEE343D7FFF473C29D694719EF65929782E90224277BFC1A2C7404730D29AB1C6B380C54FF9BB783AECDFB2C9CE19AEFF26867AFE119CBD9233CA981963B88BB4D01954DF0C257886B16F9170D96A2C759F70281183887BEED0741A2927CFFB7671D5807C9060AAD50CAE8E5DA9218B3&type=dashboard"
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