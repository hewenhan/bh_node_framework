// TEST CONFIG
this.redis = {
    host: '127.0.0.1', // default 
    port: 6379, //default 
    max_clients: 30, // defalut 
    perform_checks: false, // checks for needed push/pop functionality
    database: 0, // database number to use
    perfix: "",
    options: {
    	auth_pass: ''
    } //options for createClient of node-redis, optional 
};

this.mysql = {
	host: "127.0.0.1",
	port: 3306,
	user: 'test',
	password: '123456',
	database: 'test'
};