var rest = require("restler");
var app = require("../../app");
var base = "http://localhost:9876";
var dbUtils = require("./dbUtils");

var francoisCredentials = {
  email: "francois.dagostini@gmail.com",
  password: "toto",
  id: "57091325117230600f0d1fae"
};

var parentCredentials = {
  email: "parent@parent.com",
  password: "toto"
}

describe("The Answer API", function(){
  
  var loginToken;
  function _login(done, credentials){
    if (!credentials) credentials=francoisCredentials
    rest.post(base+"/api/login", {data: credentials})
    .on("success", function(data, response){
      loginToken = data.token;
      done();
    }).on("fail", function(data, response){
      done.fail("unable to login: "+data.message);
    });
  }

  beforeEach(function(done){
   server = app.listen(9876, function(){
      dbUtils.clearDatabase(function(){
        dbUtils.addFixture(function(){
          _login(done);
        });
      });
    });
  });

  afterEach(function(done){
    server.close(function(){
      dbUtils.clearDatabase(done);
    });
  });


  var answerValue = 32;
  var sessionId = "570e7986a3c7b8b5330b287a";
  var enigmeId = "5706689e44be3f420562c667";
 
  it("should store the answer inside the enigmes section of a session", function(done){
    rest.post(base+"/api/session/"+sessionId+"/enigme/"+enigmeId+"/answer", 
              {accessToken: loginToken, data: {answer:answerValue}})
    .on("success", function(data, response){
      rest.get(base+"/api/sessions/"+sessionId, {accessToken: loginToken})
      .on("success", function(session, response){
        session.enigmes.forEach(function(enigme){
          if (enigme.enigme._id === enigmeId){
            enigme.answers.forEach(function(answer){
              expect(parseInt(answer.value)).toBe(answerValue);
              expect(answer.user).toBe(francoisCredentials.email);
            });
            done();                              
          }
        });
      }).on("fail", function(data, response){
        done.fail("could not retrieve sessions after posting an answer");
      });
    })
    .on("fail", function(data, response){
      done.fail("You should be able to post a new answer");
    });
  });

  it("should not allow empty values for answers", function(done){

    rest.post(base+"/api/session/"+sessionId+"/enigme/"+enigmeId+"/answer", 
              {accessToken: loginToken, data: {}})
    .on("success", function(session, response){
      done.fail("an ampty answer should not be answered successfully");
    })
    .on("fail", function(data, response){
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it("should not allow the same user to answer twice on the same enigme in the same session", function(done){
    rest.post(base+"/api/session/"+sessionId+"/enigme/"+enigmeId+"/answer", 
              {accessToken: loginToken, data: {answer:answerValue}})
    .on("success", function(session, response){
      rest.post(base+"/api/session/"+sessionId+"/enigme/"+enigmeId+"/answer", 
              {accessToken: loginToken, data: {answer:34}})
      .on("success", function(data, response){
        done.fail("you should not be able to answer to the same session and enigme twice");
      })
      .on("fail", function(data, response){
        expect(response.statusCode).toBe(403);
        done();
      });
    })
    .on("fail", function(data, response){
      done.fail("You should be able to post a new answer");
    });


  });

  it("should not allow a parent to answer any enigme", function(done){
    _login(function(){
      rest.post(base+"/api/session/"+sessionId+"/enigme/"+enigmeId+"/answer", 
              {accessToken: loginToken, data: {answer:answerValue}})
    .on("success", function(session, response){
      done.fail("a parent should never be allowed to answer an enigme")
    })
    .on("fail", function(data, response){
      done();
    });
    },parentCredentials)
  });



  function _extractAnswer(user, sid, eid, email){
    var session = user.sessions.find(function(session){
      return session._id === sid;
    });
    var enigme = session.enigmes.find(function(enigme){
      return enigme.enigme._id === eid;
    });


    return enigme.answers.find(function(answer){
      return answer.user === email;
    });
  }

  function _sendAnswerAndRetrieveIt(sesid, answer, enId, cb, done){
    rest.post(base+"/api/session/"+sesid+"/enigme/"+enId+"/answer", 
              {accessToken: loginToken, data: {answer:answer}})
    .on("success", function(session, response){
      rest.get(base+"/api/users/"+francoisCredentials.id,{accessToken: loginToken})
      .on("success", function(user, response){
        cb(_extractAnswer(user, sesid, enId, francoisCredentials.email));
      })
      .on("fail", function(data, response){
        done.fail("error in retrieving users "+data);
      });
    })
    .on("fail", function(data, response){
      done.fail("You should be able to post a new answer "+data.message);
    });
  }

  it("should put the value in the answer as correct if it is indeed correct", function(done){
    _sendAnswerAndRetrieveIt("570e7986a3c7b8b5330b287a", 32, "5706689e44be3f420562c667", function(answerFromDb){
      expect(answerFromDb.correctValue).toBe(true);
        done();
    }, done);
  });

  it("should set the correctValue field to false if provided with an incorrect answer", function(done){
    _sendAnswerAndRetrieveIt("570e7986a3c7b8b5330b287a", 33, "5706689e44be3f420562c667", function(answerFromDb){
      expect(answerFromDb.correctValue).toBe(false);
        done();
    }, done);
  });


  it("should allow to handle textual answers", function(done){
    _sendAnswerAndRetrieveIt("570feedbdc29f6193729d48f", "salut la companie", "57067248a28caf6e09f7bc75", function(answerFromDb){
      expect(answerFromDb.correctValue).toBe(true);
        done();
    }, done);
  });

  it("should cleanly handle enigmes with both numeric and textual responses given a textual answer", function(done){
    _sendAnswerAndRetrieveIt("570feedbdc29f6193729d48f", "salut la companie", "57067248a28caf6e09f7bc76", function(answerFromDb){
      expect(answerFromDb.correctValue).toBe(true);
      done();
    }, done);
  });

  it("should cleanly handle enigmes with both numeric and textual responses given a numeric answer", function(done){
    _sendAnswerAndRetrieveIt("570feedbdc29f6193729d48f", 32, "57067248a28caf6e09f7bc76", function(answerFromDb){
      expect(answerFromDb.correctValue).toBe(true);
      done();
    }, done);
  });


  it("should allow to delete just one answer", function(done){
    var sesid = "570e7986a3c7b8b5330b287a";
    var enId = "5706689e44be3f420562c667"
     _sendAnswerAndRetrieveIt(sesid, 32, enId, function(answerFromDb){      
      rest.del(base+"/api/session/"+sesid+"/enigme/"+enId+"/answer/"+answerFromDb._id,
                  {accessToken: loginToken})
      .on("success", function(a, b){  
        rest.get(base+"/api/users/"+francoisCredentials.id,{accessToken: loginToken})
        .on("success", function(user, response){
          var a = _extractAnswer(user, sesid, enId, francoisCredentials.email);
          expect(a).toBeUndefined();
          done();
        })
        .on("fail", function(data, response){
          done.fail("error in retrieving users "+data);
        });
      }).on("fail", function(error, response){
        console.log("Answer data failed");
        done.fail();
      })
    }, done);
   });

  it("should allow to modify an answer", function(done){
    var sesid = "570e7986a3c7b8b5330b287a";
    var enId = "570536454e07f8817caa067e"
     rest.get(base+"/api/users/"+francoisCredentials.id,{accessToken: loginToken})
        .on("success", function(user, response){
          var answerFromDb = _extractAnswer(user, sesid, enId, francoisCredentials.email);
     
          answerFromDb.value = 45;
          answerFromDb.correctValue = false;
          rest.put(base+"/api/session/"+sesid+"/enigme/"+enId+"/answer/"+answerFromDb._id,
                      {accessToken: loginToken, data: {answer:JSON.stringify(answerFromDb)}})
          .on("success", function(a, b){  
            rest.get(base+"/api/users/"+francoisCredentials.id,{accessToken: loginToken})
            .on("success", function(user, response){
              var a = _extractAnswer(user, sesid, enId, francoisCredentials.email);
              expect(a.value).toBe('45');
              expect(a.correctValue).toBe(false);
              done();
            })
            .on("fail", function(data, response){
              done.fail("error in retrieving users "+data);
            });
          }).on("fail", function(error, response){
            console.log("Answer data failed");
            done.fail();
          })
    }, done);
   });

});
