Template.userEvaluationAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#CustomerServiceTab').addClass('active');
    $('#newCustomerServiceMSTRTab').addClass('active');
    $('#userEvaluationAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var url = "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340166CEB0D8C583781E9400C6FF5C5BAEBBEDCF63DECCDB142CD2F12A2DDDD25D314B4B45C11D596463A619170D2CD2AFE5B2A61355A235625968FC7D51AA20A6E9F943EDC6E516F00552DF49CFF42ED4EE43419A59BADDBEF1AF47E27705A851E0E5FD3D59F7A24FC13161A3164C44B7D781E79DCABFD7D68DE2373BC1F468EA68A2340BA70EC0A58DA03A2911D6B54D7799C24F1DE7DA0B2B02A4381015E519FE10421E71E2AF4EED3D8AA5F7E2C6F8F206609E69D3DC82A595DE4CE6DC45A4EEC82A0AB78B29577A3710173E2232FD7C&type=dashboard"
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