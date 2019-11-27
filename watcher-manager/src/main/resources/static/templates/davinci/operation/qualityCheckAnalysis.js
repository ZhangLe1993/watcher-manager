Template.qualityCheckAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#qualityCheckTab').addClass('active');
    $('#qualityCheckAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234012EAADBAAA46486EBD93BD7BA549082B50663443896C377E306AF886F63B98921E968E7891EAC234F06CF4E25A3D25D84B2A61355A235625968FC7D51AA20A6E99B67CD18C0FBB2B283EBC37B0F0ED05543419A59BADDBEF1AF47E27705A851E014763586116AD26A10F40F9B00FDAF425402D4304D52668B9F8BEBC9C1F9CE34EBDF2112E16F9FAFA3C03C446D8C404D8944905F603591F0B0F5A5A5CFB3CD714F8F284465DE3AD7E3416297E50AF216A4A2C58B1F73348AAB8DB61906CDF69D0C34D799DAE67EDF832E18376D662D4C&type=dashboard"
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