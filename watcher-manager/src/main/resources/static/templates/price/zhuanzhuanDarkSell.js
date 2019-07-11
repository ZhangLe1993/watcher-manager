Template.zhuanzhuanDarkSell.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#priceTab').addClass('active');
    $('#pythonTab').addClass('active');
    $('#zhuanzhuanDarkSell').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }


    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401772670673F55C36AFC12A536348776FE4097F27772CD9A758396D3AEC6CEDE5EBB96EA047A69D05E6A9014B461C07116B2A61355A235625968FC7D51AA20A6E92FD15A0AC2A92AC71B95CFB52352652D43419A59BADDBEF1AF47E27705A851E08ACD6516E64797C6DB0F389BFB2F8586D05B8D276AFF0EB6309988583BE132DBF8ACBC21A829EB48C180247516FF8208AEAED765635CC20F6C0260FE1744136E8E7DA46C2B167A1F350005604308C6254226077A652177019B55A32A51A9BB2E64DA27A34621533B18F5F00576E25313&type=dashboard"
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