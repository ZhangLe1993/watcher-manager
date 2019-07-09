Template.loveRecyclingOperateDayBD.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#ahsOverviewTab').addClass('active');
    $('#loveRecyclingOperateDayBD').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401ABE767CD3BC1BEA43968DA315D04324753EE9FDFD103C1671E41188764982E38682A65E06370632B470ED6C2AD26587AE43B8C25177532ED344D673F546810BEF8EF04141533C236E90A3D8FC409137CD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B3B73E642938ED317BA76E0302D675ABACB36C6AAB43A68A43479CCB40F3703388D6E134D5CF8DD950745FFA2B95DD68C4EC5383D563EB67D6DA47CAE23087CC05E8CD94BE24756BE6E464799A26ACB3A00B3577832D52E08A222A9607B990FBA&type=dashboard"
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