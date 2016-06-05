var mongoose = require("mongoose");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    createdOn: {type: Date, "default": Date.now},
    role: {type: String, enum: ["admin", "member"], default: "member"},
    classe: {type: String, enum: ["6eme", "5eme", "4eme", "3eme", "2nde", "1ere", "terminale", "externe"], default:"externe", required: true},
    hash: String,
    salt: String
});

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString("hex");
};

userSchema.methods.validPassword = function(password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString("hex");
    return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        admin: this.role === "admin",
        exp: parseInt(expiry.getTime() / 1000)
    }, process.env.JWT_SECRET);
}

mongoose.model("User", userSchema);