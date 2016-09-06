(function () {

  angular
    .module('zenigmesApp')
    .controller('contactCtrl', ["contact","$location", "$uibModal", inactiveCtrl]);

  function inactiveCtrl(contact, $location, $uibModal) {
    var vm = this;

    vm.pageHeader = {
      title: "Vous avez un problème?",
    };
    vm.main = {
       content: "Contactez l'administrateur. <br/> "
    };

    vm.sendMessage = function(){
      contact.askAdmins(vm.message)
      .then(function(data){
        var modalInstance = $uibModal.open({
            templateUrl: "app/contact/contactModal.template.html",
            controller: "genericModalCtrl as vm"
        });
        modalInstance.result.then(function(done){
              $location.path("/");
        });
      }, function(error){
        console.log(error);
          vm.error = error.data.message;
      });
    };
  }

})();