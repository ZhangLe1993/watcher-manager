Template.BIETLJobs.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#BITab').addClass('active');
    $('#BIETLJobs').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    requestURL(window.origin + "/mongo/etljoblist", {}).done(function (data) {
        var dataset = data;
        // console.log(dataset);
        renderdatatable(dataset);
        $('#remove').click(function(){
            var id= $.map($('#ETLJobData').bootstrapTable('getSelections'),function(row){
                return row.id;
            });
            var name = $.map($('#ETLJobData').bootstrapTable('getSelections'),function(row){
                return row.name;
            });
            var sid = $.map($('#ETLJobData').bootstrapTable('getSelections'),function(row){
                return row.sid;
            });
            var order = $.map($('#ETLJobData').bootstrapTable('getSelections'),function(row){
                return row.order;
            });
            var query={
                id:id[0],
                sid:sid[0],
                order:order[0]
            }
            $('#ETLJobData').bootstrapTable('remove',{
                field:'name',
                values:name
            });
            Meteor.call("dataremove",query,function(error,result){
                if(error){
                    alert("Execution Failed!")
                }else{
                    alert("Record Removed Successfully")
                }
            });
        });
        $('#Submit').click(function(){
            var table=$('#ETLJobData');
            var data={};
            var query={};
            var uid=[];
            var id=[];
            var sid=[];
            var name=[];
            var order=[];
            $.map(table.bootstrapTable('getSelections'),function(row){
                uid=row._id;
                id = row.id;
                sid=row.sid;
                order=row.order;
                name=row.name;

            });
            if(uid===undefined){
                alert("Invalid selection,please refresh");
            }
            else if(uid.length==0){
                alert("No data selected");
            }else{
                query={_id:uid};
                data={id:id.toString(),sid:sid.toString(),order:order.toString(),name:name.toString()}
                console.log(query);
                Meteor.call('dataupdate',query,data,function(error,result){
                    if(error){
                        alert("Execution Failed");
                    }else{
                        alert("Record Updated");
                        renderdatatable(etljoblist.find());
                    }
                });
                // renderdatatable(etljoblist.find());
            }
        });
        $('#add').click(function(){
            var rowdata=[{id:$('#jobid').val().toString(),sid:$('#jobsid').val().toString(),order:$('#joborder').val().toString(),name:$('#jobname').val().toString()}]
            if(rowdata[0].id==""||rowdata[0].sid==""||rowdata[0].order==""||rowdata[0].name==""){
                alert("Invalid Data")
            }else{
                $('#ETLJobData').bootstrapTable('append',rowdata);
                var query={
                    id:rowdata[0].id,
                    sid:rowdata[0].sid,
                    order:rowdata[0].order,
                    name:rowdata[0].name
                };
                Meteor.call('datainsert',query,function(error,result){
                    if(error){
                        alert("Execution Failed");
                    }else{
                        renderdatatable(etljoblist.find());
                        alert("Record Added")
                        $('#jobid').val("");
                        $('#jobsid').val("");
                        $('#joborder').val("");
                        $('#jobname').val("");
                    }
                });
            }

        })
        $('#refresh').click(function(){
            var dataset2=etljoblist.find();
            renderdatatable(dataset2);
        })
    });


}
// var jobflowchart = echarts.init(document.getElementById('ETLJobVisualize'));
function renderflowchart(dataset) {
    //renderflowchart code goes here
}
function renderdatatable(dataset) {
    var parsedata = [];
    dataset.forEach(function (e) {
        parsedata.push(e);
    })
    $('#ETLJobData').bootstrapTable('destroy').bootstrapTable({
        data: parsedata,
        pagination: true,
        pageSize:'All',
        search: true,
        singleSelect:true
    })
    $('#ETLJobData').bootstrapTable('hideColumn','_id')
}
