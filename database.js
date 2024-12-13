const mysql = require('mysql2');

let connection;

const connectionConfigs = {
	host: process.env.MYSQL_HOST,
	port: '3306',
	user: process.env.MYSQL_USER,
	database: process.env.MYSQL_DATABASE,
	password: process.env.MYSQL_ROOT_PASSWORD,
};

function connectWithRetry() {
	connection = mysql.createConnection(connectionConfigs);

	connection.connect((err) => {
		if (err) {
			console.err('Error connecting to db', err);
			console.log('Retrying in 5 seconds');
			setTimeout(connectWithRetry, 5000);
			return;
		}
		console.log('Connection established');
	});

	connection.on('error', (err) => {
		console.log('db error', err);
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			connectWithRetry();
		} else {
			throw err;
		}
	});
}

module.exports = connection;
