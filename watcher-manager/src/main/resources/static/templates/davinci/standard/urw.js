Template.urw.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#rejectGoodsTab").addClass('active');
    $("#userFrontRejectGoodsTab").addClass('active');
    $('#urw').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340133E6E096F6A4A5C85630FF6F388386B6EE14567131EF323DD7339AFB12740B11B739C3E041F6C5492CC7B3BAEA158494B2A61355A235625968FC7D51AA20A6E9589D78E8DF51CD71CB968AB8FCE8B01743419A59BADDBEF1AF47E27705A851E069051D1F5208EA664396F6AA86458B9092250124DEA338727BBE9129BB7CE302E72221DCF4111C9738D7D8A2D24E954D7CC93B8C8DE4EA7E1C6089447D164213A9D4C4A4C3AC858DE95B4F03AEDF7D84313E7EAF2AEB7B1790171BDF922090FE68EFEE721DBB774A9C0561F9207F2FC3&type=dashboard"
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