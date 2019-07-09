
Template.myLogin.helpers({
    login: function() {
            if(Meteor.user() != null){return 0}else{
            Meteor.loginCas(function(error){
                if(error){
                    alert(error)
                }else{
            
                }
            })  
            return dateTradeStats.find({createdDt:today})
            }
        }
    });