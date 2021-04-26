var fs = require('fs');

this.createRoutePath = function (method, dir, router, filter) {
	try {
		fs.mkdirSync(dir);
	} catch (e) {
		// console.log(e);
	}
	var filesArr = fs.readdirSync(dir);
	for (var i = 0; i < filesArr.length; i++) {
		var fileStat = fs.lstatSync(dir + '/' + filesArr[i]);
		if (fileStat.isDirectory()) {
			this.createRoutePath(method, dir + '/' + filesArr[i], router, dir);
			continue;
		}

		if (!/\.js$/.test(filesArr[i])) {
			continue;
		}

		var fileName = '/' + filesArr[i].replace(/\.js$/, "");
		var routePath = dir + fileName;
		var path = '';
		if (filter != null) {
			path = dir.replace(filter, "");
		}
		if (method == 'all') {
			if (fileName == '/index') {
				router.all(path + '/', require(routePath));
			}
			router.all(path + fileName, require(routePath));
			continue;
		}
		if (method == 'get') {
			if (fileName == '/index') {
				router.get(path + '/', require(routePath));
			}
			router.get(path + fileName, require(routePath));
			continue;
		}
		if (method == 'post') {
			if (fileName == '/index') {
				router.post(path + '/', require(routePath));
			}
			router.post(path + fileName, require(routePath));
			continue;
		}
	}
};

this.runAllPrograms = function (dir) {
	try {
		fs.mkdirSync(dir);
	} catch (e) {
		// console.log(e);
	}
	var filesArr = fs.readdirSync(dir);
	for (var i = 0; i < filesArr.length; i++) {
		require('../' + dir + '/' + filesArr[i].replace(/\.js$/, ""));
	}
};

this.responseFn = function (req, res, next) {
	res.success = function (data, msg) {
		if (res.finished) {
			return;
		}
		res.jsonp({
			success: true,
			data: data || {},
			msg: msg || ""
		});
	};

	res.error = function (msg, data) {
		if (res.finished) {
			return;
		}
		res.jsonp({
			success: false,
			data: data || {},
			msg: msg || ""
		});
	};

	next();
};

this.mergeParams = function (req, res, next) {
	var getParams = req.query;
	var postParams = req.body;
	req.allParams = {};
	for (var i in getParams) {
		req.allParams[i] = getParams[i];
	}

	if (/text\/plain/g.test(req.headers["content-type"])) {
		req.allParams.text = postParams;
	} else if (/application\/octet-stream/g.test(req.headers["content-type"])) {
		req.allParams.buff = postParams;
	} else {
		for (var i in postParams) {
			req.allParams[i] = postParams[i];
		}
	}
	next();
};

this.verifyParams = function (req, res, next) {
	req.verifyParams = function (paramsJson, callback) {
		for (var i in paramsJson) {
			if (req.allParams[i] == null) {
				res.error(`PARAMS_IS_EMPTY: ${i}`);
				var rejected = true;
				callback(rejected);
				return;
			}
		};
		callback();
	};
	next();
};

this.verifyCookies = function (req, res, next) {
	if (!/^\/user/.test(req._parsedUrl.pathname)) {
		next();
		return;
	}
	if (req.cookies.loginSession == null) {
		res.error('session key empty or expired');
		return;
	}
	common.getUserInfoByLoginSession(req.cookies.loginSession, (err, userInfo) => {
		if (err) {
			res.clearCookie('loginSession');
			res.error('session key empty or expired');
			return;
		}
		if (userInfo == null) {
			res.clearCookie('loginSession');
			res.error('session key empty or expired');
			return;
		}
		req.allParams.userInfo = userInfo;
		next();
	});
};
