var rest = require("restler");
var app = require("../../app");
var base = "http://localhost:9876";


describe("The app with no users in the database", function(){
  beforeEach(function(done){
   server = app.listen(9876, done);
  });

  afterEach(function(done){
    server.close(done);
  });

  var newUser = {
    name: "New User",
    email: "toto@toto.com",
    password: "toto",
    classe: "externe"
  };

  it("should allow the first user to register to be an admin", function(done){

    var token;

    rest.post(base+"/api/register",{data:newUser})
    .on("success", function(data, response){
      token = data.token;
      rest.get(base+"/api/users",{accessToken: token})
      .on("success", function(data, response){
        done();
      }).on("fail",function(err, response){
        done.fail(err);
      });
    }).on("fail", function(err, response){
      done.fail(err);
    });

  });
});