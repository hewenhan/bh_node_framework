// useAge:
// var reqHttp = require("reqHttp");

// var options = {
// 	method: 'get', // default 'get'
// 	url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
// 	port: 443,	// if http default 80, if https default 443
//	headers: {
//		'Content-Type': 'text/xml'	// default 'application/x-www-form-urlencoded'
//	},
// 	data: {
// 		deviceId: 977748,
// 		deviceStatus: 'inGame'
// 	}
// };

// reqHttp(options, function (err, json) {
// 	if (err) {
// 		console.log(err);
// 	}
// 	console.log(json);
// });

var querystring = require('querystring');
var https = require('https');
var http = require('http');
var url = require('url');
var piXml = require('pixl-xml');

var tryHttp = function (protocol, reqOptions, callback) {

	if (typeof reqOptions.data == 'object') {
		var dataStr = querystring.stringify(reqOptions.data);
	} else {
		var dataStr = reqOptions.data;
	}

	if (reqOptions.method == null) {
		reqOptions.method = '';
	}

	switch (reqOptions.method.toLowerCase()) {
		case 'get':
			var concatStr = '?';
			if (reqOptions.hasQuery) {
				concatStr = '&';
			}
			if (dataStr != null) {
				reqOptions.path += concatStr + dataStr;
			}
			reqOptions.method = 'GET';
			break;
		case 'post':
			reqOptions.method = 'POST';
			break;
		default:
			var concatStr = '?';
			if (reqOptions.hasQuery) {
				concatStr = '&';
			}
			if (dataStr != null) {
				reqOptions.path += concatStr + dataStr;
			}
			reqOptions.method = 'GET';
	}


	var json;
	var err;

	var req = protocol.request(reqOptions, function (res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			try {
				JSON.parse(chunk);
			} catch(e) {
				try {
					piXml.parse(chunk);
				} catch(e) {
					json = chunk;
					return;
				}
				json = piXml.parse(chunk);
				return;
			}
			json = JSON.parse(chunk);
		});
		res.on('end', function () {
			callback(err, json);
		})
	});

	req.on('error', function (err) {
		if (err) {
			return;
		}
	});

	if (reqOptions.method.toLowerCase() == 'post') {
		// write post data to request body
		req.write(dataStr);
	}

	req.end();
};

var reqHttp = function (options, callback) {
	if (options.url == null) {
		callback('url is null');
		return;
	}
	var urlParse = url.parse(options.url);
	if (options.headers == null) {
		options.headers = {};
	}
	if (options.headers['Content-Type'] == null) {
		options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
	}
	var reqOptions = {
		hostname: urlParse.hostname,
		path: urlParse.path,
		method: options.method,
		headers: options.headers,
		data: options.data,
		hasQuery: false
	};
	if (urlParse.query != null) {
		reqOptions.hasQuery = true;
	}
	if (urlParse.protocol == null) {
		callback('url is null');
		return;
	}
	if (urlParse.protocol == 'http:') {
		reqOptions.port = options.port == null ? 80 : options.port;
		protocol = http;
	}
	if (urlParse.protocol == 'https:') {
		reqOptions.port = options.port == null ? 443 : options.port;
		protocol = https;
	}
	if (urlParse.port != null) {
		reqOptions.port = urlParse.port;
	}
	tryHttp(protocol, reqOptions, callback);
};

module.exports = reqHttp;
