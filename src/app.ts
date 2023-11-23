import express, { ErrorRequestHandler } from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import createError from 'http-errors';
import httpStatus from 'http-status';
import logger from 'morgan';
import ApiError from './utils/ApiError';
import { errorConverter, errorHandler } from './middlewares/error';
import { authLimiter } from './middlewares/rateLimiter';
import config from './config/index';
import morgan from './config/morgan';
import ApiRouter from './routes/index';
import swaggerDocument from './swagger/swagger';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Logger
if (config.env !== 'test') {
	app.use(morgan.successHandler);
	app.use(morgan.errorHandler);
}
// gzip compression
app.use(compression());
// enable cors
app.use(cors());
app.options('*', cors());
// set security HTTP headers
app.use(helmet());

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
	app.use('/auth', authLimiter);
}

app.get('/', (req, res) => {
	res.send('Welcome to Pay Zen API. Visit /docs for API documentation');
});

// APP ROUTER
app.use('/api/v1', ApiRouter);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
	next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500).end();
} as ErrorRequestHandler);

// Swagger-doc
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
