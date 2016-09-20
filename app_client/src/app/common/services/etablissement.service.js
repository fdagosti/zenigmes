(function() {
    angular
    .module("zenigmesApp")
    .service("etablissement", authentication);

    var etablissement = {
        name: "Lycée Jean Baptiste Say",
        classes: [
            {
                displayName: "6ème",
                dbValue: "6eme",
                classNumbers: [1,2,3,4,5,6]
            },
            {
                displayName: "5ème",
                dbValue: "5eme",
                classNumbers: [1,2,3,4,5,6]
            },
            {
                displayName: "4ème",
                dbValue: "4eme",
                classNumbers: [1,2,3,4,5,6]
            },
            {
                displayName: "3ème",
                dbValue: "3eme",
                classNumbers: [1,2,3,4,5,6]
            },
            {
                displayName: "2nde",
                dbValue: "2nde",
                classNumbers: [1,2,3,4,5,6,7,8]
            },
            {
                displayName: "1ère",
                dbValue: "1ere",
                classNumbers: [1,2,3,4,5,7,8]
            },
            {
                displayName: "Terminale",
                dbValue: "terminale",
                classNumbers: [1,2,3,4,5,6,7,8]
            },
            {
                displayName: "Externe",
                dbValue: "externe"
            },
        ]
    };

    authentication.$inject = [];
    function authentication() {
        var getEtablissement = function() {
            return etablissement;
        };

       
        return {
       
            getEtablissement: getEtablissement,
        };
    }
})();