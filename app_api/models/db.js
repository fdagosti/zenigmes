var mongoose = require('mongoose');
require("./enigmes");
require("./users");
require("./sessions");

mongoose.connection.on("connected", function(){
    console.log("Mongoose connected to "+dbURI);
});
mongoose.connection.on("error", function(err){
    console.log("Mongoose connection error: "+err);
});
mongoose.connection.on("diconnected", function(){
    console.log("Mongoose disconnected");
});

var gracefulShutdown = function (msg, callback){
    mongoose.connection.close(function(){
        console.log("Mongoose disconnected through "+msg);
        callback();
    });
};

process.once("SIGUSR2", function(){
    gracefulShutdown("nodemon restart", function(){
        process.kill(process.pid, "SIGUSR2");
    });
});
process.once("SIGINT", function(){
    gracefulShutdown("app termination", function(){
        process.exit(0);
    });
});
process.once("SIGTERM", function(){
    gracefulShutdown("Heroku app shutdown", function(){
        process.exit(0);
    });
}); 

var dbURI = "mongodb://localhost/zenigmes";
console.log("Node env = "+process.env.NODE_ENV+" mong uri = "+process.env.MONGOLAB_URI);
if (process.env.NODE_ENV === "production"){
    dbURI = process.env.MONGOLAB_URI;
} else if (process.env.NODE_ENV === "test"){
    dbURI = "mongodb://localhost/unitTests";
}
mongoose.connect(dbURI); 