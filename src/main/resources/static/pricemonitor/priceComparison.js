/**
 * Created by liufangliang on 2017/3/13.
 */

Template.priceComparison.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#pricemonitor').addClass('active');
    $('#priceComparison').addClass('active');
    $("#chartContent").hide()
    $("#loading").show()
    $("#error").hide()

    if(isMobile()){
        $('.sidebar-toggle').click();
    }
    try{
        var type = this.data.type;
    }catch(e) {
        var type = "other";
    }

    if(type==undefined){
        type = "other";
    }
    //BD 保持和利润中心一样
    if(type=="BD"){
        type="PRICE"
    }

    getData(type)
    getSelectOptions()
    $(".btn").click(function () {
        getData(type)
    })



}
function rendOptions(data) {
    $(".category,.brand,.product,.sku,.level").attr("multiple", "multiple")
    renderSelectOption(".category", _.map(data,function(obj){return obj.category}).unique())
    renderSelectOption(".brand", [])
    renderSelectOption(".product", [])
    renderSelectOption(".sku", [])
    renderSelectOption(".level", [])
    $(".category").change(function(){
        var category= $(this).val()
        var brand_name = []
        if(category){
            brand_name=_.map(_.filter(data,function(obj){
                return category.contains(obj.category)
            }),function(obj){
                return obj.product_brand_name
            }).unique()
        }
        renderSelectOption(".brand", brand_name);
        $(".brand").select2({
            placeholder: "全部",
            selectAllText:"全部",
            width: 200,
            selectAll: true
        })
        $(".product,.sku,.level").empty()

    })
    $(".brand").change(function(){
        var category= $(".category").val()
        var brand= $(this).val()
        var product_name = []
        if(brand){
            product_name=_.map(_.filter(data,function(obj){
                return brand.contains(obj.product_brand_name)&&category.contains(obj.category)
            }),function(obj){
                return obj.product_name
            }).unique()
        }
        renderSelectOption(".product", product_name);
        $(".product").select2({
            placeholder: "全部",
            selectAllText:"全部",
            width: 200,
            selectAll: true
        })
        $(".sku,.level").empty()

    })
    $(".product").change(function(){
        var category= $(".category").val()
        var brand= $(".brand").val()
        var product= $(this).val()
        var sku_name = []
        if(product){

            sku_name=_.map(_.filter(data,function(obj){
                return product.contains(obj.product_name)&&brand.contains(obj.product_brand_name)&&category.contains(obj.category)
            }),function(obj){
                return obj.product_sku_name
            }).unique()
        }
        renderSelectOption(".sku", sku_name)
        $(".level").empty()
        $(".sku,.level").select2({
            placeholder: "全部",
            selectAllText:"全部",
            width: 200,
            selectAll: true
        })
    })
    $(".sku").change(function(){
        var category= $(".category").val()
        var brand= $(".brand").val()
        var product= $(".product").val()
        var sku= $(this).val()
        var level_name = []
        if(sku){

            level_name=_.map(_.filter(data,function(obj){
                return sku.contains(obj.product_sku_name)&&product.contains(obj.product_name)&&brand.contains(obj.product_brand_name)&&category.contains(obj.category)
            }),function(obj){
                return obj.product_level_name
            }).unique()
        }
        renderSelectOption(".level", level_name)
        $(".level").select2({
            placeholder: "全部",
            selectAllText:"全部",
            width: 200,
            selectAll: true
        })
    })


    $(".category,.brand,.product,.sku,.level").select2({
        placeholder: "全部",
        selectAllText:"全部",
        width: 200,
        selectAll: true
    })
}


function renderSelectOption(className, obj) {
    $(className).empty()
    obj.forEach(function (e) {
        $(className).append("<option value='" + e + "'>" + e + "</option>")
    })

}


function getSelectOptions(type) {
    requestURL(dataService + "/pricemonitor/getPriceComparisonSelectOptions", {}).done(function (data) {
        //
        if(data=="error"){
            $("#loading").hide()
            $("#error").show().text("您导的报表格式不正确，请检查！")
        }else{
            rendOptions(data)
        }

    })
}

function getFilterOption() {

    var filter = {
        "category": $(".category").val(),
        "brand": $(".brand").val(),
        "product": $(".product").val(),
        "sku": $(".sku").val(),
        "level": $(".level").val(),

    }
    return cleanParams(filter)
}

function getData(type) {

    var filter = getFilterOption()
    filter.type=type
    $(".search").attr("disabled",true)
    requestURL(dataService + "/pricemonitor/getPriceCompetitionData", filter).done(function (data) {
        $(".search").attr("disabled",false)
        $("#chartContent").show()
        $("#loading").hide()
        //
        renderTable(type,data)
    })
}


function renderTable(type,data) {
    var columns=[
        {
            field: "product_category_name",
            title: "品类",
            sortable: true
        }, {
            field: "product_brand_name",
            title: "品牌",
            //editable: true,
            sortable: true
        }, {
            field: "product_name",
            title: "型号",
            sortable: true
        }, {
            field: "product_sku_key",
            title: "product_sku_key",
            //editable: true,
            sortable: true
        }, {
            field: "product_sku_name",
            title: "sku",
            //editable: true,
            sortable: true
        }, {
            field: "product_level_name",
            title: "等级",
            //editable: true,
            sortable: true
        }, {
            field: "ahs",
            title: "爱回收最低价",
            //editable: true,
            sortable: true
        }, {
            field: "",
            title: "爱回收最高价",
            //editable: true,
            formatter:function(value,row,index){
                return parseInt(row.ahs)+parseInt(row.preferential_price)
            }
        }, {
            field: "hsb",
            title: "回收宝",
            //editable: true,
            sortable: true
        }
    ]
    if(type=="BD"){
        columns.push( {
            field: "suning",
            title: "苏宁",
            //editable: true,
            sortable: true
        });
        columns.push( {
            field: "ydm",
            title: "有得卖",
            //editable: true,
            sortable: true
        })
        columns.push( {
            field: "igooma",
            title: "估吗",
            //editable: true,
            sortable: true
        })
    }else if(type=="PRICE"){
        columns.push( {
            field: "ydm",
            title: "有得卖",
            //editable: true,
            sortable: true
        })
    }
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
        exportDataType: "all",
        ////cdataExport:"cdataExport",
        showExport:true,
        search: true,
        //showRefresh: true,
        //align: "center",
        columns: columns
    })


}