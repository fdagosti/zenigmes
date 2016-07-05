var rest = require("restler");
var app = require("../../app");
var dbUtils = require("./dbUtils");
var base = dbUtils.base;



describe("The defi update API", function(){
  
   beforeEach(function(done){
   server = app.listen(9876, function(){
      dbUtils.setupAndLoginAsAdmin(function(token, err){
        if (err){done.fail(err);}
        else{loginToken = token;done();}
      });
    });
  });
  // tests here
  afterEach(function(done){
    server.close(function(){
      dbUtils.clearDatabase(done);
    });
  });

  var expectToHaveAnswers = function(defi){
    var enigmeWithAnswer = defi.enigmes.find(function(enigme){
      if (enigme.enigme._id){return enigme.enigme._id === "570536454e07f8817caa067e";}
      return enigme.enigme === "570536454e07f8817caa067e";
    });
    expect(enigmeWithAnswer.answers.length).toBeGreaterThan(0);
  };

  it("should keep the existing answers when modifying a defi", function(done){
    rest.get(base+"/api/sessions/570e7986a3c7b8b5330b287a",{accessToken: loginToken})
    .on("success", function(defi, response){
      expectToHaveAnswers(defi);
      defi.enigmes.forEach(function(enigme){
        enigme.answers = [];
      });
      rest.putJson(base+"/api/sessions/570e7986a3c7b8b5330b287a", defi, {accessToken: loginToken})
      .on("success", function(modifiedDefi, response){
        expectToHaveAnswers(modifiedDefi);
        done();
      }).on("fail", function(err, response){console.log(err);done.fail(err);});
    }).on("fail", function(err, response){done.fail(err);});
    
  });
});