module.exports = function (req, res, next) {
	opt = {
		title: 'Home Page'
	};

	var options = {
		url: 'http://' + __root + 'api/test',
		data: {
			request: __root + 'api/test'
		}
	};

	reqHttp(options, function (err, data) {
		if (err) {
			console.log(err);
			return;
		}
		opt.reqInfo = data.htm;
		res.render('index', opt);
	});

	// res.render('index', opt);
};
