Template.xiaoAiVisitRecordBuyerDetails.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#empowermentTab').addClass('active');
    $('#buyerAnalysis').addClass('active');
    $('#xiaoAiVisitRecordBuyerDetails').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401C45F09D1C88F2A02DBE6F2935665A2AE0958D85FDAB1B9E61FC66C7D53F8DF0B7BEF9E5B2B3CB408B3A1F0987EE3A05DE43B8C25177532ED344D673F546810BE634CD07929C52CAA23861FDCEC1395C6D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B87BF6352C8422DF612E42625C1C0062165640996CCC90971BDBB2C41F40999D701504FC960AF9540D4E60C7232ABCE38852E767B5C1200F2D82B5AE8CA5E60D709465614BF7EF0F41AD53224E99F8100AE64C2D28107C7A8A7361B8A1E1AD22F&type=dashboard"
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