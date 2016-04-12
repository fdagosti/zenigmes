(function(){

  angular
    .module('zenigmesApp')
    .filter('formatMembership', formatMembership);
  function formatMembership() {
    return function (membership) {
      if (membership === "admin")
        return "Administrateur";
      else
        return "Membre";
    };
  }
})();