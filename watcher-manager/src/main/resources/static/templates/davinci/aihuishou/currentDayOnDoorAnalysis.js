Template.currentDayOnDoorAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#deliverAnalysisTab').addClass('active');
    $('#onDoorAnalysis').addClass('active');
    $('#currentDayOnDoorAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401A909A0A87769CBC51C36E0BB77B42ECF8FBF8E9F0AB050657FBBAC525A4D7D93DAF0D5B1D7D4CEC8541D9BE6E5223845B2A61355A235625968FC7D51AA20A6E9622E534AEFCE75910C65E1A508DC743D43419A59BADDBEF1AF47E27705A851E069C312ADDC969BA733D9D511A12866A12060F80C7C1A6F5CB84E88CCA20BF7B452188B2BF69EC8B6F6424B6EDCC0A4F8247C84250A51C8E4E4BD84999D2F783D624CA6B9BB4016941C9B2BCB27BB759557784FF869BBFFC759DA487EF507E8B593EE46208253C0939AC3E5EDC9258A54&type=dashboard"
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