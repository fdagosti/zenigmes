(function () {

  angular
    .module('zenigmesApp')
    .controller('inactiveCtrl', inactiveCtrl);

  function inactiveCtrl() {
    var vm = this;

    vm.pageHeader = {
      title: "Votre compte n'est pas encore actif",
    };
    vm.main = {
       content: 'Votre compte doit être validé par le professeur. Cela devrait se faire dans les prochains jours.'
    };
  }

})();