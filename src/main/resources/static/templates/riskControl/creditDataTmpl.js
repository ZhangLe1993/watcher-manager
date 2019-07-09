Template.creditDataTmpl.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#RiskTab').addClass('active');
    $('#creditDataTmpl').addClass('active');

    renderPage()
};
function renderPage(){

    requestURL(dataService+"/riskcontrol/getCreditPassRate",{}).done(function(result){
        $("#passRate").html(result+"%")
    })
}

