Template.buyerBasicInformation.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#empowermentTab').addClass('active');
    $('#buyerAnalysis').addClass('active');
    $('#buyerBasicInformation').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401B9569010CB8CA8C37B8184B3B4853CEBFD96FAAEC7F943D1619A1392FB5F5BAA773369667EE63DBCE8B4D8E2DCA8A953E43B8C25177532ED344D673F546810BE2D7A296D8BDDE94DC33EC4FF73FA4831D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B2F87DA6937CF181D652724BF6EFD9834195A41396B8630B18D5F8592EB05D48B40356279BDB01F0D8D7E08EC6F6B0F4C7D586A33CC7754F84F89E39C7B7F6AA08B3FAC70BB53CE3F5C1BA68343A58058D3623D4454E17AEA6E7D41BF7CD30B33&type=dashboard"
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