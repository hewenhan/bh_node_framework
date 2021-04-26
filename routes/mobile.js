var express = require('express');
var router = express.Router();
var routerFunction = require('../common/router');

try {
	fs.mkdirSync(__dirname + '/mobile');
} catch (e) {
	
}
routerFunction.createRoutePath('get', __dirname + '/mobile', router);

module.exports = router;
