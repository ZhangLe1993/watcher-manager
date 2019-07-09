Template.CRMTaskDashboard.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#CustomerServiceTab').addClass('active');
    $('#CustomerDashboardTab').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }
};