var express = require('express');
var router = express.Router();
var path = path = require('path');

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

var indexLoc = process.env.NODE_ENV === "production" ? "bin":"build";

router.get("*", function(req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '../../app_client/' + indexLoc) });
});

module.exports = router;
