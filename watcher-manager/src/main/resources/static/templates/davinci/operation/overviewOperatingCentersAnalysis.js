Template.overviewOperatingCentersAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#overviewOperatingCentersTab').addClass('active');
    $('#overviewOperatingCentersAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401F1952A26F3EFC9750AC974B1E5F5ECC68A77883D97CFF56BB565FC9A89E7BBA26217A386851B741EAC68DBA02B3DEE7FB2A61355A235625968FC7D51AA20A6E9E61D43993D4FBE10154E92CC56CBB43443419A59BADDBEF1AF47E27705A851E0277E77C73788310E179A9014315A9EE0528D84B6D6DB6DFA1DE23C46FBC8562187DFEC708D70DCEF489C155F4476932B3D82820912C2CA1B3CCE2C175B2048FC1BAF55F6FA539E0657B665C13C59D561E431AADCD6F1738146557C9CB6AB2AD3E61F32464E78388946D568ED31E37E1B&type=dashboard"
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