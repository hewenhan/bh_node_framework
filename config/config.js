// TEST CONFIG
this.redis = {
	host: '127.0.0.1', // default 
	port: 6379, //default 
	max_clients: 30, // defalut 
	perform_checks: false, // checks for needed push/pop functionality
	database: 0, // database number to use
	perfix: "",
	options: {
		auth_pass: '033481033481'
	} //options for createClient of node-redis, optional 
};

this.allowCrossOriginArr = [];

