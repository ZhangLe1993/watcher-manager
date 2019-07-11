/**
 * Created by liufangliang on 2017/3/13.
 */

Template.priceComparisonJDTest.rendered = function () {

    $('.navi-tab').removeClass('active');
    $('#JDDataserviceTab').addClass('active');
    $('#priceComparisonJD').addClass('active');

    $("#chartContent").hide()
    $("#loading").show()

    getData()

    getSelectOptions()
    $(".btn").click(function () {

        getData()
    })



    $("#update").click(function(){
        var arr = $("#comparisonDataShow").bootstrapTable("getAllSelections")

        if (arr.length > 0) {
            $("#chartContent").hide()
            $("#loading").show()

            requestURLPost(dataService + "/pricemonitor/updatePriceComparisonData",arr).done(function (data) {
                getSelectOptions()
                getData()

            })
        }
    })


    $("#delete").click(function () {
        var arr = $("#comparisonDataShow").bootstrapTable("getAllSelections")


        if (arr.length > 0) {
            $("#chartContent").hide()
            $("#loading").show()

            requestURLPost(dataService + "/pricemonitor/deletePriceComparisonData",arr).done(function (data) {
                getSelectOptions()
                getData()

            })
        }

    })


}
function rendOptions(data) {
    $(".sku_id,.category,.brand,.type,.sm_type,.buy_channel,.network_type,.store_capacity,.color,.guarantee,.comparison_channel,.parameter,.price_ahs,.price_other").attr("multiple", "multiple")


    renderSelectOption(".sku_id", data.sku_ids)
    renderSelectOption(".category", data.categorys)
    renderSelectOption(".brand", data.brands)
    renderSelectOption(".type", data.types)
    renderSelectOption(".sm_type", data.sm_types)
    renderSelectOption(".buy_channel", data.buy_channels)
    renderSelectOption(".network_type", data.network_types)
    renderSelectOption(".store_capacity", data.store_capacitys)
    renderSelectOption(".color", data.colors)
    renderSelectOption(".guarantee", data.guarantees)
    renderSelectOption(".comparison_channel", data.comparison_channels)
    renderSelectOption(".parameter", data.parameters)
    renderSelectOption(".price_ahs", data.price_ahss)
    renderSelectOption(".price_other", data.price_others)

    $(".sku_id,.category,.brand,.type,.sm_type,.buy_channel,.network_type,.store_capacity,.color,.guarantee,.comparison_channel,.parameter,.price_ahs,.price_other").multipleSelect({
        placeholder: "全部",
        selectAllText:"全部",
        width: 150,
        selectAll: true
    });
}


function renderSelectOption(className, obj) {
    $(className).empty()
    obj.forEach(function (e) {
        $(className).append("<option value='" + e + "'>" + e + "</option>")
    })

}


function getSelectOptions() {
    requestURL(dataService + "/pricemonitor/getPriceComparisonSelectOptions", {}).done(function (data) {
        rendOptions(data)
    })
}

function getFilterOption() {

    var filter = {
        "sku_id": $(".sku_id").val(),
        "category": $(".category").val(),
        "brand": $(".brand").val(),
        "types": $(".type").val(),
        "sm_type": $(".sm_type").val(),
        "buy_channel": $(".buy_channel").val(),
        "network_type": $(".network_type").val(),
        "store_capacity": $(".store_capacity").val(),
        "color": $(".color").val(),
        "guarantee": $(".guarantee").val(),
        "comparison_channel": $(".comparison_channel").val(),
        "parameter": $(".parameter").val(),
        "price_ahs": $(".price_ahs").val(),
        "price_other": $(".price_other").val()
    }
    //console.log(filter)
    return filter
}

function getData() {

    var filter = getFilterOption()
    requestURL(dataService + "/pricemonitor/getPriceComparisonData", filter).done(function (data) {
        renderTable(data)

        $("#chartContent").show()
        $("#loading").hide()
    })
}


function renderTable(data) {

    $("#comparisonDataShow").bootstrapTable("destroy").bootstrapTable({
        striped: true,
        pagination: true,
        sortable: true,
        sortOrder: "asc",
        sidePagination: "client",
        showColumns: true,
        pageSize: 20,
        //toolbar: "#toolbar",
        data: data,
        ////exportDataType: "all",
        ////cdataExport:"cdataExport",
        showExport:true,
        search: true,
        //showRefresh: true,
        //align: "center",
        columns: [
            {
                checkbox: true
            }, {
                field: "sku_id",
                title: "sku_id",
                sortable: true
            }, {
                field: "category",
                title: "品类",
                //editable: true,
                sortable: true
            }, {
                field: "brand",
                title: "品牌",
                //editable: true,
                sortable: true
            }, {
                field: "types",
                //editable: true,
                title: "型号",
                sortable: true
            }, {
                field: "sm_type",
                title: "小型号",
                //editable: true,
                sortable: true
            }, {
                field: "buy_channel",
                title: "购买渠道",
                //editable: true,
                sortable: true
            }, {
                field: "network_type",
                title: "网络制式",
                //editable: true,
                sortable: true
            }, {
                field: "store_capacity",
                title: "容量",
                //editable: true,
                sortable: true
            }, {
                field: "color",
                title: "颜色",
                //editable: true,
                sortable: true
            }, {
                field: "guarantee",
                title: "保修",
                //editable: true,
                sortable: true
            }, {
                field: "comparison_channel",
                title: "对比渠道",
                sortable: true


            }, {
                field: "price_ahs",
                title: "爱回收",
                sortable: true
            }, {
                field: "price_other",
                title: "竞品价",
                sortable: true
            }, {
                field: "parameter",
                title: "对比参数",
                //editable: true,
                sortable: true,
                visible:false
            }
        ]

    })


}