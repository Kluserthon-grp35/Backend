import http from 'http';
import debug from 'debug';
import app from '../app';
import config from '../config/index';
import { logger } from '../config/logger';
import { connectToMongoose } from '../models/dbConnection';

export const server = http.createServer(app);

/**
 * @description Event listener for HTTP server "error" event. This event is fired when the server encounters an error.
 */
const exitHandler = () => {
	if (server) {
		server.close(() => {
			logger.info('Server closed');
			process.exit(1);
		});
	} else {
		process.exit(1);
	}
};

/**
 * @description Event listener for uncaughtException. This event is fired when an uncaught exception is thrown.
 * @event uncaughtException Event emitted when an uncaught exception is thrown.
 * @param {Error} error The uncaught exception. If an uncaught exception is thrown, the process will crash.
 */
const unexpectedErrorHandler = (error: unknown) => {
	logger.error(error);
	exitHandler();
};

/**
 * @description Normalize a port into a number, string, or false.
 * @param {number} port The port to normalize. 
 * @param {string} val The port to normalize.
 * @returns {number | string | boolean} The normalized port.
 * @example normalizePort('3000') // 3000
 */
function normalizePort(val: string) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * @description Event listener for HTTP server "error" event. This event is fired when the server encounters an error.
 * @event error Event emitted when the server encounters an error.
 * @param {Error} error The error encountered by the server.
 */
function onError(error: any) {
	if (error.syscall !== 'listen') {
		throw error;
	}
	var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			logger.error(bind + ' requires elevated privileges');
			process.exit(1);
		case 'EADDRINUSE':
			logger.error(bind + ' is already in use');
			process.exit(1);
		default:
			throw error;
	}
}

/**
 * @description Event listener for HTTP server "listening" event. This event is fired when the server starts listening for connections.
 * @event listening Event emitted when the server starts listening for connections.
 */
function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
	debug('Listening on ' + bind);
}

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
	logger.info('SIGTERM received');
	if (server) {
		server.close();
	}
});

var port = normalizePort(process.env.PORT || '3001');
app.set('port', port);

server.on('error', onError);
server.on('listening', onListening);


connectToMongoose(config.uri).then(() => {
	server.listen(port, () => {
		logger.info(`Listening to port ${port} in ${config.env} mode`);
	});
});
