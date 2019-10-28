(function() {
    angular
    .module("zenigmesApp")
    .service("etablissement", authentication);

    var etablissement = {
        names: [
            {
                dbValue: "jbsay"
            },
            {
                dbValue: "lafontaine"
            },
            {
                dbValue: "musset"
            },
            {
                dbValue: "boileau"
            },
        ],
        classes: [
            {
                dbValue: "cm2",
            },
            {
                dbValue: "6eme",
                classNumbers: [1,2,3,4,5,6]
            },
            {
                dbValue: "5eme",
                classNumbers: [1,2,3,4,5,6]
            },
            {
                dbValue: "4eme",
                classNumbers: [1,2,3,4,5,6]
            },
            {
                dbValue: "3eme",
                classNumbers: [1,2,3,4,5,6]
            },
            {
                dbValue: "2nde",
                classNumbers: [1,2,3,4,5,6,7,8]
            },
            {
                dbValue: "1ere",
                classNumbers: [1,2,3,4,5,7,8]
            },
            {
                dbValue: "terminale",
                classNumbers: [1,2,3,4,5,6,7,8]
            },
            {
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