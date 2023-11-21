import http from 'http';
import debug from 'debug';
import app from '../app';
import config from '../config/index';
import { logger } from '../config/logger';
import { connectToMongoose } from '../models/dbConnection';

export const server = http.createServer(app);

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

const unexpectedErrorHandler = (error: unknown) => {
	logger.error(error);
	exitHandler();
};

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

function onListening() {
	var addr = server.address();
	var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
	debug('Listening on ' + bind);
}


connectToMongoose(config.uri).then(() => {
    server.listen(port, () => {
        logger.info(`Listening to port ${port} in ${config.env} mode`);
    });
})