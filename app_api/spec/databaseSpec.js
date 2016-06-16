describe("the user database", function() {
  var mongoose = require('mongoose');
  var dbURI = "mongodb://localhost/test";
  var db = mongoose.createConnection(dbURI); 

  var dateTestDb = db.model("toto", new mongoose.Schema({nom: String, niveau: Number, start: Date}));


  afterEach(function(done){
    db.close(function(){
      done();
    });
  });

it("should allow the creation and the retrieval of a user in the database", function(done) {

var user = {
    nom: "salut",
    niveau: 2,
    start: new Date(),

  };
  dateTestDb.create(user, function(err, user){
    expect(err).toBe(null);
    
      dateTestDb.find(user)
      .exec(
        function(err, bliblou){
          expect(err).toBe(null);
          
          expect(bliblou).not.toBe(null);
          expect(bliblou[0].nom).toBe("salut");
          done();
        }
        );
    
  });

});


});