module.exports = function (req, res, next) {
	console.log(req.allParams);
	var htm = '\
<div style="background: cadetblue;height: 500px;line-height: 500px;color: whitesmoke;text-align: center;">\n\
	YOU REQUEST CONTENT = ' + req.allParams.request + '\n\
</div>\
	';
	var result = {
		htm: htm
	};
	res.jsonp(result);
};