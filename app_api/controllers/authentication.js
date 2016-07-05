var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var mails = require("./mails/mailsMessages");
var async = require("async");


var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {
    if (!req.body.name || !req.body.email || !req.body.password) {
        sendJSONresponse(res, 400, {
            message: "All fields required"
        });
        return;
    }

    async.waterfall([
        function(cb){
            User.count({}, function(err, c){
                cb(err, c === 0);
            });
        },
        function(noUsers, cb){
            var user = new User();

            user.name = req.body.name;
            user.email = req.body.email;
            user.classe = req.body.classe;
            user.setPassword(req.body.password);

            if (noUsers){
                user.status = "actif";
                user.role = "admin";
            }

            user.save(function(err){
                var token;
                if (err) {
                    console.log(err);
                    sendJSONresponse(res, 404, err);
                } else {
                    token = user.generateJwt();

                    if (!noUsers) {mails.newUserNeedValidations(req, user);}

                    sendJSONresponse(res, 200, {
                        token: token
                    });
                }
            });
        }
    ]);

};

module.exports.login = function(req, res) {
    if (!req.body.email || !req.body.password) {
        sendJSONresponse(res, 400, {
            message: "All fields required"
        });
        return;
    }

    passport.authenticate("local", function(err, user, info){
        
        var token;
        if (err) {
            sendJSONresponse(res, 404, err);
            return;
        }
        if (user) {
            token = user.generateJwt();
            sendJSONresponse(res, 200, {
                token: token
            });
        }else {
            sendJSONresponse(res, 401, info);
        }
    })(req, res);
};

module.exports.forgot = function(req, res){
    if (!req.body.email ) {
        sendJSONresponse(res, 400, {
            message: "All fields required"
        });
        return;
    }

    User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
            sendJSONresponse(err, 400, {
                message: "the email of the user not was not found"
            });
        }

        user.recoverPassword();
        

        user.save(function(err) {
            if (err){
                sendJSONresponse(res, 400, err);
            }else {
                mails.passwordReset(req, user);
              sendJSONresponse(res, 200, {
                    token: user.resetPasswordToken
                });
            }
        });
    });

};

module.exports.reset = function(req, res){
    if (!req.body.password || !req.params.token ) {
        sendJSONresponse(res, 400, {
            message: "All fields required"
        });
        return;
    }

    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            sendJSONresponse(res, 400, {
                message: "password reset token is invalid or has expired."
            });
            return;
        }

        user.setPassword(req.body.password);        

        user.save(function(err) {
            if (err){
                sendJSONresponse(res, 400, err);
            }else {
                mails.passwordHasChanged(req, user);
                token = user.generateJwt();
                sendJSONresponse(res, 200, {
                    token: token
                });
            }
        });
    });
};