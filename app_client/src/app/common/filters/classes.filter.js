(function(){

  angular
    .module('zenigmesApp')
    .filter('formatClasse', formatClasse);
  

    var classes = {
                "cm2": "CM2",
                "6eme": "6ème",
                "5eme": "5ème",
                "4eme": "4ème",
                "3eme": "3ème",
                "2nde": "Seconde",
                "1ere": "Première",
                "terminale": "Terminale",
                "externe": "Professeur/Externe",
            };

  function formatClasse() {
    return function (classe) {
      return classes[classe];
    };
  };
})();