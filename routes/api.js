var fs = require('fs');
var express = require('express');
var router = express.Router();
var routerFunction = require('../common/router');

router.use(routerFunction.responseFn);
router.use(routerFunction.mergeParams);
router.use(routerFunction.verifyParams);

try {
	fs.mkdirSync(__dirname + '/api');
} catch (e) {
	
}
routerFunction.createRoutePath('get', __dirname + '/api/get', router);
routerFunction.createRoutePath('post', __dirname + '/api/post', router);
routerFunction.createRoutePath('all', __dirname + '/api/all', router);

module.exports = router;
