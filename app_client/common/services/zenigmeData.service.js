(function(){

  angular
  .module('zenigmesApp')
  .service('zenigmeData', zenigmeData);

  zenigmeData.$inject = ["$http"];   
  function zenigmeData ($http) {

      var enigmeById = function(id){
        var data = allEnigmes();
        for (i=0; i<data.length;i++){
          if (data[i]._id === id){
            return data[i];
          }
        }
      };

      var addEnigme = function(enigme){
          enigme._id = totalData.length + 1;
          totalData.push(enigme);
      };



   var allEnigmes = function () {
         // return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=200');
         return totalData;
      };
      

   var totalData =  [
         {
          _id : 1,
          titre: "Enigme des trois allumettes",
          description: "Ceci est la description d'une enigme pour rigoler",
          illustration: "rsc/riddle.jpg",
          niveau: "3",
          points: "1",
          trivia: "Cette enigme prend sa source dans le grand livre des mathématiques, écrit par Jean de Bouvier en 1633. Elle a été utilisé trés souvent pour la validation des acquis des élèves"
        },
        {
          _id : 2,
          titre: "La roulette maléfique",
          description: "ed (saepe enim redeo ad Scipionem, cuius omnis sermo erat de amicitia) querebatur, quod omnibus in rebus homines diligentiores essent; capras et oves quot quisque haberet, dicere posse, amicos quot haberet, non posse dicere et in illis quidem parandis adhibere curam, in amicis eligendis neglegentis esse nec habere quasi signa quaedam et notas, quibus eos qui ad amicitias essent idonei, iudicarent. Sunt igitur firmi et stabiles et constantes eligendi; cuius generis est magna penuria. Et iudicare difficile est sane nisi expertum; experiendum autem est in ipsa amicitia. Ita praecurrit amicitia iudicium tollitque experiendi potestatem.",
          illustration: "rsc/riddle.jpg",
          niveau: "3",
          points: "1",
          trivia: "Cette enigme prend sa source dans le grand livre des mathématiques, écrit par Jean de Bouvier en 1633. Elle a été utilisé trés souvent pour la validation des acquis des élèves"
        },
        {
          _id : 3,
          titre: "La question d'Aristote",
          description: "ed (saepe enim redeo ad Scipionem, cuius omnis sermo erat de amicitia) querebatur, quod omnibus in rebus homines diligentiores essent; capras et oves quot quisque haberet, dicere posse, amicos quot haberet, non posse dicere et in illis quidem parandis adhibere curam, in amicis eligendis neglegentis esse nec habere quasi signa quaedam et notas, quibus eos qui ad amicitias essent idonei, iudicarent. Sunt igitur firmi et stabiles et constantes eligendi; cuius generis est magna penuria. Et iudicare difficile est sane nisi expertum; experiendum autem est in ipsa amicitia. Ita praecurrit amicitia iudicium tollitque experiendi potestatem.",
          illustration: "rsc/riddle.jpg",
          niveau: "1",
          points: "2",
          trivia: "Cette enigme prend sa source dans le grand livre des mathématiques, écrit par Jean de Bouvier en 1633. Elle a été utilisé trés souvent pour la validation des acquis des élèves"
        },
        {
          _id : 4,
          titre: "Le casse tête renversant",
          description: "ed (saepe enim redeo ad Scipionem, cuius omnis sermo erat de amicitia) querebatur, quod omnibus in rebus homines diligentiores essent; capras et oves quot quisque haberet, dicere posse, amicos quot haberet, non posse dicere et in illis quidem parandis adhibere curam, in amicis eligendis neglegentis esse nec habere quasi signa quaedam et notas, quibus eos qui ad amicitias essent idonei, iudicarent. Sunt igitur firmi et stabiles et constantes eligendi; cuius generis est magna penuria. Et iudicare difficile est sane nisi expertum; experiendum autem est in ipsa amicitia. Ita praecurrit amicitia iudicium tollitque experiendi potestatem.",
          illustration: "rsc/riddle.jpg",
          niveau: "3",
          points: "2",
          trivia: "Cette enigme prend sa source dans le grand livre des mathématiques, écrit par Jean de Bouvier en 1633. Elle a été utilisé trés souvent pour la validation des acquis des élèves"
        },
        {
          _id : 5,
          titre: "La danse de la pieuve",
          description: "ed (saepe enim redeo ad Scipionem, cuius omnis sermo erat de amicitia) querebatur, quod omnibus in rebus homines diligentiores essent; capras et oves quot quisque haberet, dicere posse, amicos quot haberet, non posse dicere et in illis quidem parandis adhibere curam, in amicis eligendis neglegentis esse nec habere quasi signa quaedam et notas, quibus eos qui ad amicitias essent idonei, iudicarent. Sunt igitur firmi et stabiles et constantes eligendi; cuius generis est magna penuria. Et iudicare difficile est sane nisi expertum; experiendum autem est in ipsa amicitia. Ita praecurrit amicitia iudicium tollitque experiendi potestatem.",
          illustration: "rsc/riddle.jpg",
          niveau: "2",
          points: "3",
          trivia: "Cette enigme prend sa source dans le grand livre des mathématiques, écrit par Jean de Bouvier en 1633. Elle a été utilisé trés souvent pour la validation des acquis des élèves"
        },
        {
          _id : 6,
          titre: "Tu pèses une tonne, Newton",
          description: "ed (saepe enim redeo ad Scipionem, cuius omnis sermo erat de amicitia) querebatur, quod omnibus in rebus homines diligentiores essent; capras et oves quot quisque haberet, dicere posse, amicos quot haberet, non posse dicere et in illis quidem parandis adhibere curam, in amicis eligendis neglegentis esse nec habere quasi signa quaedam et notas, quibus eos qui ad amicitias essent idonei, iudicarent. Sunt igitur firmi et stabiles et constantes eligendi; cuius generis est magna penuria. Et iudicare difficile est sane nisi expertum; experiendum autem est in ipsa amicitia. Ita praecurrit amicitia iudicium tollitque experiendi potestatem.",
          illustration: "rsc/riddle.jpg",
          niveau: "1",
          points: "1",
          trivia: "Cette enigme prend sa source dans le grand livre des mathématiques, écrit par Jean de Bouvier en 1633. Elle a été utilisé trés souvent pour la validation des acquis des élèves"
        },
        {
          _id : 7,
          titre: "Le Cury de Marie",
          description: "ed (saepe enim redeo ad Scipionem, cuius omnis sermo erat de amicitia) querebatur, quod omnibus in rebus homines diligentiores essent; capras et oves quot quisque haberet, dicere posse, amicos quot haberet, non posse dicere et in illis quidem parandis adhibere curam, in amicis eligendis neglegentis esse nec habere quasi signa quaedam et notas, quibus eos qui ad amicitias essent idonei, iudicarent. Sunt igitur firmi et stabiles et constantes eligendi; cuius generis est magna penuria. Et iudicare difficile est sane nisi expertum; experiendum autem est in ipsa amicitia. Ita praecurrit amicitia iudicium tollitque experiendi potestatem.",
          illustration: "rsc/riddle.jpg",
          niveau: "3",
          points: "3",
          trivia: "Cette enigme prend sa source dans le grand livre des mathématiques, écrit par Jean de Bouvier en 1633. Elle a été utilisé trés souvent pour la validation des acquis des élèves"
        },
        {
          _id : 8,
          titre: "Gauss repart à la hausse",
          description: "ed (saepe enim redeo ad Scipionem, cuius omnis sermo erat de amicitia) querebatur, quod omnibus in rebus homines diligentiores essent; capras et oves quot quisque haberet, dicere posse, amicos quot haberet, non posse dicere et in illis quidem parandis adhibere curam, in amicis eligendis neglegentis esse nec habere quasi signa quaedam et notas, quibus eos qui ad amicitias essent idonei, iudicarent. Sunt igitur firmi et stabiles et constantes eligendi; cuius generis est magna penuria. Et iudicare difficile est sane nisi expertum; experiendum autem est in ipsa amicitia. Ita praecurrit amicitia iudicium tollitque experiendi potestatem.",
          illustration: "rsc/riddle.jpg",
          niveau: "2",
          points: "1",
          trivia: "Cette enigme prend sa source dans le grand livre des mathématiques, écrit par Jean de Bouvier en 1633. Elle a été utilisé trés souvent pour la validation des acquis des élèves"
        },
        {
          _id : 9,
          titre: "Les inégalités entre poissons",
          description: "ed (saepe enim redeo ad Scipionem, cuius omnis sermo erat de amicitia) querebatur, quod omnibus in rebus homines diligentiores essent; capras et oves quot quisque haberet, dicere posse, amicos quot haberet, non posse dicere et in illis quidem parandis adhibere curam, in amicis eligendis neglegentis esse nec habere quasi signa quaedam et notas, quibus eos qui ad amicitias essent idonei, iudicarent. Sunt igitur firmi et stabiles et constantes eligendi; cuius generis est magna penuria. Et iudicare difficile est sane nisi expertum; experiendum autem est in ipsa amicitia. Ita praecurrit amicitia iudicium tollitque experiendi potestatem.",
          illustration: "rsc/riddle.jpg",
          niveau: "2",
          points: "2",
          trivia: "Cette enigme prend sa source dans le grand livre des mathématiques, écrit par Jean de Bouvier en 1633. Elle a été utilisé trés souvent pour la validation des acquis des élèves"
        },
        ];

      return {
       allEnigmes : allEnigmes,
       enigmeById: enigmeById,
       addEnigme: addEnigme,
     };
   };
 })();