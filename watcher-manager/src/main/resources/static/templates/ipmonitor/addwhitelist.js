Template.addwhitelist.events({
    'click #addWhite': function () {
        Meteor.call("updateIdIPWhiteList",Meteor.user().profile.name,this.obid,this.ip,function(error,result){
            if(result){
                //alert("OPERATION_SUCCESS")
            }else{
                alert("OPERATION_FAILED")
            }
        })
    },
    'click #addIP': function () {
        Meteor.call("updateIPWhiteList",Meteor.user().profile.name,this.ip,function(error,result){
            if(result){
                //alert("OPERATION_SUCCESS")
            }else{
                alert("OPERATION_FAILED")
            }
        })
    },
    'click #addPerson': function () {
        Meteor.call("updateIdWhiteList",Meteor.user().profile.name,this.obid,function(error,result){
            if(result){
                //alert("OPERATION_SUCCESS")
            }else{
                alert("OPERATION_FAILED")
            }
        })
    }
});