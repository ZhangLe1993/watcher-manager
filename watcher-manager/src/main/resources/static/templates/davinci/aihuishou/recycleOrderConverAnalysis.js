Template.recycleOrderConverAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#ahsOverviewTab').addClass('active');
    $('#recycleOrderConverAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401256F32DD0FAF8952088A445D6DE4D5F2FB37639427FED00C0136B9B0D699C16CFB0FEED14759D1D15E898052EF701396E43B8C25177532ED344D673F546810BE32DC6799ABFAA55CF70C5CFBE1591ECCD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B3020561A22E15927E4997813F8191075BD710280AC542D74B8AE76FCB52E8B306319F4D66D1DD57624E26068827721209EC511BD24542898950467B15CB76B8CF8ADA7B13F9959E61A06D73420446BAA50CD75E7243AA5BD51374BA066F0BFA4&type=dashboard"
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