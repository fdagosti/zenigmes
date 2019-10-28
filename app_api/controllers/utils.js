var classeFromDefiNiveau = function(session){
    var niveau = session.niveau;
    if (niveau === 1){
      return ["6eme", "5eme"];
    }else if (niveau === 2){
      return ["4eme", "3eme"];
    }else if (niveau === 3){
      return ["2nde", "1ere", "terminale"];
    }else {
      return "exterieur";
    }
  };


  var defiNiveauFromClasse = function(user){
    var classe = user.classe;
    if (classe == "6eme" || classe == "5eme"){
        return 1;
    } else if (classe == "4eme" || classe == "3eme"){
        return 2;
    } else if (classe == "2nde" || classe == "1ere" || classe == "terminale"){
        return 3;
    } 
    return 0;
};

module.exports = {
    classeFromDefiNiveau, 
    defiNiveauFromClasse
};
