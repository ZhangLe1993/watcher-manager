Template.Tables.rendered = function(){
    usingdate = sessionStorage.getItem('date');
    platform = sessionStorage.getItem('platform');
    // var testset = [
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7301",uv:"7301"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7302",uv:"7302"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7303",uv:"7303"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7304",uv:"7304"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7305",uv:"7305"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7306",uv:"7306"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7307",uv:"7307"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7308",uv:"7308"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7309",uv:"7309"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7310",uv:"7310"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7311",uv:"7311"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7312",uv:"7312"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7313",uv:"7313"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7314",uv:"7314"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7315",uv:"7315"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7316",uv:"7316"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7317",uv:"7317"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7318",uv:"7318"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7319",uv:"7319"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7320",uv:"7320"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7321",uv:"7321"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7322",uv:"7322"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7323",uv:"7323"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7324",uv:"7324"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7325",uv:"7325"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7326",uv:"7326"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7327",uv:"7327"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7328",uv:"7328"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7329",uv:"7329"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7330",uv:"7330"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7331",uv:"7331"},
    //     {date:usingdate,mainurl:"aihuishou.com",url:"7332",uv:"7332"}
                
    // ];
    getdataset();
}
var platform = "";
var usingdate="";
function getdataset(){
    var query = {
        "date":usingdate
    };
    var datasource = dataService+"/product/getOthersAggregateMarketingWebTrafficData";
    requestURL(datasource,query).done(function(data){
        rendertable(data)
    })
}
function rendertable(dataset){
    var result=[];
    if(platform=="官网"){
        dataset.forEach(function(e){
            if(e.url =="http://www.aihuishou.com"){
                e.uv=numeral(e.uv).format();
                result.push(e);
            }
        })
    }
    else{
        dataset.forEach(function(e){
            if(e.url == "http://m.aihuishou.com" ){
                e.uv=numeral(e.uv).format();
                result.push(e)
            }
        })
    }
    $('#OtherPVStatics').bootstrapTable({
        // dom:'Bfrtip',
        data:result,
        pagination:true,
        search:true,
        pageList:[10,25,50,100,'All'],
        // buttons:['excelHtml5'],
        columns:[
            {field:'date',title:'日期'},
            {field:'url',title:'URL'},
            {field:'pagename',title:'PageName'},
            {field:'uv',title:'UVs'}
            
        ],
        // exportDataType:$(this).val()
    });

}