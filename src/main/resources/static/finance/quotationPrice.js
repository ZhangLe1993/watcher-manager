Template.quotationPrice.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#quotationPriceTab').addClass('active');
    $("#quotationPrice").addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    renderPage();
};

function renderPage(){
    getQuotationPriceData();
}

function getQuotationPriceData(){

     requestURL(dataService+"/financeQuotation/getQuotationPrice",{}).done(function(data){
          $('#quotationPrice11').html( "￥ " + data.priceBeforeEleven.toLocaleString())
          $('#quotationPrice16').html( "￥ " + data.priceBeforeSixteen.toLocaleString())
        })
}