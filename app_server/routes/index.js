var express = require('express');
var router = express.Router();
var path = path = require('path');

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get("*", function(req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '../../app_clfdsfient/build') });
});

module.exports = router;
