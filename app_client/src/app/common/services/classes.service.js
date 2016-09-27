(function(){

  angular
  .module('zenigmesApp')
  .service('classes', classes);

  classes.$inject = ["$http", "authentication"];   
  function classes ($http, authentication) {


    var allClasses = function () {
     return $http.get('/api/classes', {
        headers: {
          Authorization: "Bearer "+ authentication.getToken()
        }
      }).then(function(response){
        return _addMetadataAboutClassesChange(response.data);
      });

   };

var _addMetadataAboutClassesChange = function(classes){
  var result = [];
  var currentClasse, currentClasseNumber = "something stupid";
  var currentClasseNumberArray;
  var currentStudentArray;
  for (var i = 0; i < classes.length; i++) {
    var student = classes[i];
    if (currentClasse != student.classe){
      currentClasseNumberArray = [];
      currentClasse = student.classe;
      result.push({className: student.classe, classeNumbers: currentClasseNumberArray});
    }
    if (currentClasseNumber != student.classeNumber){
      currentStudentArray = [];
      currentClasseNumber = student.classeNumber;
      currentClasseNumberArray.push({number: student.classeNumber ? student.classeNumber:"__", students: currentStudentArray});
    }
    currentStudentArray.push(student);
  }
  return result;
};

   
   return {
     allClasses : allClasses,
   };
 }
})();