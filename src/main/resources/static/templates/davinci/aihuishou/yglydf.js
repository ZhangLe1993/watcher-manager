Template.yglydf.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#deliverAnalysisTab').addClass('active');
    $('#qaTab').addClass('active');
    $('#yglydf').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234017D1A8A96D37A282C10D316174BC445007175F5F68585261D214A1140198EDD7067499F6C6ADED9FAF693F9FBE5A1A45EB2A61355A235625968FC7D51AA20A6E92086DC19EDEFFDC7931CE90797E2909843419A59BADDBEF1AF47E27705A851E0D0D5C6F967E6B24B84BCFC063DD89AE2269093F0BDE036AB70749C04DC9C23191ECFF844EC04871FD68CFD15D8A5F2A29643B8DC5D9C9BD4CA57F714404AB245968CA4EB6467C6E8CF640D25DC36BF6A23F36F9BA1AA5F42178573253DA0AC79499B4E447B6790D94C7F367274ACEB4A&type=dashboard"
        + "&_t=" + (new Date()).getTime();

    $("#frame_davinci").attr("src",url);

    $("#frame_davinci").load(function() {
        setTimeout(function() {
            var frame = document.getElementById("frame_davinci").contentWindow;
            var message = {parentOrigin:window.origin,msg:"收到请回复"};
            frame.postMessage(JSON.stringify(message), davinci);
            console.log('发送成功');
        },2000);
        window.addEventListener("message", receiveMessage, false);
    });
};

function receiveMessage(event) {
    console.log(event.origin);
    if (event.origin !== davinci){
        return;
    }
    console.log("子页面有消息回来了");
    console.log(event);
    $("#frame_davinci").attr("height",accAdd(accMul(event.data,1),300) + 'px');
    window.removeEventListener("message", receiveMessage, false);
}