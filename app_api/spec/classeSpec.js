var rest = require("restler");
var app = require("../../app");
var base = "http://localhost:9876";
var dbUtils = require("./dbUtils");

var francoisCredentials = {
  email: "francois.dagostini@gmail.com",
  password: "toto"
};



describe("The Class API", function(){
  
  var loginToken;

  beforeEach(function(done){
   server = app.listen(9876, function(){
      dbUtils.setupAndLoginAsAdmin(function(token, err){
        if (err){
          done.fail(err);
        }else{
          loginToken = token;
          done();
        }
      });
    });
  });
  // tests here
  afterEach(function(done){
    server.close(function(){
      dbUtils.clearDatabase(done);
    });
  });

it("should list all the classes in the school", function(done){
  rest.get(base+"/api/classes", {accessToken: loginToken})
  .on("success", function(classes, foundNumber, response){
    var foundclass, foundNumber = false;
      expect(classes.length).toBeGreaterThan(0);
      for (var i = 0; i < classes.length; i++) {
        if (classes[i].classe === "6eme"){
          foundclass = true;
          var sixiemeStudent = classes[i];
          if (sixiemeStudent.classeNumber === "A"){
            foundNumber = true;
            break;
          }
          break;
        }
      }
      expect(foundclass).toBe(true);
      expect(foundNumber).toBe(true);
      done();
  })
  .on("fail", function(data, response){
    done.fail(data);
  });
});

// it("should give the number of students for a particular classe", function(done){
//   rest.get(base+"/api/classes/6eme/count", {accessToken: loginToken})
//   .on("success", function(count, response){
//       expect(count).toBe(4);
//       done();
//   })
//   .on("fail", function(data, response){
//     done.fail(data);
//   });
// });

// it("should give the number of students for a particular classe and a classe Number", function(done){
//   rest.get(base+"/api/classes/6eme/A/count", {accessToken: loginToken})
//   .on("success", function(count, response){
//       expect(count).toBe(2);
//       rest.get(base+"/api/classes/6eme/B/count", {accessToken: loginToken})
//       .on("success", function(count, response){
//           expect(count).toBe(1);
//           done();
//       })
//       .on("fail", function(data, response){
//         done.fail(data);
//       });
//       done();
//   })
//   .on("fail", function(data, response){
//     done.fail(data);
//   });
// });

// it("should return the students for a particular classroom", function(done){
//   rest.get(base+"/api/classes/6eme", {accessToken: loginToken})
//   .on("success", function(students, response){
//       expect(students.length).toBe(4);
//       expect(students[0].email).toBeDefined();
//       expect(students[0].name).toBeDefined();
//       done();
//   })
//   .on("fail", function(data, response){
//     done.fail(data);
//   });
// });

// it("should return the students for a particular classroom and its className", function(done){
//   rest.get(base+"/api/classes/6eme/A", {accessToken: loginToken})
//   .on("success", function(students, response){
//       expect(students.length).toBe(2);
//       expect(students[0].email).toBeDefined();
//       expect(students[0].name).toBeDefined();
//       done();
//   })
//   .on("fail", function(data, response){
//     done.fail(data);
//   });
// });



});