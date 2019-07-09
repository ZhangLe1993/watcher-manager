Template.detailsBusinessVisits.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#empowermentTab').addClass('active');
    $('#sellerAnalysis').addClass('active');
    $('#detailsBusinessVisits').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401529FF395FEBD4CC90CD0B78C8B5041D407B539E63440B4D1290E148EC35D1D3B64670CE923BA025FD943325CDC12228EE43B8C25177532ED344D673F546810BE75088552A0A215863C752EBF0A26DD6CD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6BDEC63BA1B4B22C0FC4F8E4EBB6F6D8C7156E21FC7E2762496E86C49B2C2DC342DDE0A62D75DB89AEDC4E6A9A9B429202350C09D9E894B2976B15310498E941CC7537F9BC3CF085B823E63421609737A0CB2F5531F953A6270A8C2528F78E14D4&type=dashboard"
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