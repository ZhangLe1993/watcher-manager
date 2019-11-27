Template.recycleMarketFlowFunnel.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#flowAnalysisTab').addClass('active');
    $('#marketChannel').addClass('active');
    $('#recycleMarketFlowFunnel').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401390ADD89AE02C59A2CE0FAE541B008B88164B1BD863CAB21E8289CE4397948CEFB0FEED14759D1D15E898052EF701396E43B8C25177532ED344D673F546810BE7B7D864D40E9D9E7286C4B4BC0C38C53D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6BF0FB7A4BA72F90AAC0FB8B9D75F7294E5834E35DED18D016D5C444CF7839A46C31AFCC8565158E667F4BA4BE6EE278F7C38F50C8BAAB094D99AA64F955E23C125D6E54C75DD26F7E1969842086076B766F169056113E1E9B6F981BFB0E410FF3&type=dashboard"
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