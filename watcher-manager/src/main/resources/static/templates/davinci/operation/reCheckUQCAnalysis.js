Template.reCheckUQCAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#repeatCheckTab').addClass('active');
    $('#reCheckUQCAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401C9F6E395133602DC4FEAC55F279D44980AAB4D74D8D311C85351D2C06B0437210D7BAD6F5AA490947F4F1BAADCF26EF5B2A61355A235625968FC7D51AA20A6E99DFFBDE232482A0EE2553E3958EF0B5343419A59BADDBEF1AF47E27705A851E069051D1F5208EA664396F6AA86458B90521912E1AB5BB40D219BEEDF61985DB981B14BDDBAB1319E04316DAD53501D477310B547811E485D0F9B902B2FF35F43AD63B8AC033EBCA208844C5EEE3364A88A9922C94DE3913206A26B8419162A63AAD1CD6AC22380C47B5FAECC31CECBF4&type=dashboard"
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