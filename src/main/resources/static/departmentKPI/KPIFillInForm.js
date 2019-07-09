/**
 * Created by liufangliang on 2017/4/19.
 */
Template.KPIFillInForm.rendered = function () {

    $('.navi-tab').removeClass('active');
    $('#KPIDetail').addClass('active');
    $('#KPIFillInForm').addClass('active');


    renderFirstDate();

    renderOpt();

    $(".department").click(function () {
        trigger();
    })

    $(".update").click(function () {
        var dt = $('.duringDateLabel').text().replace(/ /g, "").split("~");
        var duringDate = dt[0];
        var query = {

            "duringDate": duringDate,
            "department": $(".department").val(),

            "revenue_target": $("#revenue_target").val(),
            "gross_target": $("#gross_target").val(),

            "revenue_weight": $("#revenue_weight").val(),
            "gross_weight": $("#gross_weight").val(),
            "charge_weight": $("#charge_weight").val(),
            "profit_weight": $("#profit_weight").val(),

            "charge_finish_rate": $("#charge_finish_rate").val(),
            "profit_finish_rate": $("#profit_finish_rate").val()
        }

        requestURL(dataService+"/departmentKPI/updateDepartmentParams",query).done(function(data){
            if(data=="success"){
                alert("修改成功！");
            }else{
                alert("修改失败，请重试！");
            }
        })
    })
}

function trigger(){
        var dt = $('.duringDateLabel').text().replace(/ /g, "").split("~");
        var duringDate = dt[0];
        var department = $(".department").val();
        var query = {
            "duringDate": duringDate,
            "department": department
        }
        requestURL(dataService + "/departmentKPI/getDetailParams", query).done(function (data) {
            renderValue(data);
        })
}

function renderValue(data) {
    $("#revenue_target").val(data.revenue_target);
    $("#gross_target").val(data.gross_target);

    $("#revenue_weight").val(data.revenue_weight);
    $("#gross_weight").val(data.gross_weight);
    $("#charge_weight").val(data.charge_weight);
    $("#profit_weight").val(data.profit_weight);

    $("#charge_finish_rate").val(data.charge_finish_rate);
    $("#profit_finish_rate").val(data.profit_finish_rate);
}


function renderFirstDate() {
    var minMonthDate = "2017-01-01";
    var startMonthDate = moment().subtract(0, 'month').startOf('month').format("YYYY-MM-DD");
    var endMonthDate = moment().subtract(0, 'month').endOf('month').format("YYYY-MM-DD");
    if(startMonthDate<minMonthDate){
        startMonthDate = minMonthDate;
    }

    $(".duringDateLabel").html(startMonthDate+"~"+endMonthDate);
    $('.datePicker').daterangepicker(monthDatePickerOptionsFunc(startMonthDate,endMonthDate,minMonthDate,true), pickDateRangeCallbackUp);

}

function pickDateRangeCallbackUp(start, end,label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = moment(end).endOf('month').format("YYYY-MM-DD")
    $('.duringDateLabel').html(sdt+"~"+edt);
    trigger();
}


function renderOpt() {
    renderOp(".department", ["主营","华强南","外采","大区","BD","MKT","爱机汇","口袋优品","海外事业部","运营中心","用户体验中心","IT", "前端产品", "后端产品","数据","人事","行政","财务","政府关系部","享换机","企业事业部","创新事业部"])
}

function renderOp(className, obj) {
    if (obj.length > 0) {
        obj.forEach(function (e) {
            $(className).append("<option value=" + e + ">" + e + "</option>")
        })
    }
}
