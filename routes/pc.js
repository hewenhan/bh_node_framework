var express = require('express');
var router = express.Router();
var routerFunction = require('../common/router');

var requireAuthentication = function (req, res, next) {
	next();
};

router.all('*', requireAuthentication);


var adminAuthentication = function (req, res, next) {
	next();
};

router.all('/admin*', adminAuthentication);

try {
	fs.mkdirSync(__dirname + '/pc');
} catch (e) {
	
}
routerFunction.createRoutePath('get', __dirname + '/pc', router);

module.exports = router;
