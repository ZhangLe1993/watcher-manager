Template.AccessControl.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#BITab').addClass('active');
    $('#BIAccessControl').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var dataset = userPermissionOperationMapping.find();
    // console.log(dataset);
    renderdatatable(dataset);
    $('#remove').click(function () {
        var accessName = $.map($('#AccessControl').bootstrapTable('getSelections'), function (row) {
            return row.accessName;
        });
        var operation = $.map($('#AccessControl').bootstrapTable('getSelections'), function (row) {
            return row.operation;
        });
        var uid = $.map($('#AccessControl').bootstrapTable('getSelections'), function (row) {
            return row._id
        });
        var query = {
            _id: uid[0],
            operation: operation[0],
            accessName: accessName[0]
        }
        $('#AccessControl').bootstrapTable('remove', {
            field: '_id',
            values: uid
        });
        Meteor.call("Accessremove", query, function (error, result) {
            if (error) {
                alert("Execution Failed!")
            } else {
                alert("Record Removed Successfully")
            }
        });
    });
    $('#Submit').click(function () {
        var table = $('#AccessControl');
        var data = {};
        var query = {};
        var uid;
        var operation = [];
        var accessName = [];
        $.map(table.bootstrapTable('getSelections'), function (row) {
            uid = new Meteor.Collection.ObjectID(row._id._str);
            operation = row.operation;
            accessName = row.accessName;
        });
        if (uid === undefined) {
            alert("Invalid selection,please refresh");
        }
        else if (uid._str.length == 0) {
            alert("No data selected");
        } else {
            query = { _id: uid };
            data = { operation: operation.toString(), accessName: accessName.toString() }
            console.log(query);
            Meteor.call('Accessupdate', query, data, function (error, result) {
                if (error) {
                    alert("Execution Failed");
                } else {
                    alert("Record Updated");
                    renderdatatable(userPermissionOperationMapping.find());
                }
            });
            // renderdatatable(etljoblist.find());
        }
    });
    $('#add').click(function () {
        var rowdata = [{ operation: $('#operation1').val().toString(), accessName: $('#accessname').val().toString() }]
        if (rowdata[0].operation == "" || rowdata[0].accessName == "") {
            alert("Invalid Data")
        } else {
            $('#AccessControl').bootstrapTable('append', rowdata);
            var query = {
                operation: rowdata[0].operation,
                accessName: rowdata[0].accessName,
            };
            Meteor.call('Accessinsert', query, function (error, result) {
                if (error) {
                    alert("Execution Failed");
                } else {
                    alert("Record Added")
                    $('#operation1').val("");
                    $('#accessname').val("");
                }
            });
        }

    })
    $('#refresh').click(function () {
        var dataset2 = userPermissionOperationMapping.find();
        renderdatatable(dataset2);
    })

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
    $('#AccessControl').bootstrapTable('destroy').bootstrapTable({
        data: parsedata,
        pagination: true,
        pageSize: 'All',
        search: true,
        singleSelect: true
    })
    $('#AccessControl').bootstrapTable('hideColumn', '_id')
}
