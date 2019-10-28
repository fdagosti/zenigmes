(function(){

  angular
    .module('zenigmesApp')
    .filter('formatEtablissement', formatEtablissement);
  
    
    var etablissements = {
                "jbsay": "Lycée Jean Baptiste Say",
                "lafontaine": "Ecole La Fontaine",
                "musset": "Ecole de Musset",
                "boileau": "Ecole Boileau",
            };

  function formatEtablissement() {
    return function (dbValue) {
      return etablissements[dbValue];
    };
  };
})();