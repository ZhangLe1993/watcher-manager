Template.visitRecordsPotentialCustomers.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#empowermentTab').addClass('active');
    $('#sellerAnalysis').addClass('active');
    $('#visitRecordsPotentialCustomers').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401DB3EF21100728BFB0415B6ED87A12C15A6F3B8AC7C56DB1EF69CC004909E723D6140802B6224A1B506F46DEEFEC2F861E43B8C25177532ED344D673F546810BE1B7A53BE7E986E0C75B8E9769733CD91D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6BCCD51CAA37FA59DD75EA24D492BF0A87EC625A45FD09B35496E6BCC346FB7398F10128609D057E2B6BAFCF5DD54F87614DA3F386D0E44632C14EF5EF239DC34B6065547CC8D6F7292C44CF1463C0D004A0FCEE20F4216F9F8789D1CEC7E5AFF8&type=dashboard"
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