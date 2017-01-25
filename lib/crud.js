query = require('../lib/query');

var createWhereQuery = function (whereObj) {
	if (typeof whereObj != "object") {
		return false;
	} else if (typeof whereObj.length != "undefined") {
		return false;
	}
	var keys = Object.keys(whereObj);
	var result = " WHERE ";
	for (var i = 0; i < keys.length; i++) {
		var thisObjValue = whereObj[keys[i]];
		if (typeof thisObjValue == "object" && typeof thisObjValue.length != "undefined") {
			result += "(";
			for (var j = 0; j < thisObjValue.length; j++) {
				result += '`' + keys[i] + '` = "' + thisObjValue[j] + '"';
				if (j != thisObjValue.length - 1) {
					result += " OR ";
				} else {
					result += ") ";
				}
			}
		} else {
			result += '`' + keys[i] + '` = "' + thisObjValue + '"';
		}
		if (i != keys.length - 1) {
			result += " AND ";
		}
	}
	return result;
};

//	dataJson:
// 		tableName: "String",
// 		field: "Array",
// 		limit: "Int",
// 		where: "JSON Object",
//		order: "String"
// 	callback:
//		"function(err, rows)"
select = function (dataJson, callback) {
	if (typeof dataJson.limit == "undefined" || dataJson.limit > 100) {
		dataJson.limit = 100;
	}
	if (typeof dataJson.field == "undefined") {
		dataJson.field = "*";
	} else {
		dataJson.field = dataJson.field.map(function(cell) {return '`' + cell + '`'});
		dataJson.field = dataJson.field.join(", ");
	}
	var sql = "SELECT " + dataJson.field + " FROM " + dataJson.tableName;
	var whereQuery = createWhereQuery(dataJson.where);
	if (whereQuery != false) {
		sql += whereQuery;
	}
	if (typeof dataJson.order != "undefined") {
		sql += " ORDER BY " + dataJson.order;
	}
	sql +=  " LIMIT " + dataJson.limit;
	query(sql, callback);
};

var createUpdateDataQuery = function (dataObj) {
	if (typeof dataObj != "object") {
		return false;
	} else if (typeof dataObj.length != "undefined") {
		return false;
	}
	var keys = Object.keys(dataObj);
	var result = "";
	for (var i = 0; i < keys.length; i++) {
		result += "`" + keys[i] + '` = "' + dataObj[keys[i]] + '"';
		if (i != keys.length - 1) {
			result += ", ";
		}
	}
	return result;
};

//	dataJson:
// 		tableName: "String",
// 		data: "JSON Object",
// 		where: "JSON Object",
// 	callback:
//		"function(err, results)"
update = function (dataJson, callback) {
	var sql = "UPDATE " + dataJson.tableName + " SET " + createUpdateDataQuery(dataJson.data) + createWhereQuery(dataJson.where);
	query(sql, callback);
};

var createInsertDataQuery = function (dataObj) {
	if (typeof dataObj != "object") {
		return false;
	} else if (typeof dataObj.length != "undefined") {
		return false;
	}
	var keys = Object.keys(dataObj);
	var fields = "";
	var values = "";
	for (var i = 0; i < keys.length; i++) {
		var key = "`" + keys[i] + "`";
		var value = '"' + dataObj[keys[i]] + '"';
		fields += key;
		values += value;
		if (i != keys.length - 1) {
			fields += ", ";
			values += ", ";
		}
	}
	var result = " (" + fields + ") VALUES (" + values + ")";
	return result;
};

//	dataJson:
// 		tableName: "String",
// 		data: "JSON Object",
// 	callback:
//		"function(err, results)"
insert = function (dataJson, callback) {
	var sql = "INSERT INTO " + dataJson.tableName + createInsertDataQuery(dataJson.data);
	query(sql, callback);
};

//	dataJson:
// 		tableName: "String",
// 		data: "JSON Object",
//		uniqueFieldName: "Array"
// 	callback:
//		"function(err, results)"
insertOrUpdate = function (dataJson, callback) {
	var selectJson = {
		tableName: dataJson.tableName,
		limit: 1
	};
	selectJson.where = {};
	for (var i = 0; i < dataJson.uniqueFieldName.length; i++) {
		selectJson.where[dataJson.uniqueFieldName[i]] = dataJson.data[dataJson.uniqueFieldName[i]];
	}
	select(selectJson, function (err, rows) {
		if (err) {
			console.log(err);
			return;
		}
		if (rows.length == 0) {
			console.log('INSERT');
			insert(dataJson, function (err, results) {
				callback(err, results);
			});
			return;
		}
		dataJson.where = {};
		for (var i = 0; i < dataJson.uniqueFieldName.length; i++) {
			dataJson.where[dataJson.uniqueFieldName[i]] = dataJson.data[dataJson.uniqueFieldName[i]];
		}
		console.log('UPDATE');
		update(dataJson, callback);
	});
};

// page must have a cloumn name is 'id'
// if dataJsonOrSql is a String, then function well use this String like a sql line
// if dataJsonOrSql is a Json Object, then function well use the normal select function to select, but the limit element Well be write cover by startId and limit 

selectPrePage = function (dataJsonOrSql, startId, limit, callback) {
	if (limit == null) {
		limit = 15;
	}
	if (startId == null) {
		startId = 0;
	}
	if (typeof dataJsonOrSql == 'string') {
		dataJsonOrSql += ' Limit ' + startId + ', ' + limit;
		query(dataJsonOrSql, function (err, rows) {
			if (err) {
				callback(err, null, null);
				return;
			}
			var lastId = parseInt(startId) + rows.length;
			var hasNext = true;
			if (rows.length < limit) {
				hasNext = false;
			}
			callback(err, rows, lastId, hasNext);
		});
		return;
	}
	if (typeof dataJsonOrSql == 'object' && dataJsonOrSql.length == null) {
		dataJsonOrSql.limit = startId + ', ' + limit;
		select(dataJsonOrSql, function (err, rows) {
			if (err) {
				callback(err, null, null);
				return;
			}
			var lastId = parseInt(startId) + rows.length;
			var hasNext = true;
			if (rows.length < limit) {
				hasNext = false;
			}
			callback(err, rows, lastId, hasNext);
		});
		return;
	}
	callback(err, null, null);
	return;
};