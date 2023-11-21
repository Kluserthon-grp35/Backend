require('dotenv').config();
import validateEnv from '../utils/validateENV.utils';

validateEnv();

const config = {
    env: process.env.NODE_ENV as string,
    port: process.env.PORT as string,
    baseUrl: process.env.BASE_URL as string,
    uri: process.env.DB_URL as string,
    jwt: {
        secret: process.env.JWT_SECRET as string,
        accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES as string,
        refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS as string,
        resetPasswordExpirationMinutes: process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES as string,
        verifyEmailExpirationMinutes: process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES as string,
    },
    email: {
        host: process.env.SMTP_HOST as string,
        port: process.env.SMTP_PORT as string,
        username: process.env.SMTP_USERNAME as string,
        password: process.env.SMTP_PASSWORD as string,
        from: process.env.EMAIL_FROM as string,
    },
};

export default config;