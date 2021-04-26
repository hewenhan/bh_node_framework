var formatNumLength = function (int, length) {
	var intLength = int.toString().length;
	var freeLength = length - intLength;
	var fillStr = '';
	for (var i = 0; i < freeLength; i++) {
		fillStr += '0';
	}
	return fillStr + int.toString();
};

Array.prototype.hasObj = function (obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
};

this.jsonSortByKeys = function (json) {
	var keys = Object.keys(json);
	keys.sort();
	var result = {};
	for (var i = 0; i < keys.length; i++) {
		result[keys[i]] = json[keys[i]];
	}
	return result;
};

this.randomStr = function (length) {
	var length = parseInt(length);
	var str = '';
	if (length / 25 >= 1) {
		for (var i = 0; i < Math.floor(length / 25); i++) {
			str += Math.random().toString(36).substr(2, 25);
		}
	}
	str += Math.random().toString(36).substr(2, length % 25);
	return str;
};

this.customFormatTime = function (timeObject, format) {

	if (timeObject instanceof Date === false) {
		return 'Error timeObject Type';
	}

	var format = format || "%YYYY-%MM-%DD %hh:%mm:%ss:%mss";

	var YY = (timeObject.getYear() - 100).toString();
	var M = timeObject.getMonth() + 1;
	var D = timeObject.getDate();
	var h = timeObject.getHours();
	var m = timeObject.getMinutes();
	var s = timeObject.getSeconds();
	var ms = timeObject.getMilliseconds();

	var YYYY = timeObject.getFullYear().toString();
	var MM = formatNumLength(M, 2);
	var DD = formatNumLength(D, 2);
	var hh = formatNumLength(h, 2);
	var mm = formatNumLength(m, 2);
	var ss = formatNumLength(s, 2);
	var mss = formatNumLength(ms, 3);

	var replaceArr = [
	[/\%YYYY/g, YYYY],
	[/\%MM/g, MM],
	[/\%DD/g, DD],
	[/\%hh/g, hh],
	[/\%mm/g, mm],
	[/\%mss/g, mss],
	[/\%ss/g, ss],
	[/\%YY/g, YY],
	[/\%M/g, M],
	[/\%D/g, D],
	[/\%h/g, h],
	[/\%ms/g, ms],
	[/\%m/g, m],
	[/\%s/g, s]
	];

	for (var i = 0; i < replaceArr.length; i++) {
		format = format.replace(replaceArr[i][0], replaceArr[i][1]);
	}

	return format;
};

this.secTimestamp = function (timeObject) {
	return (Date.parse(timeObject) / 1000);
};

var crypto = require('crypto');
this.generateRandomSha256Key = () => {
	var shaObj = crypto.createHash('sha256');
	shaObj.update(Date.now() + common.randomStr(5));
	return shaObj.digest("HEX");
};
