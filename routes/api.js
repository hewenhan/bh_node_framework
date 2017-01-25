var express = require('express');
var router = express.Router();
var routerFunction = require('../common/router');

router.use(routerFunction.mergeParams);
routerFunction.createRoutePath('all', __dirname + '/api', router);

module.exports = router;
