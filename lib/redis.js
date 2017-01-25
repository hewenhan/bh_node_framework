var redisConfig = require("../config/config").redis;
var redisPool = require('redis-connection-pool')('myRedisPool', redisConfig);

if (typeof redisConfig.perfix == 'undefined') {
	redisConfig.perfix = '';
}

var redisFnObj = {
	set: function (key, value, expireTime, callback) {
		key = redisConfig.perfix + key;
		redisPool.set(key, value, function (err) {
			if (typeof expireTime != 'undefined') {
				redisPool.expire(key, expireTime);
			}
			if (typeof callback == 'function') {
				callback(err);
			}
		});
	},
	get: function (key, callback) {
		key = redisConfig.perfix + key;
		redisPool.get(key, function (err, reply) {
			if (typeof callback == 'function') {
				callback(err, reply);
			}
		});
	},
	del: function (key, callback) {
		key = redisConfig.perfix + key;
		redisPool.del(key, function (err) {
			if (typeof callback == 'function') {
				callback(err);
			}
		});
	},
	// expireTime in second
	expire: function (key, expireTime) {
		key = redisConfig.perfix + key;
		redisPool.expire(key, expireTime);
	},
	send_command: function (commandName, args, callback) {
		redisPool.send_command(commandName, args, callback);
	},
	getPatt: function (keyPatt, callback) {
		var _this = this;

		this.send_command('keys', [redisConfig.perfix + keyPatt], function (err, keyName) {
			if (err) {
				callback(err);
				return;
			}
			var getKey = function (key) {
				redisPool.get(key, function (err, value) {
					if (err) {
						console.log(err);
						getValueCount++;
						return;
					}
					result[key] = value;
					getValueCount++;
					if (getValueCount == keyName.length) {
						callback(null, result);
					}
				});
			};
			var result = {};
			var getValueCount = 0;
			for (var i = 0; i < keyName.length; i++) {
				getKey(keyName[i]);				
			}
		});
	},
	delPatt: function (keyPatt, callback) {
		var _this = this;

		this.send_command('keys', [redisConfig.perfix + keyPatt], function (err, keyName) {
			if (err) {
				if (typeof callback != 'function') {
					console.log(err);
				}
				callback(err);
				return;
			}
			var deleteKey = function (key) {
				redisPool.del(key, function (err) {
					if (err) {
						console.log(err);
						getValueCount++;
						return;
					}
					delArr.push(key);
					getValueCount++;
					if (getValueCount == keyName.length) {
						if (typeof callback != 'function') {
							return;
						}
						callback(null, delArr);
					}
				});
			};
			var delArr = [];
			var getValueCount = 0;
			for (var i = 0; i < keyName.length; i++) {
				deleteKey(keyName[i]);				
			}
		});
	}
};

module.exports = redisFnObj;