var fs = require('fs');

this.createRoutePath = function (method, dir, router, filter) {
	var filesArr = fs.readdirSync(dir);
	for (var i = 0; i < filesArr.length; i++) {
		var fileStat = fs.lstatSync(dir + '/' + filesArr[i]);
		if (fileStat.isDirectory()) {
			this.createRoutePath(method, dir + '/' + filesArr[i], router, dir);
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
	var filesArr = fs.readdirSync(dir);
	for (var i = 0; i < filesArr.length; i++) {
		require('../' + dir + '/' + filesArr[i].replace(/\.js$/, ""));
	}
};

this.mergeParams = function (req, res, next) {
	var getParams = req.query;
	var postParams = req.body;
	req.allParams = {};
	for (var i in getParams) {
		req.allParams[i] = getParams[i]
	}
	for (var i in postParams) {
		req.allParams[i] = postParams[i]
	}
	next();
};