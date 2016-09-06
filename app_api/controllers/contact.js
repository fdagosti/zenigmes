var mails = require("./mails/mailsMessages");


var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.askAdmins = function(req, res){
    if (!req.body.message){
        sendJSONresponse(res, 400, {
            message: "All fields required"
        });
        return;
    }
    mails.messageToAdmin(req, req.body.message, req.user);
    sendJSONresponse(res, 200);

};

