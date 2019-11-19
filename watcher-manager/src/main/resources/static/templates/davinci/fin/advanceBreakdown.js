Template.advanceBreakdown.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#FinanceTab').addClass('active');
    $("#auctionHallTab").addClass('active');
    $("#paidServiceTab").addClass('active');
    $('#advanceBreakdown').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340167A34308429DCB74B7DC052B24EC605140CA059404BF5F82626EC62860AEC87F074A7B838FF8D9AD0E2329046E549066E43B8C25177532ED344D673F546810BE49CBE504C6EFBD24B2340D71006C6C8AD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6BC18F733CD93D936C4E938E29A8A9F58944D4886975BA845350B31480DCF4D2CBCEC1D767D936651A6055006776E632AFE75911108FE63FBA5C81FC28A321183D76093B4BBA465D86D80DB44FA12FA2B52837AED4CF2D4CFE22FFEB3CE226E47B&type=dashboard"
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