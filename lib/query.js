var mysql = require('mysql');
var mysqlConfig = require('../config/config').mysql;
var pool  = mysql.createPool(mysqlConfig);


var query = function (sql, callback) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.log(err);
			// callback(err, null, null);
		} else {
			connection.query(sql, function(err, results) {
				// And done with the connection.
				// console.log(sql);
				if (err) {
					console.log('MYSQL_ERROR: ' + new Date());
					console.log(sql);
				}
				connection.release();
				if (typeof callback == 'function') {
					callback(err, results);
				}
			});
		}
	});
};

module.exports = query;