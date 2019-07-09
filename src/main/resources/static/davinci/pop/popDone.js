Template.popDone.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#CompetitonPriceTab').addClass('active');
    $('#popDone').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401B526034A596E8D6D1B7E33C84450FF9A1D04E178F62B7878E43DA30623B4DC345095FE1A204CDDB4F28DF17556AB36CFE43B8C25177532ED344D673F546810BE579559E8883916B69E968E700B579188D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B4C53FDFAB4E2E18141D048ADD01333B0A5457C188D1382C9CEDD6618E97DBC0689B4C91EEE7DA533169900BD4AA462B6340039E4C06C319ECFD9CB7A4A8F624F3234D483B98FBEA78976858A4322BEDD26925E80FD6FB299E6B1E7844E86916B&type=dashboard"
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